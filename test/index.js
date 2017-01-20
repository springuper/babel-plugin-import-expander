const path = require('path');
const fs = require('fs');
const assert = require('assert');
const { transformFileSync } = require('babel-core');
const plugin = require('..');

function trim(str) {
  return str.replace(/^\s+|\s+$/, '');
}

describe('Resolve import paths for named dependencies', () => {
  const fixturesDir = path.join(__dirname, 'fixtures');
  fs.readdirSync(fixturesDir).map((caseName) => {
    it(`should ${caseName.split('-').join(' ')}`, () => {
      const fixtureDir = path.join(fixturesDir, caseName);
      const actualPath = path.join(fixtureDir, 'actual.js');
      const actual = transformFileSync(actualPath, {
        plugins: [
          [
            plugin,
            {
              locate: (name, source, filename) => {
                if (source.match(/^(\.|\/).*\/components$/)) {
                  return `${source}/${name}/${name}`;
                }
                return source;
              },
            },
          ],
        ],
      }).code;

      const expected = fs.readFileSync(
          path.join(fixtureDir, 'expected.js')
      ).toString();

      assert.equal(trim(actual), trim(expected));
    });
  });
});
