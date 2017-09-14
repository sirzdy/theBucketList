const formatTime = (date, to) => {
  if (typeof date == 'number') {
    date = new Date(date);
  }
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  if (to == 'min') {
    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute].map(formatNumber).join(':')
  }
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')

}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const generateUUID = () => {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}
const sortBy = (l, sort) => {
  if (!sort || sort == 'plan') {
    l.sort(sortByTime);
  } else if (sort == 'add') {
    l.sort(function (a, b) {
      if (a.addTime == b.addTime) {
        return
      }
      return a.addTime - b.addTime;
    })
  } else if (sort == 'level') {
    l.sort(function (a, b) {
      if (a.level == b.level) {
        return sortByTime(a, b);
      }
      return b.level.length - a.level.length;
    })
  } else if (sort == 'tag') {
    l.sort(function (a, b) {
      if (a.tag == b.tag) {
        return sortByTime(a, b);
      }
      return b.tag.localeCompare(a.tag);
    })
  }
}
const sortByTime = (a, b) => {
  if (!a || !b) {
    return;
  }
  var ret;
  var da = a.date.replace(/-/g, '');
  var db = b.date.replace(/-/g, '');
  var ta = a.time ? a.time.replace(/:/g, '') : -1;
  var tb = b.time ? b.time.replace(/:/g, '') : -1;
  if (da != db) {
    ret = da - db;
  } else {
    ret = ta - tb;
  }
  return ret;
}

const deepCopy = (source) => {
  var result = {};
  for (var key in source) {
    result[key] = (result[key] instanceof Object ? this.deepCopy(source[key]) : source[key]);
  }
  return result;
}
const getShowTime = (date, time) => {
  var cur = new Date();
  cur.setHours(0);
  cur.setMinutes(0);
  cur.setSeconds(0);
  cur.setMilliseconds(0);
  var curDate = cur.getDate();
  var now = new Date();
  var tomorrow = new Date(cur.setDate(curDate + 1));
  var theDayAfterTomorrow = new Date(cur.setDate(curDate + 2));
  var threeDaysFromNow = new Date(cur.setDate(curDate + 3));
  var yesterday = new Date(cur.setDate(curDate - 1));
  var theDayBeforeYesterday = new Date(cur.setDate(curDate - 2));
  var threeDaysAgo = new Date(cur.setDate(curDate - 3));
  var d = new Date(date);
  if (now.getFullYear() == d.getFullYear() && now.getMonth() == d.getMonth() && now.getDate() == d.getDate()) {
    return time ? time : '今天';
  } else if (tomorrow.getFullYear() == d.getFullYear() && tomorrow.getMonth() == d.getMonth() && tomorrow.getDate() == d.getDate()) {
    return '明天';
  } else if (theDayAfterTomorrow.getFullYear() == d.getFullYear() && theDayAfterTomorrow.getMonth() == d.getMonth() && theDayAfterTomorrow.getDate() == d.getDate()) {
    return '后天';
  } else if (threeDaysFromNow.getFullYear() == d.getFullYear() && threeDaysFromNow.getMonth() == d.getMonth() && threeDaysFromNow.getDate() == d.getDate()) {
    return '大后天';
  } else if (yesterday.getFullYear() == d.getFullYear() && yesterday.getMonth() == d.getMonth() && yesterday.getDate() == d.getDate()) {
    return '昨天';
  } else if (theDayBeforeYesterday.getFullYear() == d.getFullYear() && theDayBeforeYesterday.getMonth() == d.getMonth() && theDayBeforeYesterday.getDate() == d.getDate()) {
    return '前天';
  } else if (threeDaysAgo.getFullYear() == d.getFullYear() && threeDaysAgo.getMonth() == d.getMonth() && threeDaysAgo.getDate() == d.getDate()) {
    return '大前天';
  } else if (now.getFullYear() == d.getFullYear()) {
    return formatNumber(d.getMonth() - 0 + 1) + '月' + formatNumber(d.getDate()) + '日';
  } else if (now.getFullYear() != d.getFullYear()) {
    return d.getFullYear() + '年';
  }
}
const belongToPeriod = (date, sign) => {
  var cur = new Date();
  cur.setHours(0);
  cur.setMinutes(0);
  cur.setSeconds(0);
  cur.setMilliseconds(0);
  var curDate = cur.getDate();
  var day = cur.getDay();
  var month = cur.getMonth();
  if (sign == 'day') {
    date = new Date(date);
    if (date.getFullYear() == cur.getFullYear() && date.getMonth() == cur.getMonth() && date.getDate() == cur.getDate()) {
      return true;
    } else {
      return false;
    }
  }
  if (sign == 'week') {
    var startDate = new Date(cur.setDate(curDate - day + 1));//周一为第一天
    var endDate = new Date(cur.setDate(curDate - day + 7));//周日为最后一天
    var startD = startDate.getFullYear() + formatNumber(startDate.getMonth() - 0 + 1) + formatNumber(startDate.getDate());
    var endD = endDate.getFullYear() + formatNumber(endDate.getMonth() - 0 + 1) + formatNumber(endDate.getDate());
    var d = date.replace(/-/g, '');
    if (d >= startD && d <= endD) {
      return true;
    } else {
      return false;
    }
  }
  if (sign == 'month') {
    date = new Date(date);
    if (date.getFullYear() == cur.getFullYear() && date.getMonth() == cur.getMonth()) {
      return true;
    } else {
      return false;
    }
  }
  if (sign == 'year') {
    date = new Date(date);
    if (date.getFullYear() == cur.getFullYear()) {
      return true;
    } else {
      return false;
    }
  }
  if (sign == 'all') {
    return true;
  }
}
module.exports = {
  formatNumber: formatNumber,
  formatTime: formatTime,
  generateUUID: generateUUID,
  deepCopy: deepCopy,
  getShowTime: getShowTime,
  sortBy: sortBy,
  belongToPeriod: belongToPeriod
}
