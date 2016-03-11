$(function () {
    var palubShip1 = 0, //тип коробл€ ѕодлодка Ёсминец  рейсер Ћинкор
        palubShip2 = 0,
        shipKolich = 0,//сколько нужно кораблей
        kordinat = [],
        shipAll = {
            tekush: 0,
            podlodka: { nugno: 4, ustanov: 0, palub: 1 },
            esminec: { nugno: 3, ustanov: 0, palub: 2 },
            kreicer: { nugno: 2, ustanov: 0, palub: 3 },
            linkor: { nugno: 1, ustanov: 0, palub: 4 }
        };
    //ѕроверка на наличие
    function setShip(e){
        //координаты текущей €чейки
        var adress1 = { x: e.target.id[1], y: e.target.id[2] };
        console.log($(e.target).data('status'));
        if ($(e.target).data('status')[3] !== undefined) {
            return false;
        } if ($(e.target).data('status')[2] !== undefined) {
            return false;
        }

        
        //координаты окружающих €чеек
        
        var adres2 = {
            v1: { x: adress1.x - 1 , y: adress1.y - 1 },
            v2: { x: adress1.x - 1 , y: adress1.y },
            v3: { x: adress1.x - 1 , y: +adress1.y + 1 }, 
            v4: { x: adress1.x , y: adress1.y - 1 },
            v5: { x: adress1.x , y: +adress1.y + 1 },
            v6: { x: +adress1.x + 1 , y: adress1.y - 1 },
            v7: { x: +adress1.x + 1 , y: adress1.y },
            v8: { x: +adress1.x + 1 , y: +adress1.y + 1 }

        };

        for (var property in adres2) {
            if (adres2[property].x >= 0 && adres2[property].y >= 0 && adres2[property].x <= 9 && adres2[property].y <= 9) {
                if ($("#w" + adres2[property].x + adres2[property].y).data('status') !== undefined) {
                    if ($("#w" + adres2[property].x + adres2[property].y).data('status')[3] !== undefined) {
                        //console.log($("#w" + adres2[property].x + adres2[property].y).data('status'));
                        if ($("#w" + adres2[property].x + adres2[property].y).data('status')[2] !== undefined) {
                            //console.log($("#w" + adres2[property].x + adres2[property].y).data('status'));
                            $(e.target).css('backgroundColor', 'rgba(191, 34, 51, 0.7');
                            return false;
                        }
                    }                                
                }    
            }            
        }
   }
   

   // $('td.colTab').click(setShip);
    $('td.colTab').click(function (e) { 
        if (setShip(e) == false) {//получили добро
           // console.log('non');
            breack;
        };
        //console.log('yes');
        

        if (shipKolich > 0) { //проверить нужно ли ставить корабли
            console.log('nachalo korabley ' + shipKolich);
            if (palubShip2 == 0) { //если да то сколько палуб
                palubShip2 = palubShip1;  
            }
            // 
            console.log('palub ' + palubShip2);
            if (palubShip2 > 0) {
                kordinat.push('#' + e.target.id);                             //запомнить адресс €чейки
                $(e.target).css('backgroundColor', 'rgba(0, 0, 139, 0.7');//в €чейку записать цвет 
                palubShip2 = palubShip2 - 1; //счетчик палуб уменьшить на 1   
                $('#' + e.target.id).data('status', e.target.id);///////////////////////////////            
            } //else {
        //        kordinat[0] = координата;
        //        $('#uctanovShip4').data('shtuk')--;
        //        for (){
        //            список €чеек = внести значени€
        //               }
        //        kordinat = 0;
                
            //}
            if (kordinat.length === palubShip1) {
                var i = 0,
                    mas = kordinat.length;

                for (i; i < mas; i++) {
                    $(kordinat[i]).data('status', $(kordinat[i]).data('status') + 'z');
                    
                };
                shipKolich--;
                console.log('minus 1 ' + shipKolich);
                //palubShip1 = 0;
                palubShip2 = 0;
                kordinat.length = 0;
                //$('#uctanovShip' + palubShip1).text();
                switch (shipAll.tekush) {
                    case 1:
                        console.log('zapomnili korabley ' + shipKolich);
                        shipAll.podlodka.ustanov = shipKolich;
                        break;

                    case 2:
                        console.log('zapomnili korabley ' + shipKolich);
                        shipAll.esminec.ustanov = shipKolich;
                        break;

                    case 3:
                        shipAll.kreicer.ustanov = shipKolich;
                        break;

                    case 4:// if (x === 'value2')
                        shipAll.linkor.ustanov = shipKolich;
                        break;

                }

                //console.log('Ship zavershon' + shipKolich);
            };

        }
    });
    
$('td.colTab').click(setShip);
    
    //установить тип корабл€ и количество кораблей
    var ships = function (e) {
    switch (e.target.id) {
        case 'uctanovShip1':
            if (shipAll.podlodka.nugno !== shipAll.podlodka.ustanov) {
                if ( 0 !== shipAll.podlodka.ustanov ) {
                        shipKolich = shipAll.podlodka.ustanov;
                } else {
                        shipKolich = shipAll.podlodka.nugno;
                };
                if ( 0 !== shipAll.tekush) {
                    $('button#uctanovShip' + shipAll.tekush).removeClass().addClass("btn btn-default btn-lg btn-block");//.removeAttr("disabled")
                }
                palubShip1 = shipAll.podlodka.palub;             
                shipAll.tekush = 1;
            }
            break;
 
        case 'uctanovShip2':
            if (shipAll.esminec.nugno !== shipAll.esminec.ustanov) {
                if ( 0 !== shipAll.esminec.ustanov ) {
                        shipKolich = shipAll.esminec.ustanov;
                        console.log('uctanovili c octatok' + shipKolich);
                } else {
                        shipKolich = shipAll.esminec.nugno;
                        console.log('uctanovili nachala ' + shipKolich);
                };
                if (shipAll.tekush !== 0) {
                    $('button#uctanovShip' + shipAll.tekush).removeClass().addClass("btn btn-default btn-lg btn-block");//.removeAttr("disabled")
                }
                palubShip1 = shipAll.esminec.palub;
                shipAll.tekush = 2;
            }
            //shipAll.tekush = 2;
            //shipKolich = shipAll.esminec.nugno;
            //palubShip1 = shipAll.esminec.palub;
            break;

        case 'uctanovShip3':// 
            if (shipAll.kreicer.nugno !== shipAll.kreicer.ustanov) {
                if (0 !== shipAll.kreicer.ustanov) {
                    shipKolich = shipAll.kreicer.ustanov;
                } else {
                    shipKolich = shipAll.kreicer.nugno;
                };
                if (0 !== shipAll.tekush) {
                    $('button#uctanovShip' + shipAll.tekush).removeClass().addClass("btn btn-default btn-lg btn-block");//.removeAttr("disabled")
                }
                palubShip1 = shipAll.kreicer.palub;
                shipAll.tekush = 3;
            }

            //shipAll.tekush = 3;
            //shipKolich = shipAll.kreicer.nugno;
            //palubShip1 = shipAll.kreicer.palub;
            break;
       
        case 'uctanovShip4':// if (x === 'value2')
            if (shipAll.linkor.nugno !== shipAll.linkor.ustanov) {
                if (0 !== shipAll.linkor.ustanov) {
                    shipKolich = shipAll.linkor.ustanov;
                } else {
                    shipKolich = shipAll.linkor.nugno;
                };
                if (shipAll.tekush !== 0) {
                    $('button#uctanovShip' + shipAll.tekush).removeClass().addClass("btn btn-default btn-lg btn-block");//.removeAttr("disabled")
                }
                palubShip1 = shipAll.linkor.palub;
                shipAll.tekush = 3;
            }

            //shipAll.tekush = 4;
            //shipKolich = shipAll.linkor.nugno;
            //palubShip1 = shipAll.linkor.palub;
            break;

}
        //shipKolich = $(e.target).data('ship');
        //palubShip1 = $(e.target).data('palub');
    $(e.target).addClass("btn btn-warning btn-lg btn-block disabled");//.attr("disabled", "disabled")

};
    
    //кнопкам выбора корабл€ отклик на клик
    $('button[data-ship]').click(ships);
    
    //выбор €чейки дл€ корабл€
    //$('td.colTab').click(function (e) {
    //    //socket.send($(e.target).data('status'));
    //    jQuery("#" + e.target.id).data('status', 888);
    //});
    
    // ќчищаем вс корабли и оживл€ем кнопки
    $("#btClear").click(function () {
        $('button[data-ship]').removeClass().addClass("btn btn-default btn-lg btn-block").removeAttr("disabled");
        palubShip1 = 0;
        shipKolich = 0;
        shipKolich = 0;
    });
});// онец блока риди