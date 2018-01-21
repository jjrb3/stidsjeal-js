Api.PrestamoDetalle = {
    id: null,
    uri: null,
    carpeta: 'Prestamo',
    controlador: 'PrestamoDetalle',
    nombreTabla: 'prestamo-detalle-tabla',
    idPrestamo: null,

    $ajaxC: Api.Ajax.constructor,
    $ajaxT: Api.Ajax.ajaxTabla,
    $ajaxS: Api.Ajax.ajaxSimple,
    $mensajeS: Api.Mensaje.superior,
    $uriCrud: Api.Uri.crudObjecto,
    $funcionalidadesT: Api.Elementos.funcionalidadesTabla(),
    $AHcP: Api.Herramientas.cambiarPestanhia,
    $informacion: null,

    _ConsultarPorPrestamo: null,
    _Eliminar: null,
    _GuardarPago: null,

    constructor: function() {
        this._ConsultarPorPrestamo	= this.$uriCrud('ConsultarPorPrestamo',this.controlador,this.carpeta);
        this._Eliminar              = this.$uriCrud('Eliminar',this.controlador,this.carpeta);
        this._GuardarPago           = this.$uriCrud('GuardarPago',this.controlador,this.carpeta);

        str         = this.controlador;
        this.uri    = str.toLowerCase();

        $('#prestamo-detalle-tabla').html('');

        if (this.idPrestamo) {
            this.cargarInformacion();
            this.tabla();
            this.$AHcP('pestanhia-prestamo', 'detalle-prestamo');
        }
    },

    cargarInformacion: function() {

        var $AHfM = Api.Herramientas.formatoMoneda;

        $('#informacion-prestamo-detalle').removeClass('ocultar');

        $('#detalle-no-prestamo').text(this.$informacion.no_prestamo);
        $('#detalle-cliente').text(this.$informacion.cliente);
        $('#detalle-tipo-prestamo').text(this.$informacion.tipo_prestamo);
        $('#detalle-forma-pago').text(this.$informacion.forma_pago);
        $('#detalle-estado-pago').text(this.$informacion.estado_pago);
        $('#detalle-intereses').text(this.$informacion.intereses + '%');
        $('#detalle-no-cuotas').text(this.$informacion.no_cuotas);
        $('#detalle-monto').text($AHfM(this.$informacion.monto_requerido));
        $('#detalle-total-intereses').text($AHfM(this.$informacion.total_intereses));
        $('#detalle-total').text($AHfM(this.$informacion.total));
        $('#total-saldo-pagado').text($AHfM(this.$informacion.total_pagado));
        $('#total-a-pagar').text($AHfM(this.$informacion.total - this.$informacion.total_pagado));
    },

    tabla: function(pagina,tamanhio) {

        this.$ajaxC(this.nombreTabla,pagina,tamanhio);

        this._ConsultarPorPrestamo['idPrestamo'] = this.idPrestamo;

        this.$ajaxT(
            this.nombreTabla,
            this.uri,
            this._ConsultarPorPrestamo,
            {
                objecto: this.controlador,
                metodo: 'tabla',
                funcionalidades: this.$funcionalidadesT,
                opciones: this.opciones(),
                checkbox: false,
                columnas: [
                    {nombre: 'no',              edicion: false,	formato: '',        alineacion:'centrado'},
                    {nombre: 'fecha_pago',      edicion: false,	formato: '',        alineacion:'centrado'},
                    {nombre: 'saldo_inicial',   edicion: false,	formato: 'moneda',  alineacion:'centrado'},
                    {nombre: 'cuota_a_pagar',   edicion: false,	formato: 'moneda',  alineacion:'centrado'},
                    {nombre: 'intereses',       edicion: false,	formato: 'moneda',  alineacion:'centrado'},
                    {nombre: 'abono_capital',   edicion: false,	formato: 'moneda',  alineacion:'centrado'},
                    {nombre: 'saldo_final',     edicion: false,	formato: 'moneda',  alineacion:'centrado'},
                    {nombre: 'valor_pagado',    edicion: false,	formato: 'moneda',  alineacion:'centrado'},
                    {nombre: 'estado_pago',    edicion: false,	formato: '',        alineacion:'centrado'}
                ],
                automatico: false
            }
        );
    },

    calcularPrestamo: function() {

        var $AH         = Api.Herramientas,
            $calculos   = Api.Calculos.calcularPrestamo();

        if ($calculos) {

            $('#total-intereses').text($AH.formatoMoneda($calculos.total_interes));
            $('#total-general').text($AH.formatoMoneda($calculos.total_general));
        }
        else {
            $('#total-intereses').text('$0');
            $('#total-general').text('$0');
        }
    },

    guardarPago: function() {

        this.idPrestamo = null;

        this.constructor();

        var $parametros = this.verificarFormularioPagos(this._GuardarPago);
        var $AP         = Api.Prestamo;
        var $AM         = Api.Mensaje;

        $parametros['id_prestamo'] = $AP.id;

        if ($parametros) {
            this.$ajaxS(
                '',
                this.uri,
                $parametros,

                function (json) {

                    $AM.jsonSuperior(json);
                    $AM.publicar('informacion','#prestamo-detalle-tabla','Seleccione un prestamo para ver el listado de cuotas que debe pagar el cliente');
                    $AP.tabla();

                    $('#informacion-prestamo-detalle').addClass('ocultar');
                    $('#pagos-valor').val('');
                    $('#pagos-observacion').val('');
                    $('#modal-pagos').modal('hide');
                }
            );
        }
    },

    verificarFormularioPagos: function($objeto) {

        $objeto['valor']        = $('#pagos-valor').val().replace(/,/g,'');
        $objeto['observacion']  = $('#pagos-observacion').val().trim();


        if (!$objeto['valor']) {
            this.$mensajeS('advertencia','Advertencia','Debe digitar el valor a pagar para continuar');
            return false;
        }

        return $objeto;
    },

    eliminar: function(id) {

        var $objeto = Api[this.controlador];

        this._Eliminar['id'] = id;

        swal({
            title: "¿Seguro que desea eliminarlo?",
            text: "Después de eliminarlo no podrás recuperar esta información ni revertir los cambios!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Sí, deseo eliminarlo",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false
        }, function () {

            $objeto.$ajaxS(
                '',
                $objeto.uri,
                $objeto._Eliminar,

                function (json) {

                    if (json.resultado === 1) {

                        swal("Eliminado!", json.mensaje, "success");
                        $objeto.constructor();
                    }
                    else {
                        swal("Error", json.mensaje , "error");
                    }
                }
            );
        });
    },

    opciones: function() {
        return {
            parametrizacion: [
                /*{
                    nombre: 'Detalle de la cuota',
                    icono: 'fa-list-alt',
                    accion: 'Api.' + this.controlador + '.detalle',
                    color: '#428bca',
                    estado: false,
                    permiso: false,
                    informacion: true
                },
                {
                    nombre: 'Pagar cuota',
                    icono: 'fa-money',
                    accion: 'Api.' + this.controlador + '.pagoValorSuperior',
                    color: '#428bca',
                    estado: false,
                    permiso: false,
                    informacion: true
                },*/
                {
                    nombre: 'Borrar pago',
                    icono: 'fa-eraser',
                    accion: 'Api.' + this.controlador + '.borrarPago',
                    color: '#ec4758',
                    estado: false,
                    permiso: 'eliminar',
                    informacion: false
                },
                {
                    nombre: 'Eliminar',
                    icono: 'fa-trash',
                    accion: 'Api.' + this.controlador + '.eliminar',
                    color: '#ec4758',
                    estado: false,
                    permiso: 'eliminar',
                    informacion: false
                }/*,
                {
                    nombre: 'Descargar Pagos',
                    icono: 'fa-cloud-download',
                    accion: 'Api.' + this.controlador + '.descargarPagos',
                    color: '#23c6c8',
                    estado: false,
                    permiso: 'exportar',
                    informacion: false
                }*/
            ]
        };
    }
};

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