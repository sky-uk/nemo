## Getting Started

(You can install grunt globally and replace all local paths to grunt-cli with just `grunt`)

The ususal `npm install` and `node_modules/grunt-cli/bin/grunt bower:install`.

#### For developement locally:

`node_modules/grunt-cli/bin/grunt dev`

This will concat the js and start an express server on localhost:3333 with / pointing to the app folder, along with a watcher.

#### For creating a distributable (unminifined):

`node_modules/grunt-cli/bin/grunt build`

#### For creating a distributable (minifined):

`node_modules/grunt-cli/bin/grunt build-and-min`

## Tests 

There aren't any (yet)