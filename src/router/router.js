var util = require("../utils/util")
const Router = require("koa-router")
let router = new Router()

//  主页
router.get("/", function (req, res) {
  var $ = util.getIndexPage()
  $("body").append($("#index").html())
  res.send($.html())
})

//  POST 请求
router.post("/", function (req, res) {
  res.send("Hello POST")
})

router.get("/list_user", function (req, res) {
  res.send("用户列表页面")
})

module.exports = router