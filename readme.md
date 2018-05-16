# node-sass-tilde-importer

> A node-sass custom importer which turns ~ into absolute paths to the nearest parent node_modules directory.

[![Build Status](https://travis-ci.org/matthewdavidson/node-sass-tilde-importer.svg?branch=master)](https://travis-ci.org/matthewdavidson/node-sass-tilde-importer)
[![npm version](https://badge.fury.io/js/node-sass-tilde-importer.svg)](http://badge.fury.io/js/node-sass-tilde-importer)

## Install

```sh
npm install -D node-sass-tilde-importer
# OR
yarn add -D node-sass-tilde-importer
```

## Usage

```js
var sass = require('node-sass')
var tildeImporter = require('node-sass-tilde-importer')

var result = sass.renderSync({
  data: scss_content,
  importer: tildeImporter
})
```

`node-sass` CLI example:
```sh
node-sass --importer node_modules/node-sass-tilde-importer style.scss
```

Please refer to the node-sass [readme](https://github.com/sass/node-sass#readme) for full instructions on how to use
custom importers.
