
Api.Empresa = {
    ie: null,
    id: null,
    uri: null,
    carpeta: 'Parametrizacion',
    controlador: 'Empresa',
    nombreTabla: 'tabla-empresa',
    idMensaje: 'mensaje',

    $ajaxC: Api.Ajax.constructor,
    $ajaxT: Api.Ajax.ajaxTabla,
    $ajaxS: Api.Ajax.ajaxSimple,
    $mensajeP: Api.Mensaje.publicar,
    $uriCrudObjecto: Api.Uri.crudObjecto,
    $funcionalidadesT: Api.Elementos.funcionalidadesTabla(),

    _InicializarFormulario: null,
    _Consultar: null,
    _ConsultarDetalle: null,
    _Guardar: null,
    _Actualizar: null,
    _CambiarEstado: null,
    _Eliminar: null,
    _ConsultarSesion: null,
    _GuardarPermisosRapidos: null,

    constructor: function() {
        this._InicializarFormulario	 = this.$uriCrudObjecto('InicializarFormulario',this.controlador,this.carpeta);
        this._Consultar	             = this.$uriCrudObjecto('Consultar',this.controlador,this.carpeta);
        this._ConsultarDetalle	     = this.$uriCrudObjecto('ConsultarDetalle',this.controlador,this.carpeta);
        this._Guardar	             = this.$uriCrudObjecto('Guardar',this.controlador,this.carpeta);
        this._Actualizar             = this.$uriCrudObjecto('Actualizar',this.controlador,this.carpeta);
        this._CambiarEstado          = this.$uriCrudObjecto('CambiarEstado',this.controlador,this.carpeta);
        this._Eliminar               = this.$uriCrudObjecto('Eliminar',this.controlador,this.carpeta);

        this._ConsultarSesion        = this.$uriCrudObjecto('ConsultarSesion','ModuloEmpresa',this.carpeta);
        this._GuardarPermisosRapidos = this.$uriCrudObjecto('GuardarPermisosRapido','ModuloRol',this.carpeta);

        str         	= this.controlador;
        this.uri    	= str.toLowerCase();

        this.inicializarFormulario();
        this.tabla();
    },

    tabla: function(pagina,tamanhio) {

        this.$ajaxC(this.nombreTabla,pagina,tamanhio);

        if (Api.ie > 1) {
            this.$funcionalidadesT.buscador = false;
            this.$funcionalidadesT.paginacion = false;
        }

        this.$ajaxT(
            this.nombreTabla,
            this.uri,
            this._Consultar,
            {
                objecto: this.controlador,
                metodo: 'tabla',
                funcionalidades: this.$funcionalidadesT,
                opciones: Api.ie > 1 ? this.opciones() : this.opcionesGenenciales(),
                checkbox: false,
                columnas: [
                    {nombre: 'tema',            edicion: false,	formato: '', alineacion:'centrado'},
                    {nombre: 'nit',             edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'nombre_cabecera', edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'nombre',          edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'frase',           edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'estado',          edicion: false,	formato: '', alineacion:'centrado'}
                ],
                automatico: false
            }
        );
    },

    detalle: function(id) {

        this.limpiarFormularioDetalle();

        this._ConsultarDetalle['id_empresa'] = id;

        this.$ajaxS(
            '',
            this.uri,
            this._ConsultarDetalle,

            function (json) {

                $('.id-empresa').val(id);

                var AS  = Api.Sucursal,
                    AM  = Api.ModuloEmpresa,
                    AR  = Api.Rol,
                    AH  = Api.Herramientas,
                    AE  = Api.Empresa,
                    AU  = Api.Usuario,
                    AI  = Api.Identificacion,
                    AV  = Api.Valores,
                    AEm = Api.Emails;

                AS.idEmpresa = AM.ie = AR.ie = AE.ie = AU.ie = AV.ie = AEm.ie = AI.ie = id;

                AM.constructor();
                AR.constructor();
                AU.constructor('crear-editar-empresa #mensaje');
                AI.constructor();
                AV.constructor();
                AEm.constructor();


                if (Object.keys(json.sucursal).length > 0) {

                    AS.inicializarParametros(json.sucursal);
                }

                if (Object.keys(json.rol).length > 0) {

                    AH.cargarSelectJSON('#permisos #id-rol',json.rol,true);
                }

                if (Object.keys(json.modulos).length > 0) {

                    AH.cargarSelectJSON('#permisos #id-modulo',json.modulos,true);
                }

                $('#bloque-detalle').slideDown(300);
            }
        );
    },

    crearActualizar: function() {

        var $objeto    = Api[this.controlador];
        var parametros = this.verificarFormulario(this.id ? this._Actualizar : this._Guardar);

        if (parametros) {
            this.$ajaxS(
                this.idMensaje,
                this.uri,
                parametros,

                function (json) {

                    Api.Mensaje.json(json,$objeto.idMensaje);

                    if (json.resultado === 1) {

                        $objeto.id = null;
                        $objeto.tabla();

                        var AH = Api.Herramientas;

                        AH.cancelarCA('empresa');

                        setTimeout(function(){
                            AH.cambiarPestanhia('pestanhia-empresa','informacion');
                        }, 2000);
                    }
                }
            );
        }
    },

    editar: function(id,$objeto) {

        this.id = id;

        var AH          = Api.Herramientas;
        var contenedor  = '#crear-editar-empresa ';

        $(contenedor + '#nit').val(AH.noNull($objeto.nit));
        $(contenedor + '#nombre-cabecera').val(AH.noNull($objeto.nombre_cabecera));
        $(contenedor + '#nombre').val(AH.noNull($objeto.nombre));
        $(contenedor + '#frase').val(AH.noNull($objeto.frase));
        $(contenedor + this.idMensaje).html('');

        AH.selectDefault('tema',$objeto.id_tema);
        AH.mostrarBotonesActualizar('empresa');
        AH.cambiarPestanhia('pestanhia-empresa','crear-editar-empresa');
    },

    cambiarEstado: function(id) {

        var $objeto = Api[this.controlador];

        this._CambiarEstado['id'] = id;

        this.$ajaxS(
            '',
            this.uri,
            this._CambiarEstado,

            function() {

                $objeto.tabla();
            }
        );
    },

    eliminar: function(id) {

        var $objeto = Api[this.controlador];

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

            $objeto.$ajaxS(
                '',
                $objeto.uri,
                $objeto._Eliminar,

                function (json) {

                    if (json.resultado === 1) {

                        swal("Eliminado!", json.mensaje, "success");
                        $objeto.tabla();
                    }
                    else {
                        swal("Error", json.mensaje , "error");
                    }
                }
            );
        });
    },

    verificarFormulario: function($objeto) {

        var contenedor = '#crear-editar-empresa ';
        var idMensaje  = Api.Herramientas.verificarId(this.idMensaje,true);

        $objeto['id_tema']          = $(contenedor + '#tema').val();
        $objeto['nit']              = $(contenedor + '#nit').val().trim();
        $objeto['nombre_cabecera']  = $(contenedor + '#nombre-cabecera').val().trim();
        $objeto['nombre']           = $(contenedor + '#nombre').val().trim();
        $objeto['frase']            = $(contenedor + '#frase').val().trim();
        $objeto['id']               = this.id;

        $(idMensaje).html('');

        if (!$objeto.id_tema) {
            this.$mensajeP('advertencia',idMensaje,'Seleccione un tema para continuar.');
            return false;
        }

        if (!$objeto.nombre) {
            this.$mensajeP('advertencia',idMensaje,'Digite el nombre para continuar.');
            return false;
        }

        return $objeto;
    },

    opcionesGenenciales: function() {
        return {
            parametrizacion: [
                {
                    nombre: 'Ver detalle',
                    icono: 'fa-eye',
                    accion: 'Api.' + this.controlador + '.detalle',
                    color: '#428bca',
                    estado: false,
                    permiso: false,
                    informacion: false
                },
                {
                    nombre: 'Actualizar',
                    icono: 'fa-pencil-square-o',
                    accion: 'Api.' + this.controlador + '.editar',
                    color: '#1a7bb9',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: true
                },
                {
                    accion: 'Api.' + this.controlador + '.cambiarEstado',
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
                    accion: 'Api.' + this.controlador + '.eliminar',
                    color: '#ec4758',
                    estado: false,
                    permiso: 'eliminar',
                    informacion: false
                }
            ]
        };
    },

    opciones: function() {
        return {
            parametrizacion: [
                {
                    nombre: 'Ver detalle',
                    icono: 'fa-eye',
                    accion: 'Api.' + this.controlador + '.detalle',
                    color: '#428bca',
                    estado: false,
                    permiso: false,
                    informacion: false
                },
                {
                    nombre: 'Actualizar',
                    icono: 'fa-pencil-square-o',
                    accion: 'Api.' + this.controlador + '.editar',
                    color: '#1a7bb9',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: true
                }
            ]
        };
    },

    consultarSesion: function(idModulo) {

        var apuntador = '#permisos #id-sesion';

        this._ConsultarSesion['id_empresa'] = this.ie;
        this._ConsultarSesion['id_modulo']  = idModulo;

        $(apuntador).html('');

        $(apuntador)
            .find('option:first-child')
            .prop('selected', true)
            .end()
            .trigger("chosen:updated");

        this.$ajaxS(
            '',
            this.uri,
            this._ConsultarSesion,

            function (json) {

                Api.Herramientas.cargarSelectJSON(apuntador,json,false);
            }
        );
    },

    guardarPermiso: function() {

        var formulario  = this.verificarFormularioPermiso(this._GuardarPermisosRapidos),
            mensaje     = '#permiso-mensaje',
            apuntador   = '#permisos #id-sesion';

        if (formulario) {

            this.$ajaxS(
                mensaje,
                this.uri,
                formulario,

                function (json) {

                    var AE = Api.Empresa;

                    Api.Mensaje.json(json,mensaje);

                    AE.detalle(AE.ie);

                    $(apuntador).html('');

                    $(apuntador)
                        .find('option:first-child')
                        .prop('selected', true)
                        .end()
                        .trigger("chosen:updated");
                }
            );
        }
    },

    verificarFormularioPermiso: function($objeto) {

        var contenedor = '#permiso-mensaje';

        $objeto['id_rol']     = $('#id-rol').val();
        $objeto['id_modulo']  = $('#id-modulo').val();
        $objeto['id_sesion']  = $('#id-sesion').val();
        $objeto['permisos']   = $('#id-permiso').val();


        $(contenedor).html('');

        if (!$objeto.id_rol) {
            this.$mensajeP('advertencia',contenedor,'Seleccione un rol para continuar.');
            return false;
        }

        if (!$objeto.id_modulo) {
            this.$mensajeP('advertencia',contenedor,'Seleccione un módulo para continuar.');
            return false;
        }


        return $objeto;
    },

    limpiarFormularioDetalle: function() {

        var contenedorDetalle = '#detalle-general ';
        var contenedorPermiso = '#permisos ';

        $(contenedorDetalle + '#codigo').val('');
        $(contenedorDetalle + '#ciudad').val('');
        $(contenedorDetalle + '#id-municipio').val('');
        $(contenedorDetalle + '#nombre').val('');
        $(contenedorDetalle + '#telefono').val('');
        $(contenedorDetalle + '#direccion').val('');
        $(contenedorDetalle + '#quienes-somos').val('');
        $(contenedorDetalle + '#que-hacemos').val('');
        $(contenedorDetalle + '#mision').val('');
        $(contenedorDetalle + '#vision').val('');

        $(contenedorPermiso + '#id-rol').html('');
        $(contenedorPermiso + '#id-rol').find('option:first-child').prop('selected', true).end().trigger("chosen:updated");
        $(contenedorPermiso + '#id-modulo').html('');
        $(contenedorPermiso + '#id-modulo').find('option:first-child').prop('selected', true).end().trigger("chosen:updated");
        $(contenedorPermiso + '#id-sesion').html('');
        $(contenedorPermiso + '#id-sesion').find('option:first-child').prop('selected', true).end().trigger("chosen:updated");
    },

    inicializarFormulario: function() {

        this.$ajaxS(
            '',
            this.uri,
            this._InicializarFormulario,

            function (json) {

                var AH = Api.Herramientas;

                AH.cargarSelectJSON('#tema',json.temas,true);
            }
        );
    }
};

