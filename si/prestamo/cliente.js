
Api.Cliente = {
    id: null,
    uri: null,
    carpeta: 'Prestamo',
    controlador: 'Cliente',
    nombreTabla: 'cliente-tabla',
    idMensaje: 'cliente-mensaje',

    $ajaxC: Api.Ajax.constructor,
    $ajaxT: Api.Ajax.ajaxTabla,
    $ajaxS: Api.Ajax.ajaxSimple,
    $mensajeS: Api.Mensaje.superior,
    $mensajeP: Api.Mensaje.publicar,
    $uriCrud: Api.Uri.crudObjecto,
    $funcionalidadesT: Api.Elementos.funcionalidadesTabla(),

    _InicializarFormulario: null,
    _Consultar: null,
    _CrearActualizar: null,
    _CambiarEstado: null,
    _Eliminar: null,

    constructor: function() {
        this._InicializarFormulario	= this.$uriCrud('InicializarFormulario',this.controlador,this.carpeta);
        this._Consultar	            = this.$uriCrud('Consultar',this.controlador,this.carpeta);
        this._CrearActualizar	    = this.$uriCrud('CrearActualizar',this.controlador,this.carpeta);
        this._CambiarEstado         = this.$uriCrud('CambiarEstado',this.controlador,this.carpeta);
        this._Eliminar              = this.$uriCrud('Eliminar',this.controlador,this.carpeta);

        str         	        = this.controlador;
        this.uri    	        = str.toLowerCase();

        this.tabla();
        this.inicializarFormulario();
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
                    {nombre: 'identificacion',  edicion: false,	formato: '', alineacion:'centrado'},
                    {nombre: 'nombres',         edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'apellidos',       edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'direccion',       edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'telefono',        edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'celular',         edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'estado',          edicion: false,	formato: '', alineacion:'izquierda'}
                ],
                automatico: false
            }
        );
    },

    crearActualizar: function() {

        var $objeto = Api[this.controlador];
        var parametros = this.verificarFormulario(this._CrearActualizar);

        if (parametros) {
            this.$ajaxS(
                '',
                this.uri,
                parametros,

                function (json) {

                    $objeto.$mensajeS(json);

                    if (json.resultado === 1) {

                        var AH = Api.Herramientas;

                        $objeto.id = null;
                        $objeto.constructor();

                        AH.cancelarCA('cliente');

                        setTimeout(function(){
                            AH.cambiarPestanhia('pestanhia-cliente','informacion');
                        }, 1000);
                    }
                }
            );
        }

    },

    editar: function(id,objeto) {

        this.id = id;

        var $objeto = Api[this.controlador];

        $($objeto.contenedor + '#nombre').val(objeto.nombre).focus();
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
            closeOnConfirm: false
        }, function () {

            $objeto.$ajaxS(
                '',
                $objeto.uri,
                $objeto._Eliminar,

                function (json) {

                    if (json.resultado === 1) {

                        swal("Eliminado!", json.mensaje, "success");
                        $objeto.constructor();
                    }
                    else {
                        swal("Error", json.mensaje , "error");
                    }
                }
            );
        });
    },

    verificarFormulario: function($objeto) {

        $objeto['nombre'] = $('#nombre').val().trim();
        $objeto['id']     = this.id;

        if (!$objeto['nombre']) {
            this.$mensajeS('advertencia','Advertencia','Debe digitar un nombre para continuar');
            return false;
        }

        return $objeto;
    },

    opciones: function() {
        return {
            parametrizacion: [
                {
                    nombre: 'Codeudor',
                    icono: 'fa-address-card-o',
                    accion: 'Api.' + this.controlador + '.codeudor',
                    color: '#1a7bb9',
                    estado: false,
                    permiso: false,
                    informacion: true
                },
                {
                    nombre: 'Actualizar',
                    icono: 'fa-pencil-square-o',
                    accion: 'Api.' + this.controlador + '.editar',
                    color: '#1a7bb9',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: true
                },
                {
                    accion: 'Api.' + this.controlador + '.cambiarEstado',
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
                    accion: 'Api.' + this.controlador + '.eliminar',
                    color: '#ec4758',
                    estado: false,
                    permiso: 'eliminar',
                    informacion: false
                }
            ]
        };
    },

    inicializarFormulario: function() {

        this.$ajaxS(
            '',
            this.uri,
            this._InicializarFormulario,

            function (json) {

                console.log(json);

                var AH = Api.Herramientas;

                AH.cargarSelectJSON('#id-tipo-identificacion',json.tipo_identificacion,true);
                AH.cargarSelectJSON('#id-estado-civil',json.estado_civil,true);
                AH.cargarSelectJSON('#id-ocupacion',json.ocupacion,true);
                AH.cargarSelectJSON('#id-banco-cliente',json.bancos,true);
            }
        );
    }
};

/* Nueva version */
Api.Clientessss = {
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


function guardar(actualizar,id) {

    var data = _urlCrud((actualizar ? 'Actualizar' : 'Guardar'),controlador)+'&'+$('#formulario').serialize()+'&id='+id;

    _ajax(controlador,data,'mensajeGuardar','formulario');

    setTimeout(function(){ listado(); }, 2000);
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