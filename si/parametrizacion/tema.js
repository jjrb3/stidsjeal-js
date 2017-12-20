
Api.Temas = {
    id: null,
    uri: null,
    carpeta: 'Parametrizacion',
    controlador: 'Tema',
    nombreTabla: 'tabla',
    idMensaje: 'mensaje',

    $ajaxC: Api.Ajax.constructor,
    $ajaxT: Api.Ajax.ajaxTabla,
    $ajaxS: Api.Ajax.ajaxSimple,
    $mensajeP: Api.Mensaje.publicar,
    $uriCrudObjecto: Api.Uri.crudObjecto,
    $funcionalidadesT: Api.Elementos.funcionalidadesTabla(),

    _Consultar: null,
    _ConsultarId: null,
    _Guardar: null,
    _Actualizar: null,
    _Eliminar: null,

    constructor: function() {
        this._Consultar		= this.$uriCrudObjecto('Consultar',this.controlador,this.carpeta);
        this._ConsultarId	= this.$uriCrudObjecto('ConsultarId',this.controlador,this.carpeta);
        this._Guardar		= this.$uriCrudObjecto('Guardar',this.controlador,this.carpeta);
        this._Actualizar	= this.$uriCrudObjecto('Actualizar',this.controlador,this.carpeta);
        this._Eliminar      = this.$uriCrudObjecto('Eliminar',this.controlador,this.carpeta);

        str             	= this.controlador;
        this.uri        	= str.toLowerCase();

        this.tabla();
    },

    tabla: function(pagina,tamanhio) {

        this.$ajaxC(this.nombreTabla,pagina,tamanhio);

        this.$ajaxT(
            this.nombreTabla,
            this.uri,
            this._Consultar,
            {
                objecto: 'Territorio.Pais',
                metodo: 'tabla',
                funcionalidades: this.$funcionalidadesT,
                opciones: this.opciones(),
                checkbox: false,
                columnas: [
                    {nombre: 'nombre',  				edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'nombre_usuario',  		edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'nombre_administrador',  	edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'nombre_logueo',  			edicion: false,	formato: '', alineacion:'izquierda'}
                ]
            }
        );
    },

    crear: function() {

        var parametros = this.verificarFormulario(this._Guardar);

        if (parametros) {
            this.$ajaxS(
                this.idRetorno,
                this.uri,
                parametros,

                function (json) {

                    Api.Mensaje.json(json,'mensaje');

                    if (json.resultado === 1) {

                        var AT = Api.Temas;

                        AT.constructor();
                        document.getElementById('formulario-temas').reset();
                    }
                }
            );
        }
    },

    editar: function(id, objeto) {

        this.id = id;

        $('#nombre').val(objeto.nombre).focus();
        $('#nombre-usuario').val(objeto.nombre_usuario);
        $('#nombre-administrador').val(objeto.nombre_administrador);
        $('#nombre-logueo').val(objeto.nombre_logueo);

        Api.Herramientas.mostrarBotonesActualizar('temas');
    },

    actualizar: function() {

        var parametros = this.verificarFormulario(this._Actualizar);

        if (parametros) {
            this.$ajaxS(
                this.idRetorno,
                this.uri,
                parametros,

                function (json) {

                    Api.Mensaje.json(json,'mensaje');

                    if (json.resultado === 1) {

                        var AT = Api.Temas;

                        AT.id = null;
                        AT.constructor();
                        Api.Herramientas.cancelarCA('temas');
                    }
                }
            );
        }
    },

    eliminar: function(id) {

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

            Api.Ajax.ajaxSimple(
                '',
                Api.Temas.uri,
                Api.Temas._Eliminar,

                function (json) {

                    if (json.resultado === 1) {

                        swal("Eliminado!", json.mensaje, "success");
                        Api.Temas.tabla();
                    }
                    else {
                        swal("Error", json.mensaje , "error");
                    }
                }
            );
        });
    },

    verificarFormulario: function(parametros) {

        parametros['nombre']  				= $('#nombre').val().trim();
        parametros['nombre_usuario']  		= $('#nombre-usuario').val().trim();
        parametros['nombre_administrador']  = $('#nombre-administrador').val().trim();
        parametros['nombre_logueo']  		= $('#nombre-logueo').val().trim();
        parametros['id']      				= this.id;


        if (!parametros['nombre']) {
            this.$mensajeP('advertencia',this.idMensaje,'Debe digitar un nombre para continuar');
            return false;
        }

        if (!parametros['nombre_usuario']) {
            this.$mensajeP('advertencia',this.idMensaje,'Debe digitar un nombre para la sesión de usuario');
            return false;
        }

        if (!parametros['nombre_administrador']) {
            this.$mensajeP('advertencia',this.idMensaje,'Debe digitar un nombre para la sesión del administrador');
            return false;
        }

        if (!parametros['nombre_logueo']) {
            this.$mensajeP('advertencia',this.idMensaje,'Debe digitar un nombre para la sesión de ingreso');
            return false;
        }

        return parametros;
    },

    opciones: function() {
        return {
            parametrizacion: [
                {
                    nombre: 'Actualizar',
                    icono: 'fa-pencil-square-o',
                    accion: 'Api.Temas.editar',
                    color: '#1a7bb9',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: true
                },
                {
                    nombre: 'Eliminar',
                    icono: 'fa-trash',
                    accion: 'Api.Temas.eliminar',
                    color: '#ec4758',
                    estado: false,
                    permiso: 'eliminar',
                    informacion: false
                }
            ]
        };
    }
};
