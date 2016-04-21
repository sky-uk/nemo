# Congratulations! You found Nemo! [![Build Status](https://travis-ci.org/sky-uk/nemo.svg)](https://travis-ci.org/sky-uk/nemo)

This project is for rendering form elements and validating user input.

It will NOT:
- Render labels for elements
- Fetch any data
- Submit the form

## Getting Started

##### If you don't have node run:

`./setup_node.sh`

Which will install nvm and node and run npm install

##### If you do have node:

The usual `npm install`
(You can install grunt globally and replace all local paths to grunt-cli with just `grunt`)
#### For developement locally:

`node_modules/grunt-cli/bin/grunt dev`

This will concat the js and start an express server on `localhost:3333` with / pointing to the root folder, along with a watcher.

There's a sample page available at `localhost:3333/app/sample/index.html`

#### For creating a distributable (unminifined):

`node_modules/grunt-cli/bin/grunt build`

#### For creating a distributable (minifined):

`node_modules/grunt-cli/bin/grunt build-and-min`

## Tests 

The test suite can be launched by triggering the following command:

`npm test`

## Documentation

The [Wiki space](https://github.com/sky-uk/nemo/wiki) contains a list of references to the Nemo APIs and components. A development guide will be added soon.

## Contributing
To contribute please check the [contributing guidelines](https://github.com/sky-uk/nemo/blob/master/CONTRIBUTING.md)
