var importer



importer = require('./')

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

describe('Importer', function () {
  beforeEach(function () {
    // mockFs.existsSync.mockClear()
    // mockFindParentDir.sync.mockReturnValue('MOCK_PARENT_DIR').mockClear()
  });

  test('resolves to node_modules directory when first character is ~', function (done) {
    // mockFs.existsSync.mockReturnValue(true)

    importerExpect('~my-module', '', { file: __dirname + '/MOCK_PARENT_DIR/node_modules/my-module/index' }, done)
  })

  test("does nothing when the first character isn't a ~", function (done) {
    importerExpect('my-module', '', null, done)
  })

  test('recursively resolve url until package has not been found', function (done) {
    // var i, mockFsCheck, mockParentDirFinder

    // mockFsCheck = mockFs.existsSync
    // mockParentDirFinder = mockFindParentDir.sync

    // url can not be resolved up to 10 level
    // for (i = 0; i < 10; ++i) {
    //   mockFsCheck = mockFsCheck
    //     .mockReturnValueOnce(false) // directory import
    //     .mockReturnValueOnce(false) // file import
    //
    //   mockParentDirFinder = mockParentDirFinder.mockReturnValueOnce('MOCK_PARENT_DIR' + i)
    // }

    // url finally found
    // mockFsCheck = mockFsCheck.mockReturnValueOnce(false).mockReturnValueOnce(true)
    // mockParentDirFinder = mockParentDirFinder.mockReturnValueOnce('MOCK_PARENT_DIR_final')

    importerExpect(
      '~my-module/test', '', { file: __dirname + '/MOCK_PARENT_DIR_final/node_modules/my-module/test' },
      function () {
        // expect(mockParentDirFinder.mock.calls.length).toBe(11)
        // expect(mockFsCheck.mock.calls.length).toBe(22)
        done()
      }
    )
  })

  test('return original url when package file can not be resolved', function (done) {
    var url
    // mockFindParentDir.sync.mockReturnValue(null)

    url = '~my-module'

    importerExpect(url, '', { file: url }, done)
  })

  test('should resolve extensions', function (done) {
    // mockFs.existsSync.mockReturnValueOnce(true)

    importerExpect(
      '~my-module/test.scss', '', { file: __dirname + '/MOCK_PARENT_DIR/node_modules/my-module/test.scss' }, done
    )
  })

  test('should support file imports', function (done) {
    // mockFs.existsSync
    //   .mockReturnValueOnce(false) // directory import
    //   .mockReturnValueOnce(true) // file import

    importerExpect('~my-module/test', '', { file: __dirname + '/MOCK_PARENT_DIR/node_modules/my-module/test' }, done)
  })

  test('should support directory imports', function (done) {
    // mockFs.existsSync.mockReturnValueOnce(true) // directory import

    importerExpect(
      '~my-module/test', '', { file: __dirname + '/MOCK_PARENT_DIR/node_modules/my-module/test/index' }, done
    )
  })
})
