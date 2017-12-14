
const carpetaControlador  = 'Parametrizacion';

var controlador 		= 'Modulo';
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



    var enlace 	 	 	 = _urlCrud('Consultar'+$('#tipo-modulo').val(),controlador)+'&buscador='+buscador;
    var paginacion   	 = ['&pagina='+pagina+'&tamanhioPagina='+tamanhio, 'listado', 'paginacion',tamanhio];
    var opciones 	 	 = ['actualizacionRapida','estado','actualizar','eliminar','mover','detalle'];
    var exportarImportar = [];
    var cabecera 	  	 = ['nombre','descripcion','enlace_'+$('#tipo-modulo').val().toLowerCase(),'es_nuevo','estado'];
    var edicion 	  	 = [];
    var estados  	  	 = ['<span class="label label-default ">INACTIVO</span>','<span class="label label-primary ">ACTIVO</span>'];


    _ajaxTabla(controlador,enlace,'tabla',opciones,cabecera,edicion,estados,nombreTablaGeneral,paginacion,exportarImportar);

    setTimeout(function(){
        $(".table tbody tr").each(function (index) {
            var campo1, campo2, campo3;
            $(this).children("td").each(function (index2)
            {
                switch (index2)
                {
                    case 1:
                        $(this).text() == 'null' ? $(this).html('') : ''
                        break;

                    case 2:
                        $(this).text() == 'null' ? $(this).html('') : ''
                        break;

                    case 3:
                        $(this).html($(this).text() == 1 ? 'Sí' : 'No')
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


function eliminarNivelConocimiento(id,confirmacion){

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