Api.Sucursal = {
    id: null,
    uri: null,
    carpeta: 'Parametrizacion',
    controlador: 'Sucursal',
    idEmpresa: null,

    $ajaxS: Api.Ajax.ajaxSimple,
    $mensajeS: Api.Mensaje.superior,
    $uriCrudObjecto: Api.Uri.crudObjecto,

    _ActualizarPorEmpresa: null,

    constructor: function() {
        this._ActualizarPorEmpresa  = this.$uriCrudObjecto('ActualizarPorEmpresa',this.controlador,this.carpeta);
        str         	            = this.controlador;
        this.uri    	            = str.toLowerCase();
    },

    actualizar: function() {

        this.constructor();

        var parametros = this.verificarFormulario(this._ActualizarPorEmpresa);

        if (parametros) {
            this.$ajaxS(
                '',
                this.uri,
                parametros,

                function (json) {

                    Api.Mensaje.jsonSuperior(json);
                }
            );
        }
    },

    verificarFormulario: function($objeto) {

        var contenedor = '#detalle ';

        $objeto['codigo']           = $(contenedor + '#codigo').val().trim();
        $objeto['id_municipio']     = $(contenedor + '#ciudad-detalle').val();
        $objeto['nombre']           = $(contenedor + '#nombre').val().trim();
        $objeto['telefono']         = $(contenedor + '#telefono').val().trim();
        $objeto['direccion']        = $(contenedor + '#direccion').val().trim();
        $objeto['quienes_somos']    = $(contenedor + '#quienes-somos').val().trim();
        $objeto['que_hacemos']      = $(contenedor + '#que-hacemos').val().trim();
        $objeto['mision']           = $(contenedor + '#mision').val().trim();
        $objeto['vision']           = $(contenedor + '#vision').val().trim();
        $objeto['id_empresa']       = this.idEmpresa;


        if (!$objeto.codigo) {
            this.$mensajeS('advertencia','Digite el codigo de la sucursal para continuar.');
            return false;
        }

        if (!$objeto.id_municipio) {
            this.$mensajeS('advertencia','Seleccione una ciudad para continuar.');
            return false;
        }

        if (!$objeto.nombre) {
            this.$mensajeS('advertencia','Digite un nombre de sucursal para continuar.');
            return false;
        }

        return $objeto;
    },

    subirImagen: function() {
        Api.Empresa.detalle(this.id);
    },

    inicializarParametros: function(json) {

        var contenedor  = '#detalle-general ';
        var AH          = Api.Herramientas;

        $(contenedor + '#codigo').val(json.codigo);
        $(contenedor + '#ciudad').val(json.ciudad);
        $(contenedor + '#id-municipio').val(json.id_municipio);
        $(contenedor + '#nombre').val(json.nombre);
        $(contenedor + '#telefono').val(AH.noNull(json.telefono));
        $(contenedor + '#direccion').val(AH.noNull(json.direccion));
        $(contenedor + '#quienes-somos').val(AH.noNull(json.quienes_somos));
        $(contenedor + '#que-hacemos').val(AH.noNull(json.que_hacemos));
        $(contenedor + '#mision').val(AH.noNull(json.mision));
        $(contenedor + '#vision').val(AH.noNull(json.vision));
    }
};

