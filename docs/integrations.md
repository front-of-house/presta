# Integrations

We'll flesh this out at some point. For now, there are a few points you should
keep in mind when running Presta alongside Vite, Webpack, etc.

## Reloading

By default, Presta serves files and reloads the page when they change. So if
your client-side JS bundle also handles HMR or live-reload, you may want to
consider disabling the HTTP server in Presta and serving Presta output using the
toolkit of your choice.

> For multi-page apps, live reload can sometimes be preferable. It ensures that
> each load is consistent and starts from a clean state. So consider if you need
> that HMR or if you could get by with live reload.

## JS & CSS

Presta doesn't generate client-side runtime code for you, and never will. That's
how we keep it simple!

Don't be afraid to use the platform: `<link />`, `<style>`, `<script>`, and `<img />`
will never fail you like your `<Image />` component compression pipeline will.

> CSS-in-JS can be very useful for server-rendered apps. Consider dynamically
> generating styles on the server!

## FAQ

#### Does it work with Tailwind?

Sure. Especially if you use any CSS-in-JS varietals. Otherwise yeah, just output
a `.css` file and chuck it in your `config.assets` directory for static serving.
