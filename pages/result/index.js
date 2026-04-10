const { buildQuizSession } = require('../../utils/scoring');
const { loadResult, clearAllQuizState, saveSession } = require('../../utils/storage');
const { buildDimensionCards, getTypeImage } = require('./index.logic');

Page({
  data: {
    result: null,
    dimensionCards: [],
    typeImage: ''
  },

  onShow() {
    const result = loadResult(wx);
    if (!result) {
      wx.showToast({ title: '没有可展示的结果', icon: 'none' });
      wx.reLaunch({ url: '/pages/home/index' });
      return;
    }

    this.setData({
      result,
      dimensionCards: buildDimensionCards(result),
      typeImage: getTypeImage(result.finalType.code)
    });
  },

  handleRestart() {
    clearAllQuizState(wx);
    saveSession(wx, {
      session: buildQuizSession(),
      answers: {},
      startedAt: Date.now()
    });
    wx.reLaunch({ url: '/pages/test/index' });
  },

  handleBackHome() {
    wx.reLaunch({ url: '/pages/home/index' });
  }
});