Api.Valores = {
    ie: null,
    id: null,
    uri: null,
    carpeta: 'Parametrizacion',
    controlador: 'EmpresaValores',
    nombreTabla: 'valores-tabla',
    idMensaje: 'valores-mensaje',

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

    constructor: function() {
        this._Consultar	    = this.$uriCrudObjecto('Consultar',this.controlador,this.carpeta);
        this._Guardar	    = this.$uriCrudObjecto('Guardar',this.controlador,this.carpeta);
        this._Actualizar    = this.$uriCrudObjecto('Actualizar',this.controlador,this.carpeta);
        this._Eliminar      = this.$uriCrudObjecto('Eliminar',this.controlador,this.carpeta);

        str         	= this.controlador;
        this.uri    	= str.toLowerCase();

        this.tabla();
    },

    tabla: function(pagina,tamanhio) {

        this.$ajaxC(this.nombreTabla,pagina,tamanhio);

        this._Consultar['id_empresa'] = this.ie;

        this.$ajaxT(
            this.nombreTabla,
            this.uri,
            this._Consultar,
            {
                objecto: this.controlador,
                metodo: 'tabla',
                funcionalidades: this.$funcionalidadesT,
                opciones: this.opcionesTabla(),
                checkbox: false,
                columnas: [
                    {nombre: 'nombre',  edicion: false,	formato: '', alineacion:'izquierda'}
                ],
                automatico: false
            }
        );
    },

    guardarActualizar: function(evento) {

        if (Api.Herramientas.presionarEnter(evento)) {

            var parametros  = '';

            this.id ? parametros = this.verificarFormulario(this._Actualizar) : parametros = this.verificarFormulario(this._Guardar);

            if (parametros) {

                this.$ajaxS(
                    this.idRetorno,
                    this.uri,
                    parametros,

                    function (json) {

                        var AV = Api.Valores;

                        Api.Mensaje.json(json,'valores-mensaje');

                        if (json.resultado === 1) {

                            AV.tabla();
                            AV.id ? AV.id = '' : '';

                            $('#valores-nombre').val('');
                        }
                    }
                );
            }
        }
    },

    verificarFormulario: function(parametros) {

        parametros['nombre']     = $('#valores-nombre').val().trim();
        parametros['id']         = this.id;
        parametros['id_empresa'] = this.ie;

        if (!parametros['nombre']) {
            this.$mensajeP('advertencia','valores-mensaje','Debe digitar un nombre para continuar');
            return false;
        }

        return parametros;
    },

    editar: function(id,objeto) {

        this.id = id;

        $('#valores-nombre').val(objeto.nombre).focus();
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
                Api.Valores.uri,
                Api.Valores._Eliminar,

                function (json) {

                    if (json.resultado === 1) {

                        Api.Valores.constructor();
                        swal("Eliminado!", json.mensaje, "success");
                    }
                    else {
                        swal("Error", json.mensaje , "error");
                    }
                }
            );
        });
    },

    opcionesTabla: function() {
        return {
            parametrizacion: [
                {
                    nombre: 'Actualizar',
                    icono: 'fa-pencil-square-o',
                    accion: 'Api.Valores.editar',
                    color: '#1a7bb9',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: true
                },
                {
                    nombre: 'Eliminar',
                    icono: 'fa-trash',
                    accion: 'Api.Valores.eliminar',
                    color: '#ec4758',
                    estado: false,
                    permiso: 'eliminar',
                    informacion: false
                }
            ]
        };
    }
};

