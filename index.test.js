var EXT_COMBO_COUNT, importer, mockImporterResolve

EXT_COMBO_COUNT = 6

importer = require('./')

importer.resolve = mockImporterResolve = jest.fn()

function importerExpect (url, prev, expectation, done) {
  var res

  function _done (result) {
    expect(result).toEqual(expectation)
    done()
  }

  res = importer(url, prev, _done)

  if (typeof res !== 'undefined') {
    _done(res)
  }
}

function resolveError () {
  throw new Error()
}

describe('Importer', function () {
  beforeEach(function () {
    mockImporterResolve.mockClear()
  });

  test('resolves to node_modules directory when first character is ~', function (done) {
    var path

    path = '/MOCK_PARENT_DIR/node_modules/my-module/index.js'

    mockImporterResolve.mockReturnValue(path)

    importerExpect('~my-module', '', { file: path }, done)
  })

  test("does nothing when the first character isn't a ~", function (done) {
    importerExpect('my-module', '', null, done)
  })

  test('recursively resolve url until package has been found', function (done) {
    var i, path

    // url isn't a Sass/CSS file
    for (i = 0; i < EXT_COMBO_COUNT; ++i) {
      mockImporterResolve.mockImplementationOnce(resolveError)
    }

    path = '/MOCK_PARENT_DIR/node_modules/~my-module/test'

    // url is literal; i.e., `~my-module` is the name of a module, so `~my-module/test` should be
    // `node_modules/~my-module/test`
    mockImporterResolve.mockImplementation(function () {
      return path
    })

    importerExpect('~my-module/test', '', { file: path }, done)
  })

  test('return original url when package file cannot be resolved', function (done) {
    var url

    mockImporterResolve.mockImplementation(resolveError)

    url = '~my-module'

    importerExpect(url, '', { file: url }, done)
  })

  test('should resolve extensions (.css)', function (done) {
    var path

    path = '/MOCK_PARENT_DIR/node_modules/my-module/test'

    mockImporterResolve.mockReturnValue(path)

    importerExpect('~my-module/test.css', '', { file: path }, done)
  })

  test('should resolve extensions (.scss)', function (done) {
    var path

    path = '/MOCK_PARENT_DIR/node_modules/my-module/test.scss'

    mockImporterResolve.mockReturnValue(path)

    importerExpect('~my-module/test.scss', '', { file: path }, done)
  })

  test('should resolve extensions (.sass)', function (done) {
    var path

    path = '/MOCK_PARENT_DIR/node_modules/my-module/test.sass'

    mockImporterResolve.mockReturnValue(path)

    importerExpect('~my-module/test.sass', '', { file: path }, done)
  })

  test('should support file imports', function (done) {
    var path

    path = '/MOCK_PARENT_DIR/node_modules/my-module/_test.scss'

    mockImporterResolve.mockReturnValue(path)

    importerExpect('~my-module/test', '', { file: path }, done)
  })

  test('should support partial imports', function (done) {
    var path

    path = '/MOCK_PARENT_DIR/node_modules/my-module/_test.scss'

    mockImporterResolve.mockReturnValue(path)

    importerExpect('~my-module/_test', '', { file: path }, done)
  })

  test('should use current working directory if stdin', function (done) {
    var path

    path = '/MOCK_PARENT_DIR/node_modules/my-module/index.js'

    mockImporterResolve.mockReturnValue(path)

    importerExpect('~my-module', 'stdin', { file: path }, function () {
      expect(mockImporterResolve).toHaveBeenCalledWith('my-module', { paths: [process.cwd()] })
      done()
    })
  })
})
