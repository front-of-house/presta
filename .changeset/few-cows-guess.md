---
'presta': patch
---

Remove error handling and logging from `wrapHandler.ts` — this should only be handled during dev. In prod, users should rely on other libraries like `hypr`.
