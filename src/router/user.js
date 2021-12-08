var util = require("../utils/util")
var handlebars = require("handlebars")

module.exports = function (app) {
  app.get("/user/login", async (ctx) => {
    let { email, password } = ctx.request.body
    let result, errMsg
    result = await User.findOne({
      attributes: QueryInclude.User.attributes,
      where: { email, password: md5(md5(password)) },
    })
    if (result) {
      ctx.session.id = result.id
      ctx.session.fullname = result.fullname
      ctx.session.email = result.email
      let app = ctx.app
      app.counter.users[result.fullname] = true
    } else {
      errMsg = "账号或密码错误"
    }
  })

  app.get("/user/settingTime", function (req, res) {
    // var webConfig = util.getWebConfig()
    let $ = util.getIndexPage()
    // $('body').append($('#settingTimeForm').html())
    // $('#refreshTime').val( webConfig.refreshTime || "")
    // $('#coverTime').val( webConfig.coverTime || "")
    res.send($.html())
  })
  app.post("/user/submitSettingTime", function (req, res) {
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

  app.get("/user/setting", function (req, res) {
    // var webConfig = util.getWebConfig()
    let $ = util.getIndexPage()
    // $('body').append($('#settingKeyForm').html())
    // $('#defaultFilter').html(webConfig.defaultFilter || "")
    // $('#filter').html(webConfig.filter || "")
    // $('#watermark').html(webConfig.watermark || "")
    res.send($.html())
  })

  app.post("/user/submitSetting", function (req, res) {
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
}
