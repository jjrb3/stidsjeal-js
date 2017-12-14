

Api.Mensaje = {
    contenido: null,
    icono: null,
    color: null,

    json: function(json,id) {

        switch (json.resultado) {
            case 2:
                this.publicar('informacion',id, json.mensaje);
                break;
            case 1:
                this.publicar('realizado',id, json.mensaje);
                break;
            case 0:
                this.publicar('advertencia',id, json.mensaje);
                break;
            case -1:
                this.publicar('error',id, json.mensaje);
                break;
        }
    },

    jsonSuperior: function(json) {

        switch (json.resultado) {
            case 2:
                this.superior('informacion',json.titulo, json.mensaje);
                break;
            case 1:
                this.superior('realizado',json.titulo, json.mensaje);
                break;
            case 0:
                this.superior('advertencia',json.titulo, json.mensaje);
                break;
            case -1:
                this.superior('error',json.titulo, json.mensaje);
                break;
        }
    },

    publicar: function(tipo,id,mensaje) {

        switch (tipo)
        {
            case 'realizado':
                this.icono = 'ok-sign';
                this.color = 'success';
                break;

            case 'informacion':
                this.icono = 'info-sign';
                this.color = 'info';
                break;

            case 'advertencia':
                this.icono = 'exclamation-sign';
                this.color = 'warning';
                break;

            case 'error':
                this.icono = 'exclamation-sign';
                this.color = 'danger';
                break;
        }

        contenido  = '<div class="alert alert-dismissable alert-'+this.color+'" align="center">';
        contenido += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>';
        contenido += '<i class="glyphicon glyphicon-'+this.icono+'" style="font-size: 30px"></i> ';
        contenido += '<br>';
        contenido += mensaje;
        contenido += '</div>';

        $(Api.Herramientas.verificarId(id,true)).html(contenido)
    },

    superior: function(tipo,titulo,mensaje) {

        toastr.options = {
            closeButton: true,
            progressBar: true,
            showMethod: 'slideDown',
            timeOut: 5000
        };


        switch (tipo)
        {
            case 'realizado':
                toastr.success(mensaje, titulo);
                break;

            case 'informacion':
                toastr.info(mensaje, titulo);
                break;

            case 'advertencia':
                toastr.warning(mensaje, titulo);
                break;

            case 'error':
                toastr.error(mensaje, titulo);
                break;
        }
    }
};

var codigoMensaje = '';
var icono = '';
var color = '';


/**
 * @autor Jeremy Reyes B.
 * @version 1.0
 *
 * Genera codigo para los mensajes de la pagina
 *
 * @param string tipo:    Tipo de mensaje.
 * @param string id:      Nombre del identificador donde se mostraran los resultados.
 * @param string mensaje: Descripción del mensaje.
 */
function _mensaje(tipo,id,mensaje) {

    switch (tipo)
    {
        case 'realizado':
             icono = 'ok-sign';
             color = 'success';
             break;

        case 'informacion':
             icono = 'info-sign';
             color = 'info';
             break;

        case 'advertencia':
             icono = 'exclamation-sign';
             color = 'warning';
             break;

        case 'error':
             icono = 'exclamation-sign';
             color = 'danger';
             break;
    }

    codigoMensaje  = '<div class="alert alert-dismissable alert-'+color+'" align="center">';
    codigoMensaje += '<button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>';
    codigoMensaje += '<i class="glyphicon glyphicon-'+icono+'" style="font-size: 30px"></i> ';
    codigoMensaje += '<br>';
    codigoMensaje += mensaje;
    codigoMensaje += '</div>';

    $("#"+id).html(codigoMensaje);
}