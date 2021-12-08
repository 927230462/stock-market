const https = require("https")
const cheerio = require("cheerio")
var ajax = require("../utils/http")

//获取上海的数据
var getShangHaiHtml = function (callback) {
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
        let title = $(v).find(".m_qa_detail .m_feed_txt a").html()
        let question = $(v).find(".m_feed_detail.m_qa_detail .m_feed_txt")
        question.find("a").remove()
        list.push({
          title: title,
          answer: $(v).find(".m_feed_detail.m_qa .m_feed_txt").html().trim(),
          question: question.html().trim(),
          id: $(v).find(".m_qa .m_feed_txt").attr("id").split("-")[1],
          type: "SH",
          time: $(v).find(".m_qa .m_feed_from span").html(),
        })
      })
      callback(list)
    })
  })
}

//获取深圳的数据
var getShenZhenHtml = function (callback) {
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
        title: v.companyShortName,
        code: v.stockCode,
        answer: v.attachedContent,
        id: v.esId,
        type: "SZ",
        time: v.packageDate,
        question: v.mainContent,
      })
    })
    callback(list)
  })
}

module.exports = {
  getShangHaiHtml,
  getShenZhenHtml,
}
