# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and this project adheres to
[Semantic Versioning](http://semver.org/).

## [Unreleased]

### Changed

- Essentially a complete rewrite of the code. Node's `require.resolve` is now used to resolve url path. The new code is
  based on [Sass Loader](https://github.com/webpack-contrib/sass-loader).

## [1.0.2] - 2018-03-18

### Fixed

- [#7](https://github.com/matthewdavidson/node-sass-tilde-importer/pull/7) Support using tilde importer in an importer
  array.

## [1.0.1] - 2018-01-08

### Fixed

- [#3](https://github.com/matthewdavidson/node-sass-tilde-importer/pull/3) Support importing directories.

## [1.0.0] - 2017-04-06

### Changed

- [#1](https://github.com/matthewdavidson/node-sass-tilde-importer/pull/1) Handle flat and nested dependency trees.
