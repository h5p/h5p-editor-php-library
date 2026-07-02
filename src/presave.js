'use strict';

/**
 * Curated, no-build JS module for h5p-editor-php-library — exposes `Presave`.
 *
 * Additive: reads the raw `scripts/h5peditor-pre-save.js` global-IIFE and re-exports
 * the class. Does NOT touch the existing webpack `build` script or `webpack.config.js`.
 *
 * DOM/jQuery: **none**. `Presave` is pure logic. `sanitizeLibrary()` and the exception
 * default messages call `H5PEditor.libraryFromString` / `H5PEditor.t`; minimal fallbacks
 * are provided below so the curated surface (`checkNestedRequirements`, `exceptions`,
 * `isInt`, `validateScore`, `process`) works standalone.
 *
 * Consumption:
 *   require('h5p-editor-php-library')          → { Presave }   (via src/index.js barrel)
 *   require('h5p-editor-php-library/presave')  → { Presave }   (direct subpath)
 */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

// The IIFE closes over `H5PEditor` and reads `H5PPresave`. Provide both, plus the two
// members Presave calls lazily (kept minimal — no editor runtime pulled in).
const H5PEditor = global.H5PEditor = global.H5PEditor || {};
global.H5PPresave = global.H5PPresave || {};

if (typeof H5PEditor.libraryFromString !== 'function') {
  H5PEditor.libraryFromString = function (library) {
    // "H5P.Foo 1.2" → { machineName: 'H5P.Foo', ... }; fall back to the raw string.
    const match = typeof library === 'string' && library.match(/^(.+)\s(\d+)\.(\d+)$/);
    if (match) {
      return { machineName: match[1], majorVersion: Number(match[2]), minorVersion: Number(match[3]) };
    }
    return { machineName: library };
  };
}
if (typeof H5PEditor.t !== 'function') {
  H5PEditor.t = function (context, key) { return key; };
}

// `src/` is one level below the package root, so hop up to reach `scripts/`.
const abs = path.join(__dirname, '..', 'scripts', 'h5peditor-pre-save.js');
vm.runInThisContext(fs.readFileSync(abs, 'utf8'), { filename: abs });

module.exports = {
  Presave: H5PEditor.Presave
};

