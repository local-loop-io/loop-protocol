# Category-to-Classification Mapping

localLOOP remains a lab-demo project with no public pilots or production deployments.
This is an illustrative, non-exhaustive crosswalk, not a customs, waste, or product
classification determination, and not legal advice. See the
[Regulatory Alignment Roadmap](regulatory-alignment-roadmap.md) (Horizon 2, item 4) for
the broader context this document narrows.

## Why illustrative, not authoritative

`MaterialDNA.category` and `ProductDNA.product_category` are LOOP's own coarse, stable
enums, chosen for lab interoperability rather than legal precision. `classification.*`
(`ewc_code`, `hs_code`, `cn_code`, `prodcom_code`, `taric_code`, `nace_code`, `scip_id`,
`waste_framework_code`) are free-text/pattern-validated fields an emitting node fills in
with its own determination — LOOP does not derive them automatically, and this document
does not either. Real classification (especially EWC assignment) depends on a material's
actual origin, process history, and contamination, not just its generic category, and
several of the underlying EU delegated acts that would pin these down further have not
been adopted yet (see the [roadmap](regulatory-alignment-roadmap.md)'s regulatory-signal
sections). What follows is a starting orientation for someone filling in `classification`
fields by hand, not a lookup table to automate against.

## MaterialDNA categories → waste and customs classification

EWC chapters below reference the List of Waste under Commission Decision 2000/532/EC (as
amended), which is what `waste_framework_code`/`ewc_code` ultimately trace back to. A
material's exact 6-digit EWC entry depends on its source stream (e.g., separately
collected municipal fraction under chapter 20, construction/demolition waste under chapter
17, or waste from mechanical treatment under chapter 19) — the chapters below are
candidates to check, not a single right answer. HS chapters are the customs Harmonized
System; `hs_code`/`cn_code`/`taric_code` are EU-specific refinements of the same tree.

| LOOP `category` | Candidate EWC chapters | Candidate HS chapter/heading | Notes |
|:-----------------|:------------------------|:-------------------------------|:------|
| `plastic-*` (pet/hdpe/pvc/ldpe/pp/ps/mixed) | 15 (packaging) or 19 12 04 (mechanical-treatment plastic/rubber fraction) or 20 01 39 (separately collected plastics) | 39 (plastics); waste/parings/scrap typically HS 3915 | Resin-specific subcodes (PET/HDPE/etc.) are not distinguished at HS chapter level; that granularity lives only in LOOP's own `category` enum. |
| `metal-steel`, `metal-mixed` (ferrous) | 17 04 05 (C&D iron/steel) or 19 12 02 (ferrous from mechanical treatment) or 20 01 40 | 72 (iron and steel); waste/scrap typically HS 7204 | |
| `metal-aluminum` | 17 04 02 or 19 12 03 (non-ferrous) or 20 01 40 | 76 (aluminium); waste/scrap typically HS 7602 | |
| `metal-copper` | 17 04 01 or 19 12 03 or 20 01 40 | 74 (copper); waste/scrap typically HS 7404 | |
| `organic-food` | 02 (agri-food processing waste) or 20 01 08 (biodegradable kitchen waste) | Not typically HS-classified as traded waste; food-loss reporting uses other frameworks | |
| `organic-garden` | 20 02 01 (biodegradable garden/park waste) | — | |
| `organic-wood` | 03 01 (wood processing) or 17 02 01 (C&D wood) or 19 12 07 or 20 01 38 | 44 (wood and articles of wood); waste/scrap typically HS 4401 | |
| `glass-*` (clear/brown/green/mixed) | 15 01 07 (glass packaging) or 17 02 02 (C&D glass) or 19 12 05 or 20 01 02 | 70 (glass and glassware); waste/cullet typically HS 7001 | Color sorting (clear/brown/green) is a LOOP/operational distinction, not an EWC or HS one. |
| `paper-clean`, `paper-newsprint`, `cardboard`, `paper-mixed` | 15 01 01 (paper/cardboard packaging) or 20 01 01 | 48 (paper and paperboard); recovered paper/paperboard typically HS 4707 | |
| `textile-cotton`, `textile-wool`, `textile-synthetic`, `textile-mixed` | 20 01 11 (separately collected textiles) or 04 02 (textile industry process waste) | Chapters 50–63 (raw/manufactured textiles by fiber); worn clothing/textile waste typically HS 6309/6310 | |
| `ewaste-computers`, `ewaste-phones`, `ewaste-mixed` | 16 02 (waste electrical/electronic equipment) or 20 01 21/35/36 | 84/85 (machinery, electrical equipment); electronic waste and scrap specifically HS 8549 (introduced in the HS2022 nomenclature) | Falls under the WEEE Directive (2012/19/EU) chain, tracked separately from this roadmap's current regulatory-signal scope. |
| `ewaste-batteries` | 16 06 (batteries and accumulators) or 20 01 33/34 | 8548/8549 region; see also `classification.battery_category` | See [battery extension guidance](../profiles/battery/README.md) — `ewaste-batteries` at end-of-life is the same physical object the Battery Passport tracks from placing-on-market. |

