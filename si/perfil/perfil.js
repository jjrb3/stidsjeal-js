
Api.Perfil = {
    carpeta: 'Parametrizacion',
    controlador: 'Usuario',
    uri: null,
    idRetorno: null,

    $ajaxS: Api.Ajax.ajaxSimple,
    $uriCrud: Api.Uri.crudObjecto,
    $cargarSelect: Api.Herramientas.cargarSelectJSON,
    $mensaje: Api.Mensaje.publicar,

    _GuardarPerfil: null,
    _ConsultarPerfil: null,

    constructor: function (idRetorno) {
        this._ConsultarPerfil   = this.$uriCrud('ConsultarPerfil', this.controlador, this.carpeta);
        this._GuardarPerfil     = this.$uriCrud('GuardarPerfil', this.controlador, this.carpeta);
        var  str                = this.controlador;
        this.uri                = str.toLowerCase();
        this.idRetorno          = idRetorno;

        if (idRetorno) {
            $(idRetorno).html('')
        }

        this.cargarDatos();

        return true;
    },

    cargarDatos: function () {

        var $AD = Api.Dashboard;

        this.$ajaxS(
            this.idRetorno,
            this.uri,
            this._ConsultarPerfil,

            function (json) {

                if (json.resultado == 1) {

                    var contenedor = '#informacion ';

                    $(contenedor + '#empresa').val(json.perfil_usuario.empresa);
                    $(contenedor + '#tipo-identificacion').val(json.perfil_usuario.tipo_identificacion);
                    $(contenedor + '#documento').val(json.perfil_usuario.no_documento);
                    $(contenedor + '#rol').val(json.perfil_usuario.rol);
                    $(contenedor + '#usuario').val(json.perfil_usuario.usuario);
                    $(contenedor + '#nombres').val(json.perfil_usuario.nombres);
                    $(contenedor + '#apellidos').val(json.perfil_usuario.apellidos);
                    $(contenedor + '#ciudad').val(json.perfil_usuario.ciudad);
                    $(contenedor + '#id-municipio').val(json.perfil_usuario.id_municipio);
                    $(contenedor + '#correo').val(json.perfil_usuario.correo);
                    $(contenedor + '#fecha-nacimiento').val(json.perfil_usuario.fecha_nacimiento);
                    $(contenedor + '#telefono').val(json.perfil_usuario.telefono);
                    $(contenedor + '#celular').val(json.perfil_usuario.celular);

                    if (json.perfil_usuario.id_tipo_dashboard_usuario != null) {

                        $AD.mostrarContenedor(json.perfil_usuario.id_tipo_dashboard_usuario);
                    }

                    Api.Herramientas.cargarSelectJSON(contenedor + '#sexo',json.sexo,false,json.perfil_usuario.id_sexo);

                    $(Api.Perfil.idRetorno).html('');
                }
            }
        );
    },

    guardar: function () {

        var parametros = this.verificarFormulario();

        if (parametros) {
            this.$ajaxS(
                this.idRetorno,
                this.uri,
                parametros,

                function (json) {
                    Api.Mensaje.json(json,Api.Perfil.idRetorno);
                }
            );
        }
    },

    verificarFormulario: function() {

        var contenedor      = '#informacion ';

        this._GuardarPerfil['clave']            = $(contenedor + '#clave').val();
        this._GuardarPerfil['nombres']          = $(contenedor + '#nombres').val().trim();
        this._GuardarPerfil['apellidos']        = $(contenedor + '#apellidos').val().trim();
        this._GuardarPerfil['sexo']             = $(contenedor + '#sexo').val();
        this._GuardarPerfil['id_municipio']     = $(contenedor + '#id-municipio').val();
        this._GuardarPerfil['correo']           = $(contenedor + '#correo').val().trim();
        this._GuardarPerfil['fecha_nacimiento'] = $(contenedor + '#fecha-nacimiento').val();
        this._GuardarPerfil['telefono']         = $(contenedor + '#telefono').val().trim();
        this._GuardarPerfil['celular']          = $(contenedor + '#celular').val().trim();

        $(contenedor + '#mensaje').html('');

        if (!this._GuardarPerfil.nombres) {
            this.$mensaje('advertencia',contenedor + '#mensaje','Digite sus nombres para poder guardar los cambios.');
            return false;
        }

        if (!this._GuardarPerfil.apellidos) {
            this.$mensaje('advertencia',contenedor + '#mensaje','Digite sus apellidos para poder guardar los cambios.');
            return false;
        }

        if (!Api.Herramientas.validarEmail(this._GuardarPerfil.correo)) {
            this.$mensaje('advertencia',contenedor + '#mensaje','El Email digitado no es correcto.');
            return false;
        }

        return this._GuardarPerfil;
    }
};