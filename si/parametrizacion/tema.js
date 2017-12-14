const carpetaControlador = 'Parametrizacion';

var controlador 		= 'Tema';
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
	var opciones 	 	 = ['actualizacionRapida' ,'identificacion', 'eliminar','detalle'];
	var exportarImportar = [];
	var cabecera 	 	 = ['nombre','nombre_usuario','nombre_administrador','nombre_logueo'];
	var edicion 	 	 = [true,true,true,true];
	var estados  	 	 = [];
	

	_ajaxTabla(controlador,enlace,'tabla',opciones,cabecera,edicion,estados,nombreTablaGeneral,paginacion,exportarImportar);
}


function guardar(actualizar,id) {

	var data = _urlCrud((actualizar ? 'Actualizar' : 'Guardar'),controlador)+'&'+$('#formulario').serialize()+'&id='+id;	

	_ajax(controlador,data,'mensajeGuardar','formulario');

	setTimeout(function(){ listado(); }, 1500);
}

function actualizacionRapidaTema(id,habilitar,e) {

	tecla = (document.all) ? e.keyCode : e.which;

	if (tecla == 13) {
		_guardarEdicionRapida(id,nombreTablaGeneral,controlador,'mensajeTabla');	
	}

	if (habilitar) {
		_edicionRapida(id,nombreTablaGeneral,controlador);		
	}
}

function estadoTema(id,estado) {

	var data = _urlCrud('CambiarEstado',controlador)+'&estado='+estado+'&id='+id;	

	_ajax(controlador,data,'mensajeTabla');

	setTimeout(function(){ listado(); }, 1500);
}

function eliminarTema(id,confirmacion){

	if (!confirmacion) {
		$('#modal-eliminar #siModalEliminar').attr('onClick','eliminarTema('+id+',true)');
		$('#modal-eliminar').modal('show');
	}
	else {

		var data = _urlCrud('Eliminar',controlador)+'&id='+id;	

		_ajax(controlador,data,'mensajeTabla');

		setTimeout(function(){ listado(); }, 1500);
	}
}

function detalleTema(id) {

	var nombre = $('#'+nombreTablaGeneral+'_'+id+' .nombre').html();

	$('#urlImagenTema').attr('src','../../temas/'+nombre+'/presentacion.png');
	$('#modal-imagen').modal('show');
}