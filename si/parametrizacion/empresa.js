
Api.Empresa = {
    ie: null,
    id: null,
    uri: null,
    carpeta: 'Parametrizacion',
    controlador: 'Empresa',
    nombreTabla: 'tabla-empresa',
    idMensaje: 'mensaje',

    $ajaxC: Api.Ajax.constructor,
    $ajaxT: Api.Ajax.ajaxTabla,
    $ajaxS: Api.Ajax.ajaxSimple,
    $mensajeP: Api.Mensaje.publicar,
    $uriCrudObjecto: Api.Uri.crudObjecto,
    $funcionalidadesT: Api.Elementos.funcionalidadesTabla(),

    _InicializarFormulario: null,
    _Consultar: null,
    _ConsultarDetalle: null,
    _Guardar: null,
    _Actualizar: null,
    _CambiarEstado: null,
    _Eliminar: null,

    constructor: function() {
        this._InicializarFormulario	= this.$uriCrudObjecto('InicializarFormulario',this.controlador,this.carpeta);
        this._Consultar	            = this.$uriCrudObjecto('Consultar',this.controlador,this.carpeta);
        this._ConsultarDetalle	    = this.$uriCrudObjecto('ConsultarDetalle',this.controlador,this.carpeta);
        this._Guardar	            = this.$uriCrudObjecto('Guardar',this.controlador,this.carpeta);
        this._Actualizar            = this.$uriCrudObjecto('Actualizar',this.controlador,this.carpeta);
        this._CambiarEstado         = this.$uriCrudObjecto('CambiarEstado',this.controlador,this.carpeta);
        this._Eliminar              = this.$uriCrudObjecto('Eliminar',this.controlador,this.carpeta);

        str         	= this.controlador;
        this.uri    	= str.toLowerCase();

        this.inicializarFormulario();
        this.tabla();
    },

    tabla: function(pagina,tamanhio) {

        this.$ajaxC(this.nombreTabla,pagina,tamanhio);

        if (Api.ie > 1) {
            this.$funcionalidadesT.buscador = false;
            this.$funcionalidadesT.paginacion = false;
        }

        this.$ajaxT(
            this.nombreTabla,
            this.uri,
            this._Consultar,
            {
                objecto: this.controlador,
                metodo: 'tabla',
                funcionalidades: this.$funcionalidadesT,
                opciones: Api.ie > 1 ? this.opciones() : this.opcionesGenenciales(),
                checkbox: false,
                columnas: [
                    {nombre: 'tema',            edicion: false,	formato: '', alineacion:'centrado'},
                    {nombre: 'nit',             edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'nombre_cabecera', edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'nombre',          edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'frase',           edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'estado',          edicion: false,	formato: '', alineacion:'centrado'}
                ],
                automatico: false
            }
        );
    },

    detalle: function(id) {

        this._ConsultarDetalle['id_empresa'] = id;

        this.$ajaxS(
            '',
            this.uri,
            this._ConsultarDetalle,

            function (json) {

                var AS = Api.Sucursal,
                    AM = Api.ModuloEmpresa,
                    AR = Api.Rol;

                AS.idEmpresa = AM.ie = AR.ie = id;

                AM.constructor();
                AR.constructor();

                if (Object.keys(json.sucursal).length > 0) {

                    AS.inicializarParametros(json.sucursal);
                }

                $('#bloque-detalle').slideDown(300);
            }
        );
    },

    crearActualizar: function() {

        var $objeto    = Api[this.controlador];
        var parametros = this.verificarFormulario(this.id ? this._Actualizar : this._Guardar);

        if (parametros) {
            this.$ajaxS(
                this.idMensaje,
                this.uri,
                parametros,

                function (json) {

                    Api.Mensaje.json(json,$objeto.idMensaje);

                    if (json.resultado === 1) {

                        $objeto.id = null;
                        $objeto.tabla();

                        var AH = Api.Herramientas;

                        AH.cancelarCA('empresa');

                        setTimeout(function(){
                            AH.cambiarPestanhia('pestanhia-empresa','informacion');
                        }, 2000);
                    }
                }
            );
        }
    },

    editar: function(id,$objeto) {

        this.id = id;

        var AH          = Api.Herramientas;
        var contenedor  = '#crear-editar ';

        $(contenedor + '#nit').val(AH.noNull($objeto.nit));
        $(contenedor + '#nombre-cabecera').val(AH.noNull($objeto.nombre_cabecera));
        $(contenedor + '#nombre').val(AH.noNull($objeto.nombre));
        $(contenedor + '#frase').val(AH.noNull($objeto.frase));
        $(contenedor + this.idMensaje).html('');

        AH.selectDefault('tema',$objeto.id_tema);
        AH.mostrarBotonesActualizar('empresa');
        AH.cambiarPestanhia('pestanhia-empresa','crear-editar');
    },

    cambiarEstado: function(id) {

        var $objeto = Api[this.controlador];

        this._CambiarEstado['id'] = id;

        this.$ajaxS(
            '',
            this.uri,
            this._CambiarEstado,

            function() {

                $objeto.tabla();
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
            closeOnConfirm: false,
        }, function () {

            $objeto.$ajaxS(
                '',
                $objeto.uri,
                $objeto._Eliminar,

                function (json) {

                    if (json.resultado === 1) {

                        swal("Eliminado!", json.mensaje, "success");
                        $objeto.tabla();
                    }
                    else {
                        swal("Error", json.mensaje , "error");
                    }
                }
            );
        });
    },

    verificarFormulario: function($objeto) {

        var contenedor = '#crear-editar ';
        var idMensaje  = Api.Herramientas.verificarId(this.idMensaje,true);

        $objeto['id_tema']          = $(contenedor + '#tema').val();
        $objeto['nit']              = $(contenedor + '#nit').val().trim();
        $objeto['nombre_cabecera']  = $(contenedor + '#nombre-cabecera').val().trim();
        $objeto['nombre']           = $(contenedor + '#nombre').val().trim();
        $objeto['frase']            = $(contenedor + '#frase').val().trim();
        $objeto['id']               = this.id;

        $(idMensaje).html('');

        if (!$objeto.id_tema) {
            this.$mensajeP('advertencia',idMensaje,'Seleccione un tema para continuar.');
            return false;
        }

        if (!$objeto.nombre) {
            this.$mensajeP('advertencia',idMensaje,'Digite el nombre para continuar.');
            return false;
        }

        return $objeto;
    },

    opcionesGenenciales: function() {
        return {
            parametrizacion: [
                {
                    nombre: 'Ver detalle',
                    icono: 'fa-eye',
                    accion: 'Api.' + this.controlador + '.detalle',
                    color: '#428bca',
                    estado: false,
                    permiso: false,
                    informacion: false
                },
                {
                    nombre: 'Actualizar',
                    icono: 'fa-pencil-square-o',
                    accion: 'Api.' + this.controlador + '.editar',
                    color: '#1a7bb9',
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
                }
            ]
        };
    },

    opciones: function() {
        return {
            parametrizacion: [
                {
                    nombre: 'Ver detalle',
                    icono: 'fa-eye',
                    accion: 'Api.' + this.controlador + '.detalle',
                    color: '#428bca',
                    estado: false,
                    permiso: false,
                    informacion: false
                },
                {
                    nombre: 'Actualizar',
                    icono: 'fa-pencil-square-o',
                    accion: 'Api.' + this.controlador + '.editar',
                    color: '#1a7bb9',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: true
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

                var AH = Api.Herramientas;

                AH.cargarSelectJSON('#tema',json.temas,true);
            }
        );
    }
};


Api.Sucursal = {
    id: null,
    uri: null,
    carpeta: 'Parametrizacion',
    controlador: 'Sucursal',
    idEmpresa: null,

    $ajaxS: Api.Ajax.ajaxSimple,
    $mensajeS: Api.Mensaje.superior,
    $uriCrudObjecto: Api.Uri.crudObjecto,

    _ActualizarPorEmpresa: null,

    constructor: function() {
        this._ActualizarPorEmpresa  = this.$uriCrudObjecto('ActualizarPorEmpresa',this.controlador,this.carpeta);
        str         	            = this.controlador;
        this.uri    	            = str.toLowerCase();
    },

    actualizar: function() {

        this.constructor();

        var parametros = this.verificarFormulario(this._ActualizarPorEmpresa);

        if (parametros) {
            this.$ajaxS(
                '',
                this.uri,
                parametros,

                function (json) {

                    Api.Mensaje.jsonSuperior(json);
                }
            );
        }
    },

    verificarFormulario: function($objeto) {

        var contenedor = '#detalle ';

        $objeto['codigo']           = $(contenedor + '#codigo').val().trim();
        $objeto['id_municipio']     = $(contenedor + '#id-municipio').val();
        $objeto['nombre']           = $(contenedor + '#nombre').val().trim();
        $objeto['telefono']         = $(contenedor + '#telefono').val().trim();
        $objeto['direccion']        = $(contenedor + '#direccion').val().trim();
        $objeto['quienes_somos']    = $(contenedor + '#quienes-somos').val().trim();
        $objeto['que_hacemos']      = $(contenedor + '#que-hacemos').val().trim();
        $objeto['mision']           = $(contenedor + '#mision').val().trim();
        $objeto['vision']           = $(contenedor + '#vision').val().trim();
        $objeto['id_empresa']       = this.idEmpresa;


        if (!$objeto.codigo) {
            this.$mensajeS('advertencia','Digite el codigo de la sucursal para continuar.');
            return false;
        }

        if (!$objeto.id_municipio) {
            this.$mensajeS('advertencia','Seleccione una ciudad para continuar.');
            return false;
        }

        if (!$objeto.nombre) {
            this.$mensajeS('advertencia','Digite un nombre de sucursal para continuar.');
            return false;
        }

        return $objeto;
    },

    inicializarParametros: function(json) {

        var contenedor  = '#detalle ';
        var AH          = Api.Herramientas;

        $(contenedor + '#codigo').val(json.codigo);
        $(contenedor + '#ciudad').val(json.ciudad);
        $(contenedor + '#id-municipio').val(json.id_municipio);
        $(contenedor + '#nombre').val(json.nombre);
        $(contenedor + '#telefono').val(AH.noNull(json.telefono));
        $(contenedor + '#direccion').val(AH.noNull(json.direccion));
        $(contenedor + '#quienes-somos').val(AH.noNull(json.quienes_somos));
        $(contenedor + '#que-hacemos').val(AH.noNull(json.que_hacemos));
        $(contenedor + '#mision').val(AH.noNull(json.mision));
        $(contenedor + '#vision').val(AH.noNull(json.vision));
    }
};