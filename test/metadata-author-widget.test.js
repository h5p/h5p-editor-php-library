const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../scripts/h5peditor-metadata-author-widget.js'), 'utf8');

function renderRoles(authors, options) {
  const roles = [];
  const element = {
    append() { return this; },
    appendTo() { return this; },
    children() { return this; },
    click() { return this; },
    end() { return this; },
    find() { return this; },
    empty() { return this; }
  };
  const editor = {
    $(tag, attributes) {
      if (tag === '<span>') {
        roles.push(attributes);
      }
      return element;
    },
    processSemanticsChunk() {},
    findField(name) {
      return name === 'role' ? { field: { options } } : {};
    },
    htmlspecialchars(value) { return value; },
    t(core, key) { return key; }
  };
  vm.runInNewContext(source, { H5PEditor: editor });
  editor.metadataAuthorWidget([], { authors }, element, {});
  return roles;
}

test('renders translated role labels without changing stored role values', () => {
  const authors = [{ name: 'Alice', role: 'Author' }, { name: 'Bob', role: 'Editor' }];
  const roles = renderRoles(authors, [
    { value: 'Author', label: 'Auteur' },
    { value: 'Editor', label: 'Éditeur' }
  ]);
  assert.deepEqual(roles.map(role => role.text), ['Auteur', 'Éditeur']);
  assert.deepEqual(authors.map(author => author.role), ['Author', 'Editor']);
});

test('preserves unknown roles as plain text', () => {
  const roles = renderRoles([{ name: 'Alice', role: '<custom-role>' }], []);
  assert.equal(roles[0].text, '<custom-role>');
  assert.equal(roles[0].html, undefined);
});
