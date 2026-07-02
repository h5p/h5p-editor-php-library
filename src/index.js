'use strict';

/**
 * Public JS entry (barrel) for h5p-editor-php-library.
 *
 * No-build, additive surface for Node/test consumers. Add future modules by dropping a
 * `src/<name>.js` file and re-exporting it here (and optionally as an `./<name>` subpath
 * in package.json `exports`). No new top-level files required per module.
 */

module.exports = {
  ...require('./presave')
  // ...future modules re-exported here, e.g. ...require('./foo')
};

