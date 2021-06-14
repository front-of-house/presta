# Contributing

WIP document to help new contributors get started.

## Getting started

Working with Presta is pretty simple — it's really no different from any other node-based library.

1. Fork this repo
2. Clone it to your computer
3. Install dependencies `npm i`

And you should be ready to go: you can run tests and build the framework.

## Developing with a test project

Often, you'll want to use your existing project as a sandbox for developing a new feature or fixing a bug in Presta. To do this, you'll need to use the normal [npm link](https://docs.npmjs.com/cli/v6/commands/npm-link) workflow. It boils down to this:

1. From your fork of Presta, run `npm link` (make sure you've run `npm i` beforehand)
2. From your existing project, run `npm link presta`
3. You should now be able to run your project using the files from your local Presta fork

N.B. If you run `npm i` or similar, it can break the symlinks created using `npm link`. So after installing new dependencies, it's often a good idea to re-link thinks just in case.

## Reporting bugs

[Reduced test cases](https://css-tricks.com/reduced-test-cases/) are so so helpful. A small Github repo is great, or something like a [Codesandbox](https://codesandbox.io/dashboard).

## Testing

Our testing story needs help right now. We have few, and would love some help writing more.

We use a library called [baretest](https://github.com/volument/baretest), which is kind of the bare-mininum solution for testing. It's great. It means we have to use [esbuild-register](https://github.com/egoist/esbuild-register) to transpile our files on the fly. This setup is faster and easier to maintain than a larger framework. That said, we may need to move to a more robust framework in the future.

## FAQ

Drop us a line in an [issue](https://github.com/sure-thing/presta/issues) and we'll fill this section out. 
