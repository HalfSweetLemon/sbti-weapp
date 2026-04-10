const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { questions, specialQuestions } = require('../data/questions');
const { dimensionMeta, dimensionOrder } = require('../data/dimensions');
const { typeLibrary, typeImages, normalTypes, dimExplanations } = require('../data/types');

test('quiz data counts match the template', () => {
  assert.equal(questions.length, 30);
  assert.equal(specialQuestions.length, 2);
  assert.equal(dimensionOrder.length, 15);
  assert.equal(Object.keys(dimensionMeta).length, 15);
  assert.ok(normalTypes.length >= 20);
  assert.ok(typeLibrary.DRUNK);
  assert.ok(typeLibrary.HHHH);
});

test('type image paths exist', () => {
  Object.values(typeImages).forEach((file) => {
    assert.equal(fs.existsSync(path.join(process.cwd(), file)), true, `${file} should exist`);
  });
});

test('dimension explanations cover every dimension and level', () => {
  dimensionOrder.forEach((dimensionId) => {
    assert.ok(dimExplanations[dimensionId]);
    assert.ok(dimExplanations[dimensionId].L);
    assert.ok(dimExplanations[dimensionId].M);
    assert.ok(dimExplanations[dimensionId].H);
  });
});
