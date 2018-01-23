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
    _BorrarPago: null,
    _GuardarAmpliacion: null,
    _ActualizarFecha: null,

    constructor: function() {
        this._ConsultarPorPrestamo	= this.$uriCrud('ConsultarPorPrestamo',this.controlador,this.carpeta);
        this._Eliminar              = this.$uriCrud('Eliminar',this.controlador,this.carpeta);
        this._GuardarPago           = this.$uriCrud('GuardarPago',this.controlador,this.carpeta);
        this._BorrarPago            = this.$uriCrud('BorrarPago',this.controlador,this.carpeta);
        this._GuardarAmpliacion     = this.$uriCrud('GuardarAmpliacion',this.controlador,this.carpeta);
        this._ActualizarFecha       = this.$uriCrud('ActualizarFecha',this.controlador,this.carpeta);

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

    borrarPago: function(id) {

        var $objeto = Api[this.controlador];

        this._BorrarPago['id'] = id;

        swal({
            title: "¿Seguro que desea borrarlo?",
            text: "Después de borrar este pago no podrás recuperar esta información ni revertir los cambios!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Sí, deseo borrarlo",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false
        }, function () {

            $objeto.$ajaxS(
                '',
                $objeto.uri,
                $objeto._BorrarPago,

                function (json) {

                    if (json.resultado === 1) {

                        swal("Eliminado!", json.mensaje, "success");
                        $objeto.tabla();
                        Api.Prestamo.tabla();
                    }
                    else {
                        swal("Error", json.mensaje , "error");
                    }
                }
            );
        });
    },

    ampliar: function(id,$informacion) {

        this.id = id;

        $('#ampliar-no-cuota').text($informacion.no);
        $('#ampliar-saldo').val($informacion.cuota);
        $('#ampliar-total').val('');

        $('#modal-ampliar').modal('show');
    },

    calcularAmpliacion: function() {


        var saldo   = parseInt($('#ampliar-saldo').val().replace(/,/g,'')),
            dias    = parseInt($('#ampliar-dias').val());

        if (saldo > 0 && dias > 0) {
            $('#ampliar-total').val(Api.Herramientas.formatoMoneda(Math.round(saldo / 30 * dias)));
        }
        else {
            $('#ampliar-total').val(0);
        }
    },

    guardarAmpliacion: function() {

        var $objeto = Api[this.controlador];

        this._GuardarAmpliacion['id']       = this.id;
        this._GuardarAmpliacion['valor']    = $('#ampliar-total').val();


        if (!this._GuardarAmpliacion.valor) {
            this.$mensajeS('advertencia','Advertencia','Realice el calculo para poder guardar la ampliación');
            return false;
        }
        else {
            this._GuardarAmpliacion['valor'] = this._GuardarAmpliacion['valor'].substring(1).replace(/,/g,'')
        }


        this.$ajaxS(
            '',
            this.uri,
            this._GuardarAmpliacion,

            function (json) {

                Api.Mensaje.jsonSuperior(json);

                if (json.resultado === 1) {

                    $objeto.constructor();
                    Api.Prestamo.tabla();

                    $('#ampliar-total').val('');
                    $('#ampliar-dias').val('1');
                    $('#modal-ampliar').modal('hide');
                }
            }
        );
    },

    actualizarFechas: function(id, $informacion) {

        this.id = id;

        $('#cambiar-fecha-no-cuota').text($informacion.no_cuota);
        $('#cambiar-fecha').val($informacion.fecha_pago);

        $('#modal-cambiar-fecha').modal('show');
    },

    guardarFecha: function() {

        var $objeto = Api[this.controlador];

        this._ActualizarFecha['id']    = this.id;
        this._ActualizarFecha['fecha'] = $('#cambiar-fecha').val();


        if (!this._ActualizarFecha.fecha) {
            this.$mensajeS('advertencia','Advertencia','Seleccione una fecha para poder actualizar');
            return false;
        }


        this.$ajaxS(
            '',
            this.uri,
            this._ActualizarFecha,

            function (json) {

                Api.Mensaje.jsonSuperior(json);

                if (json.resultado === 1) {

                    $objeto.constructor();

                    $('#modal-cambiar-fecha').modal('hide');
                }
            }
        );
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
                },*/
                {
                    nombre: 'Aplicación',
                    icono: 'fa-expand',
                    accion: 'Api.' + this.controlador + '.ampliar',
                    color: '#428bca',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: true
                },
                {
                    nombre: 'Actualizar fechas',
                    icono: 'fa-calendar',
                    accion: 'Api.' + this.controlador + '.actualizarFechas',
                    color: '#428bca',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: true
                },
                {
                    nombre: 'Observaciones',
                    icono: 'fa-commenting-o',
                    accion: 'Api.' + this.controlador + '.observacion',
                    color: '#428bca',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: true
                },
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