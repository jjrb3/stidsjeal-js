
Api.PrestamoDetallePago = {
    carpeta: 'Prestamo',
    controlador: 'PrestamoDetallePago',
    ajaxS: Api.Ajax.ajaxSimple,

    borrarPago: null,

    idRetorno: null,

    constructor: function(idRetorno) {
        this.borrarPago = this.uriCrud('BorrarPago',this.controlador,this.carpeta)+'&';
        str             = this.controlador;
        this.uri        = str.toLowerCase();
        this.idRetorno  = idRetorno;

        $('#'+idRetorno).html('');

        return true;
    },

    borrar: function(id,confirmacion) {

        this.constructor('mensaje-tabla-detalle');

        if (confirmacion) {

            Api.Ajax.ajaxSimple(
                this.idReturn,
                this.uri,
                this.borrarPago + '&id=' + id,

                function(json){

                    var $loanDetail = Api.PrestamoDetallePago;

                    $loanDetail.messageResultJson(json,$loanDetail.idRetorno);

                    detallePrestamo(idPrestamo);
                }
            )
        }
        else {

            var contenedor = '#modal-pequenhio ';

            $(contenedor + '#mensaje').html('¿Esta seguro que desea borrar las transacciones realizadas?');

            $(contenedor + '#si')
                .attr('onClick','Api.PrestamoDetallePago.borrar('+id+',true)')
                .text('Sí quiero borrarlas')
                .css('font-weight','700');

            $(contenedor + '#no')
                .text('No quiero borrarlas')
                .css('font-weight','700');

            $(contenedor).modal('show');
        }
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
    }
};