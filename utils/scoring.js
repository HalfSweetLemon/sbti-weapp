const { questions, specialQuestions } = require('../data/questions');
const { dimensionMeta, dimensionOrder } = require('../data/dimensions');
const { typeLibrary, normalTypes } = require('../data/types');

const DRINK_GATE_ID = 'drink_gate_q1';
const DRINK_TRIGGER_ID = 'drink_gate_q2';
const levelToNumber = { L: 1, M: 2, H: 3 };
const questionMap = new Map([...questions, ...specialQuestions].map((item) => [item.id, item]));

function shuffle(items, random = Math.random) {
  const copy = [...items];
  for (let index = copy.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [copy[index], copy[swapIndex]] = [copy[swapIndex], copy[index]];
  }
  return copy;
}

function buildQuizSession(random = Math.random) {
  const shuffledQuestions = shuffle(questions, random);
  const insertIndex = Math.floor(random() * shuffledQuestions.length) + 1;

  return {
    baseQuestionIds: [
      ...shuffledQuestions.slice(0, insertIndex).map((item) => item.id),
      DRINK_GATE_ID,
      ...shuffledQuestions.slice(insertIndex).map((item) => item.id)
    ]
  };
}

function getVisibleQuestions(session, answers) {
  const visibleIds = [...session.baseQuestionIds];
  const gateIndex = visibleIds.indexOf(DRINK_GATE_ID);

  if (gateIndex !== -1 && Number(answers[DRINK_GATE_ID]) === 3) {
    visibleIds.splice(gateIndex + 1, 0, DRINK_TRIGGER_ID);
  }

  return visibleIds.map((id) => questionMap.get(id));
}

function sumToLevel(score) {
  if (score <= 3) return 'L';
  if (score === 4) return 'M';
  return 'H';
}

function levelNum(level) {
  return levelToNumber[level];
}

function parsePattern(pattern) {
  return pattern.replace(/-/g, '').split('');
}

function computeResult(answers) {
  const rawScores = {};
  const levels = {};

  Object.keys(dimensionMeta).forEach((dimensionId) => {
    rawScores[dimensionId] = 0;
  });

  questions.forEach((question) => {
    rawScores[question.dim] += Number(answers[question.id] || 0);
  });

  Object.entries(rawScores).forEach(([dimensionId, score]) => {
    levels[dimensionId] = sumToLevel(score);
  });

  const userVector = dimensionOrder.map((dimensionId) => levelNum(levels[dimensionId]));
  const ranked = normalTypes
    .map((type) => {
      const vector = parsePattern(type.pattern).map(levelNum);
      let distance = 0;
      let exact = 0;

      for (let index = 0; index < vector.length; index += 1) {
        const diff = Math.abs(userVector[index] - vector[index]);
        distance += diff;
        if (diff === 0) exact += 1;
      }

      const similarity = Math.max(0, Math.round((1 - distance / 30) * 100));
      return {
        ...type,
        ...typeLibrary[type.code],
        distance,
        exact,
        similarity
      };
    })
    .sort((left, right) => {
      if (left.distance !== right.distance) return left.distance - right.distance;
      if (right.exact !== left.exact) return right.exact - left.exact;
      return right.similarity - left.similarity;
    });

  const bestNormal = ranked[0];
  const drunkTriggered = Number(answers[DRINK_TRIGGER_ID]) === 2;

  let finalType;
  let modeKicker = '你的主类型';
  let badge = `匹配度 ${bestNormal.similarity}% · 精准命中 ${bestNormal.exact}/15 维`;
  let sub = '维度命中度较高，当前结果可视为你的第一人格画像。';
  let special = false;
  let secondaryType = null;

  if (drunkTriggered) {
    finalType = typeLibrary.DRUNK;
    secondaryType = bestNormal;
    modeKicker = '隐藏人格已激活';
    badge = '匹配度 100% · 酒精异常因子已接管';
    sub = '乙醇亲和性过强，系统已直接跳过常规人格审判。';
    special = true;
  } else if (bestNormal.similarity < 60) {
    finalType = typeLibrary.HHHH;
    modeKicker = '系统强制兜底';
    badge = `标准人格库最高匹配仅 ${bestNormal.similarity}%`;
    sub = '标准人格库对你的脑回路集体罢工了，于是系统把你强制分配给了 HHHH。';
    special = true;
  } else {
    finalType = bestNormal;
  }

  return {
    rawScores,
    levels,
    ranked,
    bestNormal,
    finalType,
    modeKicker,
    badge,
    sub,
    special,
    secondaryType
  };
}

module.exports = {
  buildQuizSession,
  computeResult,
  getVisibleQuestions,
  levelNum,
  parsePattern,
  shuffle,
  sumToLevel
};