`nace_code` classifies the *reporting operator's economic activity* (e.g., NACE 38.32
"recovery of sorted materials"), not the material itself — there is no sound 1:1
material-category-to-NACE mapping, and this document does not attempt one. `scip_id`
(ECHA SCIP database) applies when an article contains a Candidate List substance of
concern above 0.1% w/w, independent of `category`; check `passport.substances_of_concern`
per-item rather than by category.

## ProductDNA categories → product classification and regime relevance

| LOOP `product_category` | HS chapter | Regulatory regime most likely to apply | Status as of this writing |
|:--------------------------|:------------|:------------------------------------------|:------------------------------|
| `furniture-office`, `furniture-residential`, `furniture-industrial` | 94 | ESPR ecodesign delegated act for furniture | No delegated act adopted yet; indicative timeline circa 2028. |
| `building-structural`, `building-fixture`, `building-hvac`, `building-electrical` | Varies (25, 68, 73, 84, 85) | Construction products framework, tracked separately from ESPR in this roadmap | Not covered by this roadmap's current research; do not assume ESPR DPP applicability without checking separately. |
| `electronics-computing`, `electronics-mobile`, `electronics-appliance`, `electronics-components` | 84, 85 | WEEE Directive (2012/19/EU) at end-of-life; ESPR ecodesign acts apply per-product-group where adopted (none yet for general electronics as of this writing) | No general-electronics ESPR delegated act adopted yet. |
| `textile-garment`, `textile-industrial` | 50–63 | ESPR ecodesign delegated act for textiles; EU Strategy for Sustainable and Circular Textiles | No delegated act adopted yet; indicative timeline circa 2027. |
| `packaging-reusable` | Varies by packaging material | PPWR (EU) 2025/40, Art. 11 reusable packaging | See [packaging extension guidance](../profiles/packaging/README.md) — PPWR applies since August 12, 2026, but the Art. 12 data-carrier implementing act is still pending. |
| `vehicle-parts` | 87 (and part-specific chapters) | End-of-life vehicle rules | Outside this roadmap's current research scope — check separately before relying on any specific citation. |
| `equipment-industrial` | Varies | General product safety / sector-specific rules | Not ESPR-first-wave as of this writing. |
| `equipment-medical` | 90 | Medical Devices Regulation (EU) 2017/745 / IVDR, generally tracked separately from ESPR-style DPP work | Outside this roadmap's current research scope. |

## Sources

- List of Waste, Commission Decision 2000/532/EC (as amended): https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32000D0532
- Waste Framework Directive 2008/98/EC: https://eur-lex.europa.eu/eli/dir/2008/98/oj/eng
- WEEE Directive 2012/19/EU: https://eur-lex.europa.eu/eli/dir/2012/19/oj/eng
- ESPR Regulation (EU) 2024/1781: https://eur-lex.europa.eu/eli/reg/2024/1781/oj/eng
- ESPR product-group delegated-act status (iron & steel consultation, textiles/furniture timelines): https://single-market-economy.ec.europa.eu/single-market/digital-product-passport_en
- Packaging and Packaging Waste Regulation (EU) 2025/40: https://eur-lex.europa.eu/eli/reg/2025/40/oj/eng
