const { buildQuizSession, getVisibleQuestions, computeResult } = require('../../utils/scoring');
const { loadSession, saveSession, saveResult, clearSession } = require('../../utils/storage');
const { buildPageState, decorateQuestions, updateAnswerState } = require('./index.logic');

Page({
  data: {
    answers: {},
    visibleQuestions: [],
    done: 0,
    total: 0,
    percent: 0,
    complete: false,
    hint: '全选完才会放行。世界已经够乱了，起码把题做完整。'
  },

  onShow() {
    let stored = loadSession(wx);
    if (!stored || !stored.session) {
      stored = {
        session: buildQuizSession(),
        answers: {},
        startedAt: Date.now()
      };
      saveSession(wx, stored);
    }
    this.session = stored.session;
    this.syncPage(stored.answers || {});
  },

  syncPage(answers) {
    const visibleQuestions = decorateQuestions(getVisibleQuestions(this.session, answers), answers);
    const pageState = buildPageState(this.session, answers, visibleQuestions);
    this.setData({
      answers,
      ...pageState,
      hint: pageState.complete
        ? '都做完了。现在可以把你的电子魂魄交给结果页审判。'
        : '全选完才会放行。世界已经够乱了，起码把题做完整。'
    });
    saveSession(wx, {
      session: this.session,
      answers,
      startedAt: Date.now()
    });
  },

  handleAnswerChange(event) {
    const questionId = event.currentTarget.dataset.id;
    const nextAnswers = updateAnswerState(this.data.answers, questionId, event.detail.value);
    this.syncPage(nextAnswers);
  },

  handleBackHome() {
    wx.navigateBack({ delta: 1 });
  },

  handleSubmit() {
    if (!this.data.complete) {
      return;
    }

    const result = computeResult(this.data.answers);
    result.funNote = result.special
      ? '本测试仅供娱乐。隐藏人格和傻乐兜底都属于作者故意埋的损招，请勿把它当成医学、心理学、相学、命理学或灵异学依据。'
      : '本测试仅供娱乐，别拿它当诊断、面试、相亲、分手、招魂、算命或人生判决书。你可以笑，但别太当真。';

    saveResult(wx, result);
    clearSession(wx);
    wx.navigateTo({ url: '/pages/result/index' });
  }
});
