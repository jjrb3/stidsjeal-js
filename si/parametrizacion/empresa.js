const carpetaControlador = 'Parametrizacion';

var controlador 		= 'Empresa';
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
	var opciones 	 	 = ['actualizacionRapida','identificacion', 'estado','eliminar','detalle'];
	var exportarImportar = [];
	var cabecera 	 	 = ['nombre_tema','nit','nombre_cabecera','nombre'];
	var edicion 	 	 = [false,true,true,true];
	var estados  	 	 = [];
	

	_ajaxTabla(controlador,enlace,'tabla',opciones,cabecera,edicion,estados,nombreTablaGeneral,paginacion,exportarImportar);
}

function llenarInputsGuardar() {

	_ajaxLlenarInputs('tema',_urlCrud('ConsultarTodo','Tema'),'id_tema','select','tema...');
	_ajaxLlenarInputs('pais',_urlCrud('ConsultarTodo','Pais'),'id_pais','select','país...');
}


function guardar(actualizar,id) {

	var data = _urlCrud((actualizar ? 'Actualizar' : 'Guardar'),controlador)+'&'+$('#formulario').serialize()+'&id='+id;	

	_ajax(controlador,data,'mensajeGuardar','formulario');

	setTimeout(function(){ listado(); }, 1500);
}

function actualizacionRapidaEmpresa(id,habilitar,e) {

	tecla = (document.all) ? e.keyCode : e.which;

	if (tecla == 13) {
		_guardarEdicionRapida(id,nombreTablaGeneral,controlador,'mensajeTabla');	
	}

	if (habilitar) {
		_edicionRapida(id,nombreTablaGeneral,controlador);		
	}
}


function actualizarEmpresa(id) {

	var data 	 = _urlCrud('ConsultarId',controlador)+'&id='+id;	
	var campos   = ['id_tema',
					'nit',
					'nombre_cabecera',
					'nombre'
					];

	_ajaxLlenarCamposActualizar(controlador,data,campos,'mensajeGuardar','formulario',id);
}


function estadoEmpresa(id,estado) {

	var data = _urlCrud('CambiarEstado',controlador)+'&estado='+estado+'&id='+id;	

	_ajax(controlador,data,'mensajeTabla');

	setTimeout(function(){ listado(); }, 1500);
}

function eliminarEmpresa(id,confirmacion){

	if (!confirmacion) {
		$('#modal-eliminar #siModalEliminar').attr('onClick','eliminarEmpresa('+id+',true)');
		$('#modal-eliminar').modal('show');
	}
	else {

		var data = _urlCrud('Eliminar',controlador)+'&id='+id;	

		_ajax(controlador,data,'mensajeTabla');

		setTimeout(function(){ listado(); }, 1500);
	}
}

// Desde aqui todo es manual
function detalleEmpresa(id) {

	$('#imagenLogo').slideDown(300);
	$('#sucursal').slideDown(300);
	$('#valores').slideDown(300);
	$('#correoSucursal').slideDown(300);


	// Obtenemos el detalle de la empresa
	$.ajax({
        url: 'empresa',
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
            $('#bloqueImagen').html('<center><img src="temas/' + $('#rutaImagen').val() + '/img/cargando.gif" width="50px"></center>');
        },
        success: function (json) {
        	$('#mensajeValores').html('');
        	$('#bloqueValores').html('');
        	$('#mensajeCorreos').html('');
        	$('#bloqueCorreos').html('');
        	$('#id-sucursal').html('');

        	document.getElementById("formularioSucursal").reset();

            $('#bloqueImagen').html('<center><img src="../../recursos/imagenes/empresa_logo/'+json.imagenLogo+'" width="300px"></center>');

            // Tabla de valores
            if (json.empresaValores.length > 0) {
	            var tabla = '<div class="col-lg-12"><div class="table-responsive"><table class="table table-bordered table-hover table-striped tablesorter"><thead><tr>';

	            tabla += '<th>Valores</th><th>Opciones</th>';
	            tabla += '</tr></thead><tbody>';

	            $.each(json.empresaValores, function(ji, jItem) {
	        		tabla += '<tr id="tabla_valores_'+jItem['id']+'">';
	        		
	        		tabla += '<td class="editable '+jItem['id']+'">'+jItem['nombre']+'</td>';
	        		tabla +='<td>';

	        		//tabla +='<a onclick="actualizacionRapidaValores('+jItem['id']+',true,event)" title="Rapida Edición" class="iconoActualizarRapido" style="display: inline-block;"><i class="fa fa fa-pencil fa-2x" aria-hidden="true"></i></a>';
	        		tabla +='&nbsp;<a onclick="eliminarValores('+jItem['id']+',false)" title="Eliminar" class="iconoEliminar" style="display: none;"><i class="fa fa-trash fa-2x" aria-hidden="true"></i></a>';

	        		tabla +='</td>';
	        		tabla += '</tr>';
	        	});

	            tabla += '</tbody>';
	    		tabla += '</table></div></div>';

	    		$('#bloqueValores').html(tabla);
	    	} else {
	    		_mensaje('advertencia','mensajeValores','No se encontraron valores.')
	    	}
    		// Fin tabla de valores

    		// Tabla de correos de la sucursal
    		if (json.sucursalCorreo.length > 0) {
	            var tabla = '<div class="col-lg-12"><div class="table-responsive"><table class="table table-bordered table-hover table-striped tablesorter"><thead><tr>';

	            tabla += '<th>Correos</th><th>Opciones</th>';
	            tabla += '</tr></thead><tbody>';

	            $.each(json.sucursalCorreo, function(ji, jItem) {
	        		tabla += '<tr id="tabla_correos_'+jItem['id']+'">';
	        		
	        		tabla += '<td class="editable '+jItem['id']+'">'+jItem['correo']+'</td>';
	        		tabla +='<td>';

	        		//tabla +='<a onclick="actualizacionRapidaCorreos('+jItem['id']+',true,event)" title="Rapida Edición" class="iconoActualizarRapido" style="display: inline-block;"><i class="fa fa fa-pencil fa-2x" aria-hidden="true"></i></a>';
	        		tabla +='&nbsp;<a onclick="eliminarCorreo('+jItem['id']+',false)" title="Eliminar" class="iconoEliminar" style="display: none;"><i class="fa fa-trash fa-2x" aria-hidden="true"></i></a>';

	        		tabla +='</td>';
	        		tabla += '</tr>';
	        	});

	            tabla += '</tbody>';
	    		tabla += '</table></div></div>';

	    		$('#bloqueCorreos').html(tabla);
	    	} else {
                _mensaje('advertencia','mensajeCorreos','No se encontraron correos.')
	    	}
    		// Fin tabla de correos de la sucursal

    		$('#botonActualizarSucursal').attr('onClick','guardarSucursal(true,'+id+')');
    		$('#botonActualizarImagen').attr('onClick','actualizarImagen('+id+')');
    		$('#idActualizar').val(id);

    		
    		// Llena el bloque de sucursales
    		if (json.sucursal.id > 0) {
    			
    			$('#sucursal_codigo').val(json.sucursal.codigo);
    			$('#sucursal_nombre').val(json.sucursal.nombre);
    			$('#telefono').val(json.sucursal.telefono);
    			$('#direccion').val(json.sucursal.direccion);
    			$('#quienes_somos').val(json.sucursal.quienes_somos);
    			$('#que_hacemos').val(json.sucursal.que_hacemos);
    			$('#mision').val(json.sucursal.mision);
    			$('#vision').val(json.sucursal.vision);

    			$('#id_municipio').append('<option value="'+json.sucursal.id_municipio+'">'+json.sucursal.municipio_nombre+'</option>').val(json.sucursal.id_municipio);

    			$('#id-sucursal').val(json.sucursal.id);
    		}

    		setTimeout(function(){ _verificarPermisos(); }, 500);
        },
        error: function(result) {
            _mensaje('error','bloqueImagen', 'Se encontraron errores al momento de procesar la solicitud');
        }
    });
}

