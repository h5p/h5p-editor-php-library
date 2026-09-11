const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const languageDirectory = path.join(__dirname, '../language');
const editorSource = fs.readFileSync(path.join(__dirname, '../scripts/h5peditor-editor.js'), 'utf8');

for (const file of fs.readdirSync(languageDirectory).filter(file => file.endsWith('.js'))) {
  test(`additional information label is available in ${file}`, () => {
    const context = { H5PEditor: { language: {} } };
    context.window = context;
    vm.createContext(context);
    vm.runInContext(editorSource, context);
    vm.runInContext(fs.readFileSync(path.join(languageDirectory, file), 'utf8'), context);
    const translated = context.H5PEditor.t('core', 'additionalInformation');
    assert.ok(translated.length > 0);
    assert.ok(!translated.startsWith('Missing translation'), translated);
  });
}
