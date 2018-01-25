
Api.Graficas.Prestamo = {
    uri: null,
    carpeta: 'Prestamo',
    controlador: 'Prestamo',

    $ajaxS: Api.Ajax.ajaxSimple,
    $uriCrudObjecto: Api.Uri.crudObjecto,

    _ConsultarTransacciones: null,
    _DetalleRecaudo: null,

    constructor: function() {
        this._ConsultarTransacciones    = this.$uriCrudObjecto('ConsultarTotales',this.controlador,this.carpeta);
        this._DetalleRecaudo            = this.$uriCrudObjecto('DetalleRecaudo',this.controlador,this.carpeta);
        str             		        = this.controlador;
        this.uri        		        = str.toLowerCase();
    },

    totales: function(url) {

        this.constructor();

        var $AHfN = Api.Herramientas.formatoNumerico;

        $('#bg-prestamo-total-cliente').removeClass('ocultar');
        $('#bg-prestamo-total-realizados').removeClass('ocultar');
        $('#bg-prestamo-total-completados').removeClass('ocultar');
        $('#bg-prestamo-total-sin-completar').removeClass('ocultar');

        this.$ajaxS(
            '',
            url + this.uri,
            this._ConsultarTransacciones,

            function (json) {

                $('#bg-prestamo-total-cliente').find('.valor-total').text($AHfN(json.clientes));
                $('#bg-prestamo-total-realizados').find('.valor-total').text($AHfN(json.realizados));
                $('#bg-prestamo-total-completados').find('.valor-total').text($AHfN(json.completados));
                $('#bg-prestamo-total-sin-completar').find('.valor-total').text($AHfN(json.sin_completar));
            }
        );
    },

    detalleRecaudo: function(url) {

        this.constructor();

        var $AHfN = Api.Herramientas.formatoMoneda;

        $('#bg-prestamo-detalle-recaudo').removeClass('ocultar');

        this.$ajaxS(
            '',
            url + this.uri,
            this._DetalleRecaudo,

            function (json) {

                console.log(json.detalle)

                AmCharts.makeChart("chartdiv", {
                    "type": "serial",
                    "theme": "light",
                    "legend": {
                        "equalWidths": true,
                        "useGraphSettings": true,
                        "valueAlign": "left",
                        "valueWidth": 100
                    },
                    "dataProvider": json.detalle,
                    "valueAxes": [],
                    "graphs": [{
                        "alphaField": "alpha",
                        "balloonText": "Total. $[[value]]",
                        "dashLengthField": "dashLength",
                        "fillAlphas": 0.7,
                        "legendPeriodValueText": "general $[[value.sum]]",
                        "legendValueText": " $[[value]]",
                        "title": "Total",
                        "type": "column",
                        "valueField": "total",
                        "valueAxis": "totalAxis"
                    }, {
                        "balloonText": "Capital. $[[value]]",
                        "bullet": "round",
                        "bulletBorderAlpha": 1,
                        "useLineColorForBulletBorder": true,
                        "bulletColor": "#FFFFFF",
                        "bulletSizeField": "townSize",
                        "dashLengthField": "dashLength",
                        "descriptionField": "townName",
                        "legendPeriodValueText": "total $[[value.sum]]",
                        "legendValueText": "$[[value]]",
                        "title": "Capital",
                        "fillAlphas": 0,
                        "valueField": "capital",
                        "valueAxis": "capitalAxis"
                    }, {
                        "balloonText": "Interes. $[[value]]",
                        "bullet": "square",
                        "bulletBorderAlpha": 1,
                        "bulletBorderThickness": 1,
                        "dashLengthField": "dashLength",
                        "legendPeriodValueText": "total $[[value.sum]]",
                        "legendValueText": "$[[value]]",
                        "title": "Interes",
                        "fillAlphas": 0,
                        "valueField": "interes",
                        "valueAxis": "interesAxis"
                    }],
                    "chartCursor": {
                        "categoryBalloonDateFormat": "DD",
                        "cursorAlpha": 0.1,
                        "cursorColor":"#000000",
                        "fullWidth":true,
                        "valueBalloonsEnabled": false,
                        "zoomable": false
                    },
                    "dataDateFormat": "YYYY-MM-DD",
                    "categoryField": "fecha",
                    "categoryAxis": {
                        "dateFormats": [{
                            "period": "DD",
                            "format": "DD"
                        }, {
                            "period": "WW",
                            "format": "MMM DD"
                        }, {
                            "period": "MM",
                            "format": "MMM"
                        }, {
                            "period": "YYYY",
                            "format": "YYYY"
                        }],
                        "parseDates": true,
                        "autoGridCount": false,
                        "axisColor": "#555555",
                        "gridAlpha": 0.1,
                        "gridColor": "#FFFFFF",
                        "gridCount": 50
                    },
                    "export": {
                        "enabled": false
                    }
                });

                if (json.totales) {

                    var contenedor = '#lista-prestamo-totales ';

                    $(contenedor + '.precio-interes').text($AHfN(json.totales.intereses));
                    $(contenedor + '.proncentaje-interes').text(String(json.totales.porcentaje_interes) + '%');
                    $(contenedor + '.pb-interes').css('width',String(json.totales.porcentaje_interes) + '%');

                    $(contenedor + '.precio-capital').text($AHfN(json.totales.abono_capital));
                    $(contenedor + '.proncentaje-capital').text(String(json.totales.porcentaje_capital) + '%');
                    $(contenedor + '.pb-capital').css('width',String(json.totales.porcentaje_capital) + '%');

                    $(contenedor + '.precio-total-pagado').text($AHfN(json.totales.total_pagado));
                    $(contenedor + '.proncentaje-total-pagado').text(String(json.totales.porcentaje_pagado) + '%');
                    $(contenedor + '.pb-total-pagado').css('width',String(json.totales.porcentaje_pagado) + '%');

                    $(contenedor + '.precio-por-recaudar').text($AHfN(json.totales.total_recaudar));
                    $(contenedor + '.proncentaje-por-recaudar').text(String(json.totales.porcentaje_recaudar) + '%');
                    $(contenedor + '.pb-por-recaudar').css('width',String(json.totales.porcentaje_recaudar) + '%');

                    $(contenedor + '.precio-general').text($AHfN(json.totales.total_general));
                    $(contenedor + '.proncentaje-general').text('100%');
                    $(contenedor + '.pb-general').css('width','100%');
                }
            }
        );
    }
};