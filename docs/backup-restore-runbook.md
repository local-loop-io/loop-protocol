# Backup & Restore Runbook (VPS / Docker)

**Generated:** 2025-12-24

This runbook covers backups for the localLOOP backend stack (Postgres, Redis, MinIO). Adjust paths if your compose file or data volumes differ.

## 0) Preconditions
- Access to the VPS host running Docker + `localloop-backend/docker-compose.yml`.
- Sufficient free disk space for snapshots.
- Backups stored off-host (recommended) or on a mounted backup volume.

## 1) Postgres Backup

### 1.1 Create a logical backup
```bash
cd /root/code/local-loop-io/localloop-backend
mkdir -p ./backups/postgres

docker compose exec -T postgres \
  pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc \
  > ./backups/postgres/localloop-$(date +%F).dump
```

### 1.2 Verify backup integrity
```bash
pg_restore -l ./backups/postgres/localloop-YYYY-MM-DD.dump | head -n 20
```

## 2) Redis Backup

Redis uses RDB/AOF persistence. For a manual snapshot (ensure `./data/redis` is mounted as a volume):

```bash
cd /root/code/local-loop-io/localloop-backend
mkdir -p ./backups/redis

docker compose exec -T redis redis-cli SAVE
cp ./data/redis/dump.rdb ./backups/redis/dump-$(date +%F).rdb
```

If AOF is enabled, also back up `appendonly.aof`.

## 3) MinIO Backup

MinIO data lives in `./data/minio`.

```bash
cd /root/code/local-loop-io/localloop-backend
mkdir -p ./backups/minio

tar -czf ./backups/minio/minio-data-$(date +%F).tar.gz ./data/minio
```

## 4) Restore Procedures

### 4.1 Postgres Restore (logical dump)
```bash
cd /root/code/local-loop-io/localloop-backend

docker compose exec -T postgres \
  pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists \
  < ./backups/postgres/localloop-YYYY-MM-DD.dump
```

### 4.2 Redis Restore
```bash
cd /root/code/local-loop-io/localloop-backend

docker compose stop redis
cp ./backups/redis/dump-YYYY-MM-DD.rdb ./data/redis/dump.rdb
docker compose start redis
```

### 4.3 MinIO Restore
```bash
cd /root/code/local-loop-io/localloop-backend

docker compose stop minio
rm -rf ./data/minio
mkdir -p ./data/minio

tar -xzf ./backups/minio/minio-data-YYYY-MM-DD.tar.gz -C ./
docker compose start minio
```

## 5) Verification Checklist
- [ ] API health check: `curl -sf http://127.0.0.1:8088/health`
- [ ] Interest list loads: `curl -sf http://127.0.0.1:8088/api/interest`
- [ ] MinIO console reachable (if exposed)

## 6) Scheduled Backup Automation

The repo now includes:
- `localloop-backend/deploy/backup.sh`
- `localloop-backend/deploy/localloop-backend-backup.service`
- `localloop-backend/deploy/localloop-backend-backup.timer`

### 6.1 Install the systemd units
```bash
cd /root/code/local-loop-io/localloop-backend

sudo cp deploy/localloop-backend-backup.service /etc/systemd/system/
sudo cp deploy/localloop-backend-backup.timer /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now localloop-backend-backup.timer
```

### 6.2 Run a manual backup job
```bash
cd /root/code/local-loop-io/localloop-backend
sudo PROJECT_DIR=/root/code/local-loop-io/localloop-backend deploy/backup.sh
```

### 6.3 Inspect timer status
```bash
sudo systemctl status localloop-backend-backup.timer
sudo systemctl list-timers | grep localloop-backend-backup
```

The backup script writes timestamped directories under `./backups/` and updates `./backups/latest`.

## 7) Rollback Procedure

### 7.1 Application rollback
```bash
cd /root/code/local-loop-io/localloop-backend
git fetch origin
git checkout <previous-known-good-commit>
bun install
sudo systemctl restart localloop-backend
```

### 7.2 Database-safe rollback sequence
1. Stop incoming writes: `sudo systemctl stop localloop-backend`
2. Confirm a recent backup exists under `./backups/latest`
3. Restore Postgres, Redis, and MinIO using Section 4
4. Restart the backend: `sudo systemctl start localloop-backend`
5. Run the verification checklist below before reopening traffic

### 7.3 Verification checklist after rollback
- [ ] `systemctl status localloop-backend`
- [ ] `curl -sf http://127.0.0.1:8088/health`
- [ ] `curl -sf http://127.0.0.1:8088/api/v1/node/info`
- [ ] `curl -sf http://127.0.0.1:8088/api/interest`

## 8) Recommended Next Step
- Add offsite sync for `./backups/` after each scheduled run.
