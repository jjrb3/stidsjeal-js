
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

    constructor: function() {
        this._Consultar		            = this.$uriCrudObjecto('Consultar',this.controlador,this.carpeta);

        str             		        = this.controlador;
        this.uri        		        = str.toLowerCase();

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
                ]
            }
        );
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
                    informacion: true
                },
                {
                    nombre: 'Actualizar',
                    icono: 'fa-pencil-square-o',
                    accion: 'Api.Territorio.Pais.editar',
                    color: '#1a7bb9',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: false
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

    constructor: function(idPais) {
        this._ConsultarPorPais  = this.$uriCrudObjecto('ConsultarPorPais',this.controlador,this.carpeta);

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
                ]
            }
        );
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
                    informacion: true
                },
                {
                    nombre: 'Actualizar',
                    icono: 'fa-pencil-square-o',
                    accion: 'Api.Territorio.Departamento.editar',
                    color: '#1a7bb9',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: false
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

    constructor: function(idDepartamento) {
        this._ConsultarPorDepartamento  = this.$uriCrudObjecto('ConsultarPorDepartamento',this.controlador,this.carpeta);

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
                    accion: 'Api.Territorio.Departamento.editar',
                    color: '#1a7bb9',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: false
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