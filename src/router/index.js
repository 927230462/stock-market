var shsz = require("./router/shsz") //上证深交
var historyMessage = require("./router/cache") //挂机的历史消息操作
var keySetting = require("./router/settingKey") //关键词设置
var timeSetting = require("./router/settingTime") //时间设置
var spiderInit = require("./spider/init") //外挂

module.exports = function (app) {
  shsz(app)
  historyMessage(app)
  keySetting(app)
  timeSetting(app)
  spiderInit(app)

  //  主页
  app.get("/", function (req, res) {
    var $ = util.getIndexPage()
    $("body").append($("#index").html())
    res.send($.html())
  })

  //  POST 请求
  app.post("/", function (req, res) {
    res.send("Hello POST")
  })

  app.get("/list_user", function (req, res) {
    res.send("用户列表页面")
  })

  app.get("/ab*cd", function (req, res) {
    res.send("正则匹配")
  })
}
