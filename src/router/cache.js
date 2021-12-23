let router = require("./router")
var connection = require("../mysql/index")

//挂机消息
router.get("/cache/list", async (ctx) => {
  let dateList = await new Promise((resolve, reject) => {
    connection.query(`SELECT DISTINCT DATE_FORMAT(createTime,"%Y-%m-%d") AS 'createTime' FROM log where userId ='${ctx.session.id}'`, function (error, results, fields) {
      console.log(results)
      resolve(results)
    })
  })
  ctx.type = "json"
  ctx.body = {
    data: dateList,
  }
})

router.get("/clearCache", async (ctx) => {
  ctx.body = "删除缓存文件~~~"
})

router.get("/clearCacheItem", async (req, res) => {
  ctx.body = "删除缓存文件~~~"
})

router.get("/cache/item", async (ctx) => {
  var { date } = ctx.request.query

  let sql = `SELECT * FROM log WHERE userId ='${ctx.session.id}' AND createTime > '${date} 00:00:00' AND createTime < '${date} 23:59:59'`

  console.log(sql)

  let dateList = await new Promise((resolve, reject) => {
    connection.query(sql, function (error, results, fields) {
      console.log(results)
      resolve(results)
    })
  })
  ctx.type = "json"
  ctx.body = {
    data: dateList,
  }
})
