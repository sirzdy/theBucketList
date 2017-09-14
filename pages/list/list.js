// pages/list/list.js
const util = require('../../utils/util.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    theBucketList: null,
    theShowBucketList: null,
    content: '',
    showDetail: {},
    defaultShow: { bucketDone: false },
    show: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ theBucketList: wx.getStorageSync('theBucketList') || [] });
    this.setData({ show: wx.getStorageSync('show') || this.data.defaultShow });
    this.setList();
  },

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
    this.setList();
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
  showDetail(e) {
    var todo = e.currentTarget.dataset.todo;
    wx.showActionSheet({
      itemList: ['【内容】' + todo.content, '【实现情况】' + (todo.done ? todo.finishTime ? '实现于' + todo.finishTime : '已实现' : '尚未实现'), '【添加时间】' + util.formatTime(todo.addTime, 'min'), '【备注】' + (todo.detail ? todo.detail : '暂无')],
      success: function (res) {
        // console.log(res.tapIndex)
      },
      fail: function (res) {
        // console.log(res.errMsg)
      }
    })
  },
  setList() {
    var that = this;
    wx.setStorageSync('theBucketList', that.data.theBucketList);
    that.data.theShowBucketList = [];
    if (!that.data.show.bucketDone) {
      var list = that.data.theBucketList;
      for (var i = 0, len = list.length; i < len; i++) {
        if (!list[i].done) {
          that.data.theShowBucketList.push(list[i]);
        };
      }
    } else {
      that.data.theShowBucketList = that.data.theBucketList.slice(0);
    }
    this.setData({
      theShowBucketList: that.data.theShowBucketList
    });
  },
  bindDateChange: function (e) {
    var that = this;
    for (let i = 0, len = that.data.theBucketList.length; i < len; i++) {
      if (that.data.theBucketList[i].id == e.currentTarget.dataset.id) {
        var params = {};
        var key = 'theBucketList[' + i + '].finishTime';
        params[key] = e.detail.value;
        this.setData(params);
      }
    }
    this.setList();
  },
  updateDetail: function (e) {
    var that = this;
    for (let i = 0, len = that.data.theBucketList.length; i < len; i++) {
      if (that.data.theBucketList[i].id == e.currentTarget.dataset.id) {
        var params = {};
        var key = 'theBucketList[' + i + '].detail';
        params[key] = e.detail.value;
        this.setData(params);
      }
    }
    this.setList();
  },
  updateContent: function (e) {
    var that = this;
    for (let i = 0, len = that.data.theBucketList.length; i < len; i++) {
      if (that.data.theBucketList[i].id == e.currentTarget.dataset.id) {
        var params = {};
        var key = 'theBucketList[' + i + '].content';
        params[key] = e.detail.value;
        this.setData(params);
        break;
      }
    }
    this.setList();
  },
  checkboxChange: function (e) {
    var that = this;
    for (let i = 0, len = that.data.theBucketList.length; i < len; i++) {
      if (that.data.theBucketList[i].id == e.currentTarget.dataset.id) {
        var params = {};
        var key = 'theBucketList[' + i + '].done';
        params[key] = e.currentTarget.dataset.value == 'true' ? true : false;
        if (params[key]) {
          // params['theBucketList[' + i + '].finishTime'] = Date.now();
        } else {
          params['theBucketList[' + i + '].finishTime'] = null;
        }
        this.setData(params);
        break;
      }
    }
    this.setList();
  },
  bindEventChange: function (e) {
    this.setData({
      'content': e.detail.value
    })
  },
  deleteToDo(e) {
    var todo = e.currentTarget.dataset.todo;
    var that = this;
    wx.showModal({
      title: '是否删除',
      content: todo.content,
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          var list = that.data.theBucketList;
          for (var i = 0, len = list.length; i < len; i++) {
            if (list[i].id == todo.id) {
              list.splice(i, 1);
              break;
            };
          }
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 1500
          })
          that.setData({
            'theToDoList': that.data.theToDoList
          })
          that.setList();
        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })
  },
  addEvent: function (e) {
    if (!this.data.content) return;
    this.data.theBucketList.push({
      id: util.generateUUID(),
      content: this.data.content,
      addTime: Date.now()
    })
    this.setData({
      theBucketList: this.data.theBucketList
    })
    wx.showToast({
      title: '添加成功',
      icon: 'success',
      duration: 1500
    })
    this.setList();
  },
  setInfo: function (e) {
    var id = e.currentTarget.dataset.id;
    var params = {};
    var key = 'showDetail.' + id;
    params[key] = !this.data.showDetail[id];
    this.setData(params);
  }
})