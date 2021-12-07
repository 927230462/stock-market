var express = require("express");
var router = express.Router();
var util = require('../utils/util');
var spiderHttp = require('../spider/index')
var spiderFormat = require('../spider/format')


var mysql = require('mysql');
var connection = mysql.createConnection({
    port: '3306',
    host: 'localhost',
    user: 'root',
    password: '111111',
    database: 'stock'
});
connection.connect();


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

                list.forEach(function (v) {
                    v.createTime = util.parseTime(new Date())
                    connection.query(`SELECT * FROM log where msgId='${v.id}'`, function (error, results, fields) {
                        if (error) throw error;
                        console.log('The solution is: ', results[0]);
                        if(!results[0]){
                            connection.query(`INSERT INTO log(msgId, msgSource, msgTitle, msgQuestion, msgAnswer,msgTime, createTime) VALUES("${v.id}","${v.type}", '${v.title}', '${v.question}', '${v.text}', '${v.time}','${v.createTime}')`, function (error, results, fields) {
                                if (error) throw error;
                                console.log('The solution is: ', results[0]);
                            });
                        }
                    });

                })


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