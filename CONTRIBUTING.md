# Contributing

The Presta monorepo is managed with [pnpm]() and published with [Changesets]().

## Publishing

1. Edit files
2. Run `pnpm changeset` from root to create and changeset and stage and commit
   edited files
3. Make sure markdown file gets added, since prettier might have formatted it
4. Push up changeset(s) and merge to main
5. After merge, the Changesets library should create a new PR with all changes
6. Merge Changeset PR — it will [fail
   CD](https://github.com/atlassian/changesets/issues/550), working on this
7. Pull down main and run `pnpm release` to publish the new versions

## FAQ

Drop us a line in an [issue](https://github.com/sure-thing/presta/issues) and we'll fill this section out.
