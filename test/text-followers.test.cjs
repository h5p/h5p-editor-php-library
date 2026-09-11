const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

function createText(initial = 'Initial', options = {}) {
  let change;
  let value = initial;
  let error = '';
  const saved = [];
  const input = {
    change(callback) {
      if (callback) change = callback;
      else change();
      return this;
    },
    val(next) {
      if (arguments.length) { value = next; return this; }
      return value;
    },
    toggleClass() {}
  };
  const errors = {
    html(next) { error = next; },
    append(next) { error += next; }
  };
  const item = {
    appendTo() { return this; },
    find() { return input; },
    children() { return errors; }
  };
  const jquery = () => item;
  jquery.extend = (deep, target, source) => Object.assign(target, source);
  const context = {
    parent: { H5PEditor: {} },
    navigator: { userAgent: '' },
    H5P: { jQuery: jquery, trim: value => value.trim() }
  };
  context.window = context;
  vm.createContext(context);
  for (const file of ['h5peditor.js', 'h5peditor-text.js']) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../scripts', file), 'utf8'), context);
  }
  const editor = context.ns;
  editor.t = (namespace, key) => key;
  editor.checkErrors = (errors, input, value) => error ? false : value;
  const field = new editor.Text(null, { name: 'title', ...options }, initial,
    (field, value) => saved.push(value));
  // Rendering markup is unrelated to the change and follow-field behavior.
  field.createHtml = () => '';
  field.appendTo({});
  const parent = { children: [field], ready: callback => callback() };
  return { field, saved, follow: callback => editor.followField(parent, 'title', callback) };
}

test('followField receives the initial text and subsequent stored values', () => {
  const { field, saved, follow } = createText();
  const values = [];
  follow(value => values.push(value));
  field.forceValue('Updated');
  field.forceValue('<b>&');
  assert.deepEqual(values, ['Initial', 'Updated', '&lt;b&gt;&']);
  assert.deepEqual(saved, ['Updated', '&lt;b&gt;&']);
});

test('clearing optional text notifies followers with undefined', () => {
  const { field, saved, follow } = createText('Initial', { optional: true });
  const values = [];
  follow(value => values.push(value));
  field.forceValue('   ');
  assert.deepEqual(values, ['Initial', undefined]);
  assert.deepEqual(saved, [undefined]);
});

test('invalid text does not change the followed value or notify listeners', () => {
  const { field, saved, follow } = createText();
  const values = [];
  follow(value => values.push(value));
  field.forceValue('');
  assert.deepEqual(values, ['Initial']);
  assert.deepEqual(saved, []);
});

test('legacy change() and changeCallbacks subscribers still run once', () => {
  const { field, follow } = createText();
  const legacy = [];
  const direct = [];
  const followed = [];
  assert.equal(field.change(value => legacy.push(value)), 0);
  field.changeCallbacks.push(value => direct.push(value));
  follow(value => followed.push(value));
  field.forceValue('<b>');
  assert.deepEqual(legacy, [undefined, '<b>']);
  assert.deepEqual(direct, ['<b>']);
  assert.deepEqual(followed, ['Initial', '&lt;b&gt;']);
});
