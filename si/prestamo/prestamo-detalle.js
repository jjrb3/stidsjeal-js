
Api.LoanDetail = {
    folder: 'Prestamo',
    controller: 'PrestamoDetalle',
    idDetails: null,
    uri: null,
    consultByIdCrud: null,
    addCrud: null,
    addHigherPayment: null,
    updateModalCrud: null,
    idReturn: null,

    constructor: function(idReturn) {
        this.consultByIdCrud  = this.uriCrud('ConsultById',this.controller,this.folder)+'&';
        this.saveCrud         = this.uriCrud('Add',this.controller,this.folder)+'&';
        this.addHigherPayment = this.uriCrud('AddPaymentWithHigherValue',this.controller,this.folder)+'&';
        this.updateModalCrud  = this.uriCrud('UpdateModal',this.controller,this.folder)+'&';
        str                   = this.controller;
        this.uri              = str.toLowerCase();
        this.idReturn         = idReturn;

        $('#'+idReturn).html('');
    },

    consultDetailModal: function(id) {

        this.constructor('mdp-mensaje');

        var contenedor = '#modal-detalle-prestamo ';

        Api.Ajax.ajaxSimple(
            this.idReturn,
            this.uri,
            this.consultByIdCrud + '&id='+id,

            function(json){

                if (json.success) {

                    var $data       = json.data;

                    $(contenedor + '#no-prestamo').text($data.no_cuota);

                    $(contenedor + '#fecha-pago').val($data.fecha_pago);
                    $(contenedor + '#capital').val('$' + _formatoNumerico($data.capital));
                    $(contenedor + '#amortizacion').val('$' + _formatoNumerico($data.amortizacion));
                    $(contenedor + '#intereses').val('$' + _formatoNumerico($data.intereses + $data.mora));
                    $(contenedor + '#total').val('$' + _formatoNumerico($data.total));
                    $(contenedor + '#valor-pagado').val('$' + _formatoNumerico($data.valor_pagado));
                    $(contenedor + '#persona').val($data.usuario_modifico);
                    $(contenedor + '#fecha-alteracion').val($data.fecha_alteracion);
                    $(contenedor + '#observacion').val($data.observacion);

                    $(contenedor + '#valor-intereses').val($data.total);
                    $(contenedor + '#dias').val(0);
                    $(contenedor + '#result-magnification').val(0);

                    $(contenedor + '#botonActualizar').attr('onClick','Api.LoanDetail.updateModal('+id+')')

                    $('#mdp-mensaje').html('');

                    $(contenedor).modal('show')
                }
            }
        )
    },

    savePaymentWithHigherValue: function() {

        this.constructor('mensaje-pago-superior')

        Api.Ajax.ajaxSimple(
            this.idReturn,
            this.uri,
            this.addHigherPayment + '&id_prestamo=' + idPrestamo
                                  + '&' + $('#formulario-pago-superior').serialize(),

            function(json){

                var $loan = Api.LoanDetail;

                $loan.messageResultJson(json,$loan.idReturn);

                console.log(json);

                if (json.resultado == 1) {
                    document.getElementById('formulario-pago-superior').reset()
                    detallePrestamo(idPrestamo);
                    listado();
                }
            }
        )
    },

    updateModal: function(id) {

        this.constructor('mdp-mensaje');

        var contenedor  = '#modal-detalle-prestamo ';
        var fechaPago   = $(contenedor + '#fecha-pago').val();
        var observacion = $(contenedor + '#observacion').val();
        var mora        = $(contenedor + '#result-magnification').val();

        Api.Ajax.ajaxSimple(
            this.idReturn,
            this.uri,
            this.updateModalCrud + '&id=' + id
                                 + '&fecha_pago=' + fechaPago
                                 + '&observacion=' + observacion
                                 + '&mora=' + mora,

            function(json){

                var $loanDetail = Api.LoanDetail;

                $loanDetail.messageResultJson(json,$loanDetail.idReturn);

                if (json.resultado == 1) {
                    detallePrestamo(idPrestamo);
                    setTimeout(function(){
                        $loanDetail.consultDetailModal(id)
                    }, 3000);
                }
            }
        )
    },

    showMagnification: function() {

        $('#modal-detalle-prestamo #magnification').slideDown(300);
    },

    showPaymentWithHigherValue: function() {

        $('#bloque-pago-valor-superior').slideDown(300);
    },

    calculateMagnification: function() {

        var interes = parseInt($('#modal-detalle-prestamo #valor-intereses').val());
        var days = parseInt($('#modal-detalle-prestamo #dias').val());

        if (interes > 0 && days > 0) {
            $('#modal-detalle-prestamo #result-magnification').val(Math.round(interes / 30 * days));
        }
        else {
            $('#modal-detalle-prestamo #result-magnification').val(0);
        }
    },

    showRefinancing:function(id) {

        var cuotas      = parseInt($('#tabla-detalle #detalle-no-cuotas').text());
        var $prestamo   = Api.Prestamo;
        var contenedor  = '#modal-refinanciacion';

        $prestamo.constructor('');
        $prestamo.consultarPorId(id);

        $(contenedor + '#fecha-inicial').val('');
        $(contenedor + '#cuotas').val(1);
        $(contenedor + '#tabla-refinanciacion > table > tbody').html('');

        setTimeout(function(){

            var data        = $prestamo.jsonPrestamo;
            var contenedor  = '#modal-refinanciacion ';

            $(contenedor+'#refinanciacion-nombre-cliente').text(data.cliente);
            $(contenedor+'#refinanciacion-forma-pago').text(data.forma_pago);
            $(contenedor+'#refinanciacion-tipo-prestamo').text(data.tipo_prestamo);
            $(contenedor+'#refinanciacion-monto').text(data.monto_requerido);
            $(contenedor+'#refinanciacion-monto').text('$'+_formatoNumerico(data.total - data.total_pagado));

            $(contenedor+'#refinanciar-monto').val(data.total - data.total_pagado);
            $(contenedor+'#refinanciar-intereses').val(data.intereses);
            $(contenedor+'#refinanciar-id-forma-pago').val(data.id_forma_pago);
            $(contenedor+'#refinanciar-id-tipo-prestamo').val(data.id_tipo_prestamo);
            $(contenedor+'#refinanciar-siguiente-cuota').val(parseInt(data.siguiente_cuota) - 1);

            $(contenedor+'#cuotas')
                .val(cuotas)
                .attr('data-numero-minimo',parseInt(data.siguiente_cuota));


            $(contenedor+'#btn-guardar-refinanciacion').attr('onclick','Api.Prestamo.guardarRefinanciacion('+id+')');

            $(contenedor).modal('show');

        }, 2000);

    },

    validarNumeroMinimo: function() {

        var contenedor      = '#modal-refinanciacion ';
        var numeroMinimo    = parseInt($(contenedor + '#cuotas').data('numero-minimo'));
        var numeroDigitado  = parseInt($(contenedor + '#cuotas').val());

        if (numeroDigitado < numeroMinimo) {
            $(contenedor + '#cuotas').val(numeroMinimo);
        }
    },

    uriCrud: function(action,controller,folder) {

        return 'crud=true&padre='+$('#idPadre').val()
            +'&hijo='+$('#idHijo').val()
            +'&funcionesVariables='+action
            +'&controlador='+controller
            +'&carpetaControlador='+folder;
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
};