const test = require('node:test');
const assert = require('node:assert/strict');
const { buildQuizSession, getVisibleQuestions, sumToLevel, computeResult } = require('../utils/scoring');

function toAnswers(items, defaultValue) {
  return items.reduce((acc, item) => {
    acc[item.id] = defaultValue;
    return acc;
  }, {});
}

test('sumToLevel matches the original thresholds', () => {
  assert.equal(sumToLevel(3), 'L');
  assert.equal(sumToLevel(4), 'M');
  assert.equal(sumToLevel(5), 'H');
});

test('drink trigger question appears only after selecting 饮酒', () => {
  const session = buildQuizSession(() => 0.25);
  const before = getVisibleQuestions(session, {});
  const after = getVisibleQuestions(session, { drink_gate_q1: 3 });

  assert.equal(before.some((item) => item.id === 'drink_gate_q2'), false);
  assert.equal(after.some((item) => item.id === 'drink_gate_q2'), true);
});

test('drink trigger overrides the computed type with DRUNK', () => {
  const session = buildQuizSession(() => 0.25);
  const visible = getVisibleQuestions(session, { drink_gate_q1: 3 });
  const answers = toAnswers(visible, 2);
  answers.drink_gate_q1 = 3;
  answers.drink_gate_q2 = 2;

  const result = computeResult(answers);
  assert.equal(result.finalType.code, 'DRUNK');
  assert.equal(result.special, true);
});
