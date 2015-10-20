# Congratulations! You found Nemo! [![Coverage Status](https://coveralls.io/repos/sky-uk/nemo/badge.svg?branch=master&service=github)](https://coveralls.io/github/sky-uk/nemo?branch=master)

This project is for rendering form elements and validating user input. It supports a particular data structure, defined [here](https://git.bskyb.com/kim.westley/nemo/wikis/data-structure)

It will NOT:
- Render labels for elements
- Render help text/tool tips for elements
- Submit the form
- Fetch any data
- Ensure that validation codes/rules are unique see [here](https://git.bskyb.com/kim.westley/nemo/wikis/unique-codes) for more info.

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

`{path-to-node} node_modules/karma/bin/karma start test/conf/karma.conf.js --browsers=Chrome --reporters=dots`

## Contributing
To contribute please create a branch from master. Before commiting your changes to the branch, please run
`node_modules/grunt-cli/bin/grunt build` to create a new distributable.

Then talk to/email NowTV Web to let them know your code is ready for review!