# Core-DP EPCIS/CBV Mapping Fixtures

Core-DP pins **EPCIS 2.0.1** and **CBV 2.0** only for a conservative mapping fixture subset. These fixtures are for implementer alignment and validator parsing; they are not a claim of full EPCIS conformance.

Supported subset:

- object-style event shape for MaterialDNA/ProductDNA registration evidence;
- object-style event shape for Offer -> Match -> Transfer evidence milestones;
- CBV-style business step strings limited to `commissioning`, `shipping`, `receiving`, and `accepting`;
- opaque references from Core-DP evidence entries to EPCIS-like fixture event IDs.

Unsupported features are enumerated in `unsupported-features.json`.
