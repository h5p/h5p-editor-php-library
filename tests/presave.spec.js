'use strict';

/**
 * First JS unit tests for h5p-editor-php-library — the curated `Presave` surface.
 * Public deps only (Mocha + Chai). No DOM, no jQuery.
 */

const { expect } = require('chai');
const { Presave } = require('..');

describe('h5p-editor-php-library — Presave (no DOM)', function () {
  it('exports a Presave class with the static helpers', function () {
    expect(Presave).to.be.a('function');
    expect(Presave.checkNestedRequirements).to.be.a('function');
    expect(Presave.isInt).to.be.a('function');
    expect(Presave.exceptions).to.be.an('object');
  });

  describe('checkNestedRequirements', function () {
    it('is true when the nested key exists (first segment names the object)', function () {
      expect(Presave.checkNestedRequirements({ question: 'x' }, 'content.question')).to.equal(true);
    });

    it('is false when the nested key is missing', function () {
      expect(Presave.checkNestedRequirements({}, 'content.question')).to.equal(false);
    });

    it('is false for undefined content', function () {
      expect(Presave.checkNestedRequirements(undefined, 'content.question')).to.equal(false);
    });
  });

  describe('isInt', function () {
    it('accepts integers and rejects non-integers', function () {
      expect(Presave.isInt(3)).to.equal(true);
      expect(Presave.isInt(3.5)).to.equal(false);
      expect(Presave.isInt('4')).to.equal(true);
    });
  });

  describe('exceptions', function () {
    it('exposes an InvalidContentSemanticsException constructor', function () {
      expect(Presave.exceptions.InvalidContentSemanticsException).to.be.a('function');
      const err = new Presave.exceptions.InvalidContentSemanticsException('My Error');
      // NB: the REAL implementation sets `.name` from the first arg (drift vs. the mock,
      // which hardcodes 'InvalidContentSemanticsException'). Documented in the fidelity tier.
      expect(err.name).to.equal('My Error');
      expect(err.code).to.equal('H5P-P500');
    });
  });
});

