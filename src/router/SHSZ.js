var spiderHttp = require("../spider/index")
var spiderFormat = require("../spider/format")
let router = require("./router")

//所有的数据接口
router.get("/current/all", async (ctx) => {
  var res = await Promise.all([spiderHttp.getShangHaiHtml(), spiderHttp.getShenZhenHtml()])
  var arr = spiderFormat.listFilter(res[0].concat(res[1]), ctx)
  ctx.body = {
    data: arr,
  }
})

//上海的数据接口
router.get("/current/shangHai", function (req, res) {
  spiderHttp.getShangHaiHtml(function (list) {
    var html = spiderFormat.renderList(list)
    res.send(html)
  })
})

//深圳的数据接口
router.get("/current/shenZhen", function (req, res) {
  spiderHttp.getShenZhenHtml(function (list) {
    var html = spiderFormat.renderList(list)
    res.send(html)
  })
})
