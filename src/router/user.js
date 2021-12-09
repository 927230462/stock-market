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
  let errMsg
  let user = await new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM user where id='${ctx.session.id}'`, function (error, results, fields) {
      console.log(results)
      resolve(results[0])
    })
  })
  ctx.type = "json"
  ctx.body = user
})

router.post("/user/setting", async (ctx) => {
  console.log(ctx.request)
  let { watermark, defaultFilter, filter, refreshTime, coverTime } = ctx.request.body
  let sql = `UPDATE user 
  SET defaultFilter = '${defaultFilter}', filter = '${filter}', 
  watermark = '${watermark}',  refreshTime = '${refreshTime}',  coverTime = '${coverTime}'  
  WHERE id='${ctx.session.id}'`

  console.log(sql)

  // let user = await new Promise((resolve, reject) => {
  //   connection.query(sql, function (error, results, fields) {
  //     console.log(results)
  //     resolve(results)
  //   })
  // })
  ctx.type = "json"
  ctx.body = {
    msg: "设置成功",
  }
})
