const carpetaControlador = 'Parametrizacion';

var controlador 		= 'Pais';
var nombreTablaGeneral 	= 'tabla'+controlador;


function ejecutarBuscador(pagina,tamanhio,buscador,funcion) {

	switch(funcion) 
    {
        case 'listado':
            listado(pagina,tamanhio,buscador);
        break;

        case 'listadoDepartamento':
        	listadoDepartamento(pagina,tamanhio,buscador,$('#id_pais').val());
        break;

        case 'listadoMunicipio':
        	listadoMunicipio(pagina,tamanhio,buscador,$('#id_departamento').val());
        break;
    }
}


function listado(pagina,tamanhio,buscador) {

	if (!pagina) {pagina = 1;}
	if (!tamanhio) {tamanhio = 10;}
	if (!buscador) {buscador = '';}
	
	var enlace 	 	 	 = _urlCrud('Consultar',controlador)+'&buscador='+buscador;	
	var paginacion   	 = ['&pagina='+pagina+'&tamanhioPagina='+tamanhio, 'listado', 'paginacionPais',tamanhio];
	var opciones 	 	 = ['actualizacionRapida', 'eliminar','detalle'];
	var exportarImportar = [];
	var cabecera 	  	 = ['nombre'];
	var edicion 	  	 = [true, true];
	var estados  	  	 = ['<span class="label label-default ">INACTIVO</span>','<span class="label label-primary ">ACTIVO</span>'];
	
	
	_ajaxTabla(controlador,enlace,'tablaPais',opciones,cabecera,edicion,estados,nombreTablaGeneral,paginacion,exportarImportar);
}


function guardarPais() {

	var data = _urlCrud('Guardar',controlador)+'&nombre='+$('#nombre').val();	

	_ajax(controlador,data,'mensaje');

	_limpiarFormulario(['nombre']);

	setTimeout(function(){ listado(); }, 1000);
}


function estadoPais(id,estado) {

	var data = _urlCrud('CambiarEstado',controlador)+'&estado='+estado+'&id='+id;	

	_ajax(controlador,data,'mensaje');

	setTimeout(function(){ listado(); }, 1500);
}


function eliminarPais(id,confirmacion){

	if (!confirmacion) {
		$('#modal-eliminar #siModalEliminar').attr('onClick','eliminarPais('+id+',true)');
		$('#modal-eliminar').modal('show');
	}
	else {

		var data = _urlCrud('Eliminar',controlador)+'&id='+id;	

		_ajax(controlador,data,'mensaje');

		setTimeout(function(){ listado(); }, 1500);
	}
}


function actualizacionRapidaPais(id,habilitar,e) {

	tecla = (document.all) ? e.keyCode : e.which;

	if (tecla==13) {
		_guardarEdicionRapida(id,nombreTablaGeneral,controlador,'mensaje');	
	}

	if (habilitar) {
		_edicionRapida(id,nombreTablaGeneral,controlador);		
	}
}


function enterPais(e) {
  tecla = (document.all) ? e.keyCode : e.which;
  if (tecla==13) guardarPais();
}


function detallePais(id) {
	listadoDepartamento('','','',id)
}

// Detalle de Departamento

function listadoDepartamento(pagina,tamanhio,buscador,id) {

	if (!pagina) {pagina = 1;}
	if (!tamanhio) {tamanhio = 10;}
	if (!buscador) {buscador = '';}
	if (!id) {id = $('#id_pais').val()}

	var enlace 	 	 	 = _urlCrud('Consultar','Departamento')+'&buscador='+buscador+'&id_pais='+id;	
	var paginacion   	 = ['&pagina='+pagina+'&tamanhioPagina='+tamanhio, 'listadoDepartamento', 'paginacionDepartamento',tamanhio];
	var opciones 	 	 = ['actualizacionRapida', 'eliminar','detalle'];
	var exportarImportar = [];
	var cabecera 	  	 = ['nombre'];
	var edicion 	  	 = [true, true];
	var estados  	  	 = ['<span class="label label-default ">INACTIVO</span>','<span class="label label-primary ">ACTIVO</span>'];
	
	
	_ajaxTabla('Departamento',enlace,'tablaDepartamento',opciones,cabecera,edicion,estados,'tablaDepartamento',paginacion,exportarImportar);

	$('#id_pais').val(id);
}

