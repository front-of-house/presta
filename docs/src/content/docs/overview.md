---
title: Overview
description: 'Presta starts simple and stays simple. It aims to provide familiar ergonomics while avoiding opaque abstraction, giving more power (and responsibility) to the developer.'
slug: overview
linkTitle: Overview
linkDescription: What Presta is, and what it's not
next: getting-started
---

Presta starts simple and stays simple. It aims to provide familiar ergonomics while
avoiding opaque abstraction, giving more power (and responsibility) to the
developer. It's one of the easiest ways to make a static and/or server rendered site (a hybrid).

Because it's focused on being a server-side hybrid, Presta doesn't do any client-side bundling. But you can bring your own! Say you're templating in React. You can absolutely bundle and hydrate a React app using Presta rendered pages.

### What Presta is not

One of the main goals of this library is to never require questions like "how do I do X in Presta?". Frameworks often grow in features to the point that each have their own flavor of X, which can create lock-in, tribal knowledge, and added boilerplate. **This is normal and OK,** but sometimes we all want something a little... less. Right?

Presta aims to avoid this by not deviating from its specialty: concatenating strings. We're just loading data and generating HTML here, nothing too fancy.

### Why does the world need this?

Let's avoid hyperbolic marketing jargon: it doesn't. But Presta _is_ faster than most other JS frameworks for the same reason that's it's simple and fun to use: it doesn't do a whole lot. You bring the magic, Presta provides a stable base to build from.
