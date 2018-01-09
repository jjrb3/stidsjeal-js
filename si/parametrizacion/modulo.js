
Api.Modulo = {
    id: null,
    carpeta: 'Parametrizacion',
    controlador: 'Modulo',
    uri: null,
    idRetorno: null,
    idModulo: 1,
    idContenedor: '#contenedor-modulos',
    idFormulario: '#formulario-modulo-sesion ',
    idTablaModulo: '#tabla-modulo',
    idTablaSesion: '#tabla-sesion',

    $ajaxC: Api.Ajax.constructor,
    $ajaxT: Api.Ajax.ajaxTabla,
    $ajaxS: Api.Ajax.ajaxSimple,
    $uriCrud: Api.Uri.crudObjecto,
    $mensajeS: Api.Mensaje.superior,
    $funcionalidadesT: Api.Elementos.funcionalidadesTabla(),

    _ConsultarPadrePorTipo: null,
    _InicializarParametros: null,
    _CrearActualizar: null,

    _ConsultarModulo: null,
    _ConsultarSesion: null,
    _GuardarIdsModulosPorEmpresa: null,
    _EliminarIdsModulosPorEmpresa: null,
    _ConsultarSesionPorEmpresaModulo: null,

    constructor: function () {
        this._ConsultarPadrePorTipo     = this.$uriCrud('ConsultarPadrePorTipo', this.controlador, this.carpeta);
        this._InicializarParametros     = this.$uriCrud('InicializarParametros', this.controlador, this.carpeta);
        this._CrearActualizar	        = this.$uriCrud('CrearActualizar',this.controlador,this.carpeta);
        this._ConsultarModulo           = this.$uriCrud('ConsultarModulos', this.controlador, this.carpeta);
        this._ConsultarSesion           = this.$uriCrud('ConsultarSesion', this.controlador, this.carpeta);

        this._EliminarIdsModulosPorEmpresa              = this.$uriCrud('EliminarIdsModulosPorEmpresa', this.controlador, this.carpeta);

        var  str                            = this.controlador;
        this.uri                            = str.toLowerCase();

        this.tablaModulo();
        this.tablaSesion();
        this.inicializarFormulario();
    },

    tablaModulo: function(pagina,tamanhio) {

        this.$ajaxC(this.idContenedor + ' ' + this.idTablaModulo,pagina,tamanhio);

        this.$ajaxT(
            this.idTablaModulo,
            this.uri,
            this._ConsultarModulo,
            {
                objecto: this.controlador,
                metodo: 'tablaModulo',
                funcionalidades: this.$funcionalidadesT,
                opciones: this.opcionesModulo(),
                checkbox: false,
                color: false,
                seleccionar: true,
                columnas: [
                    {nombre: 'icono',    edicion: false, formato: 'icono',      alineacion: 'centrado'},
                    {nombre: 'nombre',   edicion: false, formato: false,        alineacion: 'justificado'},
                    {nombre: 'etiqueta', edicion: false, formato: 'etiqueta',   alineacion: 'justificado'},
                    {nombre: 'estado',   edicion: false, formato: false,        alineacion: 'centrado'}
                ],
                automatico: false
            }
        );
    },

    tablaModuloSeleccionado: function(id) {

        this.idModulo = id;

        this.tablaSesion();
    },

    tablaSesion: function(pagina,tamanhio) {

        this.$ajaxC(this.idContenedor + ' ' + this.idTablaSesion,pagina,tamanhio);

        this._ConsultarSesion['id_modulo'] = this.idModulo;

        this.$ajaxT(
            this.idTablaSesion,
            this.uri,
            this._ConsultarSesion,
            {
                objecto: this.controlador,
                metodo: 'tablaSesion',
                funcionalidades: this.$funcionalidadesT,
                opciones: this.opcionesModulo(),
                checkbox: false,
                color: false,
                seleccionar: false,
                columnas: [
                    {nombre: 'icono',    edicion: false, formato: 'icono',      alineacion: 'centrado'},
                    {nombre: 'nombre',   edicion: false, formato: false,        alineacion: 'justificado'},
                    {nombre: 'etiqueta', edicion: false, formato: 'etiqueta',   alineacion: 'justificado'},
                    {nombre: 'estado',   edicion: false, formato: false,        alineacion: 'centrado'}
                ],
                automatico: false
            }
        );
    },

    crearActualizar: function() {

        var $objeto    = Api[this.controlador];
        var parametros = this.verificarFormulario(this._CrearActualizar);

        if (parametros) {
            this.$ajaxS(
                this.idMensaje,
                this.uri,
                parametros,

                function (json) {

                    Api.Mensaje.jsonSuperior(json);

                    if (json.resultado === 1) {

                        $objeto.id = null;
                        $objeto.constructor();

                        var AH = Api.Herramientas;

                        AH.cancelarCA('modulo-sesion');

                        setTimeout(function(){
                            AH.cambiarPestanhia($objeto.idContenedor + ' #pestanhia-modulos-sesiones','modulos-sesiones');
                        }, 2000);
                    }
                }
            );
        }
    },

    agregar: function() {

        var ids = this.obtenerIdsTablas();

        if (ids) {

            this._GuardarIdsModulosPorEmpresa['id_empresa'] = this.ie;
            this._GuardarIdsModulosPorEmpresa['ids']        = ids;

            this.$ajaxS(
                this.idRetorno,
                this.uri,
                this._GuardarIdsModulosPorEmpresa,

                function (json) {

                    Api.Mensaje.jsonSuperior(json);
                    Api.ModuloEmpresa.constructor();
                }
            );
        }
        else {
            Api.Mensaje.superior('informacion','Información','Debe seleccionar algun módulo o sesión para continuar');
        }
    },

    quitar: function() {

        var AM  = Api.ModuloEmpresa;
        var ids = this.obtenerIdsTablas();


        if (ids) {

            this._EliminarIdsModulosPorEmpresa['id_empresa'] = this.ie;
            this._EliminarIdsModulosPorEmpresa['ids']        = ids;

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

                Api.Ajax.ajaxSimple(
                    '',
                    AM.uri,
                    AM._EliminarIdsModulosPorEmpresa,

                    function (json) {

                        if (json.resultado === 1) {

                            swal("Eliminado!", json.mensaje, "success");
                            Api.ModuloEmpresa.constructor();
                        }
                        else {
                            swal("Error", json.mensaje , "error");
                        }
                    }
                );
            });
        }
        else {
            Api.Mensaje.superior('informacion','Información','Debe seleccionar algun módulo o sesión para continuar');
        }
    },

    obtenerIdsTablas: function() {

        var AHoC        = Api.Herramientas.obtenerCheck,
            ids         = '',
            idsModulos  = '',
            idsSesiones = '';

        idsModulos  = AHoC('tabla-modulo-contenido',true);
        idsSesiones = AHoC('tabla-sesion-contenido',true);

        if (idsModulos) {
            ids = idsModulos + (idsSesiones ? ',' + idsSesiones : idsSesiones);
        }
        else {
            ids = idsSesiones;
        }

        return ids;
    },

    mostrarIcono: function(icono) {

        var formulario  = this.idContenedor + ' ' + this.idFormulario + ' ';

        $(formulario + '#icono').parent().find('i').attr('class','fa ' + icono);
    },

    buscarPadre: function() {
        var AH          = Api.Herramientas;
        var formulario  = this.idContenedor + ' ' + this.idFormulario + ' ';

        this._ConsultarPadrePorTipo['tipo'] = $(formulario + '#tipo').val();

        this.$ajaxS(
            '',
            this.uri,
            this._ConsultarPadrePorTipo,

            function (json) {

                AH.cargarSelectJSON(formulario + '#id-modulo',json,true);
            }
        );
    },

    opcionesModulo: function() {
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
                    nombre: 'Subir',
                    icono: 'fa-level-up',
                    accion: 'Api.' + this.controlador + '.subirGrafica',
                    color: '#428bca',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: false
                },
                {
                    nombre: 'Bajar',
                    icono: 'fa-level-down',
                    accion: 'Api.' + this.controlador + '.bajarGrafica',
                    color: '#428bca',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: false
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

    verificarFormulario: function($objeto) {

        var formulario  = this.idContenedor + ' ' + this.idFormulario + ' ';

        $objeto['tipo']         = $(formulario + '#tipo').val();
        $objeto['id_padre']     = $(formulario + '#id-modulo').val();
        $objeto['nombre']       = $(formulario + '#nombre').val().trim();
        $objeto['enlace']       = $(formulario + '#enlace').val().trim();
        $objeto['icono']        = $(formulario + '#icono').val().trim();
        $objeto['id_etiqueta']  = $(formulario + '#id-etiqueta').val();
        $objeto['descripcion']  = $(formulario + '#descripcion').val().trim();
        $objeto['id']           = this.id;

        if (!$objeto.tipo) {
            this.$mensajeS('advertencia','Advertencia','Seleccione un tipo para continuar.');
            return false;
        }

        if (!$objeto.nombre) {
            this.$mensajeS('advertencia','Advertencia','Digite el nombre para continuar.');
            return false;
        }

        if (!$objeto.enlace) {
            this.$mensajeS('advertencia','Advertencia','Digite el enlace para continuar.');
            return false;
        }

        if (!$objeto.icono) {
            this.$mensajeS('advertencia','Advertencia','Digite el codigo del icono para continuar.');
            return false;
        }

        return $objeto;
    },

    inicializarFormulario: function() {

        var AH          = Api.Herramientas;
        var formulario  = this.idContenedor + ' ' + this.idFormulario + ' ';

        this.$ajaxS(
            '',
            this.uri,
            this._InicializarParametros,

            function (json) {

                AH.cargarSelectJSON(formulario + '#id-modulo',json.modulos,true);
                AH.cargarSelectJSON(formulario + '#id-etiqueta',json.etiquetas,true);
            }
        );
    }
};