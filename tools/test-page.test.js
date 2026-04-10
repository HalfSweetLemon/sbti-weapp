const test = require('node:test');
const assert = require('node:assert/strict');
const { buildPageState, updateAnswerState, decorateQuestions } = require('../pages/test/index.logic');

const session = { baseQuestionIds: ['q1', 'drink_gate_q1', 'q2'] };

test('page state calculates progress and completion', () => {
  const state = buildPageState(session, { q1: 1, drink_gate_q1: 2, q2: 3 }, [
    { id: 'q1' },
    { id: 'drink_gate_q1' },
    { id: 'q2' }
  ]);
  assert.equal(state.done, 3);
  assert.equal(state.total, 3);
  assert.equal(state.complete, true);
});

test('changing drink gate away from 饮酒 clears the trigger answer', () => {
  const answers = updateAnswerState({ drink_gate_q1: 3, drink_gate_q2: 2 }, 'drink_gate_q1', 1);
  assert.equal(answers.drink_gate_q2, undefined);
});

test('decorateQuestions marks the selected radio option', () => {
  const decorated = decorateQuestions([
    {
      id: 'q1',
      dim: 'S1',
      text: 'question',
      options: [
        { label: 'A', value: 1 },
        { label: 'B', value: 2 }
      ]
    }
  ], { q1: 2 });

  assert.equal(decorated[0].options[0].checked, false);
  assert.equal(decorated[0].options[1].checked, true);
});
