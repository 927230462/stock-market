const cheerio = require("cheerio")
var util = require("../utils/util")
var path = require("path")
var handlebars = require("handlebars")

var listFilter = function (list, ctx) {
  var arr = []
  var filter = ctx.sesstion.filter
  var filterList = filter.split(" ")
  var defaultFilterList = ctx.sesstion.defaultFilter.split(" ")

  list.forEach(function (v, index) {
    v.code = v.code ? "(" + v.code + ")" : ""
    v.index = index + 1
    v.question = v.question || ""
    v.answer = v.answer || ""

    var flag = false
    defaultFilterList.forEach(function (noItem) {
      if (v.answer.indexOf(noItem) >= 0) {
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
        if (v.question.indexOf(key) >= 0 || v.text.indexOf(key) >= 0) {
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
