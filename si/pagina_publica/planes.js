
const carpetaControlador  = 'PaginaPublica';

var controlador 		= 'Planes';
var nombreTablaGeneral 	= 'tabla'+controlador;

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
    var opciones 	 	 = ['actualizacionRapida', 'eliminar','detalle'];
    var exportarImportar = [];
    var cabecera 	  	 = ['nombre', 'descripcion','valor'];
    var edicion 	  	 = [true, true,true];
    var estados  	  	 = [];


    _ajaxTabla(controlador,enlace,'tabla',opciones,cabecera,edicion,estados,nombreTablaGeneral,paginacion,exportarImportar);

    setTimeout(function(){
        $("#tabla .table tbody tr").each(function (index) {
            var campo1, campo2, campo3;
            $(this).children("td").each(function (index2)
            {
                switch (index2)
                {
                    case 1:
                        $(this).text() == 'null' ? $(this).html('') : ''
                        break;
                    case 2: campo3 = $(this).text();
                        $(this).css('text-align','right').html('$'+_formatoNumerico($(this).text()))
                        break;
                }
            })
        })

    }, 1000);
}


function guardar(actualizar,id) {

    var data = _urlCrud((actualizar ? 'Actualizar' : 'Guardar'),controlador)+'&'+$('#formulario').serialize()+'&id='+id;

    _ajax(controlador,data,'mensajeGuardar','formulario',false);

    setTimeout(function(){ listado(); }, 1500);
}

function actualizacionRapidaPlanes(id,habilitar,e) {

    tecla = (document.all) ? e.keyCode : e.which;

    if (tecla == 13) {
        _guardarEdicionRapida(id,nombreTablaGeneral,controlador,'mensajeTabla');
    }

    if (habilitar) {
        _edicionRapida(id,nombreTablaGeneral,controlador);
    }
}

function eliminarPlanes(id,confirmacion){

    if (!confirmacion) {
        $('#modal-eliminar #siModalEliminar').attr('onClick','eliminar'+controlador+'('+id+',true)');
        $('#modal-eliminar').modal('show');
    }
    else {

        var data = _urlCrud('Eliminar',controlador)+'&id='+id;

        _ajax(controlador,data,'mensajeTabla');

        setTimeout(function(){ listado(); }, 1500);

        $('#bloqueDetalle').html('');
        $('#mensajeTablaDetalle').html('');
        $('#id_planes_caracteristicas').val('');
    }
}


// Desde aqui todo es manual
function detallePlanes(id) {

    $.ajax({
        url: controlador.toLowerCase(),
        type: 'post',
        data: 'id='+id+
        '&funcionesVariables=Detalle'+
        '&controlador='+controlador+
        '&carpetaControlador='+carpetaControlador,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        },
        dataType: 'json',
        beforeSend: function(){
            $('#bloqueDetalle').html('<center><img src="temas/' + $('#rutaImagen').val() + '/img/cargando.gif" width="50px"></center>');
        },
        success: function (json) {

            $('#id_planes_caracteristicas').val(id);

            if (json.length > 0) {

                var tabla = '<div class="col-lg-12"><div class="table-responsive"><table class="table table-bordered table-hover table-striped tablesorter"><thead><tr>';

                tabla += '<th>Título</th><th>Descripción</th><th>Opciones</th>';
                tabla += '</tr></thead><tbody>';


                $.each(json, function(ji, jItem) {
                    tabla += '<tr id="tabla_valores_'+jItem['id']+'">';

                    tabla += '<td class="editable titulo">'+jItem['titulo']+'</td>';
                    tabla += '<td class="editable descripcion">'+jItem['descripcion']+'</td>';

                    tabla +='<td>';
                    tabla +='<a onclick="actualizacionRapidaPlanesCaracteristicas('+jItem['id']+',true,event)" title="Rapida Edición" class="iconoActualizarRapido" style="display: none;"><i class="fa fa fa-pencil fa-2x" aria-hidden="true"></i></a>';
                    tabla +='&nbsp;<a onclick="eliminarDetalle('+jItem['id']+',false,'+id+')" title="Eliminar" class="iconoEliminar" style="display: none;"><i class="fa fa-trash fa-2x" aria-hidden="true"></i></a>';
                    tabla +='</td>';

                    tabla += '</tr>';
                });

                tabla += '</tbody>';
                tabla += '</table></div></div>';

                $('#bloqueDetalle').html(tabla);
            }
            else {
                _mensaje('advertencia','mensajeTablaDetalle','No se encontraron valores.');
                $('#bloqueDetalle').html('');
            }


            setTimeout(function(){ _verificarPermisos(); }, 500);
        },
        error: function(result) {
            _mensaje('error','mensajeTablaDetalle', 'Se encontraron errores al momento de procesar la solicitud');
        }
    });
}


function guardarPlanDetalle(actualizar,id) {

    var idPlanCaracteristicas = $('#id_planes_caracteristicas').val();

    if (!idPlanCaracteristicas) {
        _mensaje('advertencia','mensajeTablaDetalle','Debe seleccionar el detalle de un plan para continuar');
        return  false;
    }

    var data = _urlCrud((actualizar ? 'Actualizar' : 'Guardar'),'PlanesCaracteristicas')+'&'+$('#formularioDetalle').serialize()+'&id='+id;

    _ajax('PlanesCaracteristicas',data,'mensajeTablaDetalle','formulario',false);

    setTimeout(function(){ detallePlanes(idPlanCaracteristicas); }, 1500);

    $('#titulo').val('');
    $('#formularioDetalle #descripcion').val('');
}


function eliminarDetalle(id,confirmacion){

    if (!confirmacion) {
        $('#modal-eliminar #siModalEliminar').attr('onClick','eliminarDetalle('+id+',true)');
        $('#modal-eliminar').modal('show');
    }
    else {

        var data = _urlCrud('Eliminar','PlanesCaracteristicas')+'&id='+id;

        _ajax('PlanesCaracteristicas',data,'mensajeTablaDetalle');

        setTimeout(function(){ detallePlanes($('#id_planes_caracteristicas').val()); }, 1500);
    }
}


function actualizacionRapidaPlanesCaracteristicas(id,habilitar,e) {

    tecla = (document.all) ? e.keyCode : e.which;

    if (tecla == 13) {
        _guardarEdicionRapida(id,'tabla_valores','PlanesCaracteristicas','mensajeTablaDetalle');
    }

    if (habilitar) {
        _edicionRapida(id,'tabla_valores','PlanesCaracteristicas');
    }
}