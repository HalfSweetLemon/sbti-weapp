const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

['pages/test/index.json', 'pages/result/index.json'].forEach((file) => {
  test(`${file} registers custom components`, () => {
    const json = JSON.parse(fs.readFileSync(file, 'utf8'));
    assert.ok(json.usingComponents);
  });
});

['pages/home/index.wxss', 'pages/test/index.wxss', 'pages/result/index.wxss'].forEach((file) => {
  test(`${file} includes card and button hooks`, () => {
    const css = fs.readFileSync(file, 'utf8');
    assert.ok(css.includes('.card'));
    assert.ok(css.includes('.btn-primary'));
  });
});

test('result page no longer includes poster-specific styling hooks', () => {
  const css = fs.readFileSync('pages/result/index.wxss', 'utf8');
  assert.equal(css.includes('.poster-action-row'), false);
  assert.equal(css.includes('.poster-action-button'), false);
  assert.equal(css.includes('.poster-canvas'), false);
});
