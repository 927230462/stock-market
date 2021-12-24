const https = require("https")
const cheerio = require("cheerio")
var ajax = require("../utils/http")

//获取上海的数据
var getShangHaiHtml = function () {
  return new Promise((reslove, reject) => {
    let url = "https://sns.sseinfo.com/ajax/feeds.do?type=11&pageSize=10&lastid=-1&show=1&page=1&_=" + new Date().getTime()
    https.get(url, function (res) {
      let chunks = [],
        size = 0
      res.on("data", function (chunk) {
        chunks.push(chunk)
        size += chunk.length
      })

      res.on("end", function () {
        let data = Buffer.concat(chunks, size)
        let html = data.toString()
        let $ = cheerio.load(html, { decodeEntities: false })
        var list = []
        $(".m_feed_item").each(function (index, v) {
          let titleHtml = $(v).find(".m_qa_detail .m_feed_txt a").html()
          let title = titleHtml.split("(")[0]
          let stockCode = titleHtml.split("(")[1]
          let question = $(v).find(".m_feed_detail.m_qa_detail .m_feed_txt")
          question.find("a").remove()
          list.push({
            msgTitle: title,
            stockCode: stockCode,
            msgAnswer: $(v).find(".m_feed_detail.m_qa .m_feed_txt").html().trim(),
            msgQuestion: question.html().trim(),
            msgId: $(v).find(".m_qa .m_feed_txt").attr("id").split("-")[1],
            msgSource: "SH",
            msgTime: $(v).find(".m_qa .m_feed_from span").html(),
          })
        })
        reslove(list)
      })
    })
  })
}

//获取深圳的数据
var getShenZhenHtml = function () {
  return new Promise((reslove, reject) => {
    var params = {
      pageNo: 1,
      pageSize: 10,
      searchTypes: "11,",
      market: "",
      industry: "",
      stockCode: "",
    }
    var option = {
      method: "post",
      host: "irm.cninfo.com.cn",
      prot: "80",
      path: "/ircs/index/search",
      headers: {
        // 必选信息
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
    }
    ajax.request(option, params, function (res) {
      var list = []
      JSON.parse(res).results.forEach(function (v) {
        list.push({
          msgTitle: v.companyShortName,
          stockCode: v.stockCode,
          msgAnswer: v.attachedContent,
          msgId: v.esId,
          msgSource: "SZ",
          msgTime: v.packageDate,
          msgQuestion: v.mainContent,
        })
      })
      reslove(list)
    })
  })
}

module.exports = {
  getShangHaiHtml,
  getShenZhenHtml,
}
