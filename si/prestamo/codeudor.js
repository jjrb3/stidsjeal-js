
Api.Codeudor = {
    id: null,
    uri: null,
    carpeta: 'Prestamo',
    controlador: 'Codeudor',
    nombreTabla: 'codeudor-tabla',
    idModal: '#modal-codeudor ',
    idCliente: null,

    $ajaxC: Api.Ajax.constructor,
    $ajaxT: Api.Ajax.ajaxTabla,
    $ajaxS: Api.Ajax.ajaxSimple,
    $mensajeS: Api.Mensaje.superior,
    $uriCrud: Api.Uri.crudObjecto,
    $funcionalidadesT: Api.Elementos.funcionalidadesTabla(),

    _InicializarFormulario: null,
    _ConsultarPorClientePaginado: null,
    _CrearActualizar: null,
    _CambiarEstado: null,
    _Eliminar: null,

    constructor: function(id, json) {
        this._InicializarFormulario	        = this.$uriCrud('InicializarFormulario',this.controlador,this.carpeta);
        this._ConsultarPorClientePaginado	= this.$uriCrud('ConsultarPorClientePaginado',this.controlador,this.carpeta);
        this._CrearActualizar	            = this.$uriCrud('CrearActualizar',this.controlador,this.carpeta);
        this._CambiarEstado                 = this.$uriCrud('CambiarEstado',this.controlador,this.carpeta);
        this._Eliminar                      = this.$uriCrud('Eliminar',this.controlador,this.carpeta);

        str         	= this.controlador;
        this.uri    	= str.toLowerCase();
        this.idCliente  = id;

        this.tabla();

        $(this.idModal + '#nombre-completo').text(json.nombres + ' ' + json.apellidos);
        $(this.idModal).modal('show');

    },

    tabla: function(pagina,tamanhio) {

        this.$ajaxC(this.nombreTabla,pagina,tamanhio);

        this._ConsultarPorClientePaginado['id_cliente'] = this.idCliente;

        this.$ajaxT(
            this.nombreTabla,
            this.uri,
            this._ConsultarPorClientePaginado,
            {
                objecto: this.controlador,
                metodo: 'tabla',
                funcionalidades: this.$funcionalidadesT,
                opciones: this.opciones(),
                checkbox: false,
                columnas: [
                    {nombre: 'cedula',              edicion: false,	formato: 'numerico', alineacion:'centrado'},
                    //{nombre: 'fecha_expedicion',    edicion: false,	formato: '', alineacion:'centrado'},
                    {nombre: 'nombres',             edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'apellidos',           edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'direccion',           edicion: false,	formato: '', alineacion:'izquierda'},
                    {nombre: 'telefono',            edicion: false,	formato: '', alineacion:'centrado'},
                    {nombre: 'celular',             edicion: false,	formato: '', alineacion:'centrado'}
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
                        $objeto.tabla();

                        AH.cancelarCA('codeudor');

                        setTimeout(function(){
                            AH.cambiarPestanhia('pestanhia-codeudor','lista');
                        }, 1000);
                    }
                }
            );
        }

    },

    editar: function(id,objeto) {

        var AH = Api.Herramientas;

        this.id = id;

        $('#codeudor-cedula').val(objeto.cedula);
        $('#fecha-expedicion').val(objeto.fecha_expedicion);
        $('#codeudor-nombres').val(objeto.nombres);
        $('#codeudor-apellidos').val(objeto.apellidos);
        $('#codeudor-direccion').val(objeto.direccion);
        $('#codeudor-telefono').val(objeto.telefono);
        $('#codeudor-celular').val(objeto.celular);

        AH.mostrarBotonesActualizar('codeudor');
        AH.cambiarPestanhia('pestanhia-codeudor','crear-actualizar');
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

        $objeto['cedula']           = $('#codeudor-cedula').val().trim();
        $objeto['fecha_expedicion'] = $('#fecha-expedicion').val().trim();
        $objeto['nombres']          = $('#codeudor-nombres').val().trim();
        $objeto['apellidos']        = $('#codeudor-apellidos').val().trim();
        $objeto['direccion']        = $('#codeudor-direccion').val().trim();
        $objeto['telefono']         = $('#codeudor-telefono').val().trim();
        $objeto['celular']          = $('#codeudor-celular').val().trim();

        $objeto['id_cliente']   = this.idCliente;
        $objeto['id']           = this.id;


        if (!$objeto['cedula']) {
            this.$mensajeS('advertencia','Advertencia','Debe digitar la cedula para continuar');
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

        if (!$objeto['celular']) {
            this.$mensajeS('advertencia','Advertencia','Debe digitar el celular para continuar');
            return false;
        }

        return $objeto;
    },

    opciones: function() {
        return {
            parametrizacion: [
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
    }
};