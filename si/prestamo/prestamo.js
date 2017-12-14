Api.Prestamo = {
    carpeta: 'Prestamo',
    controlador: 'Prestamo',
    ajaxS: Api.Ajax.ajaxSimple,
    calculos: Api.Calculos,
    uri: null,

    consultarRegistroPorId: null,
    crearRefinanciacion: null,

    idRetorno: null,
    json: null,
    jsonPrestamo: null,

    constructor: function(idRetorno) {
        this.consultarRegistroPorId = this.uriCrud('ConsultarId',this.controlador,this.carpeta)+'&';
        this.crearRefinanciacion    = this.uriCrud('GuardarRefinanciacion',this.controlador,this.carpeta)+'&';
        str                         = this.controlador;
        this.uri                    = str.toLowerCase();
        this.idRetorno              = idRetorno;

        $('#'+idRetorno).html('');

        return true;
    },

    consultarPorId: function(id) {

        this.ajaxS(
            this.idRetorno,
            this.uri,
            this.consultarRegistroPorId + '&id='+id,

            function(json){

                Api.Prestamo.jsonPrestamo = json[0];
            }
        )
    },

    guardarRefinanciacion: function(id) {

        var $contenedor = '#modal-refinanciacion ';
        var $calculos   = Api.Calculos;
        var cadena      = $calculos.cadenaPrestamo;

        if (!cadena) {
            _mensaje('advertencia','modal-refinanciacion #mensaje','Debe generar la refinanciación para poderla guardar')
            return false;
        }

        $($contenedor).modal('hide');

        this.ajaxS(
            'mensaje-tabla-detalle',
            this.uri,
            this.crearRefinanciacion + '&id='                   + id
                                     + '&cadena_refinaciacion=' + $calculos.cadenaPrestamo
                                     + '&monto_requerido='      + $calculos.totalMonto
                                     + '&total_intereses='      + $calculos.totalIntereses
                                     + '&total='                + $calculos.totalGeneral
                                     + '&fecha_inicial='        + $($contenedor + '#fecha-inicial').val()
                                     + '&cuotas='               + $($contenedor + '#cuotas').val()
                                     + '&observacion='          + $($contenedor + '#observacion').val()
                                     + '&ultima_cuota_pagada='  + $($contenedor + '#refinanciar-siguiente-cuota').val()
                                     + '&total_cuotas='         + $($contenedor + '#refinanciar-nueva-cuota').val()
            ,
            function(json){

                Api.Prestamo.messageResultJson(json,'mensaje-tabla-detalle');

                if (json.resultado == 1) {

                    listado();
                    detallePrestamo(json.id);
                }
            }
        )
    },

    simularRefinanciacion: function() {

        var nuevaCuota      = 0;
        var $contenedor     = '#modal-refinanciacion ';
        var monto           = $($contenedor + '#refinanciar-monto').val();
        var interes         = $($contenedor + '#refinanciar-intereses').val();
        var cuotas          = parseInt($($contenedor + '#cuotas').val());
        var fechaInicial    = $($contenedor + '#fecha-inicial').val();
        var formaPago       = $($contenedor + '#refinanciar-id-forma-pago').val();
        var tipoPrestamo    = $($contenedor + '#refinanciar-id-tipo-prestamo').val();
        var siguienteCuota  = parseInt($($contenedor + '#refinanciar-siguiente-cuota').val());

        $($contenedor + '#tabla-refinanciacion > table > tbody').html('');

        if (!fechaInicial.trim()) {
            _mensaje('advertencia','modal-refinanciacion #mensaje','Seleccione la fecha de pago inicial para continuar');
            return false;
        }

        if (!cuotas || cuotas < 1) {
            _mensaje('advertencia','modal-refinanciacion #mensaje','Digite una cantidad de cuotas mayor que 0');
            return false;
        }


        this.calculos.calculosPrestamo(
            monto,
            interes,
            cuotas,
            fechaInicial,
            formaPago,
            tipoPrestamo,

            function(data){

                $.each(data.arreglo, function(k, i) {

                    nuevaCuota = i.no_cuota + siguienteCuota;

                    $($contenedor + '#tabla-refinanciacion > table > tbody:last').append('<tr></tr>');

                    $($contenedor + '#tabla-refinanciacion > table > tbody > tr:last')
                        .append('<td align="center">' + nuevaCuota + '</td>')
                        .append('<td align="center">' + i.fecha_pago + '</td>')
                        .append('<td align="center">$' + _formatoNumerico(i.capital) + '</td>')
                        .append('<td align="center">$' + _formatoNumerico(i.amortizacion) + '</td>')
                        .append('<td align="center">$' + _formatoNumerico(i.interes) + '</td>')
                        .append('<td align="center">$' + _formatoNumerico(i.total) + '</td>');
                });

                $($contenedor + '#refinanciar-nueva-cuota').val(nuevaCuota);
            }
        );
    },

    descargarSimulacionPrestamo: function() {

        var contenedor      = '.formulario-prestamo ';
        var cliente         = $(contenedor + '#id_cliente option:selected').text();
        var monto           = $(contenedor + '#monto_solicitado').val();
        var intereses       = $(contenedor + '#intereses').val();
        var cuotas          = $(contenedor + '#no_cuotas').val();
        var fecha_pago      = $(contenedor + '#fecha_pago_inicial').val();
        var forma_pago      = $(contenedor + '#id_forma_pago option:selected').text();
        var tipo_prestamo   = $(contenedor + '#id_tipo_prestamo option:selected').text();
        var total_intereses = $(contenedor + '#total_intereses').val();
        var total           = $(contenedor + '#total').val();
        var encabezadoPDF   = cliente + ';' + tipo_prestamo + ';' + forma_pago + ';' + monto + ';' + cuotas + ';' + intereses + ';' + total_intereses + ';' + total + ';' + fecha_pago;

        this.calculos.calculosPrestamo(
            monto,
            intereses,
            cuotas,
            fecha_pago,
            $(contenedor + '#id_forma_pago').val(),
            $(contenedor + '#id_tipo_prestamo').val(),

            function(data){

                contenedor = '#form-descargar-simulacion ';

                $(contenedor + '#encabezado').val(encabezadoPDF);
                $(contenedor + '#tabla').val(data.cadena);

                $(contenedor).submit();
            }
        );
    },

    asignarValoresPrestamo: function() {

        var contenedor = '.formulario-prestamo ';

        $(contenedor + '#id_cliente').val(6);
        $(contenedor + '#id_tipo_prestamo').val(2);
        $(contenedor + '#monto_solicitado').val(100000);
        $(contenedor + '#intereses').val(3);
        $(contenedor + '#id_forma_pago').val(4);
        $(contenedor + '#no_cuotas').val(24);
        $(contenedor + '#total-intereses').html('$20,557');
        $(contenedor + '#total_intereses').val(20557);
        $(contenedor + '#total-general').html('$120,557');
        $(contenedor + '#total').val(120557);
        $(contenedor + '#fecha_pago_inicial').val('2017-12-03');
    },

    uriCrud: function(accion,controlador,carpeta) {

        return 'crud=true&padre='+$('#idPadre').val()
            +'&hijo='+$('#idHijo').val()
            +'&funcionesVariables='+accion
            +'&controlador='+controlador
            +'&carpetaControlador='+carpeta;
    },

    messageResultJson: function(json,id) {

        switch (json.resultado) {
            case 1:
                _mensaje('realizado',id, json.mensaje);
                break;
            case 0:
                _mensaje('advertencia',id, json.mensaje);
                break;
            case -1:
                _mensaje('error',id, json.mensaje);
                break;
        }
    }
}
