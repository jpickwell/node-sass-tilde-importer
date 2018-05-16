var path

path = require('path')

function resolve (dir, importToResolve) {
  return new Promise(function (pResolve, pReject) {
    try {
      pResolve(require.resolve(importToResolve, { paths: [dir] }))
    } catch (ex) {
      pReject(ex)
    }
  })
}

// Modified from https://github.com/webpack-contrib/sass-loader/blob/master/lib/webpackImporter.js#L44-L60
function startResolving (dir, imports) {
  if (imports.length === 0) {
    return Promise.reject()
  }

  return resolve(dir, imports[0])
    .then(
      function (resolvedFile) {
        // By removing the CSS file extension, we trigger node-sass to include the CSS file instead of just linking it.
        return { file: resolvedFile.replace(/\.css$/, '') }
      },
      function () {
        return startResolving(dir, imports.slice(1))
      }
    )
}

// Modified from https://github.com/webpack-contrib/sass-loader/blob/master/lib/importsToResolve.js
function importsToResolve (url) {
  var baseName, dirName, ext, imports, request

  request = url.substr(1)

  // Keep in mind: ext can also be something like '.datepicker' when the true extension is omitted and the filename
  // contains a dot.
  ext = path.extname(url)

  // Test if the url is a node package main import.
  if (/^~([^\/]+|@[^\/]+[\/][^\/]+)$/g.test(url)) {
    return [request, url]
  }

  // libsass' import algorithm works like this:

  // In case there is a file extension...
  // - If the file is a CSS-file, do not include it all, but just link it via @import url().
  // - The exact file name must match (no auto-resolving of '_'-modules).
  if (ext === '.css') {
    return []
  }

  if (ext === '.scss' || ext === '.sass') {
    return [request, url]
  }

  imports = [
    request + '.scss',
    request + '.sass',
    request + '.css',
    url
  ]

  // In case there is no file extension...
  // - Prefer modules starting with '_'.
  // - File extension precedence: .scss, .sass, .css.
  baseName = path.basename(request)
  if (baseName.charAt(0) === '_') {
    return imports
  }

  dirName = path.dirName(request)

  imports.unshift(
    dirName + '/_' + baseName + '.scss',
    dirName + '/_' + baseName + '.sass',
    dirName + '/_' + baseName + '.css'
  )

  return imports
}

// Modified from https://github.com/webpack-contrib/sass-loader/blob/master/lib/webpackImporter.js#L62-L69
function importer (url, prev, done) {
  if (url[0] !== '~') {
    return null
  }

  startResolving(
    path.dirname(prev),
    importsToResolve(url)
  )
    // Catch all resolving errors, return the original file and pass responsibility back to other custom importers.
    .catch(function () {
      return { file: url }
    })
    .then(done)
}

module.exports = importer
