Api.Prestamo = {
    id: null,
    uri: null,
    carpeta: 'Prestamo',
    controlador: 'Prestamo',
    nombreTabla: 'prestamo-tabla',
    totalIntereses: null,
    total: null,

    $ajaxC: Api.Ajax.constructor,
    $ajaxT: Api.Ajax.ajaxTabla,
    $ajaxS: Api.Ajax.ajaxSimple,
    $mensajeS: Api.Mensaje.superior,
    $mensajeP: Api.Mensaje.publicar,
    $uriCrud: Api.Uri.crudObjecto,
    $funcionalidadesT: Api.Elementos.funcionalidadesTabla(),
    $calculos: null,
    $prestamo: null,
    $informacion: null,

    _InicializarFormulario: null,
    _Consultar: null,
    _Crear: null,
    _CambiarEstado: null,
    _Eliminar: null,
    _GuardarRefinanciacion: null,
    _GuardarObservacion: null,

    constructor: function() {
        this._InicializarFormulario	= this.$uriCrud('InicializarFormulario',this.controlador,this.carpeta);
        this._Consultar	            = this.$uriCrud('Consultar',this.controlador,this.carpeta);
        this._Crear                 = this.$uriCrud('Crear',this.controlador,this.carpeta);
        this._CambiarEstado         = this.$uriCrud('CambiarEstado',this.controlador,this.carpeta);
        this._Eliminar              = this.$uriCrud('Eliminar',this.controlador,this.carpeta);
        this._GuardarRefinanciacion = this.$uriCrud('GuardarRefinanciacion',this.controlador,this.carpeta);
        this._GuardarObservacion    = this.$uriCrud('GuardarObservacion',this.controlador,this.carpeta);

        str         = this.controlador;
        this.uri    = str.toLowerCase();

        this.tabla();
        this.inicializarFormulario();
        this.$mensajeP('informacion','#prestamo-detalle-tabla','Seleccione un prestamo para ver el listado de cuotas que debe pagar el cliente');
        $('#informacion-prestamo-detalle').addClass('ocultar');
    },

    tabla: function(pagina,tamanhio) {

        tamanhio = !tamanhio ? 25 : tamanhio;

        this.$ajaxC(this.nombreTabla,pagina,tamanhio);

        this.$ajaxT(
            this.nombreTabla,
            this.uri,
            this._Consultar,
            {
                objecto: this.controlador,
                metodo: 'tabla',
                funcionalidades: this.$funcionalidadesT,
                opciones: this.opciones(),
                checkbox: false,
                columnas: [
                    {nombre: 'no',              edicion: false,	formato: '', alineacion:'centrado'},
                    {nombre: 'identificacion',  edicion: false,	formato: '', alineacion:'centrado'},
                    {nombre: 'cliente',         edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'tipo_prestamo',   edicion: false,	formato: '', alineacion:'centrado'},
                    {nombre: 'forma_pago',      edicion: false,	formato: '', alineacion:'centrado'},
                    {nombre: 'total',           edicion: false,	formato: 'moneda', alineacion:'centrado'},
                    {nombre: 'total_pagado',    edicion: false,	formato: 'moneda', alineacion:'centrado'},
                    {nombre: 'estado_pago',     edicion: false,	formato: '', alineacion:''},
                    {nombre: 'estado',          edicion: false,	formato: '', alineacion:'centrado'}
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

    simularPrestamo: function() {

        var $calculos = Api.Calculos.calcularPrestamo();

        if (!$calculos) {

            Api.Mensaje.superior('advertencia','Advertencia','Llene todos los campos del formulario para poder realizar la simulación');

            this.$calculos = null;
        }
        else {

            var modal  = '#modal-simular ',
                $AH    = Api.Herramientas,
                $tbody = null;

            $(modal + '#simulacion-nombre-cliente').text($calculos.informacion.cliente_nombre);
            $(modal + '#simulacion-forma-pago').text($calculos.informacion.forma_pago_nombre);
            $(modal + '#simulacion-tipo-prestamo').text($calculos.informacion.tipo_nombre);
            $(modal + '#simulacion-monto').text($AH.formatoMoneda($calculos.informacion.monto));
            $(modal + '#simulacion-intereses').text($calculos.informacion.interes + '%');
            $(modal + '#simulacion-cuotas').text($calculos.informacion.cuotas);
            $(modal + '#simulacion-total-interes').text($AH.formatoMoneda($calculos.total_interes));
            $(modal + '#simulacion-total-general').text($AH.formatoMoneda($calculos.total_general));

            $tbody = $(modal + '#tabla-simulacion').find('tbody').html('');

            $.each($calculos.lista_cuotas, function(k, i) {

                $tbody.append('<tr></tr>');

                $tbody.find('tr').last()
                    .append('<td class="centrado">' + i.no_cuota + '</td>')
                    .append('<td class="centrado">' + i.fecha_pago + '</td>')
                    .append('<td class="centrado">' + $AH.formatoMoneda(i.saldo_inicial) + '</td>')
                    .append('<td class="centrado">' + $AH.formatoMoneda(i.cuota) + '</td>')
                    .append('<td class="centrado">' + $AH.formatoMoneda(i.interes) + '</td>')
                    .append('<td class="centrado">' + $AH.formatoMoneda(i.abono_capital) + '</td>')
                    .append('<td class="centrado">' + $AH.formatoMoneda(i.saldo_final) + '</td>')
            });

            $(modal).modal('show');

            this.$calculos = $calculos;
        }
    },

    descargarSimulacion: function() {

        if (this.$calculos) {

            var encabezadoPDF   = '',
                contenedor      = '#formulario-exportar-simulacion ';

            encabezadoPDF =
                this.$calculos.informacion.cliente_nombre + ';' +
                this.$calculos.informacion.tipo_nombre + ';' +
                this.$calculos.informacion.forma_pago_nombre + ';' +
                this.$calculos.informacion.monto + ';' +
                this.$calculos.informacion.cuotas + ';' +
                this.$calculos.informacion.interes + ';' +
                this.$calculos.total_interes + ';' +
                this.$calculos.total_general + ';' +
                this.$calculos.informacion.fecha_pago;

            $(contenedor + '#encabezado').val(encabezadoPDF);
            $(contenedor + '#tabla').val(this.$calculos.cadena);

            $(contenedor).submit();
        }
    },

    crear: function() {

        var $objeto     = Api[this.controlador];
        var $parametros = Api.Calculos.calcularPrestamo();

        if ($parametros) {

            this._Crear['id_cliente']           = parseInt($parametros.informacion.id_cliente);
            this._Crear['id_tipo_prestamo']     = parseInt($parametros.informacion.id_tipo_prestamo);
            this._Crear['id_forma_pago']        = parseInt($parametros.informacion.forma_pago);
            this._Crear['fecha_pago_inicial']   = $parametros.informacion.fecha_pago;
            this._Crear['monto']                = parseInt($parametros.informacion.monto);
            this._Crear['interes']              = parseFloat($parametros.informacion.interes);
            this._Crear['cuotas']               = parseInt($parametros.informacion.cuotas);
            this._Crear['cadena_cuotas']        = $parametros.cadena;
            this._Crear['total_interes']        = $parametros.total_interes;
            this._Crear['total_general']        = $parametros.total_general;


            this.$ajaxS(
                '',
                this.uri,
                this._Crear,

                function (json) {

                    Api.Mensaje.jsonSuperior(json);

                    if (json.resultado === 1) {

                        var AH = Api.Herramientas;

                        $objeto.id = null;
                        $objeto.constructor();

                        AH.cancelarCA('prestamo');

                        $('#total-intereses').text('$0');
                        $('#total-general').text('$0');
                        $('#informacion-prestamo-detalle').addClass('ocultar');

                        setTimeout(function(){
                            AH.cambiarPestanhia('pestanhia-prestamo','lista-prestamos');
                        }, 1000);
                    }
                }
            );
        }
    },

    cambiarEstado: function(id) {

        var $objeto = Api[this.controlador];

        this._CambiarEstado['id'] = id;

        this.$ajaxS(
            '',
            this.uri,
            this._CambiarEstado,

            function () {

                $objeto.constructor();
            }
        );
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

    detalle: function(id, $informacion) {

        var $APD = Api.PrestamoDetalle;

        $APD.idPrestamo = id;
        $APD.$informacion = $informacion;

        $APD.constructor();
    },

    realizarPago: function(id, $informacion) {

        var $AP = Api.Prestamo;

        $AP.id           = id;
        $AP.$informacion = $informacion;

        $('#modal-pagos').modal('show');
    },

    refinanciar: function(id, $informacion) {

        var $AH = Api.Herramientas;

        $('#refinanciar-no-prestamo').text($informacion.no);
        $('#refinanciar-nombre-cliente').text($informacion.cliente);
        $('#refinanciar-forma-pago').text($informacion.forma_pago);
        $('#refinanciar-tipo-prestamo').text($informacion.tipo_prestamo);
        $('#refinanciar-monto').text($AH.formatoMoneda($informacion.monto_requerido));
        $('#refinanciar-intereses').text($informacion.intereses + '%');
        $('#refinanciar-cuotas').text($informacion.no_cuotas);
        $('#refinanciar-total-interes').text($AH.formatoMoneda($informacion.total_intereses));
        $('#refinanciar-total-general').text($AH.formatoMoneda($informacion.total));
        $('#refinanciar-total-deuda').text($AH.formatoMoneda($informacion.total - $informacion.total_pagado));
        $('#refinanciar-valor-refinanciar').val($AH.formatoMoneda($informacion.total - $informacion.total_pagado));

        $('#modal-refinanciar').modal('show');

        this.$prestamo = {
            id_cliente:         $informacion.id_cliente,
            id_tipo_prestamo:   $informacion.id_tipo_prestamo,
            cliente_nombre:     $informacion.cliente,
            forma_pago_nombre:  $informacion.forma_pago,
            tipo_nombre:        $informacion.tipo_prestamo,
            forma_pago:         $informacion.id_forma_pago,
            fecha_pago:         null,
            tipo:               String($informacion.id_tipo_prestamo),
            monto:              ($informacion.total - $informacion.total_pagado),
            interes:            $informacion.intereses,
            cuotas:             null,
            id_prestamo:        id
        }
    },

    simularRefinanciacion: function() {

        var $calculos   =  null,
            modal       = '#modal-refinanciar ',
            $AH         = Api.Herramientas,
            $tbody      = null;


        this.$prestamo['fecha_pago'] = $('#refinanciar-fecha-inicial').val().trim();
        this.$prestamo['cuotas']     = parseInt($('#refinanciacion-cuotas').val());

        if (!this.$prestamo.fecha_pago) {
            this.$mensajeS('advertencia','Advertencia','Llene el campo de fecha inicial para poder realizar la simulación');
            return false;
        }

        if (this.$prestamo.cuotas < 1) {
            this.$mensajeS('advertencia','Advertencia','Seleccione el número de cuotas para poder realizar la simulación');
            return false;
        }

        $calculos = Api.Calculos.calcularPrestamo(this.$prestamo);

        if ($calculos) {

            $tbody = $(modal + '#tabla-simulacion-refinanciar').find('tbody').html('');

            $.each($calculos.lista_cuotas, function (k, i) {

                $tbody.append('<tr></tr>');

                $tbody.find('tr').last()
                    .append('<td class="centrado">' + i.no_cuota + '</td>')
                    .append('<td class="centrado">' + i.fecha_pago + '</td>')
                    .append('<td class="centrado">' + $AH.formatoMoneda(i.saldo_inicial) + '</td>')
                    .append('<td class="centrado">' + $AH.formatoMoneda(i.cuota) + '</td>')
                    .append('<td class="centrado">' + $AH.formatoMoneda(i.interes) + '</td>')
                    .append('<td class="centrado">' + $AH.formatoMoneda(i.abono_capital) + '</td>')
                    .append('<td class="centrado">' + $AH.formatoMoneda(i.saldo_final) + '</td>')
            });
        }

        this.$calculos = $calculos;
    },

    guardarRefinanciacion: function() {

        var $objeto = Api[this.controlador];

        this._GuardarRefinanciacion['id']                   = parseInt(this.$calculos.informacion.id_prestamo);
        this._GuardarRefinanciacion['id_cliente']           = parseInt(this.$calculos.informacion.id_cliente);
        this._GuardarRefinanciacion['id_tipo_prestamo']     = parseInt(this.$calculos.informacion.id_tipo_prestamo);
        this._GuardarRefinanciacion['id_forma_pago']        = parseInt(this.$calculos.informacion.forma_pago);
        this._GuardarRefinanciacion['fecha_inicial']        = this.$calculos.informacion.fecha_pago;
        this._GuardarRefinanciacion['monto_requerido']      = parseInt(this.$calculos.informacion.monto);
        this._GuardarRefinanciacion['interes']              = parseFloat(this.$calculos.informacion.interes);
        this._GuardarRefinanciacion['cuotas']               = parseInt(this.$calculos.informacion.cuotas);
        this._GuardarRefinanciacion['cadena_refinaciacion'] = this.$calculos.cadena;
        this._GuardarRefinanciacion['total_intereses']      = this.$calculos.total_interes;
        this._GuardarRefinanciacion['total']                = this.$calculos.total_general;
        this._GuardarRefinanciacion['observacion']          = $('#refinanciar-observacion').val();
        this._GuardarRefinanciacion['total_cuotas']         = parseInt($('#refinanciar-cuotas').text());

        this.$ajaxS(
            '',
            this.uri,
            this._GuardarRefinanciacion,

            function (json) {

                Api.Mensaje.jsonSuperior(json);

                if (json.resultado === 1) {

                    var AH = Api.Herramientas;

                    $objeto.id = null;
                    $objeto.constructor();

                    $('#modal-refinanciar').modal('hide');

                    setTimeout(function(){
                        AH.cambiarPestanhia('pestanhia-prestamo','lista-prestamos');
                    }, 1000);
                }
            }
        );
    },

    observacion: function(id, $informacion) {

        this.id = id;

        if ($('#btn-guardar-observacion').length > 0) {
            $('#btn-guardar-observacion').attr('onclick','Api.Prestamo.guardarObservacion()');
        }

        $('#observacion').val(Api.Herramientas.noNull($informacion.observacion));
        $('#modal-observacion').modal('show');
    },

    guardarObservacion: function() {

        var $objeto = Api[this.controlador];

        this._GuardarObservacion['id']          = this.id;
        this._GuardarObservacion['observacion'] = $('#observacion').val();

        this.$ajaxS(
            '',
            this.uri,
            this._GuardarObservacion,

            function (json) {

                Api.Mensaje.jsonSuperior(json);

                if (json.resultado === 1) {

                    var AH = Api.Herramientas;

                    $objeto.id = null;
                    $objeto.constructor();

                    $('#modal-observacion').modal('hide');

                    setTimeout(function(){
                        AH.cambiarPestanhia('pestanhia-prestamo','lista-prestamos');
                    }, 1000);
                }
            }
        );
    },

    opciones: function() {
        return {
            parametrizacion: [
                {
                    nombre: 'Detalle del prestamo',
                    icono: 'fa-list-alt',
                    accion: 'Api.' + this.controlador + '.detalle',
                    color: '#555',
                    estado: false,
                    permiso: false,
                    informacion: true
                },
                {
                    nombre: 'Realizar pago',
                    icono: 'fa-money',
                    accion: 'Api.' + this.controlador + '.realizarPago',
                    color: '#1ab394',
                    estado: false,
                    permiso: 'crear',
                    informacion: true
                },
                {
                    nombre: 'Refinanciar',
                    icono: 'fa-refresh',
                    accion: 'Api.' + this.controlador + '.refinanciar',
                    color: '#1ab394',
                    estado: false,
                    permiso: 'crear',
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
                    accion: 'Api.' + this.controlador + '.cambiarEstado',
                    color: '#f7a54a',
                    estado: true,
                    condicion: {
                        1: {
                            icono: 'fa-toggle-off',
                            titulo: 'Desactivar',
                            etiqueta: '<span class="label label-primary ">ACTIVO</span>'
                        },
                        0: {
                            icono: 'fa-toggle-on',
                            titulo: 'Activar',
                            etiqueta: '<span class="label label-default">INACTIVO</span>'
                        }
                    },
                    permiso: 'estado',
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
                    nombre: 'Descargar Información',
                    icono: 'fa-cloud-download',
                    accion: 'Api.' + this.controlador + '.descargarInformacion',
                    color: '#23c6c8',
                    estado: false,
                    permiso: 'exportar',
                    informacion: false
                }*/
            ]
        };
    },

    inicializarFormulario: function() {

        this.$ajaxS(
            '',
            this.uri,
            this._InicializarFormulario,

            function (json) {

                var AH          = Api.Herramientas;
                var contenedor  = 'formulario-prestamo ';

                AH.cargarSelectJSON(contenedor + '#id-cliente',json.clientes,true);
                AH.cargarSelectJSON(contenedor + '#id-forma-pago',json.forma_pago,true);
                AH.cargarSelectJSON(contenedor + '#id-tipo-prestamo',json.tipo_prestamo,true);
            }
        );
    },

    cargarPruebasFormulario: function() {

        var AH = Api.Herramientas;

        AH.selectDefault('#id-cliente',11);
        AH.selectDefault('#id-forma-pago',4);
        AH.selectDefault('#id-tipo-prestamo',2);

        $('#fecha-pago-inicial').val('2018-01-17');
        $('#monto-requerido').val('100,000');
        $('#intereses').val('3.0');
        $('#no-cuotas').val(12);
    }
};
