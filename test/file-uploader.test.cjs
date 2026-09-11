const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../scripts/h5peditor-file-uploader.js'), 'utf8');

function uploadResponse(status, responseText) {
  const events = [];
  const errors = [];
  let request;
  const context = {
    H5P: {
      jQuery: {},
      EventDispatcher: function () {
        this.trigger = (name, data) => events.push({ name, data });
      },
      error: error => errors.push(error)
    },
    H5PEditor: {
      t: (namespace, key) => key,
      getAjaxUrl: () => '/files'
    },
    FormData: class {
      append() {}
    },
    XMLHttpRequest: class {
      constructor() {
        this.upload = {};
        this.status = status;
        this.responseText = responseText;
        request = this;
      }
      open() {}
      send() {}
    }
  };
  vm.runInNewContext(source, context);
  const uploader = new context.H5PEditor.FileUploader({ type: 'image' });
  uploader.upload({}, 'image.png');
  request.onload();
  const completed = events.filter(event => event.name === 'uploadComplete');
  assert.equal(completed.length, 1);
  return { result: completed[0].data, errors };
}

for (const status of [200, 401, 403, 500]) {
  test(`uses a generic error for a non-JSON HTTP ${status} response`, () => {
    const { result, errors } = uploadResponse(status, '<html>Unexpected response</html>');
    assert.equal(result.error, 'unknownFileUploadError');
    assert.equal(result.data, null);
    assert.equal(errors.length, 1);
  });
}

test('reports an oversized file for a non-JSON HTTP 413 response', () => {
  const { result } = uploadResponse(413, '<html>Content Too Large</html>');
  assert.equal(result.error, 'fileToLarge');
  assert.equal(result.data, null);
});

test('preserves a server-provided validation message', () => {
  const { result, errors } = uploadResponse(400, JSON.stringify({
    success: false, message: 'File type is not allowed'
  }));
  assert.equal(result.error, 'File type is not allowed');
  assert.equal(result.data, null);
  assert.equal(errors.length, 0);
});

test('preserves a successful upload response', () => {
  const { result, errors } = uploadResponse(200, JSON.stringify({ path: 'images/image.png' }));
  assert.equal(result.error, null);
  assert.equal(result.data.path, 'images/image.png');
  assert.equal(errors.length, 0);
});
