const carpetaControlador = 'Parametrizacion';

var controlador 		= 'Rol';
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
	var opciones 	 	 = ['actualizacionRapida', 'estado', 'eliminar'];
	var exportarImportar = [];
	var cabecera 	  	 = ['nombre', 'estado'];
	var edicion 	  	 = [true, true];
	var estados  	  	 = ['<span class="label label-default ">INACTIVO</span>','<span class="label label-primary ">ACTIVO</span>'];
	
	
	_ajaxTabla(controlador,enlace,'tabla',opciones,cabecera,edicion,estados,nombreTablaGeneral,paginacion,exportarImportar);
}


function guardar() {

	var data = _urlCrud('Guardar',controlador)+'&nombre='+$('#nombre').val();	

	_ajax(controlador,data,'mensaje');

	_limpiarFormulario(['nombre']);

	setTimeout(function(){ listado(); }, 1500);
}


function estadoRol(id,estado) {

	var data = _urlCrud('CambiarEstado',controlador)+'&estado='+estado+'&id='+id;	

	_ajax(controlador,data,'mensaje');

	setTimeout(function(){ listado(); }, 1500);
}


function eliminarRol(id,confirmacion){

	if (!confirmacion) {
		$('#modal-eliminar #siModalEliminar').attr('onClick','eliminarRol('+id+',true)');
		$('#modal-eliminar').modal('show');
	}
	else {

		var data = _urlCrud('Eliminar',controlador)+'&id='+id;	

		_ajax(controlador,data,'mensaje');

		setTimeout(function(){ listado(); }, 1500);
	}
}


function actualizacionRapidaRol(id,habilitar,e) {

	tecla = (document.all) ? e.keyCode : e.which;

	if (tecla==13) {
		_guardarEdicionRapida(id,nombreTablaGeneral,controlador,'mensaje');	
	}

	if (habilitar) {
		_edicionRapida(id,nombreTablaGeneral,controlador);		
	}

}


function enterRol(e) {
  tecla = (document.all) ? e.keyCode : e.which;
  if (tecla==13) guardar();
}