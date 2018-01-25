
Api.Usuario = {
    ie: null,
    id: null,
    uri: null,
    carpeta: 'Parametrizacion',
    controlador: 'Usuario',
	nombreTabla: 'tabla-usuario',
	idRetorno: null,

    $ajaxC: Api.Ajax.constructor,
    $ajaxT: Api.Ajax.ajaxTabla,
    $ajaxS: Api.Ajax.ajaxSimple,
    $uriCrudObjecto: Api.Uri.crudObjecto,
    $opcionesT: Api.Elementos.opcionesTabla('Usuario'),
	$funcionalidadesT: Api.Elementos.funcionalidadesTabla(),
    $permisosG: Api.Graficas.permisos,

	_Consultar: null,
    _ConsultarDetalle: null,
    _InicializarFormulario: null,
    _Crear: null,
    _Actualizar: null,
    _CambiarEstado: null,
    _Eliminar: null,

    constructor: function(idRetorno,permisoGrafica) {
		this._Consultar			    = this.$uriCrudObjecto('Consultar',this.controlador,this.carpeta);
        this._ConsultarDetalle	    = this.$uriCrudObjecto('ConsultarDetalle',this.controlador,this.carpeta);
        this._InicializarFormulario	= this.$uriCrudObjecto('InicializarFormulario',this.controlador,this.carpeta);
        this._Crear	                = this.$uriCrudObjecto('Crear',this.controlador,this.carpeta);
        this._Actualizar	        = this.$uriCrudObjecto('Actualizar',this.controlador,this.carpeta);
        this._CambiarEstado         = this.$uriCrudObjecto('CambiarEstado',this.controlador,this.carpeta);
        this._Eliminar              = this.$uriCrudObjecto('Eliminar',this.controlador,this.carpeta);

        this.$permisosG             = permisoGrafica ? permisoGrafica : this.$permisosG;

        str             		    = this.controlador;
        this.uri        		    = str.toLowerCase();
        this.idRetorno              = idRetorno;

        this.tabla();
        this.inicializarFormulario();

        // Graficas
        if (this.$permisosG.length > 0) {
            this.$permisosG.indexOf(1) > -1 ? Api.Graficas.Parametrizacion.transacciones() : null;
            this.$permisosG.indexOf(2) > -1 ? Api.Graficas.Parametrizacion.total() : null;
        }
    },

	tabla: function(pagina,tamanhio) {

	    this.$ajaxC(this.nombreTabla,pagina,tamanhio);

	    this._Consultar['id_empresa'] = this.ie;

		this.$ajaxT(
			this.nombreTabla,
			this.uri,
            this._Consultar,
            {
            	objecto: 'Usuario',
                metodo: 'tabla',
                funcionalidades: this.$funcionalidadesT,
				opciones: this.$opcionesT,
                checkbox: false,
                columnas: [
                    {nombre: 'identificacion',  edicion: false,	formato: '',         alineacion:'centrado'},
                    {nombre: 'documento',       edicion: true,	formato: 'numerico', alineacion:'centrado'},
                    {nombre: 'nombres',         edicion: true,	formato: '',         alineacion:'izquierda'},
                    {nombre: 'apellidos',       edicion: true,	formato: '',         alineacion:'izquierda'},
                    {nombre: 'rol',             edicion: false,	formato: '',         alineacion:'centrado'},
                    {nombre: 'correo',          edicion: true,	formato: '',         alineacion:'izquierda'},
                    {nombre: 'estado',          edicion: false,	formato: '',         alineacion:'centrado'}
                ],
                automatico: false
            }
		);
	},

	detalle: function(id) {

    	Api.Herramientas.cambiarPestanhia('pestanhia-usuario','detalle');

    	this._ConsultarDetalle['id'] = id;

        this.$ajaxS(
            '',
            this.uri,
            this._ConsultarDetalle,

            function (json) {

                if (json.resultado === 1) {

                    var contenedor  = '#pestanhia-usuario #detalle ';
                    var AE          = Api.Elementos;
                    var dashboard   = json.usuario.id_tipo_dashboard_usuario;


                    $(contenedor + '#info-empresa').html(json.usuario.empresa);
                    $(contenedor + '#info-usuario').html(json.usuario.usuario);
                    $(contenedor + '#info-tipo-identificacion').html(json.usuario.tipo_identificacion);
                    $(contenedor + '#info-documento').html(json.usuario.no_documento);
                    $(contenedor + '#info-nombres').html(json.usuario.nombres);
                    $(contenedor + '#info-apellidos').html(json.usuario.apellidos);
                    $(contenedor + '#info-email').html(json.usuario.correo);
                    $(contenedor + '#info-rol').html(json.usuario.rol);
                    $(contenedor + '#info-localizacion').html(json.usuario.ciudad);
                    $(contenedor + '#info-sexo').html(json.usuario.id_sexo === 1 ? 'Masculino' : 'Femenino');
                    $(contenedor + '#info-localizacion').html(json.usuario.ciudad);
                    $(contenedor + '#info-telefono').html(json.usuario.telefono);
                    $(contenedor + '#info-celular').html(json.usuario.celular);
                    $(contenedor + '#info-estado').html(json.usuario.estado === 1 ? AE.botonActivo : AE.botonInactivo);

                    $(contenedor + '#info-logo').attr('src', $('#ruta').val() + 'recursos/imagenes/empresa_logo/' + json.empresa.imagen_logo);

                    $(contenedor + '#info-dashboard a').removeClass('active');

                    if (dashboard === 1) {
                        $(contenedor + '#info-modulo').addClass('active');
                    }
                    else if (dashboard === 2) {
                        $(contenedor + '#info-grafica').addClass('active');
                    }

                    if (Object.keys(json.modulos).length > 0) {

                        $('#info-modulos-habilitados').html('');

                        $.each(json.modulos, function(k, i) {

                            $('#info-modulos-habilitados').append('<div class="pad2"><button class="btn btn-white"><i class="fa ' + i.icono + ' azul"></i>&nbsp;' + i.nombre + '</button></div>');

                            if (Object.keys(i.sesiones).length > 0) {

                                $.each(i.sesiones, function(ks, is) {
                                    $('#info-modulos-habilitados').append('<div class="pad-btn"><button class="btn btn-white"><i class="fa ' + is.icono + ' azul-claro"></i>&nbsp;' + is.nombre + '</button></div>');
                                });
                            }
                        });
                    }
                    else {
                        Api.Mensaje.publicar('informacion','#info-modulos-habilitados','No tiene módulos habilitados.')
                    }

                    Api.Herramientas.cambiarPestanhia('pestanhia-usuario','detalle');
                }
            }
        );
	},

    crear: function() {

        var parametros = this.verificarFormulario('crear',this._Crear);

        if (parametros) {
            this.$ajaxS(
                this.idRetorno,
                this.uri,
                parametros,

                function (json) {

                    Api.Mensaje.json(json,Api.Usuario.idRetorno);

                    if (json.resultado === 1) {

                        var AU = Api.Usuario;
                        var id = $('#crear-editar #id').val();

                        AU.constructor('crear-editar #mensaje-crear-editar');
                        Api.Herramientas.cancelarCA('usuario');

                        setTimeout(function(){
                            AU.detalle(json.id);
                        }, 2000);

                    }
                }
            );
        }
    },

    actualizar: function() {

        var parametros = this.verificarFormulario('actualizar',this._Actualizar);

        if (parametros) {
            this.$ajaxS(
                this.idRetorno,
                this.uri,
                parametros,

                function (json) {

                    Api.Mensaje.jsonSuperior(json);

                    if (json.resultado === 1) {

                        var AU = Api.Usuario;

                        AU.constructor('crear-editar #mensaje-crear-editar');
                        Api.Herramientas.cancelarCA('usuario');

                        setTimeout(function(){
                            AU.detalle(AU.id);
                        }, 2000);
                    }
                }
            );
        }
    },

    editar: function(id) {

        this.id = this._ConsultarDetalle['id'] = id;

        this.$ajaxS(
            '',
            this.uri,
            this._ConsultarDetalle,

            function (json) {

                if (json.resultado === 1) {

                    var AH = Api.Herramientas;

                    AH.selectDefault('tipo-identificacion',json.usuario.id_tipo_identificacion);
                    AH.selectDefault('#id-rol-usuario',json.usuario.id_rol);
                    AH.selectDefault('sexo',json.usuario.id_sexo);

                    $('#id').val(id);
                    $('#no-documento').val(json.usuario.no_documento);
                    $('#usuario').val(json.usuario.usuario);
                    $('#clave').val('');
                    $('#nombres').val(json.usuario.nombres);
                    $('#apellidos').val(json.usuario.apellidos);
                    $('#pestanhia-usuario #ciudad').val(json.usuario.ciudad);
                    $('#pestanhia-usuario #id-municipio').val(json.usuario.id_municipio);
                    $('#email').val(json.usuario.correo);
                    $('#fecha-nacimiento').val(json.usuario.fecha_nacimiento);
                    $('#telefono').val(json.usuario.telefono);
                    $('#celular').val(json.usuario.celular);

                    AH.mostrarBotonesActualizar('usuario');
                    AH.cambiarPestanhia('pestanhia-usuario','crear-editar');
                }
            }
        );
    },

    verificarFormulario: function(tipo, $objeto) {

        var contenedor  = '#crear-editar ';
        var AMS         = Api.Mensaje.superior;

        $objeto['id_tipo_identificacion']  = $(contenedor + '#tipo-identificacion').val();
        $objeto['id_rol']                  = $(contenedor + '#id-rol-usuario').val();
        $objeto['id_municipio']            = $(contenedor + '#id-municipio').val();
        $objeto['id_sexo']                 = $(contenedor + '#sexo').val();
        $objeto['no_documento']            = $(contenedor + '#no-documento').val().trim();
        $objeto['usuario']                 = $(contenedor + '#usuario').val();
        $objeto['nombres']                 = $(contenedor + '#nombres').val().trim();
        $objeto['apellidos']               = $(contenedor + '#apellidos').val().trim();
        $objeto['correo']                  = $(contenedor + '#email').val().trim();
        $objeto['fecha_nacimiento']        = $(contenedor + '#fecha-nacimiento').val();
        $objeto['telefono']                = $(contenedor + '#telefono').val().trim();
        $objeto['celular']                 = $(contenedor + '#celular').val().trim();
        $objeto['id_empresa']              = this.ie;
        $objeto['clave']                   = $(contenedor + '#clave').val();
        $objeto['id']                      = this.id;



        $(contenedor + '#mensaje').html('');

        if (!$objeto.id_tipo_identificacion) {
            AMS('advertencia','Seleccione un tipo de identificacion para continuar.');
            return false;
        }

        if (!$objeto.no_documento) {
            AMS('advertencia','Digite su numero de documento para continuar.');
            return false;
        }

        if (!$objeto.id_rol) {
            AMS('advertencia','Seleccione un rol de identificacion para continuar.');
            return false;
        }

        if (!$objeto.usuario) {
            AMS('advertencia','Digite el usuario para continuar.');
            return false;
        }

        if (!$objeto.id_sexo) {
            AMS('advertencia','Seleccione un sexo para continuar.');
            return false;
        }

        if (!$objeto.id_municipio) {
            AMS('advertencia','Digite una ciudad validad para continuar.');
            return false;
        }

        if (!$objeto.nombres) {
            AMS('advertencia','Digite sus nombres para continuar.');
            return false;
        }

        if (!$objeto.apellidos) {
            AMS('advertencia','Digite sus apellidos para continuar.');
            return false;
        }

        if (!Api.Herramientas.validarEmail($objeto.correo)) {
            AMS('advertencia','El Email digitado no es correcto.');
            return false;
        }

        return $objeto;
    },

    cambiarEstado: function(id) {

        this._CambiarEstado['id'] = id;

        this.$ajaxS(
            '',
            this.uri,
            this._CambiarEstado,

            function (json) {

                Api.Usuario.constructor('#mensaje-crear-editar');
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
            closeOnConfirm: false
        }, function () {

            Api.Ajax.ajaxSimple(
                '',
                Api.Usuario.uri,
                Api.Usuario._Eliminar,

                function (json) {

                    if (json.resultado === 1) {

                        swal("Eliminado!", json.mensaje, "success");
                        Api.Usuario.constructor('#mensaje-crear-editar');
                    }
                    else {
                        swal("Error", json.mensaje , "error");
                    }
                }
            );
        });
    },

    inicializarFormulario: function() {

        this._InicializarFormulario['id_empresa'] = this.ie;

        this.$ajaxS(
            '',
            this.uri,
            this._InicializarFormulario,

            function (json) {

                if (json.resultado === 1) {

                    var AH = Api.Herramientas;

                    AH.cargarSelectJSON('#id-rol-usuario',json.rol,true);
                    AH.cargarSelectJSON('#tipo-identificacion',json.tipo_identificacion,true);
                    AH.cargarSelectJSON('#sexo',json.sexo,true);
                }
            }
        );
	}
};