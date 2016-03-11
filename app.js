"use strict";

var http = require('http');
var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var path = require('path');
var sock = require('sockjs');
var favicon = require('serve-favicon');
var logger = require('morgan');
var methodOverride = require('method-override');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var errorHandler = require('errorhandler');

var app;
app = express();

// all environments
app.set('port', 8085); //process.env.PORT || 8081
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ resave: true, saveUninitialized: true,secret: 'uwotm8' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(multer());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/', function (req, res) {
    console.log(req.body);
});

// error handling middleware should be loaded after the loading the routes
if ('development' === app.get('env')) {
    app.use(errorHandler());
}
//сокет сервер
var sockjsEecho = sock.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/0.3.4/sockjs.min.js' });
var sockId = [],
    games = [],
    nGame = 0;
    //setConn = new Set();
 sockjsEecho.on('connection', function (conn) {
    conn.on('data', function (message) {
        var mes = message.split(':'),
            i = 0,
            x = 0; //n=0
        //noinspection Eslint
        switch (mes[0]) {
            case 'name':
                i = 0;
                x = sockId.length; //n = message.slice(5)
                for (i; i < x; i++) {
                    if (mes[1] === sockId[i].name) {
                        conn.write('esty:Игрок с именем ' + mes[1] + 'зарегестрирован');
                        return;
                    }
                }
                //добовляем нового юзера и его соединение
                conn.write('name:' + mes[1]);


                sockId[sockId.length] = {
                    name: mes[1],
                    id : conn
                };
                i = 0;
                x = sockId.length;
                var s = "";
                //Получение списка игроков
                for (i; i < x; i++) {
                    s = s + sockId[i].name + ':';
                }
                //Рассылка списка игроков всем
                i = 0;
                x = sockId.length;
                for (i; i < x; i++) {
                    //send the message to that client
                    sockId[i].id.write('spis:' + s);
                }
                break;
            case 'preg':
                i = 0;
                x = sockId.length;
                //находим партнера в списке
                for (i; i < x; i++) {
                    if (sockId[i].name === mes[2]) {
                        sockId[i].id.write('preg:' + mes[1]);
                        return;
                    }
                }
                conn.write('netu');
                break;
            case 'otvt':
                i = 0;
                x = sockId.length;
                if (mes[3] === 'net') {
                    for (i; i < x; i++) {
                        //send the message to that client
                        if (sockId[i].name === mes[2]) {
                            sockId[i].id.write('otvt:' + mes[1] + ':' + mes[3]);
                        }
                    }
                }
                if (mes[3] === 'da') {
                    nGame = games.length;
                    i = 0;
                    x = sockId.length;
                    //Найти себя в общем списке
                    for (i; i < x; i++) {
                        if (sockId[i].name === mes[1]) {
                            //запомнить себя в игре
                            games[nGame] = {
                                name1 : mes[1],
                                id1   : sockId[i].id
                            };
                            //sockId.splice(i, 1);
                        }
                    }
                    //Найти партнера в общем списке
                    i = 0;
                    x = sockId.length;
                    for (i; i < x; i++) {
                        if (sockId[i].name === mes[2]) {
                            //запомнить партнера в игре
                            games[nGame].name2 = mes[2];
                            games[nGame].id2 = sockId[i].id;
                        }
                    }
                    //удалить себя из основного списка
                    i = 0;
                    x = sockId.length;
                    for (i; i < x; i++) {
                        if (sockId[i].name === mes[1]) {
                            sockId.splice(i, 1);
                            break;
                        }
                    }
                    //удалить партнера из основного списка
                    i = 0;
                    x = sockId.length;
                    for (i; i < x; i++) {
                        if (sockId[i].name === mes[2]) {
                            sockId.splice(i, 1);
                            break;
                        }
                    }
                    //Добавить счетчик попаданий
                    games[nGame].schet1 = 12;
                    games[nGame].schet2 = 12;
                    //games[nGame].gotov1 = false;
                    //games[nGame].gotov2 = false;
                    games[nGame].ogony = "";
                    //отправить новый список играков
                    i = 0;
                    x = sockId.length;
                    s = "";
                    //Получение списка игроков
                    for (i; i < x; i++) {
                        s = s + sockId[i].name + ':';
                    }
                    //Рассылка списка игроков всем
                    i = 0;
                    x = sockId.length;
                    for (i; i < x; i++) {
                        //send the message to that client
                        sockId[i].id.write('spis:' + s);
                    }
                    //приглашение принято
                    games[nGame].id1.write('game' + ':' + mes[2] + ':' + nGame + ':' + 'id2' + ':' + 'id1');
                    games[nGame].id2.write('game' + ':' + mes[1] + ':' + nGame + ':' + 'id1' + ':' + 'id2');
                }
                //games //sockId[i].id.write('otvt:' + mes[1] + ':' + mes[3]);
                break;
            case 'gotv':
                {
                    //games[mes[1]].id1.write('gotv');
                    if (mes[2] === 'id1'){
                        if (games[mes[1]].ogony === '') {
                            games[mes[1]].ogony = 'id1';
                            games[mes[1]].id1.write('ogon:' + games[mes[1]].ogony);
                            games[mes[1]].id2.write('ogon:' + games[mes[1]].ogony);
                            games[mes[1]].id2.write('gotv');
                        } else {
                            games[mes[1]].id2.write('gotv');
                        }
                    } else {
                        if (games[mes[1]].ogony === '') {
                            games[mes[1]].ogony = 'id2';
                            games[mes[1]].id1.write('ogon:' + games[mes[1]].ogony);
                            games[mes[1]].id2.write('ogon:' + games[mes[1]].ogony);
                            games[mes[1]].id1.write('gotv');
                        } else {
                            games[mes[1]].id1.write('gotv');
                        }
                    }
                }
                break;
            case 'bahh':
                if (mes[4] === games[mes[1]].ogony) { //есть ли право выстрела
                    if (mes[3] === 'id1') { //отправить противнику координаты
                        games[mes[1]].id1.write('bahh:' + mes[2]);
                    } else {
                        games[mes[1]].id2.write('bahh:' + mes[2]);
                    }
                }
                break;
            case 'popl':
                //if (mes[4] === games[mes[1]].ogony) { //есть ли право выстрела
                if (mes[3] === 'id1') { //отправить противнику координаты
                    games[mes[1]].id1.write('popl:' + mes[2]);
                } else {
                    games[mes[1]].id2.write('popl:' + mes[2]);
                }
                //}
                break;
            case 'mimo':
                //if (mes[4] === games[mes[2]].ogony) { //есть ли право выстрела
                    if (mes[3] === 'id1') { //отправить противнику координаты
                        games[mes[1]].ogony = 'id2';//Стреляет противник
                        games[mes[1]].id1.write('mimo:' + mes[2] + ':' + games[mes[1]].ogony);
                        games[mes[1]].id1.write('ogon:' + games[mes[1]].ogony);
                        games[mes[1]].id2.write('ogon:' + games[mes[1]].ogony);
                    } else {
                        games[mes[1]].ogony = 'id1';
                        games[mes[1]].id2.write('mimo:' + mes[2] + ':' + games[mes[1]].ogony);
                        games[mes[1]].id2.write('ogon:' + games[mes[1]].ogony);
                        games[mes[1]].id1.write('ogon:' + games[mes[1]].ogony);
                    }
                //}
                break;
        }
    });

    conn.on('close', function () {
        var i = 0, x = sockId.length;
        for (i; i < x; i++) {
            //send the message to that client
            if (sockId[i].id.id === conn.id) {
                sockId.splice(i, 1);
                console.log("Отключился " + conn.id);
                break;
            }
        }
        i = 0;
        x = sockId.length;
        var s = "";
        //Получение списка игроков
        for (i; i < x; i++) {
            s = s + sockId[i].name + ':';
        }
        //Рассылка списка игроков всем
        i = 0;
        x = sockId.length;
        for (i; i < x; i++) {
            //send the message to that client
            sockId[i].id.write('spis:' + s);
        }
    });
});

var server;
server = http.createServer(app);

sockjsEecho.installHandlers(server, { prefix: '/echo' });


server.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