function enterDepartamento(e) {
  tecla = (document.all) ? e.keyCode : e.which;
  if (tecla==13) guardarDepartamento();
}


function guardarDepartamento() {

	var id = $('#id_pais').val();

	if (id) {

		var data = _urlCrud('Guardar','Departamento')+'&nombre='+$('#nombreDepartamento').val()+'&id_pais='+id;	

		_ajax('Departamento',data,'mensajeDepartamento');

		_limpiarFormulario(['nombreDepartamento']);

		setTimeout(function(){ listadoDepartamento('','','',id); }, 1500);
	}
	else {
		mensajeAdvertencia('mensajeDepartamento','Seleccione un País para continuar');
	}
}


function actualizacionRapidaDepartamento(id,habilitar,e) {

	tecla = (document.all) ? e.keyCode : e.which;

	if (tecla==13) {
		_guardarEdicionRapida(id,'tablaDepartamento','Departamento','mensajeDepartamento');	
	}

	if (habilitar) {
		_edicionRapida(id,'tablaDepartamento','Departamento');		
	}
}


function eliminarDepartamento(id,confirmacion){

	if (!confirmacion) {
		$('#modal-eliminar #siModalEliminar').attr('onClick','eliminarDepartamento('+id+',true)');
		$('#modal-eliminar').modal('show');
	}
	else {

		var data = _urlCrud('Eliminar','Departamento')+'&id='+id;	

		_ajax('Departamento',data,'mensajeDepartamento');

		setTimeout(function(){ listadoDepartamento('','','',$('#id_pais').val()); }, 1500);
	}
}


function detalleDepartamento(id) {
	listadoMunicipio('','','',id)
}


// Detalle de Municipio

function listadoMunicipio(pagina,tamanhio,buscador,id) {

	if (!pagina) {pagina = 1;}
	if (!tamanhio) {tamanhio = 10;}
	if (!buscador) {buscador = '';}
	if (!id) {id = $('#id_departamento').val()}

	var enlace 	 	 	 = _urlCrud('Consultar','Municipio')+'&buscador='+buscador+'&id_departamento='+id;	
	var paginacion   	 = ['&pagina='+pagina+'&tamanhioPagina='+tamanhio, 'listadoMunicipio', 'paginacionMunicipio',tamanhio];
	var opciones 	 	 = ['actualizacionRapida', 'eliminar'];
	var exportarImportar = [];
	var cabecera 	  	 = ['nombre'];
	var edicion 	  	 = [true, true];
	var estados  	  	 = ['<span class="label label-default ">INACTIVO</span>','<span class="label label-primary ">ACTIVO</span>'];
	
	
	_ajaxTabla('Municipio',enlace,'tablaMunicipio',opciones,cabecera,edicion,estados,'tablaMunicipio',paginacion,exportarImportar);

	$('#id_departamento').val(id);
}

function enterMunicipio(e) {
  tecla = (document.all) ? e.keyCode : e.which;
  if (tecla==13) guardarMunicipio();
}


function guardarMunicipio() {

	var id = $('#id_departamento').val();

	if (id && id != 'undefined') {

		var data = _urlCrud('Guardar','Municipio')+'&nombre='+$('#nombreMunicipio').val()+'&id_departamento='+id;	

		_ajax('Municipio',data,'mensajeMunicipio');

		_limpiarFormulario(['nombreMunicipio']);

		setTimeout(function(){ listadoMunicipio('','','',id); }, 1500);
	}
	else {
		mensajeAdvertencia('mensajeMunicipio','Seleccione un Departamento para continuar');
	}
}


function actualizacionRapidaMunicipio(id,habilitar,e) {

	tecla = (document.all) ? e.keyCode : e.which;

	if (tecla==13) {
		_guardarEdicionRapida(id,'tablaMunicipio','Municipio','mensajeMunicipio');	
	}

	if (habilitar) {
		_edicionRapida(id,'tablaMunicipio','Municipio');		
	}
}


function eliminarMunicipio(id,confirmacion){

	if (!confirmacion) {
		$('#modal-eliminar #siModalEliminar').attr('onClick','eliminarMunicipio('+id+',true)');
		$('#modal-eliminar').modal('show');
	}
	else {

		var data = _urlCrud('Eliminar','Municipio')+'&id='+id;	

		_ajax('Municipio',data,'mensajeMunicipio');

		setTimeout(function(){ listadoMunicipio('','','',$('#id_departamento').val()); }, 1500);
	}
}