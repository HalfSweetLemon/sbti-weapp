const { buildQuizSession } = require('../../utils/scoring');
const { loadSession, saveSession } = require('../../utils/storage');
const { decideStartMode } = require('./index.logic');

Page({
  data: {
    hasSession: false
  },

  onShow() {
    const session = loadSession(wx);
    this.setData({
      hasSession: decideStartMode(session) === 'resume'
    });
  },

  handleStart() {
    const session = loadSession(wx);
    if (!session) {
      saveSession(wx, {
        session: buildQuizSession(),
        answers: {},
        startedAt: Date.now()
      });
    }
    wx.navigateTo({ url: '/pages/test/index' });
  }
});
