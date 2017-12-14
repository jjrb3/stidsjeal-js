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


function listado(pagina,tamanhio,buscador) {

    if (!pagina) {pagina = 1;}
    if (!tamanhio) {tamanhio = 10;}
    if (!buscador) {buscador = '';}


    var enlace 	 	 	 = _urlCrud('Consultar',controlador)+'&buscador='+buscador;
    var paginacion   	 = ['&pagina='+pagina+'&tamanhioPagina='+tamanhio, 'listado', 'paginacion',tamanhio];
    var opciones 	 	 = ['eliminar','detalle'];
    var exportarImportar = [];
    var cabecera 	 	 = ['no_prestamo','identificacion', 'cliente','tipo_prestamo','monto_requerido','total_pagado','fecha_pago_inicial','estado_pago'];
    var edicion 	 	 = [true, true, true, true, true, true, false];
    var estados  	 	 = ['<span class="label label-default ">INACTIVO</span>','<span class="label label-primary ">ACTIVO</span>'];


    _ajaxTabla(controlador,enlace,'tabla',opciones,cabecera,edicion,estados,nombreTablaGeneral,paginacion,exportarImportar);

    setTimeout(function(){
        $('#tabla-prestamo tbody tr').each(function (index) {
            var campo1, campo2, campo3;
            $(this).children('td').each(function (index2)
            {
                if (index2 == 3 || index2 == 4 || index2 == 5 || index2 == 6 || index2 == 7) {

                    $(this).css('text-align','center').html($(this).text())
                }

                if(index2 == 4 || index2 == 5) {
                    $(this).css('text-align','center').html('$'+_formatoNumerico($(this).text()))
                }
            })
        })

    }, 3000);
}


function llenarInputsGuardar() {

    _ajaxLlenarInputs('../prestamo/cliente',_urlCrud('ConsultarActivos','Cliente'),'id_cliente','select','cliente...');
    _ajaxLlenarInputs('../prestamo/formaPago',_urlCrud('ConsultarActivos','FormaPago'),'id_forma_pago','select','pago...');
    _ajaxLlenarInputs('../prestamo/tipoPrestamo',_urlCrud('ConsultarActivos','TipoPrestamo'),'id_tipo_prestamo','select','tipo...');
}


function guardar(actualizar,id) {

    var data = _urlCrud((actualizar ? 'Actualizar' : 'Guardar'),controlador)+'&'+$('#formulario').serialize()+'&id='+id+'&detalle='+obtenerCalculos();

    _ajax(controlador,data,'mensajeGuardar','formulario');

    setTimeout(function(){ listado(); }, 2000);
}


function obtenerCalculos() {

    var concatCalculate = '';

    if ($('#id_cliente').val() &&
        $('#id_forma_pago').val() &&
        $('#monto_requerido').val() &&
        $('#intereses').val() &&
        $('#no_cuotas').val() &&
        $('#total_intereses').val() &&
        $('#total').val() &&
        $('#fecha_pago_inicial').val() &&
        $('#id_tipo_prestamo').val()

    ) {

        var monto_solicitado    = !$('#monto_solicitado').val() ? 0 : _reemplazar($('#monto_solicitado').val(),',','');
        var intereses           = !$('#intereses').val() ? 0.0 : $('#intereses').val();
        var no_cuotas           = !$('#no_cuotas').val() ? 0 : $('#no_cuotas').val();
        var fecha_pago_inicial  = $('#fecha_pago_inicial').val();
        var id_forma_pago       = $('#id_forma_pago').val();
        var id_tipo_prestamo    = $('#id_tipo_prestamo').val();

        var abonoInteres    = 0;
        var amortizacion    = 0;
        var fecha           = '';
        var capital         = monto_solicitado;
        var porcentaje      = intereses / 100;
        var montoFijo       = Math.round((porcentaje * Math.pow(1+porcentaje,no_cuotas)* monto_solicitado)/(Math.pow(1+porcentaje,no_cuotas)-1));

        for(var i=0;i<no_cuotas;i++) {

            switch (parseInt(id_forma_pago))
            {
                case 1:
                    fecha = _sumarDia(i,fecha_pago_inicial);
                    break;
                case 2:
                    fecha = _sumarDia(i * 7,fecha_pago_inicial);
                    break;
                case 3:
                    fecha = _sumarDia(i * 15,fecha_pago_inicial);
                    break;
                case 4:
                    fecha = _sumarMes(i,fecha_pago_inicial);
                    break;
            }

            if (id_tipo_prestamo == 1) {

                abonoInteres = Math.round(monto_solicitado * intereses / 100);
                amortizacion = Math.round(monto_solicitado / no_cuotas);
                montoFijo = abonoInteres + amortizacion;
            }
            else if (id_tipo_prestamo == 2) {

                abonoInteres = Math.round(capital * intereses / 100);
                amortizacion = montoFijo - abonoInteres;
            }

            concatCalculate += (i+1)+';'
            concatCalculate += fecha+';'
            concatCalculate += capital+';'
            concatCalculate += amortizacion+';'
            concatCalculate += abonoInteres+';'
            concatCalculate += montoFijo+';}'

            capital -= amortizacion;
        }

        return concatCalculate;
    }
}


