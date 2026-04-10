const { getVisibleQuestions } = require('../../utils/scoring');

function updateAnswerState(answers, questionId, value) {
  const nextAnswers = { ...answers, [questionId]: Number(value) };
  if (questionId === 'drink_gate_q1' && Number(value) !== 3) {
    delete nextAnswers.drink_gate_q2;
  }
  return nextAnswers;
}

function decorateQuestions(questions, answers) {
  return questions.map((question, index) => ({
    ...question,
    questionIndex: index + 1,
    metaLabel: question.special ? '特殊题' : question.dim,
    options: question.options.map((option, optionIndex) => ({
      ...option,
      optionCode: ['A', 'B', 'C', 'D'][optionIndex] || String(optionIndex + 1),
      checked: answers[question.id] === option.value
    }))
  }));
}

function buildPageState(session, answers, visibleQuestions = getVisibleQuestions(session, answers)) {
  const done = visibleQuestions.filter((item) => answers[item.id] !== undefined).length;
  const total = visibleQuestions.length;
  return {
    visibleQuestions,
    done,
    total,
    percent: total ? Math.round((done / total) * 100) : 0,
    complete: total > 0 && done === total
  };
}

module.exports = {
  buildPageState,
  decorateQuestions,
  updateAnswerState
};
