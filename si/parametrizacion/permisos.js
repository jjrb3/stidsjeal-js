
Api.Permisos = {
    uri: null,
    carpeta: 'Parametrizacion',
    controlador: 'Rol',
    nombreTabla: 'tabla-rol',
    idRetorno: null,
    permisos: [],

    $ajaxC: Api.Ajax.constructor,
    $ajaxT: Api.Ajax.ajaxTabla,
    $ajaxS: Api.Ajax.ajaxSimple,
    $uriCrudObjecto: Api.Uri.crudObjecto,
    $funcionalidadesT: Api.Elementos.funcionalidadesTabla(),

    _Consultar: null,
    _ConsultarMPR: null,
    _GuardarPermisos: null,
    _ParametrosFormulario: null,
    _GuardarPermisoPersonal: null,
    _ConsultarPermisoPersonal: null,
    _ActualizarPermisoPersonal: null,

    constructor: function(idRetorno,permisoGrafica) {
        this._Consultar		            = this.$uriCrudObjecto('Consultar',this.controlador,this.carpeta);
        this._ConsultarMPR	            = this.$uriCrudObjecto('ConsultarModulosPermisosRol','Modulo',this.carpeta);
        this._GuardarPermisos	        = this.$uriCrudObjecto('GuardarPermisos','ModuloRol',this.carpeta);
        this._ParametrosFormulario	    = this.$uriCrudObjecto('ParametrosFormulario','PermisoUsuarioModulo',this.carpeta);
        this._GuardarPermisoPersonal	= this.$uriCrudObjecto('GuardarPermisoPersonal','PermisoUsuarioModulo',this.carpeta);
        this._ConsultarPermisoPersonal	= this.$uriCrudObjecto('ConsultarPermisoPersonal','PermisoUsuarioModulo',this.carpeta);
        this._ActualizarPermisoPersonal	= this.$uriCrudObjecto('ActualizarPermisoPersonal','PermisoUsuarioModulo',this.carpeta);

        str             		        = this.controlador;
        this.uri        		        = str.toLowerCase();
        this.idRetorno                  = idRetorno;

        this.tabla();
        this.cargarParametrosFormulario();
    },

    tabla: function(pagina,tamanhio) {

        this.$ajaxC(this.nombreTabla,pagina,tamanhio);

        this.$ajaxT(
            this.nombreTabla,
            this.uri,
            this._Consultar,
            {
                objecto: 'Permisos',
                metodo: 'tabla',
                funcionalidades: this.$funcionalidadesT,
                opciones: this.opcionesRoles(),
                checkbox: false,
                columnas: [
                    {nombre: 'nombre',  edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'estado',  edicion: false,	formato: '', alineacion:'centrado'}
                ]
            }
        );
    },

    modulosSesiones: function(id, buscar) {

        this._ConsultarMPR['id_rol'] = id;

        this.$ajaxS(
            '',
            this.uri,
            this._ConsultarMPR,

            function (json) {

                var AM = Api.Mensaje;

                AM.jsonSuperior(json);

                if (json.resultado === 2) {

                    $('#titulo').html('para el rol de ' + json.nombre_rol);

                    if (Object.keys(json.modulos).length > 0) {

                        Api.Elementos.constructor();

                        var idCT		    = '#clonar-tabla';
                        var $boton 		    = $('#clonar-boton');
                        var $checkbox       = $('#clonar-checkbox');
                        var $checkboxHTML   = $checkbox.html();
                        var $tablaHTML      = $(idCT).html();

                        // 1. Estilo de la tabla
                        $(idCT).find('table').addClass('table').addClass('table-hover').addClass('table-striped');


                        // 2. Cabecera
                        var $cabecera = $(idCT + ' > div > table > thead:last');

                        $cabecera.append('<th></th>').children('th:last').html();
                        $cabecera.append('<th></th>').children('th:last').addClass('vertical').html('Módulos & Sesiones');
                        $cabecera.append('<th></th>').children('th:last').css('width','5px').html(Api.Elementos.crearBotonIcono('default','Ver','fa-eye'));
                        $cabecera.append('<th></th>').children('th:last').css('width','5px').html(Api.Elementos.crearBotonIcono('primary','Ver','fa-floppy-o'));
                        $cabecera.append('<th></th>').children('th:last').css('width','5px').html(Api.Elementos.crearBotonIcono('success','Ver','fa-pencil-square-o'));
                        $cabecera.append('<th></th>').children('th:last').css('width','5px').html(Api.Elementos.crearBotonIcono('warning','Ver','fa-toggle-on'));
                        $cabecera.append('<th></th>').children('th:last').css('width','5px').html(Api.Elementos.crearBotonIcono('danger','Ver','fa-trash'));
                        $cabecera.append('<th></th>').children('th:last').css('width','5px').html(Api.Elementos.crearBotonIcono('info','Ver','fa-cloud-download'));
                        $cabecera.append('<th></th>').children('th:last').css('width','5px').html(Api.Elementos.crearBotonIcono('info','Ver','fa-cloud-upload'));


                        // 3. Contenido
                        var tr              = ' > div > table > tbody:last';
                        var td              = ' > div > table > tbody > tr:last';
                        var idPadre         = '';


                        $.each(json.modulos, function(km, im) {

                            $(idCT + tr).append('<tr></tr>');


                            // 3.1. Nombre del modulo o la sesion
                            if (im['padre'] === 'si') {

                                idPadre = im['id'];

                                $(idCT + td)
                                    .append('<td></td>')
                                    .children('td:last')
                                    .css('width','1px')
                                    .addClass('centrado')
                                    .html('<i class="fa ' + im['icono'] + ' fa-2x"></i>');

                                $(idCT + td)
                                    .append('<td></td>')
                                    .children('td:last')
                                    .addClass('vertical')
                                    .css('font-weight','600')
                                    .html(im['nombre']);
                            }
                            else {

                                $(idCT + td)
                                    .append('<td></td>')
                                    .children('td:last')
                                    .addClass('centrado');
                                    //.html('<i class="fa fa-level-up fa-2x rotar-90"></i>');

                                $(idCT + td)
                                    .append('<td></td>')
                                    .children('td:last')
                                    .addClass('vertical')
                                    .html('<i class="fa ' + im['icono'] + ' size-16"></i>&nbsp;&nbsp;' + im['nombre']);
                            }


                            // 3.2. Checkbox para la columna de ver
                            im['ver'] === 'si'             ? $checkbox.find('input').attr('checked','checked')   : '';    // Si esta checkeado
                            Api.permisos.indexOf(2) === -1 ? $checkbox.find('input').attr('disabled','disabled') : '';    // Si esta habilitado

                            $checkbox.find('input')
                                .attr('id','ver-' + im['id'])
                                .attr('data-padre-sesion',idPadre)
                                .attr('onclick','Api.Permisos.guardarPermisoVer('+im['id']+','+id+')');

                            $(idCT + td)
                                .append('<td></td>')
                                .children('td:last')
                                .css('padding-left','18px')
                                .html($checkbox.html());

                            $checkbox.html($checkboxHTML); // Inicializamos el Checkbox


                            // 3.3. Permisos generales
                            $.each(im['permisos'], function(kp, ip) {

                                ip === 'si'                    ? $checkbox.find('input').attr('checked','checked')   : '';    // Si esta checkeado
                                im['ver'] === 'no'             ? $checkbox.find('input').attr('disabled','disabled') : '';    // Si no tiene seleccionado el ver se bloquea
                                Api.permisos.indexOf(2) === -1 ? $checkbox.find('input').attr('disabled','disabled') : '';    // Si esta habilitado

                                if (im['padre'] === 'si') {

                                    $checkbox.find('input')
                                        .attr('id','permisos-' + im['id'] + '-' + kp)
                                        .attr('data-modulo',im['id'])
                                        .attr('data-permiso',kp)
                                        .attr('onclick','Api.Permisos.guardarPermisoPadre('+kp+','+im['id']+','+id+')')

                                    $(idCT + td)
                                        .append('<td></td>')
                                        .children('td:last')
                                        .css('padding-left','18px')
                                        .html($checkbox.html());
                                }
                                else {

                                    $checkbox.find('input')
                                        .attr('id','permisos-' + im['id'] + '-' + kp)
                                        .attr('data-padre',idPadre)
                                        .attr('data-modulo',im['id'])
                                        .attr('data-permiso',kp)
                                        .attr('onclick','Api.Permisos.guardarPermisoUnico('+kp+','+im['id']+','+id+')')

                                    $(idCT + td)
                                        .append('<td></td>')
                                        .children('td:last')
                                        .css('padding-left','18px')
                                        .html($checkbox.html());
                                }

                                $checkbox.html($checkboxHTML);
                            });

                        });

                        $('#tabla-modulos').html($(idCT).html());

                        $('#tabla-modulos > div > table').DataTable({
                            paging: false,
                            ordering:  false,
                            "language": {
                                "url": "//cdn.datatables.net/plug-ins/1.10.16/i18n/Spanish.json"
                            }
                        });

                        $(idCT).html($tablaHTML);   // Inicializamos la tabla
                    }
                    else {
                        AM.publicar('informacion','tabla-modulos','Usted no posee módulos, comuníquese con el administrador del sistema')
                    }
                }
            }
        );
    },

    guardarPermisoVer: function(idModulo,idRol) {

        var accion = '';

        if($('#ver-'+idModulo).is(':checked')) {
            $('input[data-modulo='+idModulo+']').val(function(){
                $(this).removeAttr('disabled');
                $(this).prop('checked',true);
            });

            $('input[data-padre='+idModulo+']').val(function(){
                $(this).prop('checked',true);
                $(this).removeAttr('disabled');
            });

            $('input[data-padre-sesion='+idModulo+']').val(function(){
                $(this).prop('checked',true);
            });

            accion = 'guardar';
        }
        else {
            $('input[data-modulo='+idModulo+']').val(function(){
                $(this).attr('disabled','disabled');
                $(this).prop('checked',false);
            });

            $('input[data-padre='+idModulo+']').val(function(){
                $(this).prop('checked',false);
                $(this).prop('disabled',true);
            });

            $('input[data-padre-sesion='+idModulo+']').val(function(){
                $(this).prop('checked',false);
            });

            accion = 'eliminar';
        }

        this.guardarPermisos(idRol,idModulo,'ver',accion,'todos');
    },

    guardarPermisoPadre: function (idPermiso,idModulo,idRol) {

        if($('#permisos-'+idModulo+'-'+idPermiso).is(':checked')) {
            $('input:not(:disabled)[data-padre='+idModulo+'][data-permiso='+idPermiso+']').val(function(){
                $(this).prop('checked',true);
            });

            accion = 'guardar';
        }
        else {
            $('input:not(:disabled)[data-padre='+idModulo+'][data-permiso='+idPermiso+']').val(function(){
                $(this).prop('checked',false);
            });

            accion = 'eliminar';
        }

        this.guardarPermisos(idRol,idModulo,'padre',accion,idPermiso);
    },

    guardarPermisoUnico: function(idPermiso,idModulo,idRol) {

        if($('#permisos-'+idModulo+'-'+idPermiso).is(':checked')) {
            accion = 'guardar';
        }
        else {
            accion = 'eliminar';
        }

        this.guardarPermisos(idRol,idModulo,'unico',accion,idPermiso);
    },

    guardarPermisos: function(idRol,idModulo,tipoPermiso,accion,permiso) {

        this._GuardarPermisos['tipo_permiso']   = tipoPermiso;
        this._GuardarPermisos['permiso']        = permiso;
        this._GuardarPermisos['id_rol']         = idRol;
        this._GuardarPermisos['id_modulo']      = idModulo;
        this._GuardarPermisos['accion']         = accion;

        this.$ajaxS(
            '',
            this.uri,
            this._GuardarPermisos,

            function (json) {

                Api.Mensaje.jsonSuperior(json);
            }
        );
    },

    opcionesRoles: function() {
    	return {
            parametrizacion: [
                {
                    nombre: 'Módulos & Sesiones',
                    icono: 'fa-list-alt',
                    accion: 'Api.Permisos.modulosSesiones',
                    color: '#428bca',
                    estado: false,
                    permiso: false,
                    informacion: true
                },
				{
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
                    }
				}
            ]
        };
	},

    activarBoton: function(tipo,clase,color) {

        if ($('#btn-permiso-' + tipo).attr('data-activo') === '1') {

            $('#btn-permiso-' + tipo).removeClass(clase).addClass('btn-white').attr('data-activo',0).children('i').addClass(color);

            var index = this.permisos.indexOf(tipo);

            if (index > -1) {
                this.permisos.splice(index, 1);
            }
        }
        else {

            this.permisos.push(tipo);

            $('#btn-permiso-' + tipo).addClass(clase).removeClass('btn-white').attr('data-activo',1).children('i').removeClass(color);
        }
    },

    cargarParametrosFormulario: function() {

        this.$ajaxS(
            '',
            this.uri,
            this._ParametrosFormulario,

            function (json) {

                var AH = Api.Herramientas;

                AH.cargarSelectJSON('id-usuario',json.usuarios,true);
                AH.cargarSelectJSON('id-usuario-consultar',json.usuarios_permisos,true);
                AH.cargarSelectJSON('id-modulo-empresa',json.modulos,true);
            }
        );
    },

    crear: function() {

        var formulario = this.verificarFormulario();

        if (formulario) {

            this.$ajaxS(
                'mensaje-pp',
                this.uri,
                formulario,

                function (json) {

                    Api.Mensaje.json(json,'mensaje-pp');

                    if (json.resultado === 1) {

                        var AP = Api.Permisos;

                        AP.limpiarFormulario();
                        AP.cargarParametrosFormulario();
                    }
                }
            );
        }
    },

    limpiarFormulario: function() {

        var permisos    = Api.Permisos.permisos;

        $(".permiso-personal .chosen-select").val('').trigger("chosen:updated");
    },

    verificarFormulario: function() {

        var contenedor  = 'mensaje-pp';
        var mensaje     = Api.Mensaje.publicar;

        this._GuardarPermisoPersonal['id_usuario']          = $('#id-usuario').val();
        this._GuardarPermisoPersonal['id_modulo_empresa']   = $('#id-modulo-empresa').val();
        this._GuardarPermisoPersonal['permisos']            = this.permisos;


        $(contenedor).html('');

        if (!this._GuardarPermisoPersonal.id_usuario) {
            mensaje('advertencia',contenedor, 'Seleccione un usuario para continuar');
            return false;
        }

        if (!this._GuardarPermisoPersonal.id_modulo_empresa) {
            mensaje('advertencia',contenedor, 'Seleccione un módulo para continuar');
            return false;
        }

        if (this._GuardarPermisoPersonal.permisos.length === 0) {
            mensaje('advertencia',contenedor, 'Seleccione por lo menos un permiso para continuar');
            return false;
        }

        return this._GuardarPermisoPersonal;
    },

    consultarPermisos: function(idUsuario) {

        if (idUsuario) {

            Api.Herramientas.selectDefault('id-usuario-consultar',idUsuario);
            this._ConsultarPermisoPersonal['id_usuario'] = idUsuario;

            this.$ajaxS(
                '',
                this.uri,
                this._ConsultarPermisoPersonal,

                function (json) {

                    if (json.resultado === 1) {

                        var idCT		    = '#clonar-tabla';
                        var $tablaHTML      = $(idCT).html();


                        // 1. Estilo de la tabla
                        $(idCT).find('table').addClass('table').addClass('table-hover').addClass('table-striped');


                        // 2. Cabecera
                        var $cabecera = $(idCT + ' > div > table > thead:last');

                        $cabecera.append('<th></th>').children('th:last').addClass('centrado').addClass('vertical').html('Módulos & Sesiones');
                        $cabecera.append('<th></th>').children('th:last').css('width','5px').html(Api.Elementos.crearBotonIcono('primary','Ver','fa-floppy-o'));
                        $cabecera.append('<th></th>').children('th:last').css('width','5px').html(Api.Elementos.crearBotonIcono('success','Ver','fa-pencil-square-o'));
                        $cabecera.append('<th></th>').children('th:last').css('width','5px').html(Api.Elementos.crearBotonIcono('warning','Ver','fa-toggle-on'));
                        $cabecera.append('<th></th>').children('th:last').css('width','5px').html(Api.Elementos.crearBotonIcono('danger','Ver','fa-trash'));
                        $cabecera.append('<th></th>').children('th:last').css('width','5px').html(Api.Elementos.crearBotonIcono('info','Ver','fa-cloud-download'));
                        $cabecera.append('<th></th>').children('th:last').css('width','5px').html(Api.Elementos.crearBotonIcono('info','Ver','fa-cloud-upload'));

                        // 3. Contenido
                        var tr              = ' > div > table > tbody:last';
                        var td              = ' > div > table > tbody > tr:last';
                        var onclickCheck    = 'Api.Permisos.actualizarPermiso(';
                        var onclick         = '';
                        var checked         = false;
                        var permisos        = [];
                        var AHC             = Api.Herramientas.checkboxOnclick;

                        // 3.1. Permisos
                        $.each(json.permisos, function(k, i) {

                            permisos = i.permisos.split(',');

                            $(idCT + tr).append('<tr></tr>');

                            $(idCT + td).append('<td></td>').children('td:last').addClass('left').html(i.modulo);

                            // Crear
                            onclick = onclickCheck + idUsuario + ','+i.id_modulo_empresa+',1)';
                            checked = permisos.indexOf('1') > -1;
                            $(idCT + td).append('<td></td>').children('td:last').css('padding-left','18px').html(AHC(onclick,checked));

                            // Actualizar
                            onclick = onclickCheck + idUsuario + ','+i.id_modulo_empresa+',2)';
                            checked = permisos.indexOf('2') > -1;
                            $(idCT + td).append('<td></td>').children('td:last').css('padding-left','18px').html(AHC(onclick,checked));

                            // Cambiar de estado
                            onclick = onclickCheck + idUsuario + ','+i.id_modulo_empresa+',3)';
                            checked = permisos.indexOf('3') > -1;
                            $(idCT + td).append('<td></td>').children('td:last').css('padding-left','18px').html(AHC(onclick,checked));

                            // Eliminar
                            onclick = onclickCheck + idUsuario + ','+i.id_modulo_empresa+',4)';
                            checked = permisos.indexOf('4') > -1;
                            $(idCT + td).append('<td></td>').children('td:last').css('padding-left','18px').html(AHC(onclick,checked));

                            // Exportar
                            onclick = onclickCheck + idUsuario + ','+i.id_modulo_empresa+',5)';
                            checked = permisos.indexOf('5') > -1;
                            $(idCT + td).append('<td></td>').children('td:last').css('padding-left','18px').html(AHC(onclick,checked));

                            // Importar
                            onclick = onclickCheck + idUsuario + ','+i.id_modulo_empresa+',6)';
                            checked = permisos.indexOf('6') > -1;
                            $(idCT + td).append('<td></td>').children('td:last').css('padding-left','18px').html(AHC(onclick,checked));
                        });

                        $('#tabla-permiso-personal').html($(idCT).html());
                        $(idCT).html($tablaHTML);   // Inicializamos la tabla

                        // Si no tiene permiso de actualizar se bloquea los inputs
                        if (Api.permisos.indexOf(2) === -1) {
                            $('#tabla-permiso-personal').find(':checkbox').prop('disabled',true);
                        }
                    }
                    else {
                        Api.Mensaje.json(json, 'tabla-permiso-personal');
                    }
                }
            );
        }
    },

    actualizarPermiso: function(idUsuario,idModuloEmpresa, idPermiso) {

        if (idUsuario && idModuloEmpresa && idPermiso) {

            this._ActualizarPermisoPersonal['id_usuario']        = idUsuario;
            this._ActualizarPermisoPersonal['id_modulo_empresa'] = idModuloEmpresa;
            this._ActualizarPermisoPersonal['id_permiso']        = idPermiso;

            $('#tabla-permiso-personal').find(':checkbox').prop('disabled',true);

            this.$ajaxS(
                '',
                this.uri,
                this._ActualizarPermisoPersonal,

                function (json) {

                    Api.Mensaje.jsonSuperior(json);
                    $('#tabla-permiso-personal').find(':checkbox').prop('disabled',false);
                    Api.Permisos.consultarPermisos(idUsuario);
                }
            );
        }
    },

    mostrarContenedor: function(tipo) {

        if (tipo === 1) {

            $('.permiso-general').slideUp(600,function(){
                $('.permiso-personal').slideDown(600);
            });

            $('#btn-general').removeClass('active');
            $('#btn-personal').addClass('active');
        }
        else {

            $('.permiso-personal').slideUp(600,function(){
                $('.permiso-general').slideDown(600);
            });

            $('#btn-personal').removeClass('active');
            $('#btn-general').addClass('active');
        }
    }
};
