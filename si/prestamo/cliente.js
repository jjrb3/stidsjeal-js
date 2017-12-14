/**
 * Created by Jose Barrios on 2/09/2017.
 */

/* Nueva version */
Api.Cliente = {
    carpeta: 'Prestamo',
    controlador: 'Cliente',
    ajaxSimple: Api.Ajax.ajaxSimple,
    uri: null,
    consultar: null,
    consultarPorId: null,
    consultarParametrosForm: null,
    //addCrud: null,
    //addHigherPayment: null,
    //updateModalCrud: null,
    idRetorno: null,

    json: null,
    tabla: null,

    constructor: function(idRetorno) {
        this.consultar                  = this.uriCrud('Consultar',this.controlador,this.carpeta)+'&';
        this.consultarPorId             = this.uriCrud('ConsultarId',this.controlador,this.carpeta)+'&';
        this.consultarParametrosForm    = this.uriCrud('ConsultarParametrosFormulario',this.controlador,this.carpeta)+'&';
        //this.saveCrud           = this.uriCrud('Add',this.controlador,this.carpeta)+'&';
        //this.addHigherPayment   = this.uriCrud('AddPaymentWithHigherValue',this.controlador,this.carpeta)+'&';
        //this.updateModalCrud    = this.uriCrud('UpdateModal',this.controlador,this.carpeta)+'&';
        str                             = this.controlador;
        this.uri                        = str.toLowerCase();
        this.idRetorno                  = idRetorno;

        $('#'+idRetorno).html('');
    },

    consultarTabla: function(idTabla,parametros) {

        this.constructor(idTabla + '-mensaje')

        this.ajaxSimple(
            this.idRetorno,
            this.uri,
            this.consultar  + '&buscar=' + parametros[0]
                            + '&pagina=' + parametros[1]
                            + '&tamanhioPagina=' + parametros[2],

            function(json){

                $AC = Api.Cliente;

                $AC.json  = json;
                $AC.tabla = $AC.disenhioTabla(json,idTabla);
            }
        )
    },

    disenhioTabla: function(json,idTabla) {

        $('#clonar').html('');

        $('#clonar').append('<div></div>');

        $('#clonar > div').addClass('table-responsive');

        $('#clonar div:last').append('<table></table>');

        $('#clonar > table')
            .attr('id','tabla-' + idTabla)
            .addClass('table')
            .addClass('table-bordered')
            .addClass('table-hover')
            .addClass('table-striped')
            .addClass('tablesorter')


        console.log($('#clonar').html())
    },

    mostrarDetalle: function(id) {

        this.constructor('modal-detalle #mensaje')

        // Cargamos el listado de codeudores
        Api.Codeudor.consultarPorCliente(id)

        // Cargamos los datos del cliente
        this.ajaxSimple(
            this.idRetorno,
            this.uri,
            this.consultarPorId + '&id='+id,

            function(json){

                $('#modal-detalle #nombre-cliente').text(json[0].nombres+' '+json[0].apellidos)
                $('#modal-detalle #identificacion').text(json[0].identificacion);
                $('#modal-detalle #direccion').text(json[0].direccion);
                $('#modal-detalle #telefono').text(json[0].telefono);
                $('#modal-detalle #celular').text(json[0].celular);
                $('#modal-detalle #id_cliente').val(id);

                $('#modal-detalle #tabla-codeudores > table > tbody').html('')

                $('#modal-detalle').modal('show')

                setTimeout(function(){
                    Api.Cliente.listarTablaCodeudor();
                },2000)
            }
        )
    },

    listarTablaCodeudor: function() {

        console.log(Api.Codeudor.json)
        var codeudores = Api.Codeudor.json;

        // Si existen codeudores
        if (codeudores.length > 0) {

            var iconoEditar = '';
            var iconoEliminar = '';

            $.each(codeudores, function(k, i) {

                iconoEditar = _crearIcono('Api.Cliente.formularioEditarCodeudor('+i.id+')','editar');
                iconoEliminar = _crearIcono('Api.Codeudor.confirmarEliminar('+i.id+')','eliminar');

                $('#modal-detalle #tabla-codeudores > table > tbody:last').append('<tr></tr>');

                $('#modal-detalle #tabla-codeudores > table > tbody > tr:last')
                    .append('<td>'+i.cedula+'</td>')
                    .append('<td>'+i.fecha_expedicion+'</td>')
                    .append('<td>'+i.nombres+'</td>')
                    .append('<td>'+i.apellidos+'</td>')
                    .append('<td>'+i.direccion+'</td>')
                    .append('<td>'+i.telefono+'</td>')
                    .append('<td>'+i.celular+'</td>')
                    .append('<td>'+iconoEditar+iconoEliminar+'</td>');
            })

            _verificarPermisos();
        }
        else {
            _mensaje('advertencia','modal-detalle #mensaje-crud','No se encontraron codeudores')
        }

        $('#modal-detalle #mensaje').html('')
    },

    formularioEditarCodeudor: function(id) {

        var $codeudor = Api.Codeudor;

        $codeudor.constructor('modal-detalle #mensaje');
        $codeudor.consultarPorId(id);

        setTimeout(function(){

            var $datos = $codeudor.jsonCodeudor;
            var contenedorForm = '#modal-detalle #form-codeudores ';

            $(contenedorForm + '#cedula').val($datos.cedula);
            $(contenedorForm + '#fecha_expedicion').val($datos.fecha_expedicion);
            $(contenedorForm + '#nombres').val($datos.nombres);
            $(contenedorForm + '#apellidos').val($datos.apellidos);
            $(contenedorForm + '#direccion').val($datos.direccion);
            $(contenedorForm + '#telefono').val($datos.telefono);
            $(contenedorForm + '#celular').val($datos.celular);
            $(contenedorForm + '#id_cliente').val($datos.id_cliente);

            $(contenedorForm + '#btn-cancelar').slideDown(300);
            $(contenedorForm + '.btn-guardar')
                .attr('onclick','Api.Codeudor.actualizar('+$datos.id+",'#form-codeudores ','modal-detalle #mensaje')")
                .html('<i class="fa fa-floppy-o"></i>&nbsp;Actualizar');

            $('#modal-detalle #mensaje').html('')

        }, 1000);
    },

    cancelarEditarCodeudor: function(idFormulario) {

        var contenedorForm  = '#modal-detalle #form-codeudores ';
        var idCliente      = $(contenedorForm + '#id_cliente').val();

        $(contenedorForm + '#btn-cancelar').slideUp(300);
        $(contenedorForm + '.btn-guardar')
            .attr('onclick',"Api.Codeudor.agregar('#form-codeudores ','modal-detalle #mensaje')")
            .html('<i class="fa fa-floppy-o"></i>&nbsp;Guardar');

        document.getElementById(idFormulario.substring(1).trim()).reset();

        $(contenedorForm + '#id_cliente').val(idCliente);
    },

    cargarParametrosFormulario: function() {

        this.ajaxSimple(
            this.idRetorno,
            this.uri,
            this.consultarParametrosForm,

            function(json){

                var AH = Api.Herramientas;

                AH.cargarSelectJSON('#id_tipo_identificacion',json.tipo_identificacion,true);
                AH.cargarSelectJSON('#id_estado_civil',json.estado_civil,true);
                AH.cargarSelectJSON('#id_ocupacion',json.ocupacion,true);
            }
        )
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
}



const carpetaControlador = 'Prestamo';

var controlador 		= 'Cliente';
var nombreTablaGeneral 	= 'tabla'+controlador;

//$('.select2').select2();

function ejecutarBuscador(pagina,tamanhio,buscador,funcion) {

    switch(funcion)
    {
        case 'listado':
            listado(pagina,tamanhio,buscador);
            break;
    }
}


function listado(pagina,tamanhio,buscador) {

    if (!pagina) {pagina = 1;}
    if (!tamanhio) {tamanhio = 10;}
    if (!buscador) {buscador = '';}


    var enlace 	 	 	 = _urlCrud('Consultar',controlador)+'&buscador='+buscador;
    var paginacion   	 = ['&pagina='+pagina+'&tamanhioPagina='+tamanhio, 'listado', 'paginacion',tamanhio];
    var opciones 	 	 = ['actualizar','estado', 'eliminar','detalle'];
    var exportarImportar = [];
    var cabecera 	 	 = ['identificacion', 'nombres', 'apellidos','direccion','telefono','celular','estado'];
    var edicion 	 	 = [true, true, true, true, true, true, false];
    var estados  	 	 = ['<span class="label label-default ">INACTIVO</span>','<span class="label label-primary ">ACTIVO</span>'];


    _ajaxTabla(controlador,enlace,'tabla',opciones,cabecera,edicion,estados,nombreTablaGeneral,paginacion,exportarImportar);
}


function guardar(actualizar,id) {

    var data = _urlCrud((actualizar ? 'Actualizar' : 'Guardar'),controlador)+'&'+$('#formulario').serialize()+'&id='+id;

    _ajax(controlador,data,'mensajeGuardar','formulario');

    setTimeout(function(){ listado(); }, 2000);
}


function actualizarCliente (id) {

    var data 	 = _urlCrud('ConsultarId',controlador)+'&id='+id;
    var campos   = [
        'id_tipo_identificacion',
        'identificacion',
        'nombres',
        'apellidos',
        'direccion',
        'telefono',
        'celular',
        'id_estado_civil',
        'fecha_nacimiento',
        'email_personal',
        'id_ciudad',
        'barrio',
        'id_ocupacion',
        'empresa_nombre',
        'empresa_cargo',
        'empresa_area',
        'id_municipio_empresa',
        'empresa_barrio',
        'empresa_direccion',
        'empresa_telefono',
        'empresa_fecha_ingreso',
        'empresa_antiguedad_meses',
        'sueldo',
        'ingresos',
        'egresos',
        'ref_personal_nombres',
        'ref_personal_apellidos',
        'id_municipio_ref_personal',
        'ref_personal_barrio',
        'ref_personal_telefono',
        'ref_personal_celular',
        'ref_familiar_nombres',
        'ref_familiar_apellidos',
        'id_municipio_ref_familiar',
        'ref_familiar_barrio',
        'ref_familiar_telefono',
        'ref_familiar_celular',
        'observaciones'
    ];

    _ajaxLlenarCamposActualizar(controlador,data,campos,'mensajeGuardar','formulario',id,true);
}

function estadoCliente(id,estado) {

    var data = _urlCrud('CambiarEstado',controlador)+'&estado='+estado+'&id='+id;

    _ajax(controlador,data,'mensajeTabla');

    setTimeout(function(){ listado(); }, 1500);
}

function eliminarCliente(id,confirmacion){

    if (!confirmacion) {
        $('#modal-eliminar #siModalEliminar').attr('onClick','eliminar'+controlador+'('+id+',true)');
        $('#modal-eliminar').modal('show');
    }
    else {

        var data = _urlCrud('Eliminar',controlador)+'&id='+id;

        _ajax(controlador,data,'mensajeTabla');

        setTimeout(function(){ listado(); }, 1500);
    }
}


function detalleCliente(id) {
    Api.Cliente.mostrarDetalle(id);
}