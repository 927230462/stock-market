const cheerio = require("cheerio")
var util = require("../utils/util")
var path = require("path")
var handlebars = require("handlebars")

var listFilter = function (list, ctx) {
  var arr = []
  var filter = ctx.session.filter
  var filterList = filter.split(" ")
  var defaultFilterList = ctx.session.defaultFilter.split(" ")

  list.forEach(function (v, index) {
    v.stockCode = v.stockCode ? "(" + v.stockCode + ")" : ""
    v.index = index + 1
    v.msgQuestion = v.msgQuestion || ""
    v.msgAnswer = v.msgAnswer || ""

    var flag = false
    defaultFilterList.forEach(function (noItem) {
      if (v.msgAnswer.indexOf(noItem) >= 0) {
        flag = true //回答中包含不是 没有 无法 还未 不推送
      }
    })
    if (flag) {
      return
    }

    //如果没有设置过滤关键词
    if (!filter) {
      arr.push(v)
    } else {
      filterList.forEach(function (key) {
        //问题当中有关键词 并且 回答中不包含
        if (v.msgQuestion.indexOf(key) >= 0 || v.msgAnswer.indexOf(key) >= 0) {
          arr.push(v)
        }
      })
    }
  })
  return arr
}

module.exports = {
  listFilter,
}
