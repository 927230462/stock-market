var express = require("express");
var router = express.Router();
var util = require('../utils/util');
var spiderHttp = require('../spider/index')
var spiderFormat = require('../spider/format')

module.exports = function (app) {
    var timer = null
    var startMemory = function(){
        console.log('同步开始缓存备份')
        var webConfig = util.getWebConfig()
        var map = {
            shanghai: false,
            shanghList: [],
            shenzhen: false,
            shenzhenList: [],
        }
        var save = function(){
            if(map.shenzhen && map.shanghai){
                var list = spiderFormat.listFilter(map.shenzhenList.concat(map.shanghList))
                if(list.length == 0){
                    return
                }
                //开启备份存储信息
                var fileName = '../cache/' + util.formatDate(new Date()) + '.txt'
                var mapList = util.getMemory(fileName)
                list.forEach(function (v) {
                    if(!mapList[v.id]){
                        mapList[v.id] = v
                    }
                })
                util.setMemory(mapList, fileName)
            }
        }

        var timerFn = function(){
            console.log('发出请求，运行一次~')
            spiderHttp.getShangHaiHtml(
                function (list) {
                    map.shanghai = true
                    map.shanghList = list
                    save()
                }
            )
            spiderHttp.getShenZhenHtml(
                function (list) {
                    map.shenzhen = true
                    map.shenzhenList = list
                    save()
                }
            )
        }
        timerFn() // 立即执行一次
        timer = setInterval( function () {
            timerFn()
        }, (webConfig.coverTime * 1000) || 30000)
    }
    startMemory()
}