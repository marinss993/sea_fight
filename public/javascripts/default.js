$(document).ready(function () {
    'use strict';
    var sock = new SockJS('http://192.168.1.45:8085/echo');
    //Отправить приглошение
    $('div#spisok').on('click', 'button', function (e) {
        sock.send('preg:' + myNaime + ':' + e.target.id);
    });
    
    var palubShip = 0, //тип коробля Подлодка Эсминец Крейсер Линкор
        tip = "",
        shipKolich = 0,//сколько нужно кораблей
        kordinat = [],
        shipAll = {
            tekush: 0,
            podlodka: { nugno: 4, ustanov: 0, palub: 1 },
            esminec: { nugno: 3, ustanov: 0, palub: 2 },
            kreicer: { nugno: 2, ustanov: 0, palub: 3 },
            linkor: { nugno: 1, ustanov: 0, palub: 4 }
        },
        myNaime = '', myId = '', protid = '', nGame = '', idShip = 0, myBahh = 1;
    
    sock.onmessage = function (e) {
        var mes = e.data.split(':');
        switch (mes[0]) {
            case 'name':
                $('h2#pole1').text('Игрок ' + mes[1]);
                myNaime = e.data.slice(5);
                $('button#sendName').removeClass().addClass("btn btn-default btn-lg disabled");
                break;
            case 'esty':
                $('h2#pole1').text(mes[1]);  //e.data.slice(5)
                break;
            case 'spis':
                var stroka = e.data.slice(5).split(':'),
                    i = 0,
                    n = stroka.length,
                    s = '';
                for (i; i < n; i++) {
                    if (stroka[i] !== "") {
                        if (stroka[i] !== myNaime) {
                            s = s + '<button ' + 'id="' + stroka[i] + '" type="button" class="btn btn-info btn-block preglos">' + stroka[i] + '</button>';
                        }
                    }
                }
                $('div#spisok').html('<h3>Подключились:</h3>' + s);
                break;
            case 'preg':
                $('#kogo').text(mes[1]);
                //$('#myModal').modal('show');
                $('#myModal').modal('show');
                break;
            case 'netu':
                $('#messaege').text("Пользователь уже в игре.");
                //$('#ModalAll').modal('show');
                $('#ModalAll').modal('show');
                break
            case 'otvt':
                $('#messaege').text("Пользователь " + mes[1] + " Вам отказал.");
                //$('#ModalAll').modal('show');
                //alert(mes[1] + " Вам отказал.");
                $('#ModalAll').modal('show');
                break;
            case 'game':
                $('#protText').text('Корабли ' + mes[1]);
                protid = mes[3], myId = mes[4], nGame = mes[2];
                console.log(e.data.slice(5));
                break;
            case 'gotv':
                $('#protText').css("background-color", '#99FFFF');

                break;
            case 'ogon':
                if (mes[1] === myId) {
                    $('#ogon').removeClass().addClass('btn btn-success btn-lg btn-block');
                    myBahh = 1;
                } else {
                    $('#ogon').removeClass().addClass('btn btn-danger btn-lg btn-block');
                    myBahh = 0;
                }
                break;
            case 'bahh':
                if ($('#' + mes[1]).data('status') !== 0) {
                    $('#' + mes[1]).css('backgroundColor', '#660000');//есть попадание  + красный
                    sock.send('popl:' + nGame +':' + mes[1] + ':' + protid + ':' + myId);
                } else {// нет попадания
                    myBahh = 1;
                    $('#ogon').removeClass().addClass('btn btn-success btn-lg btn-block');
                    $('#' + mes[1]).css('backgroundColor', '#333333'); //нет попадания темносерый
                    sock.send('mimo:' + nGame + ':' + mes[1] + ':' + protid + ':' + myId);

                }
                break;
            case 'popd':
                console.log('что то');
                break;
            case 'popl':
                    var s1 = mes[1];
                    s1 = s1.slice(1)//убрать букву w
                    $('#' + 'p' + s1).css('border', '5px solid #660000');
                    myBahh = 1;
                break;
            case 'mimo':
                var s2 = mes[1];
                s2 = s2.slice(1);
                $('#' + 'p' + s2).css('backgroundColor', '#333333');//поменяли цвет ячейки темносерый
                myBahh = 0;
                break;
        }
    };
    //Проверка на возможность установки корабля
    function setShip(e) {
        //координаты текущей ячейки
        var adress1 = { x: e.target.id[1], y: e.target.id[2] };
        if ($(e.target).data('status')[3] !== undefined) {
            return false;
        }
        if (undefined !== $(e.target).data('status')[2]) {
            return false;
        }
        //координаты окружающих ячеек
        var adres2;
        adres2 = {
            v1: {x: adress1.x - 1, y: adress1.y - 1},
            v2: {x: adress1.x - 1, y: adress1.y},
            v3: {x: adress1.x - 1, y: +adress1.y + 1},
            v4: {x: adress1.x, y: adress1.y - 1},
            v5: {x: adress1.x, y: +adress1.y + 1},
            v6: {x: +adress1.x + 1, y: adress1.y - 1},
            v7: {x: +adress1.x + 1, y: adress1.y},
            v8: {x: +adress1.x + 1, y: +adress1.y + 1}
        };
        for (var property in adres2) {
            if (adres2.hasOwnProperty(property)) {
                if (adres2[property].x >= 0 && adres2[property].y >= 0 && adres2[property].x <= 9 && adres2[property].y <= 9) {
                    if ($("#w" + adres2[property].x + adres2[property].y).data('status') !== undefined) {
                        if ($("#w" + adres2[property].x + adres2[property].y).data('status')[3] !== undefined) {
                            if ($("#w" + adres2[property].x + adres2[property].y).data('status')[2] !== undefined) {
                                //$(e.target).css('backgroundColor', 'rgba(91, 34, 51, 0.7');
                                return false;
                            }
                        }
                    }
                }
            }
        }       //конец цикла
    }   //конец процедуры
    
    $('td.colTab').click(function (e) {//отметка ячеек  и списание кораблей и палуб
        if (setShip(e) === false) {// проверка на разрешение ставить в ячейку корабль
            return;//Если занята не делать не чего.
        }

        sock.send(e.target.id);
        switch (shipAll.tekush) {
            case 0://если 0 то не выбранн корабль
                $('#messaege').text("Для установки корабля нажмите кнопку" + "\n" + "с типом нужного корабля");
                $('#ModalAll').modal('show');

                //alert("Для установки корабля нажмите кнопку");
                break;
            case 1:
                if (shipKolich !== shipAll.podlodka.nugno) { //проверить нужно ли ставить корабли
                    if (palubShip === 0) {//если все палубы установленны задать их shipAll.podlodka.palubUstanov
                        palubShip = shipAll.podlodka.palub;
                    }                    ;
                    if (palubShip !== 0) {
                        kordinat.push('#' + e.target.id); //запомнить адресс ячейки
                        $(e.target).css('border', '3px solid red');//в ячейку записать рамку 
                        palubShip = palubShip - 1; //****счетчик палуб уменьшить на 1 
                        //shipAll.podlodka.palubUstanov = shipAll.podlodka.palubUstanov - 1;
                        $('#' + e.target.id).data('status', e.target.id);//записать статус 
                        idShip = +idShip + 1;       
                    }
                    if (kordinat.length === shipAll.podlodka.palub) { //все палубы установленны
                        //Корабль готов
                        shipKolich++; //списываем корабль
                        shipAll.podlodka.ustanov = shipAll.podlodka.ustanov + 1;//запомнить сколько осталось кораблей
                        i = 0;
                        mas = kordinat.length;
                        for (i; i < mas; i++) {//записывыем всем ячейкам тип корабля и кому пренадлежат палубы
                            $(kordinat[i]).data('status', $(kordinat[i]).data('status') + 'z' + tip + idShip);
                        }
                        //изменяем стили ячейки Создаем корабль
                        i = 0;
                        mas = kordinat.length;
                        for (i; i < mas; i++) {//записывыем всем ячейкам корабля
                            $(e.target).css('border', '');
                            $(e.target).css('backgroundColor', 'rgba(191, 34, 51, 0.7');//в ячейку записать цвет 
                        }                        ;
                        kordinat.length = 0;//обнуляем счетчик палуб
                        
                        //$('button#uctanovShip' + shipAll.tekush).text("Подлодок " + shipKolich);
                        $('button#uctanovShip' + shipAll.tekush).html('Подлодок ' + '<span class="badge">' + shipKolich + '(4)' + '</span>');
                        if (shipAll.podlodka.nugno === shipAll.podlodka.ustanov) {
                            $('button#uctanovShip' + shipAll.tekush).removeClass().addClass("btn btn-primary btn-lg btn-block disabled");
                        }
                    }
                }
                break;
            case 2:
                if (shipKolich !== shipAll.esminec.nugno) { //проверить нужно ли ставить корабли
                    if (palubShip === 0) {//если все палубы установленны задать их
                        palubShip = shipAll.esminec.palub;
                       // shipAll.kreicer.palubUstanov = shipAll.kreicer.palub;
                    }                    ;
                    if (palubShip !== 0) {
                        kordinat.push('#' + e.target.id); //запомнить адресс ячейки
                        $(e.target).css('border', '3px solid red');//в ячейку записать цвет 
                        palubShip = palubShip - 1; //****счетчик палуб уменьшить на 1 
                        // shipAll.kreicer.palubUstanov = shipAll.kreicer.palubUstanov - 1;
                        $('#' + e.target.id).data('status', e.target.id);//записать статус
                        idShip = +idShip + 1;        
                    }                    ;
                    if (kordinat.length === shipAll.esminec.palub) { //все палубы установленны
                        i = 0;
                        mas = kordinat.length;
                        for (i; i < mas; i++) {//записывыем всем ячейкам корабля
                            $(kordinat[i]).data('status', $(kordinat[i]).data('status') + 'z' + tip + idShip);
                        }
                        //Корабль готов
                        shipAll.esminec.ustanov = shipAll.esminec.ustanov + 1;//запомнить сколько осталось кораблей
                        //изменяем стили ячейки Создаем корабль
                        i = 0;
                        mas = kordinat.length;
                        for (i; i < mas; i++) {//записывыем всем ячейкам корабля
                            $(kordinat[i]).css('border', '');
                            $(kordinat[i]).css('backgroundColor', 'rgba(191, 34, 51, 0.7');//в ячейку записать цвет 
                        }                        ;
                        kordinat.length = 0;//обнуляем счетчик палуб
                        shipKolich++; //списываем корабль
                        $('button#uctanovShip' + shipAll.tekush).html('Эсминец ' + '<span class="badge">' + shipKolich + '(3)' + '</span>');
                        if (shipAll.esminec.nugno === shipAll.esminec.ustanov) {
                            $('button#uctanovShip' + shipAll.tekush).removeClass().addClass("btn btn-primary btn-lg btn-block disabled");
                        }                        ;
                    }                    ;
                }                ;
                break;
            case 3:
                if (shipKolich !== shipAll.kreicer.nugno) { //проверить нужно ли ставить корабли
                    if (palubShip === 0) {//если все палубы установленны задать их
                        palubShip = shipAll.kreicer.palub;
                       // shipAll.kreicer.palubUstanov = shipAll.kreicer.palub;
                    }                    ;
                    if (palubShip !== 0) {
                        kordinat.push('#' + e.target.id); //запомнить адресс ячейки
                        $(e.target).css('border', '3px solid red');//в ячейку записать цвет 
                        palubShip = palubShip - 1; //****счетчик палуб уменьшить на 1 
                        // shipAll.kreicer.palubUstanov = shipAll.kreicer.palubUstanov - 1;
                        $('#' + e.target.id).data('status', e.target.id);//записать статус  
                        idShip = +idShip + 1;      
                    }                    ;
                    if (kordinat.length === shipAll.kreicer.palub) { //все палубы установленны
                        i = 0;
                        mas = kordinat.length;
                        for (i; i < mas; i++) {//записывыем всем ячейкам корабля
                            $(kordinat[i]).data('status', $(kordinat[i]).data('status') + 'z' + tip + idShip);
                        }                        ;
                        //Корабль готов
                        shipAll.kreicer.ustanov = shipAll.kreicer.ustanov + 1;//запомнить сколько осталось кораблей
                        //изменяем стили ячейки Создаем корабль
                        i = 0;
                        mas = kordinat.length;
                        for (i; i < mas; i++) {//записывыем всем ячейкам корабля
                            $(kordinat[i]).css('border', '');
                            $(kordinat[i]).css('backgroundColor', 'rgba(191, 34, 51, 0.7');//в ячейку записать цвет 
                        }                        ;
                        kordinat.length = 0;//обнуляем счетчик палуб
                        shipKolich++; //списываем корабль
                        //$('button#uctanovShip' + shipAll.tekush).text("Крейсер " + shipKolich);
                        $('button#uctanovShip' + shipAll.tekush).html('Крейсер ' + '<span class="badge">' + shipKolich + '(1)' + '</span>');
                        if (shipAll.kreicer.nugno === shipAll.kreicer.ustanov) {
                            $('button#uctanovShip' + shipAll.tekush).removeClass().addClass("btn btn-primary btn-lg btn-block disabled");
                        }                        ;
                    }                    ;
                }                ;
                break;
            case 4:
                if (shipKolich !== shipAll.linkor.nugno) { //проверить нужно ли ставить корабли
                    if (palubShip === 0) {//если все палубы установленны задать их
                        palubShip = shipAll.linkor.palub;
                        //shipAll.linkor.palubUstanov = shipAll.linkor.palub;
                    }                    ;
                    if (palubShip !== 0) {
                        kordinat.push('#' + e.target.id); //запомнить адресс ячейки
                        $(e.target).css('border', '3px solid red');//в ячейку записать цвет 
                        palubShip = palubShip - 1; //****счетчик палуб уменьшить на 1 
                        // shipAll.linkor.palubUstanov = shipAll.linkor.palubUstanov - 1;
                        $('#' + e.target.id).data('status', e.target.id);//записать статус  
                        idShip = +idShip + 1;      
                    }                    ;
                    if (kordinat.length === shipAll.linkor.palub) { //все палубы установленны
                        var i = 0,
                            mas = kordinat.length;
                        for (i; i < mas; i++) {//записывыем всем ячейкам корабля
                            $(kordinat[i]).data('status', $(kordinat[i]).data('status') + 'z' + tip + idShip);
                        }                        ;
                        //Корабль готов
                        shipAll.linkor.ustanov = shipAll.linkor.ustanov + 1;//запомнить сколько осталось кораблей
                        //изменяем стили ячейки Создаем корабль
                        i = 0;
                        mas = kordinat.length;
                        for (i; i < mas; i++) {//записывыем всем ячейкам корабля
                            $(kordinat[i]).css('border', '');
                            $(kordinat[i]).css('backgroundColor', 'rgba(191, 34, 51, 0.7');//в ячейку записать цвет 
                        }                        ;
                        kordinat.length = 0;//обнуляем счетчик палуб
                        shipKolich++; //списываем корабль
                        //$('button#uctanovShip' + shipAll.tekush).text("Эсминец " + shipKolich);
                        $('button#uctanovShip' + shipAll.tekush).html('Линкор ' + '<span class="badge">' + shipKolich + '(2)' + '</span>');
                        if (shipAll.linkor.nugno === shipAll.linkor.ustanov) {
                            $('button#uctanovShip' + shipAll.tekush).removeClass().addClass("btn btn-primary btn-lg btn-block disabled");
                        }
                    }
                }
                break;
        }
        if (shipAll.esminec.nugno === shipAll.esminec.ustanov) {
            if (shipAll.kreicer.nugno === shipAll.kreicer.ustanov) {
                if (shipAll.linkor.nugno === shipAll.linkor.ustanov) {
                    if (shipAll.podlodka.nugno === shipAll.podlodka.ustanov) {
                        $('#btGotov').removeClass().addClass("btn btn-success btn-lg btn-block");
                    }
                }
            }
        }
    });
    
    ////установить тип корабля и количество кораблей
    function typeKolShips(e) {
        if (palubShip > 0) {
            var i1 = 0,
                mas1 = kordinat.length;
            for (i1; i1 < mas1; i1++) {//записывыем всем ячейкам корабля
                $(kordinat[i1]).css('border', '');
                $(kordinat[i1]).data('status', "0");
            }            ;
            palubShip = 0;
            kordinat.length = 0;
            tip = "";
        }
        //разблокировка кнопок podlodka
        switch (shipAll.tekush) {
            case 1:
                if (shipAll.podlodka.nugno !== shipAll.podlodka.ustanov) {
                    $('button#uctanovShip' + shipAll.tekush).removeClass().addClass("btn btn-warning btn-lg btn-block");
                }
                break;
            case 2:
                if (shipAll.esminec.nugno !== shipAll.esminec.ustanov) {
                    $('button#uctanovShip' + shipAll.tekush).removeClass().addClass("btn btn-warning btn-lg btn-block");
                }
                break;
            case 3:
                if (shipAll.kreicer.nugno !== shipAll.kreicer.ustanov) {
                    $('button#uctanovShip' + shipAll.tekush).removeClass().addClass("btn btn-warning btn-lg btn-block");
                }
                break;
            case 4:
                if (shipAll.linkor.nugno !== shipAll.linkor.ustanov) {
                    $('button#uctanovShip' + shipAll.tekush).removeClass().addClass("btn btn-warning btn-lg btn-block");
                }
                break;
        }
        switch (e.target.id) {
            case 'uctanovShip1':
                if (shipAll.podlodka.nugno !== shipAll.podlodka.ustanov) {
                    if (shipAll.podlodka.ustanov === 0) {
                        shipKolich = 0;
                    } else {
                        shipKolich = shipAll.podlodka.ustanov;
                    }                    ;
                    shipAll.tekush = 1;
                    tip = "a";
                    if (shipAll.tekush !== 0) {
                        $('button#uctanovShip' + shipAll.tekush).removeClass().addClass("btn btn-warning btn-lg btn-block disabled");//.removeAttr("disabled")
                    }                    ;
                    //palubShip1 = shipAll.podlodka.palub;
                } else {
                    break;
                }                ;
                break;

            case 'uctanovShip2':
                if (shipAll.esminec.nugno !== shipAll.esminec.ustanov) {
                    if (shipAll.esminec.ustanov === 0) {
                        shipKolich = 0;
                    } else {
                        shipKolich = shipAll.esminec.ustanov;
                    }                    ;
                    shipAll.tekush = 2;
                    tip = "b";
                    if (shipAll.tekush !== 0) {
                        $('button#uctanovShip' + shipAll.tekush).removeClass().addClass("btn btn-warning btn-lg btn-block disabled");//.removeAttr("disabled")
                    }                    ;
                    //palubShip1 = shipAll.esminec.palub;
                    
                } else {
                    break;
                }                ;
                break;

            case 'uctanovShip3':// 
                if (shipAll.kreicer.nugno !== shipAll.kreicer.ustanov) {
                    if (shipAll.kreicer.ustanov === 0) {
                        shipKolich = 0;
                    } else {
                        shipKolich = shipAll.kreicer.ustanov;
                    }                    ;
                    shipAll.tekush = 3;
                    tip = "c";
                    if (shipAll.tekush !== 0) {
                        $('button#uctanovShip' + shipAll.tekush).removeClass().addClass("btn btn-warning btn-lg btn-block disabled");//.removeAttr("disabled")
                    }                    ;
                    //palubShip1 = shipAll.kreicer.palub;
                    
                } else {
                    break;
                }
                break;

            case 'uctanovShip4':// if (x === 'value2')
                if (shipAll.linkor.nugno !== shipAll.linkor.ustanov) {
                    if (shipAll.linkor.ustanov === 0) {
                        shipKolich = 0;
                    } else {
                        shipKolich = shipAll.linkor.ustanov;
                    }
                    shipAll.tekush = 4;
                    tip = "d";
                    if (shipAll.tekush !== 0) {
                        $('button#uctanovShip' + shipAll.tekush).removeClass().addClass("btn btn-warning btn-lg btn-block disabled");//.removeAttr("disabled")
                    }
                    //palubShip = shipAll.linkor.palub;
                    
                } else {
                    break;
                }
                break;
        }
    }
    //кнопкам выбора корабля отклик на клик
    $('button[data-ship]').click(typeKolShips);
    
    $('#sendName').click(function (e) {
        var mes = 'name:' + $('#kepName').val();
        sock.send(mes);
    });
    //Выстрел
    $('td.colTab2').click(function (e) {
        //В правой таб закрасить ячейку жолтым
        if (myBahh === 1) {
            $(e.target).css("background", "#FFCC00");
            // отправить противнику данные о выстреле №игры, адресс, кому, кто
            sock.send('bahh:' + nGame + ':' + $(e.target).data('status') + ':' + protid + ':' + myId);
        }
    });
    // от myNaime кому $('#kogo').text
    $('#net').click(function (e) {
        sock.send('otvt:' + myNaime + ':' + $('#kogo').text() + ':' + e.target.id);
        $('#myModal').modal('hide');
    });
    
    $('#da').click(function (e) {
        sock.send('otvt:' + myNaime + ':' + $('#kogo').text() + ':' + e.target.id);
        $('#myModal').modal('hide');
    });
    
    $('button#btGotov').click(function (e) {
        if (nGame !== '') {
            $('h2#pole1').css("background-color", '#99FFFF');
            //if( myBahh === 1){
                sock.send('gotv:' + nGame + ':' + myId);
            //}
        } else {
            $('#messaege').text("Не создана игра, Пригласите игрока или примите приглашение");
            $('#ModalAll').modal('show');

            //alert( 'Не создана игра, Пригласите игрока или примите приглашение');
        }
    });
    $('#ok').click(function (e) {
        $('#ModalAll').modal('hide');
    });


});//Конец vjlekz