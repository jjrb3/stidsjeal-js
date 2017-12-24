
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
    _ConsultarPorId: null,
    _Guardar: null,
    _Actualizar: null,
    _CambiarEstado: null,
    _Eliminar: null,

    constructor: function() {
        this._InicializarFormulario	= this.$uriCrudObjecto('InicializarFormulario',this.controlador,this.carpeta);
        this._Consultar	            = this.$uriCrudObjecto('Consultar',this.controlador,this.carpeta);
        this.ConsultarPorId	        = this.$uriCrudObjecto('ConsultarPorId',this.controlador,this.carpeta);
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

        if (this.ie > 1) {
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
                opciones: this.ie > 1 ? this.opciones() : this.opcionesGenenciales(),
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