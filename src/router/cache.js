var express = require("express");
var path = require("path");
var fs = require("fs");
var router = express.Router();
var util = require('../utils/util');
var spiderHttp = require('../spider/index')
var spiderFormat = require('../spider/format')
const cheerio = require('cheerio');
var handlebars = require("handlebars")

var dir = '../cache/'
var title =  '备份信息列表'

module.exports = function (app) {
    //挂机消息
    app.get('/cache', function (req, res) {
        var callback = function (arr) {
            var map = {
                list: arr,
                title: title
            }
            let $ = util.getCachePage();
            var con = handlebars.compile($("#listTemplate").html())(map);
            $('body').attr('id', 'index-container')
            $('#root').append(con)
            res.send($.html());
        }

        var stat = {}
        try {
            stat = fs.statSync(path.join(__dirname, dir));
        } catch (err) {

        }

        if (stat.isDirectory && stat.isDirectory()) {
            fs.readdir(path.join(__dirname, dir), function (err, files) {
                var arr = []
                files.forEach(function (v) {
                    var date = v.split('.txt')[0]
                    arr.push({
                        fileName: date,
                        weekDay: util.getDayOfWeek(date)
                    })
                })
                callback(arr)
            })
        } else {
            fs.mkdir(path.join(__dirname, dir), (err) => {
                if (err) {
                    throw err
                }
            })
            callback([])
        }
    })

    app.get('/clearCache', function (req, res) {
        util.clearMemory(dir)
        res.status(200)
        res.json({success: true})
    })

    app.get('/clearCacheItem', function (req, res) {
        var dir = '../cache/' + date + '.txt'
        util.clearMemoryItem(dir)
        res.status(200)
        res.json({success: true})
    })

    app.get('/getCacheItem', function (req, res) {
        var date = req.query.date
        var fileName = '../cache/' + date + '.txt'
        var map = util.getMemory(fileName)
        var list = []
        Object.keys(map).forEach(function (v,index) {
            map[v].index = index + 1
            list.push(map[v])
        })
        var html = spiderFormat.renderList(list, true, title)
        res.send(html);
    })
}