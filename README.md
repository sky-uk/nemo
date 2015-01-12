## Getting Started

The ususal `npm install`.

For developement locally, run:

`node_modules/grunt-cli/bin/grunt dev`

This will concat the js and start an express server on localhost:3333 with / pointing to the app folder.

For creating a distributable (unminifined) run:

`node_modules/grunt-cli/bin/grunt build`


For creating a distributable (minifined) run:

`node_modules/grunt-cli/bin/grunt build-and-min`

## Tests 

There aren't any (yet)