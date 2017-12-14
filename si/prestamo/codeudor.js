/**
 * Created by Jose Barrios on 2/09/2017.
 */

/* Nueva version */
Api.Codeudor = {
    carpeta: 'Prestamo',
    controlador: 'Codeudor',
    ajaxSimple: Api.Ajax.ajaxSimple,
    uri: null,

    consultarPorIdCliente: null,
    cpId: null,
    guardar: null,
    actualizarRegistro: null,
    eliminarRegistro: null,

    idRetorno: null,
    json: null,
    jsonCodeudor: null,

    constructor: function(idRetorno) {
        this.consultarPorIdCliente  = this.uriCrud('ConsultarPorIdCliente',this.controlador,this.carpeta)+'&';
        this.cpId                   = this.uriCrud('ConsultarPorId',this.controlador,this.carpeta)+'&';
        this.guardar                = this.uriCrud('Guardar',this.controlador,this.carpeta)+'&';
        this.actualizarRegistro     = this.uriCrud('Actualizar',this.controlador,this.carpeta)+'&';
        this.eliminarRegistro       = this.uriCrud('Eliminar',this.controlador,this.carpeta)+'&';
        str                         = this.controlador;
        this.uri                    = str.toLowerCase();
        this.idRetorno              = idRetorno;

        $('#'+idRetorno).html('');

        return true;
    },

    consultarPorCliente: function(id) {

        this.constructor('modal-detalle #mensaje')

        this.ajaxSimple(
            this.idRetorno,
            this.uri,
            this.consultarPorIdCliente + '&id='+id,

            function(json){

                Api.Codeudor.json = json;
            }
        )
    },

    consultarPorId: function(id) {

        this.ajaxSimple(
            this.idRetorno,
            this.uri,
            this.cpId + '&id='+id,

            function(json){

                Api.Codeudor.jsonCodeudor = json;
            }
        )
    },

    agregar: function(idFormulario,idMensaje) {

        this.constructor(idMensaje)

        if(this.verificarFormulario(idFormulario,idMensaje)) {

            this.ajaxSimple(
                this.idRetorno,
                this.uri,
                this.guardar + '&' + $(idFormulario).serialize(),

                function(json){

                    var $codeudor = Api.Codeudor;

                    $codeudor.messageResultJson(json,'mensaje-crud');

                    if (json.resultado == 1) {

                        console.log(idFormulario.substring(1).trim());
                        document.getElementById(idFormulario.substring(1).trim()).reset();
                        $codeudor.consultarPorCliente($('#id_cliente').val());

                        setTimeout(function(){
                            Api.Cliente.listarTablaCodeudor();
                        }, 1000);
                    }
                }
            )
        }
    },

    actualizar: function(id,idFormulario,idMensaje) {

        this.constructor(idMensaje)

        if(this.verificarFormulario(idFormulario,idMensaje)) {

            this.ajaxSimple(
                this.idRetorno,
                this.uri,
                this.actualizarRegistro + '&' + $(idFormulario).serialize()
                                        + '&id=' + id,

                function(json){

                    var $codeudor = Api.Codeudor;

                    $codeudor.messageResultJson(json,'mensaje-crud');

                    if (json.resultado == 1) {

                        $codeudor.consultarPorCliente($('#id_cliente').val());
                        Api.Cliente.cancelarEditarCodeudor('#form-codeudores');

                        setTimeout(function(){
                            Api.Cliente.listarTablaCodeudor();
                        }, 1000);
                    }
                }
            )
        }
    },

    confirmarEliminar: function(id) {

        $('#modal-eliminar #siModalEliminar').attr('onClick','Api.Codeudor.eliminar('+id+')');
        $('#modal-eliminar').modal('show');
    },

    eliminar: function(id) {

        this.ajaxSimple(
            this.idRetorno,
            this.uri,
            this.eliminarRegistro + '&id=' + id,

            function(json){

                var $codeudor = Api.Codeudor;

                $codeudor.messageResultJson(json,'mensaje-crud');

                if (json.resultado == 1) {

                    $codeudor.consultarPorCliente($('#id_cliente').val());

                    setTimeout(function(){
                        Api.Cliente.listarTablaCodeudor();
                    }, 1000);
                }
            }
        )
    },

    verificarFormulario: function(idFormulario, idMensaje) {

        if (!$(idFormulario+'#cedula').val()) {
            _mensaje('advertencia',idMensaje,'Digite el campo cedula para continuar')
            return false;
        }

        if (!$(idFormulario+'#fecha_expedicion').val()) {
            _mensaje('advertencia',idMensaje,'Digite seleccione la fecha de expedición para continuar')
            return false;
        }

        if (!$(idFormulario+'#nombres').val()) {
            _mensaje('advertencia',idMensaje,'Digite el campo nombres para continuar')
            return false;
        }

        if (!$(idFormulario+'#apellidos').val()) {
            _mensaje('advertencia',idMensaje,'Digite el campo apellidos para continuar')
            return false;
        }

        if (!$(idFormulario+'#direccion').val()) {
            _mensaje('advertencia',idMensaje,'Digite el campo dirección para continuar')
            return false;
        }

        return true;
    },

    uriCrud: function(accion,controlador,carpeta) {

        return 'crud=true&padre='+$('#idPadre').val()
            +'&hijo='+$('#idHijo').val()
            +'&funcionesVariables='+accion
            +'&controlador='+controlador
            +'&carpetaControlador='+carpeta;
    },

    messageResultJson: function(json,id) {

        switch (json.resultado) {
            case 1:
                _mensaje('realizado',id, json.mensaje);
                break;
            case 0:
                _mensaje('advertencia',id, json.mensaje);
                break;
            case -1:
                _mensaje('error',id, json.mensaje);
                break;
        }
    },
}
