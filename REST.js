
var fs = require('fs');
var http = require('http');
var express = require('express');
var bodyParser = require('body-parser');
const RedisClient = require('redis');

const BinanceAPI = require("./BinanceAPI");

var API = new BinanceAPI("XRP", "BTC");


var caching = RedisClient.createClient("6379", "localhost");
caching.flushall();

const RESTServer = express();
RESTServer.listen(8080);
RESTServer.get('/balance', function (req, res) {

    var currency = "USDT";
    if (req.query.currency)
        currency = req.query.currency;

    API.getBalances(currency).then(function (balance) {

        res.json(balance);

    });

});

const WebServer = express();
WebServer.use(bodyParser.urlencoded({ extended: false }))
WebServer.use(bodyParser.json());
var httpServer = http.createServer(WebServer);
httpServer.listen(57575);

WebServer.set('view engine', 'ejs');

WebServer.get('/balance', function (req, res) {

    var currency = "USDT";
    if (req.query.currency)
        currency = req.query.currency;

    API.getBalances(currency).then(function (balance) {

        res.render('balance', balance);

    });

});
