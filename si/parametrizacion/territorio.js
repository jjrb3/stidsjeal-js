
Api.Territorio = {
    idPais: null,
    idDepartamento: null,
    idMunicipio: null,

    constructor: function() {
        Api.Territorio.Pais.constructor();
    },

    pruebas: function() {

        var AT = Api.Territorio;

        AT.Pais.constructor();
        AT.Departamento.constructor(1);
        AT.Municipio.constructor(1);
    }
};

Api.Territorio.Pais = {
    id: null,
    uri: null,
    carpeta: 'Parametrizacion',
    controlador: 'Pais',
    nombreTabla: 'pais-tabla',
    idMensaje: 'pais-mensaje',

    $ajaxC: Api.Ajax.constructor,
    $ajaxT: Api.Ajax.ajaxTabla,
    $ajaxS: Api.Ajax.ajaxSimple,
    $uriCrudObjecto: Api.Uri.crudObjecto,
    $funcionalidadesT: Api.Elementos.funcionalidadesTabla(),

    _Consultar: null,
    _Guardar: null,
    _Actualizar: null,
    _Eliminar: null,

    constructor: function() {
        this._Consultar		= this.$uriCrudObjecto('Consultar',this.controlador,this.carpeta);
        this._Guardar		= this.$uriCrudObjecto('Guardar',this.controlador,this.carpeta);
        this._Actualizar	= this.$uriCrudObjecto('Actualizar',this.controlador,this.carpeta);
        this._Eliminar      = this.$uriCrudObjecto('Eliminar',this.controlador,this.carpeta);

        str             	= this.controlador;
        this.uri        	= str.toLowerCase();

        this.tabla();
    },

    tabla: function(pagina,tamanhio) {

        this.$ajaxC(this.nombreTabla,pagina,tamanhio);

        this.$ajaxT(
            this.nombreTabla,
            this.uri,
            this._Consultar,
            {
                objecto: 'Territorio.Pais',
                metodo: 'tabla',
                funcionalidades: this.$funcionalidadesT,
                opciones: this.opciones(),
                checkbox: false,
                columnas: [
                    {nombre: 'nombre',  edicion: false,	formato: '', alineacion:'izquierda'},
                ],
                automatico: false
            }
        );
    },

    editar: function(id,objeto) {

        this.id = id;

        $('#pais-nombre').val(objeto.nombre).focus();
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

                        var ATP = Api.Territorio.Pais;

                        Api.Mensaje.json(json,ATP.idMensaje);

                        if (json.resultado === 1) {



                            ATP.id = null;
                            ATP.tabla();

                            $('#pais-nombre').val('');
                        }
                    }
                );
            }
        }
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
                Api.Territorio.Pais.uri,
                Api.Territorio.Pais._Eliminar,

                function (json) {

                    if (json.resultado === 1) {

                        swal("Eliminado!", json.mensaje, "success");
                        Api.Territorio.Pais.tabla();
                    }
                    else {
                        swal("Error", json.mensaje , "error");
                    }
                }
            );
        });
    },

    verificarFormulario: function(parametros) {

        parametros['nombre']  = $('#pais-nombre').val().trim();
        parametros['id']      = this.id;


        if (!parametros['nombre']) {
            this.$mensajeP('advertencia',this.idMensaje,'Debe digitar un nombre para continuar');
            return false;
        }

        return parametros;
    },

    opciones: function() {
        return {
            parametrizacion: [
                {
                    nombre: 'Ver detalle',
                    icono: 'fa-eye',
                    accion: 'Api.Territorio.Departamento.constructor',
                    color: '#428bca',
                    estado: false,
                    permiso: false,
                    informacion: false
                },
                {
                    nombre: 'Actualizar',
                    icono: 'fa-pencil-square-o',
                    accion: 'Api.Territorio.Pais.editar',
                    color: '#1a7bb9',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: true
                },
                {
                    nombre: 'Eliminar',
                    icono: 'fa-trash',
                    accion: 'Api.Territorio.Pais.eliminar',
                    color: '#ec4758',
                    estado: false,
                    permiso: 'eliminar',
                    informacion: false
                }
            ]
        };
    }
};

