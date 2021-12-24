var connection = require("../mysql/index")
let router = require("./router")

router.post("/user/login", async (ctx) => {
  let { userName, password } = ctx.request.body
  let result, errMsg

  let user = await new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM user where mobile='${userName}'`, function (error, results, fields) {
      if (error) {
        errMsg = error
        reject(error)
      } else {
        resolve(results[0])
      }
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

    // 外挂
    var spiderInit = require("../spider/init")
    spiderInit(ctx)
  } else {
    errMsg = errMsg || "账号或密码错误"
  }

  ctx.body = {
    code: "0001",
    content: errMsg || user.email,
  }
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
  let errMsg
  let { watermark, defaultFilter, filter, refreshTime, coverTime } = ctx.request.body
  let sql = `UPDATE user SET defaultFilter = '${defaultFilter}', filter = '${filter}', watermark = '${watermark}',  refreshTime = '${refreshTime || 0}',  coverTime = '${coverTime}' 
  WHERE id='${ctx.session.id}'`
  let user = await new Promise((resolve, reject) => {
    connection.query(sql, function (error, results, fields) {
      if (error) {
        errMsg = error
      }
      resolve(results)
    })
  })
  ctx.type = "json"
  ctx.body = {
    msg: errMsg ? errMsg.sqlMessage : "设置成功",
  }
})
