
Api.Modulo = {
    id: null,
    tipo: 1,
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
    _Subir: null,
    _Bajar: null,

    constructor: function () {
        this._ConsultarPadrePorTipo = this.$uriCrud('ConsultarPadrePorTipo', this.controlador, this.carpeta);
        this._InicializarParametros = this.$uriCrud('InicializarParametros', this.controlador, this.carpeta);
        this._CrearActualizar	    = this.$uriCrud('CrearActualizar',this.controlador,this.carpeta);
        this._ConsultarModulo       = this.$uriCrud('ConsultarModulos', this.controlador, this.carpeta);
        this._ConsultarSesion       = this.$uriCrud('ConsultarSesion', this.controlador, this.carpeta);
        this._Subir                 = this.$uriCrud('Subir', this.controlador, this.carpeta);
        this._Bajar                 = this.$uriCrud('Bajar', this.controlador, this.carpeta);
        this._CambiarEstado         = this.$uriCrud('CambiarEstado',this.controlador,this.carpeta);
        this._Eliminar              = this.$uriCrud('Eliminar',this.controlador,this.carpeta);

        var  str                    = this.controlador;
        this.uri                    = str.toLowerCase();

        this.tablaModulo();
        this.tablaSesion();
        this.inicializarFormulario();
    },

    tablaModulo: function(pagina,tamanhio) {

        this.$ajaxC(this.idContenedor + ' ' + this.idTablaModulo,pagina,tamanhio);

        this._ConsultarModulo['tipo'] = this.tipo;

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

        this._ConsultarSesion['id_modulo']  = this.idModulo;
        this._ConsultarSesion['tipo']       = this.tipo;

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
                        }, 1000);
                    }
                }
            );
        }
    },

    editar: function(id,objeto) {

        this.id = id;

        var $objeto = Api[this.controlador];
        var AH      = Api.Herramientas;
        var tipo    = objeto.enlace_usuario == null || !objeto.enlace_usuario ? 1 : 2;

        this.buscarPadre(tipo,objeto.id_padre);

        AH.selectDefault($objeto.idContenedor + ' #id-etiqueta',objeto.id_etiqueta);
        AH.selectDefault($objeto.idContenedor + ' #tipo',tipo);

        $($objeto.idContenedor + ' #nombre').val(objeto.nombre).focus();
        $($objeto.idContenedor + ' #enlace').val(tipo === 1 ? objeto.enlace_administrador : objeto.enlace_usuario);
        $($objeto.idContenedor + ' #icono').val(objeto.icono);

        $($objeto.idContenedor + ' #descripcion').val(objeto.descripcion);

        Api.Herramientas.cambiarPestanhia($objeto.idContenedor + ' #pestanhia-modulos-sesiones','crear-editar');
    },

    subir: function(id, objeto) {

        if (id) {

            this._Subir['id']       = id;
            this._Subir['tipo']     = objeto.enlace_usuario == null || !objeto.enlace_usuario ? 1 : 2;
            this._Subir['id_padre'] = objeto.id_padre;

            this.$ajaxS(
                this.idRetorno,
                this.uri,
                this._Subir,

                function (json) {

                    Api.Mensaje.jsonSuperior(json);
                    Api.Modulo.constructor();
                }
            );
        }
    },

    bajar: function(id, objeto) {

        if (id) {

            this._Bajar['id']       = id;
            this._Bajar['tipo']     = objeto.enlace_usuario == null || !objeto.enlace_usuario ? 1 : 2;
            this._Bajar['id_padre'] = objeto.id_padre;

            this.$ajaxS(
                this.idRetorno,
                this.uri,
                this._Bajar,

                function (json) {

                    Api.Mensaje.jsonSuperior(json);
                    Api.Modulo.constructor();
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

    mostrarIcono: function(icono) {

        var formulario  = this.idContenedor + ' ' + this.idFormulario + ' ';

        $(formulario + '#icono').parent().find('i').attr('class','fa ' + icono);
    },

    buscarPadre: function(idPadre,predeterminado) {

        var AH          = Api.Herramientas;
        var formulario  = this.idContenedor + ' ' + this.idFormulario + ' ';

        this._ConsultarPadrePorTipo['tipo'] = idPadre;

        this.$ajaxS(
            '',
            this.uri,
            this._ConsultarPadrePorTipo,

            function (json) {

                AH.cargarSelectJSON(formulario + '#id-modulo',json,true,predeterminado);
            }
        );
    },

    tipoBusqueda: function(tipo) {

        if (tipo === 1) {

            $('#btn-pagina').removeClass('active');
            $('#btn-administracion').addClass('active');
        }
        else {

            $('#btn-administracion').removeClass('active');
            $('#btn-pagina').addClass('active');
        }

        this.tipo = tipo;

        this.constructor();
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
                    accion: 'Api.' + this.controlador + '.subir',
                    color: '#428bca',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: true
                },
                {
                    nombre: 'Bajar',
                    icono: 'fa-level-down',
                    accion: 'Api.' + this.controlador + '.bajar',
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