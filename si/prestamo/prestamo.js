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
    $uriCrud: Api.Uri.crudObjecto,
    $funcionalidadesT: Api.Elementos.funcionalidadesTabla(),
    $calculos: null,

    _InicializarFormulario: null,
    _Consultar: null,
    _Crear: null,
    _CambiarEstado: null,
    _Eliminar: null,
    /*consultarRegistroPorId: null,
    crearRefinanciacion: null,*/

    constructor: function() {
        this._InicializarFormulario	= this.$uriCrud('InicializarFormulario',this.controlador,this.carpeta);
        this._Consultar	            = this.$uriCrud('Consultar',this.controlador,this.carpeta);
        this._Crear                 = this.$uriCrud('Crear',this.controlador,this.carpeta);
        this._CambiarEstado         = this.$uriCrud('CambiarEstado',this.controlador,this.carpeta);
        this._Eliminar              = this.$uriCrud('Eliminar',this.controlador,this.carpeta);
        /*this.consultarRegistroPorId = this.uriCrud('ConsultarId',this.controlador,this.carpeta)+'&';
        this.crearRefinanciacion    = this.uriCrud('GuardarRefinanciacion',this.controlador,this.carpeta)+'&';*/

        str         = this.controlador;
        this.uri    = str.toLowerCase();

        this.tabla();
        this.inicializarFormulario();
    },

    tabla: function(pagina,tamanhio) {

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
                    {nombre: 'estado_pago',     edicion: false,	formato: '', alineacion:''}
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

                        setTimeout(function(){
                            AH.cambiarPestanhia('pestanhia-prestamo','lista-prestamos');
                        }, 1000);
                    }
                }
            );
        }
    },

    // Revisar ----------------------------
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
    // Revisar ----------------------------

    // Revisar ----------------------------
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
    // Revisar ----------------------------

    opciones: function() {
        return {
            parametrizacion: [
                {
                    nombre: 'Detalle del prestamo',
                    icono: 'fa-list-alt',
                    accion: 'Api.' + this.controlador + '.detalle',
                    color: '#428bca',
                    estado: false,
                    permiso: false,
                    informacion: true
                },
                {
                    nombre: 'Realizar pago',
                    icono: 'fa-money',
                    accion: 'Api.' + this.controlador + '.pagoValorSuperior',
                    color: '#428bca',
                    estado: false,
                    permiso: false,
                    informacion: true
                },
                {
                    nombre: 'Refinanciar',
                    icono: 'fa-refresh',
                    accion: 'Api.' + this.controlador + '.refinanciar',
                    color: '#428bca',
                    estado: false,
                    permiso: false,
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
                }
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
