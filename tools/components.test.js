const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

['components/progress-bar/index.json', 'components/score-card/index.json'].forEach((file) => {
  test(`${file} marks itself as a component`, () => {
    const config = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.equal(config.component, true);
  });
});
