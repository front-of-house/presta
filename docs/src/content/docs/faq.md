---
title: FAQ
order: 10
---

### What's this about co-located data fetching?

`presta/load` also exports a special `load` function which can be used _in
nested files_ throughout your project. You can then use another export, `flush`
to resolve all data and return your rendered templates. This is great because it
avoids extensive prop-drilling, and keeps your template files clean and concise.
Docs for this are coming soon.

### Will Presta ever build a frontend JavaScript runtime for me?

Probably. We're working on a React companion library for automatic partial
hydration and co-located data in the browser and on the server. At any rate, a
client-side runtime will _always_ be optional, and you can always BYOB.

### Additional Questions

If there's anything else you're curious about, [drop us a
line](https://github.com/sure-thing/presta/issues/new/choose). We'd love to hear
from you!
