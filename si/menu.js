
Api.Menu = {
    carpeta: 'Parametrizacion',
    controlador: 'Menu',
    ruta: $('#idPadre').length > 0 ? '' : 'parametrizacion/',
    uri: null,
    idRetorno: null,
    jsonEmpresaRoles: null,

    $menu: $('#btn-menu-izquierdo'),
    $modal: $('#modal-cambiar-empresa'),
    $ajaxS: Api.Ajax.ajaxSimple,
    $uriCrud: Api.Uri.crud,
    $cargarSelect: Api.Herramientas.cargarSelectJSON,
    $mensaje: Api.Mensaje.publicar,

    _GuardarTamanhioMenu: null,
    _CambiarDeEmpresa: null,

    constructor: function(idRetorno) {

        this.cargarEmpresas(ID_EMPRESA);
        this.cargarRol(ID_EMPRESA,ID_ROL);

        this._GuardarTamanhioMenu   = this.$uriCrud('GuardarTamanhioMenu',this.controlador,this.carpeta)+'&';
        this._CambiarDeEmpresa      = this.$uriCrud('CambiarDeEmpresa',this.controlador,this.carpeta)+'&';
        str                         = this.controlador;
        this.uri                    = str.toLowerCase();
        this.idRetorno              = idRetorno;

        if (idRetorno) {
            $(idRetorno).html('')
        }

        $(".chosen-select").chosen({disable_search_threshold: 10});
    },

    menuIzquierdoDinamico: function() {

        var estado = this.$menu.attr('disabled','disabled').data('estado');

        $("body").toggleClass("mini-navbar");

        SmoothlyMenu();

        this.$ajaxS(
            this.idRetorno,
            this.ruta + this.uri,
            this._GuardarTamanhioMenu + '&minimizar=' + this.$menu.attr('data-estado-minimizado'),

            function(json){

                if (json.resultado == 1) {

                    var $AM = Api.Menu;

                    $AM.$menu
                        .children('i')
                        .removeClass(json.quitar_icono)
                        .addClass(json.agregar_icono)
                        .parent()
                        .attr('data-estado-minimizado',String(json.estado));

                    $AM.$menu.removeAttr('disabled','disabled');
                }
            }
        );
    },

    mostrarNavegacionMaestra: function() {

        $('#modal-cambiar-empresa').modal({backdrop: 'static', keyboard: false});
    },

    cambiarEmpresa: function() {

        this.$modal.children('')
    },

    cargarEmpresas: function(idEmpresa) {

        this.$cargarSelect('#modal-cambiar-empresa #id-empresa',this.jsonEmpresaRoles,false,idEmpresa);
    },

    cargarRol: function(idEmpresa,idRol) {

        this.$cargarSelect('#modal-cambiar-empresa #id-rol',this.jsonEmpresaRoles[idEmpresa].roles,false,idRol);
    },

    cambiarDeEmpresa: function() {

        var datos       = this.verficarFormCambioEmpresa();
        var idRetorno   = 'modal-cambiar-empresa #mensaje';

        if (datos) {

            this.$ajaxS(
                idRetorno,
                this.ruta + this.uri,
                this._CambiarDeEmpresa + datos,

                function(json){

                    var redireccion = '';
                    var $AM         = Api.Mensaje;

                    $AM.json(json,idRetorno);

                    if (json.resultado === 1) {

                        if($('#idHijo').length) {
                            redireccion = '../';
                        }

                        if($('#idPadre').length) {
                            redireccion = '../';
                        }

                        setTimeout(function(){
                            redireccion ? location.assign(redireccion + 'inicio') : location.reload();
                            }, 2000
                        );
                    }
                }
            );
        }
    },


    verficarFormCambioEmpresa: function() {

        var contenedor      = '#modal-cambiar-empresa ';
        var idEmpresa       = $(contenedor + '#id-empresa > option:selected').val();
        var idRol           = $(contenedor + '#id-rol > option:selected').val();
        var claveMaestra    = $(contenedor + '#clave-maestra').val();

        if (!idEmpresa) {
            this.$mensaje('advertencia',contenedor + '#mensaje','Debe seleccionar la empresa para continuar');
            return false;
        }

        if (!idRol) {
            this.$mensaje('advertencia',contenedor + '#mensaje','Debe seleccionar el rol para continuar');
            return false;
        }

        if (!claveMaestra) {
            this.$mensaje('advertencia',contenedor + '#mensaje','Debe digitar su clave maestra para continuar');
            return false;
        }


        return '&id_empresa='   + idEmpresa
            + '&id_rol='        + idRol
            + '&clave_maestra=' + claveMaestra;
    }
};