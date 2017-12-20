
Api.Identificacion = {
    uri: null,
    carpeta: 'Parametrizacion',
    controlador: 'Rol',
    nombreTabla: 'tabla',

    $ajaxC: Api.Ajax.constructor,
    $ajaxT: Api.Ajax.ajaxTabla,
    $ajaxS: Api.Ajax.ajaxSimple,
    $mensajeP: Api.Mensaje.publicar,
    $uriCrudObjecto: Api.Uri.crudObjecto,
    $funcionalidadesT: Api.Elementos.funcionalidadesTabla(),

    _Consultar: null,
    _Guardar: null,
    _Actualizar: null,
    _CambiarEstado: null,
    _Eliminar: null,

    constructor: function(idRetorno, permisoGrafica) {
        this._Consultar	    = this.$uriCrudObjecto('Consultar',this.controlador,this.carpeta);
        this._Guardar	    = this.$uriCrudObjecto('Guardar',this.controlador,this.carpeta);
        this._Actualizar    = this.$uriCrudObjecto('Actualizar',this.controlador,this.carpeta);
        this._CambiarEstado = this.$uriCrudObjecto('CambiarEstado',this.controlador,this.carpeta);
        this._Eliminar      = this.$uriCrudObjecto('Eliminar',this.controlador,this.carpeta);

        str         	= this.controlador;
        this.uri    	= str.toLowerCase();
        this.idRetorno  = idRetorno;

        this.tabla();
    },

    guardarActualizar: function(evento) {

        if (Api.Herramientas.presionarEnter(evento)) {

            var id          = $('#id').val().trim();
            var parametros  = '';

            id ? parametros = this.verificarFormulario(this._Actualizar) : parametros = this.verificarFormulario(this._Guardar);

            if (parametros) {

                this.$ajaxS(
                    this.idRetorno,
                    this.uri,
                    parametros,

                    function (json) {

                        Api.Mensaje.json(json,'mensaje');

                        if (json.resultado === 1) {
                            Api.Identificacion.tabla();
                            $('#nombre').val('');

                            if (id) {
                                $('#id').val('');
                            }
                        }
                    }
                );
            }
        }
    },

    editar: function(id,objeto) {

        $('#id').val(id);
        $('#nombre').val(objeto.nombre).focus();
    },

    cambiarEstado: function(id) {

        this._CambiarEstado['id'] = id;

        this.$ajaxS(
            '',
            this.uri,
            this._CambiarEstado,

            function (json) {

                Api.Identificacion.tabla();
            }
        );
    },

    eliminar: function(id) {

        this._Eliminar['id'] = id;

        swal({
            title: "¿Seguro que desea eliminarlo?",
            text: "Después de eliminarlo no podrás recuperar esta información ni revertir los cambios!",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Sí, deseo eliminarlo",
            cancelButtonText: "Cancelar",
            closeOnConfirm: false,
        }, function () {

            Api.Ajax.ajaxSimple(
                '',
                Api.Identificacion.uri,
                Api.Identificacion._Eliminar,

                function (json) {

                    if (json.resultado === 1) {

                        swal("Eliminado!", json.mensaje, "success");
                        Api.Identificacion.tabla();
                    }
                    else {
                        swal("Error", json.mensaje , "error");
                    }
                }
            );
        });
    },

    verificarFormulario: function(parametros) {

        parametros['nombre'] = $('#nombre').val().trim();
        parametros['id']     = $('#id').val().trim();

        if (!parametros['nombre']) {
            this.$mensajeP('advertencia','mensaje','Debe digitar un nombre para continuar');
            return false;
        }

        return parametros;
    },

    tabla: function(pagina,tamanhio) {

        this.$ajaxC(this.nombreTabla,pagina,tamanhio);

        this.$ajaxT(
            this.nombreTabla,
            this.uri,
            this._Consultar,
            {
                objecto: 'Identificacion',
                metodo: 'tabla',
                funcionalidades: this.$funcionalidadesT,
                opciones: this.opciones(),
                checkbox: false,
                columnas: [
                    {nombre: 'nombre',  edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'estado',  edicion: false,	formato: '', alineacion:'centrado'}
                ]
            }
        );
    },

    opciones: function() {
        return {
            parametrizacion: [
                {
                    nombre: 'Actualizar',
                    icono: 'fa-pencil-square-o',
                    accion: 'Api.Identificacion.editar',
                    color: '#1a7bb9',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: true
                },
                {
                    accion: 'Api.Identificacion.cambiarEstado',
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
                    accion: 'Api.Identificacion.eliminar',
                    color: '#ec4758',
                    estado: false,
                    permiso: 'eliminar',
                    informacion: false
                }
            ]
        };
    }
};

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