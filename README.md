## Getting Started

If you don't have node run:

`./setup_node.sh`

Which will install nvm and node and run the npm install

(You can install grunt globally and replace all local paths to grunt-cli with just `grunt`)

If you do have node:

The usual `npm install`

#### For developement locally:

`node_modules/grunt-cli/bin/grunt dev`

This will concat the js and start an express server on `localhost:3333` with / pointing to the app folder, along with a watcher.

There's a sample page available at `localhost:3333/sample`

#### For creating a distributable (unminifined):

`node_modules/grunt-cli/bin/grunt build`

#### For creating a distributable (minifined):

`node_modules/grunt-cli/bin/grunt build-and-min`

## Tests 

The test suite can be launched by triggering the following command:

`{path-to-node} node_modules/karma/bin/karma start test/conf/karma.conf.js --browsers=Chrome --reporters=dots`