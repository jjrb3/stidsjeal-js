
const carpetaControlador  = 'PaginaPublica';

var controlador 		= 'NivelConocimiento';
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
    var opciones 	 	 = ['eliminar'];
    var exportarImportar = [];
    var cabecera 	  	 = ['nombre', 'color','porcentaje'];
    var edicion 	  	 = [];
    var estados  	  	 = [];


    _ajaxTabla(controlador,enlace,'tabla',opciones,cabecera,edicion,estados,nombreTablaGeneral,paginacion,exportarImportar);

    setTimeout(function(){
        $(".table tbody tr").each(function (index) {
            var campo1, campo2, campo3;
            $(this).children("td").each(function (index2)
            {
                switch (index2)
                {
                    case 1:
                        $(this).html('<input type="color" value="'+$(this).text()+'" class="form-control" disabled>');
                        break;
                    case 2: campo3 = $(this).text();
                        $(this).css('text-align','center').html($(this).text()+'%')
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