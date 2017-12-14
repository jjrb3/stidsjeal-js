

Api.Ingresar = {
    ajaxS: Api.Ajax.ajaxSimple,

    uri: 'ingresar/verificar',
    idRetorno: 'mensaje',

    ingresar: function() {

        var parametros = this.verificarFormulario();

        if (parametros) {

            this.ajaxS(
                this.idRetorno,
                this.uri,
                parametros,

                function (json) {

                    var AM = Api.Mensaje;

                    AM.json(json,Api.Ingresar.idRetorno);

                    if (json.resultado == 1) {

                        setTimeout(function(){
                            if ($('#mensaje .alert-success').length > 0) {
                                location.assign('si/inicio');
                            }
                        }, 3000);
                    }
                    else if(json.resultado == 2) {

                        Api.Herramientas.cargarSelectJSON('#id-empresa',json.empresas);
                        $('#contenedor-empresa').slideDown(300);
                    }
                }
            )
        }
    },

    verificarFormulario: function() {

        var usuario     = $('#usuario').val().trim();
        var clave       = $('#clave').val().trim();
        var recordar    = $('#recordar-ingreso').is(':checked');
        var id_empresa  = $('#id-empresa').val();

        if (!usuario) {
            Api.Mensaje.publicar('advertencia',this.idRetorno,'Debe digitar el campo usuario para continuar');
            return false;
        }

        if (!clave) {
            Api.Mensaje.publicar('advertencia',this.idRetorno,'Debe digitar el campo contraseña para continuar');
            return false;
        }

        return {
            usuario:usuario,
            clave:clave,
            recordar:recordar,
            id_empresa:id_empresa
        };
    },

    enter: function(evento) {

        if (Api.Herramientas.presionarEnter(evento)) {
            this.ingresar();
        }
    }
};


function verificarIngreso() {
    
    var url = 'ingresar/verificar'
    var data = 'usuario='+$("#usuario").val()+'&clave='+$("#clave").val()

    _ajax(url,data,'mensaje');

    setTimeout(function(){ 
        if ($("#mensaje .alert-success").length > 0) {
            location.assign('si/inicio');
        }
    }, 3000);
}

