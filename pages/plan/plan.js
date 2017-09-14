const util = require('../../utils/util.js')
// index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    theTodoList: null,
    theShowTodoList: null,
    updateSign: false,
    fnWidth: {},
    fnMaskShow: {},
    scrolling: false,//操作中 进行
    show: {},//done 已完成 past 已过期 period 时间段(all day week month year) sort(排序 plan 计划时间 add 添加时间 level 重要程度 tag 标签)
    defaultShow: { done: false, past: false, period: 'day', sort: 'plan' },
    fnAreaMove: { sp: {}, ep: {}, mp: {}, sign: false, width: 100 },
    tagsArray: ['工作', '学习','健身', '旅行', '购物','社交','娱乐', '其他'],
    badge: { '工作': '#f07063', '学习': '#f4ad5f', '健身': '#f8d461', '旅行': '#91de76', '购物': '#71bcf4', '社交': '#cd93e2', '娱乐': '#8e8e91', '其他': '#eee' },
    levelsArray: ['!', '!!', '!!!'],
    popUpShow: false,
    ToDoDetail: {
      id: '',
      content: '',
      time: '',
      date: '',
      tag: '',
      level: '',
      addTime: null,
      finishTime: null
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ theToDoList: wx.getStorageSync('theToDoList') || [] });
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
  showPopUp() {
    this.initToDoDetail();
    this.setData({
      'popUpShow': true
    })
  },
  hidePopUp() {
    this.setData({
      'popUpShow': false
    })
  },
  setList() {
    var that = this;
    wx.setStorageSync('theToDoList', that.data.theToDoList);
    that.data.theShowToDoList = that.data.theToDoList.slice(0);
    var l = that.data.theShowToDoList;
    var done = that.data.show.done;
    var past = that.data.show.past;
    var period = that.data.show.period;
    var now = new Date();
    for (let i = 0, len = l.length; i < len; i++) {
      l[i].showTime = util.getShowTime(l[i].date, l[i].time);
      // l[i].time ? l[i].time : "23:59"
      l[i].realTime = new Date(l[i].date);
      l[i].realTime.setHours(l[i].time.substr(0, 2));
      l[i].realTime.setMinutes(l[i].time.substr(3, 2));
      l[i].realTime.setSeconds(0);
      l[i].realTime.setMilliseconds(0);
      l[i].hide = false;
      if (!done) {//done true 显示已完成 false不显示
        if (l[i].done) {
          l[i].hide = true;
        }
      }
      if (!past) {//past true 显示已过期 false不显示
        if (l[i].realTime < now) {
          l[i].hide = true;
        }
      }
      if (!util.belongToPeriod(l[i].date, period)) {
        l[i].hide = true;
      }
    }
    util.sortBy(l, that.data.show.sort);
    this.setData({
      theShowToDoList: that.data.theShowToDoList
    });
  },
  showDetail(e) {
    var todo = e.currentTarget.dataset.todo;
    wx.showActionSheet({
      itemList: ['【内容】' + todo.content, '【计划时间】' + todo.date + ' ' + todo.time, '【完成时间】' + (todo.finishTime ? util.formatTime(todo.finishTime, 'min') : '尚未完成'), '【添加时间】' + util.formatTime(todo.addTime, 'min')],
      success: function (res) {
        // console.log(res.tapIndex)
      },
      fail: function (res) {
        // console.log(res.errMsg)
      }
    })
  },
  confirm: function (e) {
    var that = this;
    if (!this.data.ToDoDetail.content) {
      wx.showModal({
        title: '提示',
        content: '请输入事件！',
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
      return;
    }
    if (!this.data.ToDoDetail.date) {
      wx.showModal({
        title: '提示',
        content: '请选择日期！',
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
          } else if (res.cancel) {
            // console.log('用户点击取消')
          }
        }
      })
      return;
    }

    if (this.data.updateSign) {
      var list = that.data.theToDoList;
      for (var i = 0, len = list.length; i < len; i++) {
        if (list[i].id == that.data.ToDoDetail.id) {
          list[i] = that.data.ToDoDetail;
          break;
        };
      }
      this.setData({
        'updateSign': false
      })
      wx.showToast({
        title: '修改成功',
        icon: 'success',
        duration: 1500
      })
    } else {
      this.setData({
        'ToDoDetail.id': util.generateUUID(),
        'ToDoDetail.addTime': Date.now()
      })
      that.data.theToDoList.unshift(that.data.ToDoDetail);
      wx.showToast({
        title: '添加成功',
        icon: 'success',
        duration: 1500
      })
    }
    this.setData({
      'theToDoList': that.data.theToDoList
    })
    this.setList();
    that.hidePopUp();
  },
  editToDo(e) {
    this.hideFnArea(e);
    this.setData({
      'updateSign': true
    })
    var todo = e.currentTarget.dataset.todo;
    this.initToDoDetail(todo);
    this.setData({
      'popUpShow': true
    })
  },
  deleteToDo(e) {
    this.hideFnArea(e);
    var todo = e.currentTarget.dataset.todo;
    var that = this;
    wx.showModal({
      title: '是否删除',
      content: todo.content,
      success: function (res) {
        if (res.confirm) {
          // console.log('用户点击确定')
          var list = that.data.theToDoList;
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
  initToDoDetail: function (todo) {
    var now = new Date();
    var that = this;
    if (todo) {
      this.data.ToDoDetail = todo;
      this.setData({ 'ToDoDetail': this.data.ToDoDetail });
    } else {
      this.setData({
        'ToDoDetail.id': '',
        'ToDoDetail.content': '',
        'ToDoDetail.date': now.getFullYear() + '-' + util.formatNumber(now.getMonth() - 0 + 1) + '-' + util.formatNumber(now.getDate()),
        'ToDoDetail.time': (now.getHours() - 0 + 1) + ':00',
        'ToDoDetail.tag': that.data.tagsArray[0],
        'ToDoDetail.level': that.data.levelsArray[0],
        'ToDoDetail.addTime': null
      })
    }
  },
  bindContentInput: function (e) {
    this.setData({
      'ToDoDetail.content': e.detail.value
    })
  },
  bindTagChange: function (e) {
    var that = this;
    this.setData({
      'ToDoDetail.tag': that.data.tagsArray[e.detail.value]
    })
  },
  bindLevelChange: function (e) {
    var that = this;
    this.setData({
      'ToDoDetail.level': that.data.levelsArray[e.detail.value]
    })
  },
  bindDateChange: function (e) {
    this.setData({
      'ToDoDetail.date': e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      'ToDoDetail.time': e.detail.value
    })
  },
  checkboxChange: function (e) {
    var that = this;
    for (let i = 0, len = that.data.theToDoList.length; i < len; i++) {
      if (that.data.theToDoList[i].id == e.currentTarget.dataset.id) {
        var params = {};
        var key = 'theToDoList[' + i + '].done';
        params[key] = e.currentTarget.dataset.value == 'true' ? true : false;
        if (params[key]) {
          params['theToDoList[' + i + '].finishTime'] = Date.now();
        } else {
          params['theToDoList[' + i + '].finishTime'] = null;
        }
        this.setData(params);
      }
    }
    this.setList();
  },
  hideFnArea(e) {
    var that = this;
    if (that.data.scrolling) return;
    var interval = setInterval(function () {
      if (that.data.fnWidth[e.currentTarget.dataset.id] > 0) {
        var params = {}, value;
        var key = 'fnWidth.' + e.currentTarget.dataset.id;
        value = Math.floor(that.data.fnWidth[e.currentTarget.dataset.id] - 1);
        params[key] = value;
        that.setData(params)
      } else {
        var params = {};
        params['fnMaskShow.' + e.currentTarget.dataset.id] = false;
        that.setData(params)
        clearInterval(interval);
      }
    }, 10);
    // var params = {};
    // params['fnWidth.' + e.currentTarget.dataset.id] = 0;
    // this.setData(params)
  },
  showFnAreaStart(e) {
    var data = this.data.fnAreaMove;
    var x = e.touches[0].pageX;
    var y = e.touches[0].pageY;
    data.sp.x = x;
    data.sp.y = y;
    data.mp.x = x;
    data.mp.y = y;
  },
  showFnAreaMove(e) {
    var data = this.data.fnAreaMove;
    var x = e.touches[0].pageX;
    var y = e.touches[0].pageY;
    if (data.mp.x == data.sp.x) {//开始滑动判断横向纵向
      if (Math.abs(x - data.sp.x) > Math.abs(y - data.sp.y)) {
        data.sign = true;
      } else {
        data.sign = false;
      }
    } else {
      if (data.sign && data.sp.x - x > 0) {
        var params = {};
        var key = 'fnWidth.' + e.currentTarget.dataset.id;
        var value = (data.sp.x - x) > data.width ? data.width : (data.sp.x - x);
        params[key] = value;
        this.setData(params)
      } else {
        return;
      }
    }
    data.mp.x = x;
    data.mp.y = y;
  },
  showFnAreaEnd(e) {
    var that = this;
    var data = this.data.fnAreaMove;
    if (this.data.fnWidth[e.currentTarget.dataset.id] >= data.width / 2) {
      var params = {};
      // var key = 'fnWidth.' + e.currentTarget.dataset.id;
      // params[key] = data.width;
      params['fnMaskShow.' + e.currentTarget.dataset.id] = true;
      that.setData(params)
      that.data.scrolling = true;
      var interval = setInterval(function () {
        if (that.data.fnWidth[e.currentTarget.dataset.id] < data.width) {
          var params = {}, value;
          var key = 'fnWidth.' + e.currentTarget.dataset.id;
          value = Math.ceil(that.data.fnWidth[e.currentTarget.dataset.id] + 1);
          params[key] = value;
          that.setData(params)
        } else {
          that.data.scrolling = false;
          clearInterval(interval);
        }
      }, 10);
    } else {
      var params = {};
      // var key = 'fnWidth.' + e.currentTarget.dataset.id;
      // params[key] = 0;
      params['fnMaskShow.' + e.currentTarget.dataset.id] = false;
      that.setData(params)
      that.data.scrolling = true;
      var interval = setInterval(function () {
        if (that.data.fnWidth[e.currentTarget.dataset.id] > 0) {
          var params = {}, value;
          var key = 'fnWidth.' + e.currentTarget.dataset.id;
          value = Math.floor(that.data.fnWidth[e.currentTarget.dataset.id] - 1);
          params[key] = value;
          that.setData(params)
        } else {
          that.data.scrolling = false;
          clearInterval(interval);
        }
      }, 10);
    }
  }
})