function eliminarPrestamo(id,confirmacion){

    if (!confirmacion) {
        $('#modal-eliminar #siModalEliminar').attr('onClick','eliminar'+controlador+'('+id+',true)');
        $('#modal-eliminar').modal('show');
    }
    else {

        var data = _urlCrud('Eliminar',controlador)+'&id='+id;

        _ajax(controlador,data,'mensajeTabla');

        setTimeout(function(){
            listado();
            $('#bloque-detalle').slideUp(300);
            $('#bloque-pago').slideUp(300);
            }, 1500);
    }
}


function calculos() {

    var id_tipo_prestamo = $('#id_tipo_prestamo').val();

    if (id_tipo_prestamo) {

        var monto_solicitado = !$('#monto_solicitado').val() ? 0 : _reemplazar($('#monto_solicitado').val(), ',', '');
        var intereses = !$('#intereses').val() ? 0.0 : $('#intereses').val();
        var no_cuotas = !$('#no_cuotas').val() ? 0 : $('#no_cuotas').val();

        $('#monto_requerido').val(monto_solicitado);

        if (no_cuotas) {

            var abonoInteres    = 0;
            var amortizacion    = 0;
            var interes         = 0;
            var capital         = monto_solicitado;
            var porcentaje      = intereses / 100;
            var montoFijo       = Math.round((porcentaje * Math.pow(1+porcentaje,no_cuotas)* monto_solicitado)/(Math.pow(1+porcentaje,no_cuotas)-1));

            for (var i = 1; i <= no_cuotas; i++) {

                if (id_tipo_prestamo == 1) {

                    abonoInteres += Math.round(monto_solicitado * intereses / 100);
                }
                else if (id_tipo_prestamo == 2) {

                    interes = Math.round(capital * intereses / 100);
                    amortizacion = montoFijo - interes;
                    abonoInteres += interes;
                }

                capital -= amortizacion;
            }

            $('#total-intereses').html('$' + _formatoNumerico(abonoInteres));
            $('#total-general').html('$' + _formatoNumerico(parseInt(monto_solicitado) + parseFloat(abonoInteres)));
            $('#total_intereses').val(abonoInteres);
            $('#total').val(parseInt(monto_solicitado) + parseFloat(abonoInteres));
        }
        else {

            $('#total-intereses').html('$0');
            $('#total-general').html('$0');

            $('#total_intereses').val(0);
            $('#total').val(0);
        }
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


    $('#botonSimular').click(function(){

        if ($('#id_cliente').val() &&
            $('#id_forma_pago').val() &&
            $('#monto_requerido').val() &&
            $('#intereses').val() &&
            $('#no_cuotas').val() &&
            $('#total_intereses').val() &&
            $('#total').val() &&
            $('#fecha_pago_inicial').val() &&
            $('#id_tipo_prestamo').val()

        ) {

            $('#modal-simular-credito').modal('show');

            $('#simulacion-nombre-cliente').html($('#id_cliente option:selected').text())
            $('#simulacion-forma-pago').html($('#id_forma_pago option:selected').text())
            $('#simulacion-tipo-prestamo').html($('#id_tipo_prestamo option:selected').text())

            $('#simulacion-monto').html('$' + _formatoNumerico($('#monto_requerido').val()))
            $('#simulacion-intereses').html($('#intereses').val()+'%')
            $('#simulacion-cuotas').html(_formatoNumerico($('#no_cuotas').val()))
            $('#simulacion-total-interes').html('$' + _formatoNumerico($('#total_intereses').val()))
            $('#simulacion-total-general').html('$' + _formatoNumerico($('#total').val()))


            // Creacion de tabla
            var monto_solicitado    = !$('#monto_solicitado').val() ? 0 : _reemplazar($('#monto_solicitado').val(),',','');
            var intereses           = !$('#intereses').val() ? 0.0 : $('#intereses').val();
            var no_cuotas           = !$('#no_cuotas').val() ? 0 : $('#no_cuotas').val();
            var fecha_pago_inicial  = $('#fecha_pago_inicial').val();
            var id_forma_pago       = $('#id_forma_pago').val();
            var id_tipo_prestamo    = $('#id_tipo_prestamo').val();
            var tabla               = '';

            tabla += '  <table class="table table-bordered table-hover table-striped tablesorter">';
            tabla += '      <thead>';
            tabla += '          <tr>';
            tabla += '              <th>No. Cuota</th>';
            tabla += '              <th>Fecha pago</th>';
            tabla += '              <th>Capital</th>';
            tabla += '              <th>Amortización a capital</th>';
            tabla += '              <th>Intereses</th>';
            tabla += '              <th>Total a pagar</th>';
            tabla += '          </tr>';
            tabla += '      </thead>';
            tabla += '      <tbody>';


            var abonoInteres    = 0;
            var amortizacion    = 0;
            var fecha           = '';
            var capital         = monto_solicitado;
            var porcentaje      = intereses / 100;
            var montoFijo       = Math.round((porcentaje * Math.pow(1+porcentaje,no_cuotas)* monto_solicitado)/(Math.pow(1+porcentaje,no_cuotas)-1));

            for(var i=0;i<no_cuotas;i++) {


                switch (parseInt(id_forma_pago))
                {
                    case 1:
                        fecha = _sumarDia(i,fecha_pago_inicial);
                        break;
                    case 2:
                        fecha = _sumarDia(i * 7,fecha_pago_inicial);
                        break;
                    case 3:
                        fecha = _sumarDia(i * 15,fecha_pago_inicial);
                        break;
                    case 4:
                        fecha = _sumarMes(i - 1,fecha_pago_inicial);
                        break;
                }

                if (id_tipo_prestamo == 1) {

                    abonoInteres = Math.round(monto_solicitado * intereses / 100);
                    amortizacion = Math.round(monto_solicitado / no_cuotas);
                    montoFijo = abonoInteres + amortizacion;
                }
                else if (id_tipo_prestamo == 2) {

                    abonoInteres = Math.round(capital * intereses / 100);
                    amortizacion = montoFijo - abonoInteres;
                }

                tabla += '          <tr>';
                tabla += '              <td align="center">'+(i+1)+'</td>';
                tabla += '              <td align="center">'+fecha+'</td>';
                tabla += '              <td align="center">$'+_formatoNumerico(capital)+'</td>';
                tabla += '              <td align="center">$'+_formatoNumerico(amortizacion)+'</td>';
                tabla += '              <td align="center">$'+_formatoNumerico(abonoInteres)+'</td>';
                tabla += '              <td align="center">$'+_formatoNumerico(montoFijo)+'</td>';
                tabla += '          </tr>';

                capital -= amortizacion;
            }

            tabla += '      </tbody>';
            tabla += '  </table>';

            $('#tabla-simulacion-prestamo').html(tabla);
        }
        else {

            _mensaje('advertencia','mensajeGuardar', 'Debe llenar todos los campos para generar la simulacion');
        }
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