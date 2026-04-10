const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const requiredFiles = [
  'app.js',
  'app.json',
  'app.wxss',
  'project.config.json',
  'sitemap.json',
  'package.json',
  'pages/home/index.js',
  'pages/test/index.js',
  'pages/result/index.js',
  'data/questions.js',
  'data/dimensions.js',
  'data/types.js',
  'utils/scoring.js',
  'utils/storage.js'
];

test('native mini program shell exists', () => {
  requiredFiles.forEach((file) => {
    assert.equal(fs.existsSync(file), true, `${file} should exist`);
  });
  assert.equal(fs.existsSync('utils/poster.js'), false, 'utils/poster.js should not exist');
  assert.equal(fs.existsSync('tools/poster.test.js'), false, 'tools/poster.test.js should not exist');
});
