var util = require("../utils/util")
var connection = require("../mysql/index")
let router = require("./router")

router.get("/user/login", async (ctx) => {
  let { mobile, password } = ctx.request.query
  let result, errMsg
  console.log(mobile)
  let user = await new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM user where mobile='${mobile}'`, function (error, results, fields) {
      console.log(results)

      resolve(results[0])
    })
  })

  if (user) {
    ctx.session.id = user.id
    ctx.session.userName = user.userName
    ctx.session.mobile = user.mobile
    ctx.session.email = user.email
    ctx.session.filter = user.filter
    ctx.session.defaultFilter = user.defaultFilter
    ctx.session.watermark = user.watermark
    // let app = ctx.app
    // app.counter.users[user.userName] = true
  } else {
    errMsg = "账号或密码错误"
  }

  console.log("tongbu")
  ctx.body = errMsg || user.email
})

router.get("/user/info", async (ctx) => {
  ctx.body = ctx.session
})

router.get("/user/settingTime", async (ctx) => {
  // var webConfig = util.getWebConfig()
  let $ = util.getIndexPage()
  // $('body').append($('#settingTimeForm').html())
  // $('#refreshTime').val( webConfig.refreshTime || "")
  // $('#coverTime').val( webConfig.coverTime || "")
  ctx.body = $.html()
})
router.post("/user/submitSettingTime", function (req, res) {
  var body = ""
  req.on("data", function (chunk) {
    body += chunk
  })
  req.on("end", function () {
    // 解析参数
    body = querystring.parse(body)
    // 设置响应头部信息及编码
    res.writeHead(200, { "Content-Type": "text/html; charset=utf8" })
    res.write("设置刷新时间成功:" + body.refreshTime + "秒</br>" + "设置备份时间成功:" + body.coverTime + "秒")
    // var webConfig = util.getWebConfig()
    // webConfig.refreshTime = body.refreshTime || ''
    // webConfig.coverTime = body.coverTime || ''
    // util.setWebConfig(webConfig)
    res.end()
  })
})

router.get("/user/setting", function (req, res) {
  // var webConfig = util.getWebConfig()
  let $ = util.getIndexPage()
  // $('body').append($('#settingKeyForm').html())
  // $('#defaultFilter').html(webConfig.defaultFilter || "")
  // $('#filter').html(webConfig.filter || "")
  // $('#watermark').html(webConfig.watermark || "")
  res.send($.html())
})

router.post("/user/submitSetting", function (req, res) {
  var body = ""
  req.on("data", function (chunk) {
    body += chunk
  })
  req.on("end", function () {
    // 解析参数
    body = querystring.parse(body)
    body.filter = body.filter || ""
    body.defaultFilter = body.defaultFilter || ""
    body.watermark = body.watermark || ""
    // 设置响应头部信息及编码
    res.writeHead(200, { "Content-Type": "text/html; charset=utf8" })
    res.write("设置默认非成功：" + body.defaultFilter + "</br>设置关键词成功：" + body.filter + "</br>设置水印值成功：" + body.watermark)
    // var webConfig = util.getWebConfig()
    // webConfig.filter = body.filter
    // webConfig.defaultFilter = body.defaultFilter
    // webConfig.watermark = body.watermark
    // util.setWebConfig(webConfig)
    res.end()
  })
})