Api.Territorio.Departamento = {
    id: null,
    uri: null,
    carpeta: 'Parametrizacion',
    controlador: 'Departamento',
    nombreTabla: 'departamento-tabla',
    idMensaje: 'departamento-mensaje',

    $ajaxC: Api.Ajax.constructor,
    $ajaxT: Api.Ajax.ajaxTabla,
    $ajaxS: Api.Ajax.ajaxSimple,
    $uriCrudObjecto: Api.Uri.crudObjecto,
    $funcionalidadesT: Api.Elementos.funcionalidadesTabla(),

    _ConsultarPorPais: null,
    _Guardar: null,
    _Actualizar: null,
    _Eliminar: null,

    constructor: function(idPais) {
        this._ConsultarPorPais  = this.$uriCrudObjecto('ConsultarPorPais',this.controlador,this.carpeta);
        this._Guardar		    = this.$uriCrudObjecto('Guardar',this.controlador,this.carpeta);
        this._Actualizar	    = this.$uriCrudObjecto('Actualizar',this.controlador,this.carpeta);
        this._Eliminar          = this.$uriCrudObjecto('Eliminar',this.controlador,this.carpeta);

        str             		= this.controlador;
        this.uri        		= str.toLowerCase();

        this.tabla(1,10,idPais);
    },

    tabla: function(pagina,tamanhio,idPais) {

        this.$ajaxC(this.nombreTabla,pagina,tamanhio);

        this._ConsultarPorPais['id_pais']
            = Api.Territorio.idPais
            = parseInt(idPais) > 0 ? idPais : Api.Territorio.idPais;

        this.$ajaxT(
            this.nombreTabla,
            this.uri,
            this._ConsultarPorPais,
            {
                objecto: 'Territorio.Departamento',
                metodo: 'tabla',
                funcionalidades: this.$funcionalidadesT,
                opciones: this.opciones(),
                checkbox: false,
                columnas: [
                    {nombre: 'nombre',  edicion: false,	formato: '', alineacion:'izquierda'}
                ],
                automatico: false
            }
        );

        $(Api.Herramientas.verificarId(Api.Territorio.Municipio.nombreTabla,true)).html('');
    },

    editar: function(id,objeto) {

        this.id = id;

        $('#departamento-nombre').val(objeto.nombre).focus();
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

                        var ATD = Api.Territorio.Departamento;

                        Api.Mensaje.json(json,ATD.idMensaje);

                        if (json.resultado === 1) {

                            ATD.id = null;
                            ATD.tabla();

                            $('#departamento-nombre').val('');
                        }
                    }
                );
            }
        }
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
                Api.Territorio.Departamento.uri,
                Api.Territorio.Departamento._Eliminar,

                function (json) {

                    if (json.resultado === 1) {

                        swal("Eliminado!", json.mensaje, "success");
                        Api.Territorio.Departamento.tabla();
                    }
                    else {
                        swal("Error", json.mensaje , "error");
                    }
                }
            );
        });
    },

    verificarFormulario: function(parametros) {

        parametros['nombre']  = $('#departamento-nombre').val().trim();
        parametros['id']      = this.id;
        parametros['id_pais'] = Api.Territorio.idPais;

        if (!parametros['nombre']) {
            this.$mensajeP('advertencia',this.idMensaje,'Debe digitar un nombre para continuar');
            return false;
        }

        return parametros;
    },

    opciones: function() {
        return {
            parametrizacion: [
                {
                    nombre: 'Ver detalle',
                    icono: 'fa-eye',
                    accion: 'Api.Territorio.Municipio.constructor',
                    color: '#428bca',
                    estado: false,
                    permiso: false,
                    informacion: false
                },
                {
                    nombre: 'Actualizar',
                    icono: 'fa-pencil-square-o',
                    accion: 'Api.Territorio.Departamento.editar',
                    color: '#1a7bb9',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: true
                },
                {
                    nombre: 'Eliminar',
                    icono: 'fa-trash',
                    accion: 'Api.Territorio.Departamento.eliminar',
                    color: '#ec4758',
                    estado: false,
                    permiso: 'eliminar',
                    informacion: false
                }
            ]
        };
    }
};

