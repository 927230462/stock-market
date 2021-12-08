var fs = require("fs")
var path = require("path")
var cheerio = require("cheerio")

function getDayOfWeek(dayValue) {
  var day = new Date(Date.parse(dayValue.replace(/-/g, "/"))) //将日期值格式化
  var today = new Array("星期天", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六")
  return today[day.getDay()] //day.getDay();根据Date返一个星期中的某一天，其中0为星期日
}

function parseTime(time, cFormat) {
  if (!time) {
    return null
  }
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}"
  let date
  if (typeof time === "object") {
    date = time
  } else {
    if (typeof time === "string" && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === "number" && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === "a") {
      return ["日", "一", "二", "三", "四", "五", "六"][value]
    }
    if (result.length > 0 && value < 10) {
      value = "0" + value
    }
    return value || 0
  })
  return time_str
}

function formatDateFileName(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear(),
    hours = d.getHours()
  if (month.length < 2) month = "0" + month
  if (day.length < 2) day = "0" + day

  var hoursStr = ""
  if (hours >= 0 && hours < 6) {
    hoursStr = "-00-06"
  } else if (hours >= 6 && hours < 12) {
    hoursStr = "-06-12"
  } else if (hours >= 12 && hours < 18) {
    hoursStr = "-12-18"
  } else if (hours >= 18 && hours < 24) {
    hoursStr = "-18-24"
  }

  return [year, month, day].join("-") + hoursStr
}

//读取模板
const getTemplate = (path) => {
  var data = ""
  try {
    data = fs.readFileSync(path)
    data = data.toString()
  } catch (e) {
    data = ""
    console.log("读取模板", e.message)
  }
  return data
}

//读取模板
const getMemory = (fileName) => {
  var data = {}
  try {
    data = fs.readFileSync(path.resolve(__dirname, fileName))
    data = data.toString()
    data = JSON.parse(data)
  } catch (e) {
    data = {}
    console.log("读取挂机内容", e.message)
  }
  return data
}

var pageInit = function () {
  // var config = getWebConfig()
  // var script = '<script type="application/javascript">'
  // script += 'window.watermark="' + (config.watermark || '青') + '";'
  // script += 'window.refreshTime="' + (config.refreshTime || 3000) + '";'
  // script += '</script>'
  return script
}

var getIndexPage = function () {
  var template = getTemplate(path.resolve(__dirname, "../index.html"))
  let $ = cheerio.load(template, { decodeEntities: false })
  $("body").attr("id", "index-container")
  var script = pageInit()
  $("body").prepend(script)
  return $
}

var getCachePage = function () {
  var template = getTemplate(path.resolve(__dirname, "../cache.html"))
  let $ = cheerio.load(template, { decodeEntities: false })
  $("body").attr("id", "index-container")
  var script = pageInit()
  $("body").prepend(script)
  return $
}

module.exports = {
  getTemplate: getTemplate,
  getMemory: getMemory,
  getDayOfWeek: getDayOfWeek,
  formatDateFileName: formatDateFileName,
  parseTime: parseTime,
  getIndexPage: getIndexPage,
  getCachePage: getCachePage,
}
