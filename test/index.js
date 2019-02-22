const path = require('path');
const fs = require('fs');
const assert = require('assert');
const { transformFileSync } = require('babel-core');
const plugin = require('..');

function trim(str) {
  return str.replace(/^\s+|\s+$/, '');
}

describe('should resolve import paths for named dependencies', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');

  fs.readdirSync(fixturesDir).forEach((caseName) => {
    it(`should handle "${caseName.split('-').join(' ')}"`, () => {
      const fixtureDir = path.join(fixturesDir, caseName);
      const actualPath = path.join(fixtureDir, 'actual.js');
      const actual = transformFileSync(actualPath, {
        plugins: [
          [
            plugin,
            {
              rules: {
                condition: '^(\\.|\\/).*\\/components$',
                template: '{source}/{name}/{name}',
              },
            },
          ],
        ],
      }).code;

      const expected = fs.readFileSync(path.join(fixtureDir, 'expected.js')).toString();

      assert.equal(trim(actual), trim(expected));
    });
  });
});
