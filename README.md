## Getting Started

(You can install grunt globally and replace all local paths to grunt-cli with just `grunt`)

The ususal `npm install` and `node_modules/grunt-cli/bin/grunt bower:install`.

#### For developement locally:

`node_modules/grunt-cli/bin/grunt dev`

This will concat the js and start an express server on `localhost:3333` with / pointing to the app folder, along with a watcher.
</br>
There's a sample page available at `localhost:3333/sample`

#### For creating a distributable (unminifined):

`node_modules/grunt-cli/bin/grunt build`

#### For creating a distributable (minifined):

`node_modules/grunt-cli/bin/grunt build-and-min`

## Tests 

The test suite can be launched by triggerind the following command:

`{path-to-node} node_modules/karma/bin/karma start test/conf/karma.conf.js --browsers=Chrome --reporters=dots`