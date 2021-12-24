var util = require("../utils/util")
var spiderHttp = require("./index")
var spiderFormat = require("./format")
var connection = require("../mysql/index")

module.exports = function (ctx) {
  var timer = null
  var user = ctx.session
  var save = function (listArr) {
    if (listArr.length == 0) {
      return
    }
    var list = spiderFormat.listFilter(listArr, ctx)
    if (list.length == 0) {
      return
    }
    list.forEach(function (v) {
      v.createTime = util.parseTime(new Date())
      connection.query(`SELECT * FROM log where msgId='${v.id}'`, function (error, results, fields) {
        if (error) throw error
        if (!results[0]) {
          let sql = `INSERT INTO log(userId, msgId, msgSource, msgTitle, msgQuestion, msgAnswer,msgTime, stockCode,createTime) VALUES("${user.id}","${v.msgId}","${v.msgSource}", '${v.msgTitle}', '${v.msgQuestion}', '${v.msgAnswer}', '${v.msgTime}','${v.stockCode}','${v.createTime}')`
          connection.query(sql, function (error, results, fields) {
            if (error) throw error
          })
        }
      })
    })
  }

  var timerFn = function () {
    console.log("发出请求，运行一次~")
    spiderHttp.getShangHaiHtml().then((list) => {
      save(list)
    })
    spiderHttp.getShenZhenHtml().then((list) => {
      save(list)
    })
  }
  timerFn() // 立即执行一次
  timer = setInterval(function () {
    timerFn()
  }, ctx.session.coverTime * 1000 || 30000)
}
