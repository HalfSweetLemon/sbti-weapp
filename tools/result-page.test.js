const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { buildDimensionCards, getTypeImage } = require('../pages/result/index.logic');

const result = {
  rawScores: { S1: 5 },
  levels: { S1: 'H' }
};

test('dimension cards combine score and explanation data', () => {
  const cards = buildDimensionCards(result, {
    dimensionOrder: ['S1'],
    dimensionMeta: { S1: { name: 'S1 自尊自信' } },
    dimExplanations: { S1: { H: '高自尊' } }
  });
  assert.equal(cards[0].name, 'S1 自尊自信');
  assert.equal(cards[0].level, 'H');
  assert.equal(cards[0].score, 5);
});

test('getTypeImage normalizes asset paths for page images', () => {
  assert.equal(getTypeImage('MALO', { MALO: 'assets/images/types/MALO.png' }), '/assets/images/types/MALO.png');
  assert.equal(getTypeImage('CTRL', { CTRL: '/assets/images/types/CTRL.png' }), '/assets/images/types/CTRL.png');
});

test('result page no longer renders poster controls or canvas', () => {
  const wxml = fs.readFileSync('pages/result/index.wxml', 'utf8');
  const js = fs.readFileSync('pages/result/index.js', 'utf8');
  assert.equal(wxml.includes('保存结果海报'), false);
  assert.equal(wxml.includes('posterCanvas'), false);
  assert.equal(js.includes('handleSavePoster'), false);
});
