/**
 * Created by peira on 2017/8/24.
 */
var express = require('express');
var path = require('path');
var app = express();
var mysql  = require('mysql');
var http = require('http');
var util = require('util');
app.use(express.static("public")).listen(8888);


var connection = mysql.createConnection({
    host     : 'www.shianqi.com',
    user     : 'root',
    password : '121021',
    port: '3306',
    database: 'music',
});

connection.connect();
var  sql = 'SELECT title,source FROM misc';
//查询
connection.query(sql,function (err, result) {
    if (err) {
        console.log('[SELECT ERROR] - ', err.message);
        return;
    }
    if (result) {
        //console.log(results);
        //将RowDataPacket对象装化成json字符串
        var string = JSON.stringify(result);
        //将json字符串转化成json数组
        var json = JSON.parse(string);
        console.log(json);
    }
});

connection.end();
app.listen(4444, function() {
    console.log('App listening at port 8888;');
});