Api.Territorio.Municipio = {
    id: null,
    uri: null,
    carpeta: 'Parametrizacion',
    controlador: 'Municipio',
    nombreTabla: 'municipio-tabla',
    idMensaje: 'municipio-mensaje',

    $ajaxC: Api.Ajax.constructor,
    $ajaxT: Api.Ajax.ajaxTabla,
    $ajaxS: Api.Ajax.ajaxSimple,
    $uriCrudObjecto: Api.Uri.crudObjecto,
    $funcionalidadesT: Api.Elementos.funcionalidadesTabla(),

    _ConsultarPorDepartamento: null,
    _Guardar: null,
    _Actualizar: null,
    _Eliminar: null,

    constructor: function(idDepartamento) {
        this._ConsultarPorDepartamento  = this.$uriCrudObjecto('ConsultarPorDepartamento',this.controlador,this.carpeta);
        this._Guardar		            = this.$uriCrudObjecto('Guardar',this.controlador,this.carpeta);
        this._Actualizar	            = this.$uriCrudObjecto('Actualizar',this.controlador,this.carpeta);
        this._Eliminar                  = this.$uriCrudObjecto('Eliminar',this.controlador,this.carpeta);

        str             		        = this.controlador;
        this.uri        		        = str.toLowerCase();

        this.tabla(1,10,idDepartamento);
    },

    tabla: function(pagina,tamanhio,idDepartamento) {

        this.$ajaxC(this.nombreTabla,pagina,tamanhio);

        this._ConsultarPorDepartamento['id_departamento']
            = Api.Territorio.idDepartamento
            = parseInt(idDepartamento) > 0 ? idDepartamento : Api.Territorio.idDepartamento;

        this.$ajaxT(
            this.nombreTabla,
            this.uri,
            this._ConsultarPorDepartamento,
            {
                objecto: 'Territorio.Municipio',
                metodo: 'tabla',
                funcionalidades: this.$funcionalidadesT,
                opciones: this.opciones(),
                checkbox: false,
                columnas: [
                    {nombre: 'nombre',  edicion: false,	formato: '', alineacion:'izquierda'}
                ],
                automatico: false
            }
        );
    },

    editar: function(id,objeto) {

        this.id = id;

        console.log(objeto);
        $('#municipio-nombre').val(objeto.nombre).focus();
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

                        var ATM = Api.Territorio.Municipio;

                        Api.Mensaje.json(json,ATM.idMensaje);

                        if (json.resultado === 1) {

                            ATM.id = null;
                            ATM.tabla();

                            $('#municipio-nombre').val('');
                        }
                    }
                );
            }
        }
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
                Api.Territorio.Municipio.uri,
                Api.Territorio.Municipio._Eliminar,

                function (json) {

                    if (json.resultado === 1) {

                        swal("Eliminado!", json.mensaje, "success");
                        Api.Territorio.Municipio.tabla();
                    }
                    else {
                        swal("Error", json.mensaje , "error");
                    }
                }
            );
        });
    },

    verificarFormulario: function(parametros) {

        parametros['nombre']  = $('#municipio-nombre').val().trim();
        parametros['id']      = this.id;
        parametros['id_departamento'] = Api.Territorio.idDepartamento;

        if (!parametros['nombre']) {
            this.$mensajeP('advertencia',this.idMensaje,'Debe digitar un nombre para continuar');
            return false;
        }

        return parametros;
    },

    opciones: function() {
        return {
            parametrizacion: [
                {
                    nombre: 'Actualizar',
                    icono: 'fa-pencil-square-o',
                    accion: 'Api.Territorio.Municipio.editar',
                    color: '#1a7bb9',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: true
                },
                {
                    nombre: 'Eliminar',
                    icono: 'fa-trash',
                    accion: 'Api.Territorio.Municipio.eliminar',
                    color: '#ec4758',
                    estado: false,
                    permiso: 'eliminar',
                    informacion: false
                }
            ]
        };
    }
};