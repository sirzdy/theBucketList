// setting.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    defaultShow: { done: false, past: false, period: 'day', sort: 'plan', bucketDone:false },
    show: null,//{ done: false, past: false, period: 'day', sort: 'plan',bucketDone:false },//done 已完成 past 已过期 period 时间段(all day week month year) sort(排序 plan 计划时间 add 添加时间 level 重要程度 tag 标签) bucketDone 遗愿清单已完成
    userInfo: {},
    hasUserInfo: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  // upload: function (e) {
  //   console.log(this.data.userInfo)
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({ show: wx.getStorageSync('show') || this.data.defaultShow });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // getUserInfo: function (e) {
  //   app.globalData.userInfo = e.detail.userInfo
  //   this.setData({
  //     userInfo: e.detail.userInfo,
  //     hasUserInfo: true
  //   })
  // },
  toggleBucketDone() {
    this.setData({
      'show.bucketDone': !this.data.show.bucketDone
    })
    wx.setStorageSync('show', this.data.show)
  },
  toggleDone() {
    this.setData({
      'show.done': !this.data.show.done
    })
    wx.setStorageSync('show', this.data.show)
  },
  togglePast() {
    this.setData({
      'show.past': !this.data.show.past
    })
    wx.setStorageSync('show', this.data.show)
  },
  setPeriod(e) {
    this.setData({
      'show.period': e.detail.value || e.currentTarget.dataset.period
    })
    wx.setStorageSync('show', this.data.show)
  },
  setSort(e) {
    this.setData({
      'show.sort': e.detail.value || e.currentTarget.dataset.sort
    })
    wx.setStorageSync('show', this.data.show)
  },

})