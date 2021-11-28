---
'presta': patch
---

Remove static 404.html handling — this is specific to every hosting platform, we should not attempt to mimic it locally because it can result in non-prod-like edge cases that could confuse users.
