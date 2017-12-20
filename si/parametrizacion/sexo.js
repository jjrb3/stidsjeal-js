
Api.Sexo = {
    id: null,
    uri: null,
    carpeta: 'Parametrizacion',
    controlador: 'Sexo',
    nombreTabla: 'tabla',
    idMensaje: 'mensaje',

    $ajaxC: Api.Ajax.constructor,
    $ajaxT: Api.Ajax.ajaxTabla,
    $ajaxS: Api.Ajax.ajaxSimple,
    $mensajeP: Api.Mensaje.publicar,
    $uriCrudObjecto: Api.Uri.crudObjecto,
    $funcionalidadesT: Api.Elementos.funcionalidadesTabla(),

    _Consultar: null,
    _Guardar: null,
    _Actualizar: null,
    _CambiarEstado: null,
    _Eliminar: null,

    constructor: function() {
        this._Consultar	    = this.$uriCrudObjecto('Consultar',this.controlador,this.carpeta);
        this._Guardar	    = this.$uriCrudObjecto('Guardar',this.controlador,this.carpeta);
        this._Actualizar    = this.$uriCrudObjecto('Actualizar',this.controlador,this.carpeta);
        this._CambiarEstado = this.$uriCrudObjecto('CambiarEstado',this.controlador,this.carpeta);
        this._Eliminar      = this.$uriCrudObjecto('Eliminar',this.controlador,this.carpeta);

        str         	= this.controlador;
        this.uri    	= str.toLowerCase();

        this.tabla();
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
                    {nombre: 'nombre',  edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'estado',  edicion: false,	formato: '', alineacion:'centrado'}
                ],
                automatico: true
            }
        );
    },

    guardarActualizar: function(evento) {

        if (Api.Herramientas.presionarEnter(evento)) {

            var id          = this.id;
            var $objeto     = Api[this.controlador];
            var parametros  = '';

            id ? parametros = this.verificarFormulario(this._Actualizar) : parametros = this.verificarFormulario(this._Guardar);

            if (parametros) {

                this.$ajaxS(
                    this.idMensaje,
                    this.uri,
                    parametros,

                    function (json) {

                        Api.Mensaje.json(json,$objeto.idMensaje);

                        if (json.resultado === 1) {

                            $objeto.tabla();

                            $('#nombre').val('');

                            if (id) {
                                $objeto.id = null;
                            }
                        }
                    }
                );
            }
        }
    },

    editar: function(id,objeto) {

        this.id = id;

        $('#nombre').val(objeto.nombre).focus();
    },

    cambiarEstado: function(id) {

        var $objeto = Api[this.controlador];

        this._CambiarEstado['id'] = id;

        this.$ajaxS(
            '',
            this.uri,
            this._CambiarEstado,

            function () {

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

    verificarFormulario: function(parametros) {

        parametros['nombre'] = $('#nombre').val().trim();
        parametros['id']     = this.id;

        if (!parametros['nombre']) {
            this.$mensajeP('advertencia','mensaje','Debe digitar un nombre para continuar');
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
                    accion: 'Api.Rol.editar',
                    color: '#1a7bb9',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: true
                },
                {
                    accion: 'Api.Rol.cambiarEstado',
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
                    accion: 'Api.Rol.eliminar',
                    color: '#ec4758',
                    estado: false,
                    permiso: 'eliminar',
                    informacion: false
                }
            ]
        };
    }
};