console.log("你好！欢迎使用废废的小工具~")
const cheerio = require("cheerio")
var util = require("./utils/util")
var path = require("path")

var express = require("express")
var app = express()
app.use(express.static(path.join(__dirname, "./public")))
app.use(express.static(path.join(__dirname, "./css")))
app.use(express.static(path.join(__dirname, "./js")))

//添加路由
require("./router/index")(app)

var server = app.listen(8082, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