function actualizarImagen(id) {

	var formData = new FormData($("#imagen")[0]);

	// Obtenemos el detalle de la empresa
	$.ajax({
        url: 'empresa?id='+id+'&'+
        	  _urlCrud('ActualizarImagen','Empresa'),
        type: 'post',
        data: formData,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        },
        cache: false,
        contentType: false,
        processData: false,
        beforeSend: function(){
            $('#bloqueImagen').html('<center><img src="temas/' + $('#rutaImagen').val() + '/img/cargando.gif" width="50px"></center>');
        },
        success: function (resultado) {

            if (resultado == 1) {
            	_mensaje('realizado','mensajeImagen', 'Se actualizó la imagen correctamente');
            	detalleEmpresa(id);
            }
            else {
            	_mensaje('advertencia','mensajeImagen', 'Se encontraron problemas al momento de subir la imagen, intente mas tarde.');
            }
        },
        error: function(result) {
            _mensaje('error','mensajeImagen', 'Se encontraron errores al momento de procesar la solicitud');
        }
    });
}


function guardarSucursal(actualizar,id) {

	var data = _urlCrud((actualizar ? 'Actualizar' : 'Guardar'),'Sucursal')+'&'+$('#formularioSucursal').serialize()+'&id_empresa='+id;	

	_ajax('Sucursal',data,'mensajeSucursal','');
}


function enterValores(e) {
	tecla = (document.all) ? e.keyCode : e.which;
	if (tecla==13) guardarValores();
}

function enterCorreo(e) {
	tecla = (document.all) ? e.keyCode : e.which;
	if (tecla==13) guardarCorreo();
}


function guardarValores() {

	var data = _urlCrud('Guardar','EmpresaValores')+'&nombre='+$('#formulario-valores').val()+'&id_empresa='+$('#idActualizar').val();	

	_ajax('EmpresaValores',data,'mensajeValores');

	_limpiarFormulario(['formulario-valores']);

	setTimeout(function(){ detalleEmpresa($('#idActualizar').val()); }, 1000);
}


function guardarCorreo() {

	var data = _urlCrud('Guardar','SucursalCorreo')+'&correo='+$('#formulario-correo').val()+'&id_sucursal='+$('#id-sucursal').val();	

	_ajax('SucursalCorreo',data,'mensajeCorreos');

	_limpiarFormulario(['formulario-correo']);

	setTimeout(function(){ detalleEmpresa($('#idActualizar').val()); }, 1000);
}


function eliminarValores(id,confirmacion){

	if (!confirmacion) {
		$('#modal-eliminar #siModalEliminar').attr('onClick','eliminarValores('+id+',true)');
		$('#modal-eliminar').modal('show');
	}
	else {

		var data = _urlCrud('Eliminar','EmpresaValores')+'&id='+id;	

		_ajax('EmpresaValores',data,'mensajeValores');

		setTimeout(function(){ detalleEmpresa($('#idActualizar').val()); }, 1000);
	}
}

function eliminarCorreo(id,confirmacion){

	if (!confirmacion) {
		$('#modal-eliminar #siModalEliminar').attr('onClick','eliminarCorreo('+id+',true)');
		$('#modal-eliminar').modal('show');
	}
	else {

		var data = _urlCrud('Eliminar','SucursalCorreo')+'&id='+id;	

		_ajax('SucursalCorreo',data,'mensajeCorreos');

		setTimeout(function(){ detalleEmpresa($('#idActualizar').val()); }, 1000);
	}
}