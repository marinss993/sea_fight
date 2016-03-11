$(function () {
    var palubShip1 = 0, //тип коробл€ ѕодлодка Ёсминец  рейсер Ћинкор
        palubShip2 = 0,
        shipKolich = 0,//сколько нужно кораблей
        kordinat = [],
        shipAll = {

            podlodka: { nugno: 4, ustanov: 0, palub: 1 },
            esminec: { nugno: 3, ustanov: 0, palub: 2 },
            kreicer: { nugno: 2, ustanov: 0, palub: 3 },
            linkor: { nugno: 1, ustanov: 0, palub: 4 }
        };
    //ѕроверка на наличие
    function setShip(e){
        //координаты текущей €чейки
        var adress1 = { x: e.target.id[1], y: e.target.id[2] };
        if ($(e.target).data('status')[3] != undefined) {
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
                if ($("#w" + adres2[property].x + adres2[property].y).data('status') != undefined) {
                    //console.log($("#w" + adres2[property].x + adres2[property].y).data('status')[3]);
                    if ($("#w" + adres2[property].x + adres2[property].y).data('status')[3] != undefined) {
                        if ($("#w" + adres2[property].x + adres2[property].y).data('status')[2] != undefined) {
                            //$(e.target).css('backgroundColor', 'rgba(191, 34, 51, 0.7');
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
            breack;
        };
        //console.log(typeShip);
        

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
            if (kordinat.length == palubShip1) {
                var i = 0,
                    mas = kordinat.length;

                for (i; i < mas; i++) {
                    $(kordinat[i]).data('status', $(kordinat[i]).data('status') + 'z');
                    
                };
                shipKolich--;
                //palubShip1 = 0;
                palubShip2 = 0;
                kordinat.length = 0;
                //$('#uctanovShip' + palubShip1).text();
                //console.log('Ship zavershon' + shipKolich);
            };

        }
    });
    
$('td.colTab').click(setShip);
    
    //установить тип корабл€ и количество кораблей
var ships = function (e) {
    switch (e.target.id) {
        case 'uctanovShip1':
            shipKolich = shipAll.podlodka.nugno;
            palubShip1 = shipAll.podlodka.palub;
            break;
 
        case 'uctanovShip2':  
            shipKolich = shipAll.esminec.nugno;
            palubShip1 = shipAll.esminec.palub;
            break;

        case 'uctanovShip3':// if (x === 'value1')
            shipKolich = shipAll.kreicer.nugno;
            palubShip1 = shipAll.kreicer.palub;
            break;
       
        case 'uctanovShip4':// if (x === 'value2')
            shipKolich = shipAll.linkor.nugno;
            palubShip1 = shipAll.linkor.palub;
            break;

}
        //shipKolich = $(e.target).data('ship');
        //palubShip1 = $(e.target).data('palub');
            $(e.target).addClass("btn btn-warning btn-lg btn-block").attr("disabled", "disabled");

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