/**
 * Created by Jose Barrios on 2/09/2017.
 */

const carpetaControlador = 'Prestamo';

var controlador 		= 'Prestamo';
var nombreTablaGeneral 	= 'tabla'+controlador;
var idPrestamo          = 0;
var idDetalle           = 0;

$('.select2').select2();

function ejecutarBuscador(pagina,tamanhio,buscador,funcion) {

    switch(funcion)
    {
        case 'listado':
            listado(pagina,tamanhio,buscador);
            break;

        case 'listadoDetalle':
            listadoDetalle(pagina,tamanhio,buscador);
            break;
    }
}


$(document).ready(function(){

    // Calculos
    $('#monto_solicitado, #intereses, #no_cuotas').keyup(function(){
        calculos();
    });

    $('#id_tipo_prestamo').change(function(){
        calculos();
    });
});


// Desde aqui todo es manual
function detallePrestamo(id) {

    $('#bloque-detalle').slideDown(300);

    $.ajax({
        url: 'prestamo',
        type: 'post',
        data: 'id='+id+
        '&funcionesVariables=ConsultarId'+
        '&controlador='+controlador+
        '&carpetaControlador='+carpetaControlador,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        },
        dataType: 'json',
        beforeSend: function(){
            $('#tabla-prestamo-detalle').html(_cargando());
        },
        success: function (json) {

            $('#detalle-tipo-prestamo').text(json[0].tipo_prestamo);
            $('#detalle-forma-pago').text(json[0].forma_pago);
            $('#detalle-estado-pago').text(json[0].estado_pago);
            $('#detalle-no-prestamo').text(json[0].no_prestamo);
            $('#detalle-cliente').text(json[0].cliente);
            $('#detalle-monto').text('$'+_formatoNumerico(json[0].monto_requerido));
            $('#detalle-intereses').text(json[0].intereses+'%');
            $('#detalle-mora').text(json[0].mora+'%');
            $('#detalle-no-cuotas').text(json[0].no_cuotas);
            $('#detalle-total-intereses').text('$'+_formatoNumerico(json[0].total_intereses+json[0].total_mora));
            $('#detalle-total').text('$'+_formatoNumerico(json[0].total));
            $('#total-saldo-pagado').text('$'+_formatoNumerico(json[0].total_pagado));
            $('#btn-refinanciar').attr('Onclick','Api.LoanDetail.showRefinancing('+id+')')
            $('#total-a-pagar').text('$'+_formatoNumerico(json[0].total - json[0].total_pagado))

            listadoDetalle('','','',id)

            idPrestamo = id;
        },
        error: function(result) {
            _mensaje('error','bloqueImagen', 'Se encontraron errores al momento de procesar la solicitud');
        }
    });
}


function listadoDetalle(pagina,tamanhio,buscador,id) {

    if (!pagina) {pagina = 1;}
    if (!tamanhio) {tamanhio = 10;}
    if (!buscador) {buscador = '';}
    if (!id) {id = $('#id-prestamo-detalle').val()}


    var enlace 	 	 	 = _urlCrud('ConsultarPorPrestamo',controlador+'Detalle')+'&buscador='+buscador+'&id='+id;
    var paginacion   	 = ['&pagina='+pagina+'&tamanhioPagina='+tamanhio, 'listadoDetalle', 'paginacion-detalle',tamanhio];
    var opciones 	 	 = ['pagar','eliminar','detalle','borrar'];
    var exportarImportar = [];
    var cabecera 	 	 = ['no_cuota', 'fecha_pago', 'amortizacion','total_intereses','saldo','valor_pagado'];
    var edicion 	 	 = [false,true,false,false,false,false];
    var estados  	 	 = [];


    _ajaxTabla(controlador+'Detalle',enlace,'tabla-prestamo-detalle',opciones,cabecera,edicion,estados,nombreTablaGeneral,paginacion,exportarImportar);


    setTimeout(function(){
        $('#tabla-prestamo-detalle .table tbody tr').each(function (index) {
            var campo1, campo2, campo3;
            $(this).children('td').each(function (index2)
            {
                if (index2 == 0 || index2 == 4) {
                    $(this).css('text-align','center').html($(this).text());
                }

                if(index2 == 2 || index2 == 3 || index2 == 4 || index2 == 5) {
                    $(this).css('text-align','center').html('$'+_formatoNumerico($(this).text()))
                }
            })
        })

    }, 2000);

    $('#id-prestamo-detalle').val(id);
}


Api.Loan = {
    folder: 'Prestamo',
    controller: 'PrestamoDetallePago',
    idDetails: null,
    uri: null,
    addCrud: null,
    idReturn: null,

    constructor: function(idReturn) {
          this.saveCrud = this.uriCrud('Add',this.controller,this.folder)+'&';
          str           = this.controller;
          this.uri      = str.toLowerCase();
          this.idReturn = idReturn;
    },

    savePaymentLoan: function() {

        this.constructor('mensaje-pago')

        Api.Ajax.ajaxSimple(
            this.idReturn,
            this.uri,
            this.saveCrud   + $('#formulario-pago').serialize()
                            + '&id_detail='+this.idDetails,

            function(json){

                var $loan = Api.Loan;

                $loan.messageResultJson(json,$loan.idReturn);

                if (json.resultado == 1) {
                    $loan.cleanFormById('formulario-pago')
                    detallePrestamo(idPrestamo);
                    listado();
                }
            }
        )
    },

    cleanFormById: function(id) {

        document.getElementById(id).reset()
    },

    uriCrud: function(action,controller,folder) {

        return 'crud=true&padre='+$('#idPadre').val()
            +'&hijo='+$('#idHijo').val()
            +'&funcionesVariables='+action
            +'&controlador='+controller
            +'&carpetaControlador='+folder;
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
};


function actualizacionRapidaPrestamoDetalle(id,habilitar,e) {

    tecla = (document.all) ? e.keyCode : e.which;

    if (tecla == 13) {
        _guardarEdicionRapida(id,nombreTablaGeneral,'PrestamoDetalle','mensaje-tabla-detalle');
    }

    if (habilitar) {
        _edicionRapida(id,nombreTablaGeneral,'PrestamoDetalle');
    }
}



function pagarPrestamoDetalle(id) {

    $('#bloque-pago').slideDown(300);

    Api.Loan.idDetails = id;
}


function detallePrestamoDetalle(id) {
    Api.LoanDetail.consultDetailModal(id)
}


function eliminarPrestamoDetalle(id,confirmacion){

    if (!confirmacion) {
        $('#modal-eliminar #siModalEliminar').attr('onClick','eliminarPrestamoDetalle('+id+',true)');
        $('#modal-eliminar').modal('show');
    }
    else {

        var data = _urlCrud('Eliminar','PrestamoDetalle')+'&id='+id;

        _ajax('PrestamoDetalle',data,'mensaje-tabla-detalle');

        setTimeout(function(){ listadoDetalle(); }, 1500);
    }
}

function borrarPrestamoDetalle(id) {
    Api.PrestamoDetallePago.borrar(id,false);
}