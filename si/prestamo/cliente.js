
Api.Cliente = {
    id: null,
    uri: null,
    carpeta: 'Prestamo',
    controlador: 'Cliente',
    nombreTabla: 'cliente-tabla',

    $ajaxC: Api.Ajax.constructor,
    $ajaxT: Api.Ajax.ajaxTabla,
    $ajaxS: Api.Ajax.ajaxSimple,
    $mensajeS: Api.Mensaje.superior,
    $uriCrud: Api.Uri.crudObjecto,
    $funcionalidadesT: Api.Elementos.funcionalidadesTabla(),

    _InicializarFormulario: null,
    _Consultar: null,
    _CrearActualizar: null,
    _CambiarEstado: null,
    _Eliminar: null,

    constructor: function() {
        this._InicializarFormulario	= this.$uriCrud('InicializarFormulario',this.controlador,this.carpeta);
        this._Consultar	            = this.$uriCrud('Consultar',this.controlador,this.carpeta);
        this._CrearActualizar	    = this.$uriCrud('CrearActualizar',this.controlador,this.carpeta);
        this._CambiarEstado         = this.$uriCrud('CambiarEstado',this.controlador,this.carpeta);
        this._Eliminar              = this.$uriCrud('Eliminar',this.controlador,this.carpeta);

        str         	        = this.controlador;
        this.uri    	        = str.toLowerCase();

        this.tabla();
        this.inicializarFormulario();
    },

    tabla: function(pagina,tamanhio) {

        this.$ajaxC(this.nombreTabla,pagina,tamanhio);

        this.$ajaxT(
            this.nombreTabla,
            this.uri,
            this._Consultar,
            {
                objecto: this.controlador,
                metodo: 'tabla',
                funcionalidades: this.$funcionalidadesT,
                opciones: this.opciones(),
                checkbox: false,
                columnas: [
                    {nombre: 'codigo',          edicion: false,	formato: '', alineacion:'centrado'},
                    {nombre: 'identificacion',  edicion: false,	formato: 'numerico', alineacion:'centrado'},
                    {nombre: 'nombres',         edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'apellidos',       edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'direccion',       edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'celular',         edicion: false,	formato: '', alineacion:'centrado'},
                    {nombre: 'estado',          edicion: false,	formato: '', alineacion:'centrado'}
                ],
                automatico: false
            }
        );
    },

    crearActualizar: function() {

        var $objeto = Api[this.controlador];
        var parametros = this.verificarFormulario(this._CrearActualizar);

        if (parametros) {
            this.$ajaxS(
                '',
                this.uri,
                parametros,

                function (json) {

                    Api.Mensaje.jsonSuperior(json);

                    if (json.resultado === 1) {

                        var AH = Api.Herramientas;

                        $objeto.id = null;
                        $objeto.constructor();

                        AH.cancelarCA('cliente');

                        setTimeout(function(){
                            AH.cambiarPestanhia('pestanhia-cliente','informacion');
                        }, 1000);
                    }
                }
            );
        }

    },

    editar: function(id,objeto) {

        this.id = id;

        var $objeto = Api[this.controlador];
        var AH      = Api.Herramientas;

        AH.selectDefault('#id-tipo-identificacion',objeto.id_tipo_identificacion);
        AH.selectDefault('#id-estado-civil',objeto.id_estado_civil);
        AH.selectDefault('#id-ocupacion',objeto.id_ocupacion);
        AH.selectDefault('#id-banco-cliente',objeto.id_banco_cliente);

        $('#identificacion').val(objeto.identificacion);
        $('#nombres').val(objeto.nombres);
        $('#apellidos').val(objeto.apellidos);
        $('#fecha-nacimiento').val(objeto.fecha_nacimiento);
        $('#email-personal').val(objeto.email_personal);
        $('#id-municipio').val(objeto.id_municipio);
        $('#ciudad').val(objeto.ciudad);
        $('#direccion').val(objeto.direccion);
        $('#barrio').val(objeto.barrio);
        $('#telefono').val(objeto.telefono);
        $('#celular').val(objeto.cellIndex);
        $('#empresa-nombre').val(objeto.empresa_nombre);
        $('#empresa-cargo').val(objeto.empresa_cargo);
        $('#empresa-area').val(objeto.empresa_area);
        $('#empresa-barrio').val(objeto.empresa_barrio);
        $('#empresa-direccion').val(objeto.empresa_direccion);
        $('#empresa-telefono').val(objeto.empresa_telefono);
        $('#empresa-fecha-ingreso').val(objeto.empresa_fecha_ingreso);
        $('#empresa-antiguedad-meses').val(objeto.empresa_antiguedad_meses);
        $('#no-cuenta').val(objeto.no_cuenta);
        $('#sueldo').val(objeto.sueldo);
        $('#ingresos').val(objeto.ingresos);
        $('#egresos').val(objeto.egresos);
        $('#ref-personal-nombres').val(objeto.ref_personal_nombres);
        $('#ref-personal-apellidos').val(objeto.ref_personal_apellidos);
        $('#ref-personal-barrio').val(objeto.ref_personal_barrio);
        $('#ref-personal-telefono').val(objeto.ref_personal_telefono);
        $('#ref-personal-celular').val(objeto.ref_personal_celular);
        $('#ref-familiar-nombres').val(objeto.ref_familiar_nombres);
        $('#ref-familiar-apellidos').val(objeto.ref_familiar_apellidos);
        $('#ref-familiar-barrio').val(objeto.ref_familiar_barrio);
        $('#ref-familiar-telefono').val(objeto.ref_familiar_telefono);
        $('#ref-familiar-celular').val(objeto.ref_familiar_celular);
        $('#observaciones').val(objeto.observaciones);

        AH.mostrarBotonesActualizar('cliente');
        AH.cambiarPestanhia('pestanhia-cliente','informacion');
    },

    cambiarEstado: function(id) {

        var $objeto = Api[this.controlador];

        this._CambiarEstado['id'] = id;

        this.$ajaxS(
            '',
            this.uri,
            this._CambiarEstado,

            function () {

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
            closeOnConfirm: false
        }, function () {

            $objeto.$ajaxS(
                '',
                $objeto.uri,
                $objeto._Eliminar,

                function (json) {

                    if (json.resultado === 1) {

                        swal("Eliminado!", json.mensaje, "success");
                        $objeto.constructor();
                    }
                    else {
                        swal("Error", json.mensaje , "error");
                    }
                }
            );
        });
    },

    codeudor: function(id,json) {

        Api.Codeudor.constructor(id, json);
    },

    descargarInformacion: function(id) {

        $('#id-cliente-exportar').val(id);
        $("#formulario-exportar").submit();
    },

    verificarFormulario: function($objeto) {

        $objeto['id_tipo_identificacion']   = $('#id-tipo-identificacion').val();
        $objeto['identificacion']           = $('#identificacion').val().trim();
        $objeto['nombres']                  = $('#nombres').val().trim();
        $objeto['apellidos']                = $('#apellidos').val().trim();
        $objeto['id_estado_civil']          = $('#id-estado-civil').val().trim();
        $objeto['fecha_nacimiento']         = $('#fecha-nacimiento').val().trim();
        $objeto['email_personal']           = $('#email-personal').val().trim();
        $objeto['id_municipio']             = $('#id-municipio').val().trim();
        $objeto['direccion']                = $('#direccion').val().trim();
        $objeto['barrio']                   = $('#barrio').val().trim();
        $objeto['telefono']                 = $('#telefono').val().trim();
        $objeto['celular']                  = $('#celular').val().trim();
        $objeto['id_ocupacion']             = $('#id-ocupacion').val();
        $objeto['empresa_nombre']           = $('#empresa-nombre').val().trim();
        $objeto['empresa_cargo']            = $('#empresa-cargo').val().trim();
        $objeto['empresa_area']             = $('#empresa-area').val().trim();
        $objeto['empresa_barrio']           = $('#empresa-barrio').val().trim();
        $objeto['empresa_direccion']        = $('#empresa-direccion').val().trim();
        $objeto['empresa_telefono']         = $('#empresa-telefono').val().trim();
        $objeto['empresa_fecha_ingreso']    = $('#empresa-fecha-ingreso').val().trim();
        $objeto['empresa_antiguedad_meses'] = $('#empresa-antiguedad-meses').val().trim();
        $objeto['id_banco_cliente']         = $('#id-banco-cliente').val();
        $objeto['no_cuenta']                = $('#no-cuenta').val().trim();
        $objeto['sueldo']                   = $('#sueldo').val().trim();
        $objeto['ingresos']                 = $('#ingresos').val().trim();
        $objeto['egresos']                  = $('#egresos').val().trim();
        $objeto['ref_personal_nombres']     = $('#ref-personal-nombres').val().trim();
        $objeto['ref_personal_apellidos']   = $('#ref-personal-apellidos').val().trim();
        $objeto['ref_personal_barrio']      = $('#ref-personal-barrio').val().trim();
        $objeto['ref_personal_telefono']    = $('#ref-personal-telefono').val().trim();
        $objeto['ref_personal_celular']     = $('#ref-personal-celular').val().trim();
        $objeto['ref_familiar_nombres']     = $('#ref-familiar-nombres').val().trim();
        $objeto['ref_familiar_apellidos']   = $('#ref-familiar-apellidos').val().trim();
        $objeto['ref_familiar_barrio']      = $('#ref-familiar-barrio').val().trim();
        $objeto['ref_familiar_telefono']    = $('#ref-familiar-telefono').val().trim();
        $objeto['ref_familiar_celular']     = $('#ref-familiar-celular').val().trim();
        $objeto['observaciones']            = $('#observaciones').val().trim();

        $objeto['id'] = this.id;


        if (!$objeto['id_tipo_identificacion']) {
            this.$mensajeS('advertencia','Advertencia','Debe seleccionar un tipo de identificación para continuar');
            return false;
        }

        if (!$objeto['identificacion']) {
            this.$mensajeS('advertencia','Advertencia','Debe digitar la identificación para continuar');
            return false;
        }

        if (!$objeto['nombres']) {
            this.$mensajeS('advertencia','Advertencia','Debe digitar los nombres para continuar');
            return false;
        }

        if (!$objeto['apellidos']) {
            this.$mensajeS('advertencia','Advertencia','Debe digitar los apellidos para continuar');
            return false;
        }

        if (!$objeto['direccion']) {
            this.$mensajeS('advertencia','Advertencia','Debe digitar la dirección para continuar');
            return false;
        }

        return $objeto;
    },

    opciones: function() {
        return {
            parametrizacion: [
                {
                    nombre: 'Codeudor',
                    icono: 'fa-address-card-o',
                    accion: 'Api.' + this.controlador + '.codeudor',
                    color: '#1a7bb9',
                    estado: false,
                    permiso: false,
                    informacion: true
                },
                {
                    nombre: 'Descargar Información',
                    icono: 'fa-cloud-download',
                    accion: 'Api.' + this.controlador + '.descargarInformacion',
                    color: '#1a7bb9',
                    estado: false,
                    permiso: 'exportar',
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

    inicializarFormulario: function() {

        this.$ajaxS(
            '',
            this.uri,
            this._InicializarFormulario,

            function (json) {

                var AH = Api.Herramientas;

                AH.cargarSelectJSON('#id-tipo-identificacion',json.tipo_identificacion,true);
                AH.cargarSelectJSON('#id-estado-civil',json.estado_civil,true);
                AH.cargarSelectJSON('#id-ocupacion',json.ocupacion,true);
                AH.cargarSelectJSON('#id-banco-cliente',json.bancos,true);
            }
        );
    },

    probarFormulario: function() {

        var AH = Api.Herramientas;

        AH.selectDefault('#id-tipo-identificacion',1);
        AH.selectDefault('#id-estado-civil',1);
        AH.selectDefault('#id-ocupacion',1);
        AH.selectDefault('#id-banco-cliente',1);

        $('#identificacion').val('1');
        $('#nombres').val('1');
        $('#apellidos').val('1');
        $('#fecha-nacimiento').val('1990-08-06');
        $('#email-personal').val('1');
        $('#id-municipio').val('1');
        $('#direccion').val('1');
        $('#barrio').val('1');
        $('#telefono').val('1');
        $('#celular').val('1');
        $('#empresa-nombre').val('1');
        $('#empresa-cargo').val('1');
        $('#empresa-area').val('1');
        $('#empresa-barrio').val('1');
        $('#empresa-direccion').val('1');
        $('#empresa-telefono').val('1');
        $('#empresa-fecha-ingreso').val('2018-01-15');
        $('#empresa-antiguedad-meses').val('1');
        $('#no-cuenta').val('1');
        $('#sueldo').val('1');
        $('#ingresos').val('1');
        $('#egresos').val('1');
        $('#ref-personal-nombres').val('1');
        $('#ref-personal-apellidos').val('1');
        $('#ref-personal-barrio').val('1');
        $('#ref-personal-telefono').val('1');
        $('#ref-personal-celular').val('1');
        $('#ref-familiar-nombres').val('1');
        $('#ref-familiar-apellidos').val('1');
        $('#ref-familiar-barrio').val('1');
        $('#ref-familiar-telefono').val('1');
        $('#ref-familiar-celular').val('1');
        $('#observaciones').val('1');
    }
};