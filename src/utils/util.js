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

module.exports = {
  formatDateFileName: formatDateFileName,
  parseTime: parseTime,
}
