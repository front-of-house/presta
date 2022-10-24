# CLI

Presta ships with a simple CLI that supports most configuration options. To view
the help docs, run `presta -h` in your terminal. It will print the following:

```bash
  Usage
    $ presta <command> [options]

  Available Commands
    build    Build project to output directory.
    dev      Watch project and build to output directory.
    serve    Serve built files, lambdas, and static assets.

  For more info, run any command with the `--help` flag
    $ presta build --help
    $ presta dev --help

  Options
    -c, --config            Path to a config file.  (default presta.config.js)
    --staticOutputDir       Specify output directory for built static files.  (default ./.presta/static/)
    --functionsOutputDir    Specify output directory for built serverless functions.  (default ./.presta/functions/)
    -a, --assets            Specify static asset directory.  (default ./public)
    -d, --debug             Enable debug mode (prints more logs)
    -v, --version           Displays current version
    -h, --help              Displays this message

  Examples
    $ presta dev index.jsx -o dist
    $ presta dev 'pages/*.tsx' -o static
    $ presta 'pages/*.tsx'
    $ presta -c site.json
    $ presta serve -p 8080
```
