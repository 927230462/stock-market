var path = require("path")
var Koa = require("koa")
var app = new Koa()

// 解析body
var bodyParser = require("koa-bodyparser")
app.use(bodyParser())

// 静态资源文件
var serve = require("koa-static")
app.use(serve(path.join(__dirname, "./web")))

// session
const session = require("koa-session")
app.keys = ["some secret hurr"]
const CONFIG = {
  key: "koa:sess", //cookie key (default is koa:sess)
  maxAge: 86400000, // cookie的过期时间 maxAge in ms (default is 1 days)
  overwrite: true, //是否可以overwrite    (默认default true)
  httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
  signed: true, //签名默认true
  rolling: false, //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
  renew: false, //(boolean) renew session when session is nearly expired,
}
app.use(session(CONFIG, app))

app.use(async (ctx, next) => {
  if (!ctx.session.id && ctx.path != "/user/login") {
    ctx.type = "json" // 指定返回类型为 html 类型
    ctx.body = {
      code: "0006",
      msg: "请先登录",
    }
  } else {
    await next()
  }
})

// 添加路由
let router = require("./router/index")
app.use(router.routes())

//启动服务
var server = app.listen(8082, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})

//
console.log("你好！欢迎使用废废的小工具~")