Api.Emails = {
    ie: null,
    id: null,
    uri: null,
    carpeta: 'Parametrizacion',
    controlador: 'EmpresaEmails',
    nombreTabla: 'emails-tabla',
    idMensaje: 'emails-mensaje',

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

    constructor: function() {
        this._Consultar	    = this.$uriCrudObjecto('Consultar',this.controlador,this.carpeta);
        this._Guardar	    = this.$uriCrudObjecto('Guardar',this.controlador,this.carpeta);
        this._Actualizar    = this.$uriCrudObjecto('Actualizar',this.controlador,this.carpeta);
        this._Eliminar      = this.$uriCrudObjecto('Eliminar',this.controlador,this.carpeta);

        str         	= this.controlador;
        this.uri    	= str.toLowerCase();

        this.tabla();
    },

    tabla: function(pagina,tamanhio) {

        this.$ajaxC(this.nombreTabla,pagina,tamanhio);

        this._Consultar['id_empresa'] = this.ie;

        this.$ajaxT(
            this.nombreTabla,
            this.uri,
            this._Consultar,
            {
                objecto: this.controlador,
                metodo: 'tabla',
                funcionalidades: this.$funcionalidadesT,
                opciones: this.opcionesTabla(),
                checkbox: false,
                columnas: [
                    {nombre: 'nombre',  edicion: false,	formato: '', alineacion:'izquierda'}
                ],
                automatico: false
            }
        );
    },

    guardarActualizar: function(evento) {

        if (Api.Herramientas.presionarEnter(evento)) {

            var parametros  = '';

            this.id ? parametros = this.verificarFormulario(this._Actualizar) : parametros = this.verificarFormulario(this._Guardar);

            if (parametros) {

                this.$ajaxS(
                    this.idRetorno,
                    this.uri,
                    parametros,

                    function (json) {

                        Api.Mensaje.json(json,'emails-mensaje');

                        if (json.resultado === 1) {

                            var AE = Api.Emails;

                            AE.tabla();
                            AE.id ? AE.id = '' : '';

                            $('#emails-nombre').val('');
                        }
                    }
                );
            }
        }
    },

    verificarFormulario: function(parametros) {

        parametros['nombre']     = $('#emails-nombre').val().trim();
        parametros['id']         = this.id;
        parametros['id_empresa'] = this.ie;

        if (!parametros['nombre']) {
            this.$mensajeP('advertencia','emails-mensaje','Debe digitar un nombre para continuar');
            return false;
        }

        if (!Api.Herramientas.validarEmail(parametros['nombre'])) {
            this.$mensajeP('advertencia','emails-mensaje','El email digitado no es valido');
            return false;
        }

        return parametros;
    },

    editar: function(id,objeto) {

        this.id = id;

        $('#emails-nombre').val(objeto.nombre).focus();
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
                Api.Emails.uri,
                Api.Emails._Eliminar,

                function (json) {

                    if (json.resultado === 1) {

                        Api.Emails.constructor();
                        swal("Eliminado!", json.mensaje, "success");
                    }
                    else {
                        swal("Error", json.mensaje , "error");
                    }
                }
            );
        });
    },

    opcionesTabla: function() {
        return {
            parametrizacion: [
                {
                    nombre: 'Actualizar',
                    icono: 'fa-pencil-square-o',
                    accion: 'Api.Emails.editar',
                    color: '#1a7bb9',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: true
                },
                {
                    nombre: 'Eliminar',
                    icono: 'fa-trash',
                    accion: 'Api.Emails.eliminar',
                    color: '#ec4758',
                    estado: false,
                    permiso: 'eliminar',
                    informacion: false
                }
            ]
        };
    }
};