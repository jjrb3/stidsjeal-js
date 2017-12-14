
const carpetaControlador  = 'PaginaPublica';

var controlador 		= 'ImagenPlataforma';
var nombreTablaGeneral 	= 'tabla'+controlador;
var tipo_imagen         = 4;

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
    if (!tamanhio) {tamanhio = 4;}
    if (!buscador) {buscador = '';}

    var enlace 	 	= _urlCrud('Consultar',controlador)+'&id_tipo_imagen='+tipo_imagen+'&buscador='+buscador;
    var paginacion  = ['&pagina='+pagina+'&tamanhioPagina='+tamanhio, 'listado', 'paginacion',tamanhio];
    var opciones 	= ['actualizar','eliminar'];
    var informacion = ['titulo','descripcion','nombre_boton','enclave'];
    var ruta        = 'imagenes/clientes/';

    _ajaxBloques(controlador,enlace,'bloque',opciones,informacion,paginacion,ruta,3);
}


function guardar(actualizar,id) {

    var formData = new FormData($("#formulario")[0]);

    var data = controlador.toLowerCase() + '?' +_urlCrud((actualizar ? 'Actualizar' : 'Guardar'),controlador)+'&id='+id+'&id_tipo_imagen='+tipo_imagen;

    _ajaxObject(data,formData,'mensajeGuardar','formulario');

    setTimeout(function(){ listado(); }, 2000);
}


function actualizarImagenPlataforma(id) {

    var data 	 = _urlCrud('ConsultarId',controlador)+'&id='+id;
    var campos   = ['titulo',
        'descripcion',
        'nombre_boton',
        'enlace',
        'posicion_horizontal',
        'posicion_vertical'
    ];

    _ajaxLlenarCamposActualizar(controlador,data,campos,'mensajeGuardar','formulario',id,true);

    $('#imagen').slideUp(300);
}


function eliminarImagenPlataforma(id,confirmacion){

    if (!confirmacion) {
        $('#modal-eliminar #siModalEliminar').attr('onClick','eliminarImagenPlataforma('+id+',true)');
        $('#modal-eliminar').modal('show');
    }
    else {

        var data = _urlCrud('Eliminar',controlador)+'&id='+id+'&id_tipo_imagen='+tipo_imagen;

        _ajax(controlador,data,'mensajeBloque');

        setTimeout(function(){ listado(); }, 1500);
    }
}

$('#botonCancelar').click(function(){
    $('#imagen').slideDown(300)
});

$('#botonActualizar').click(function(){
    $('#imagen').slideDown(300)
});