var path

path = require('path')

function resolve (dir, importToResolve) {
  return new Promise(function (pResolve, pReject) {
    try {
      pResolve(importer.resolve(importToResolve, { paths: [dir] }))
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

  if (
    /^~([^\/]+|@[^\/]+[\/][^\/]+)$/g.test(url) || // Test if the url is a node package main import.
    ext === '.css' || ext === '.scss' || ext === '.sass' // In case there is a file extension.
  ) {
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

  dirName = path.dirname(request)

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
    prev === 'stdin' ? process.cwd() : path.dirname(prev),
    importsToResolve(url)
  )
    // Catch all resolving errors, return the original file and pass responsibility back to other custom importers.
    .catch(function () {
      return { file: url }
    })
    .then(done)
}

// Allows substituting require.resolve with a mock function because require.resolve cannot be mocked.
importer.resolve = require.resolve

module.exports = importer
