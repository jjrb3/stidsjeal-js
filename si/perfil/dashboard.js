Api.Dashboard = {
    carpeta: 'Parametrizacion',
    controlador: 'Dashboard',
    uri: null,
    idRetorno: null,
    nombreTablaModulo1: 'tabla-modulo-1',
    nombreTablaGrafica: 'tabla-grafica',
    nombreTablaModuloAgregados: 'tabla-modulo-agregados',
    nombreTablaGraficaAgregadas: 'tabla-grafica-agregados',

    $ajaxC: Api.Ajax.constructor,
    $ajaxT: Api.Ajax.ajaxTabla,
    $ajaxS: Api.Ajax.ajaxSimple,
    $uriCrud: Api.Uri.crudObjecto,
    $mensaje: Api.Mensaje.publicar,
    $funcionalidadesT: Api.Elementos.funcionalidadesTabla(),

    _ConsultarModulos: null,
    _ConsultarModulosAgregados: null,
    _GuardarTipo: null,
    _GuardarModulos: null,
    _EliminarModulos: null,
    _SubirModulo: null,
    _BajarModulo: null,
    _ConsultarGraficas: null,
    _ConsultarGraficasAgregadas: null,
    _GuardarGraficas: null,
    _EliminarGraficas: null,
    _SubirGrafica: null,
    _BajarGrafica: null,

    constructor: function (idRetorno) {
        this._GuardarTipo                   = this.$uriCrud('GuardarTipo', this.controlador, this.carpeta);

        this._ConsultarModulos              = this.$uriCrud('ConsultarModulos', this.controlador, this.carpeta);
        this._ConsultarModulosAgregados     = this.$uriCrud('ConsultarModulosAgregados', this.controlador, this.carpeta);
        this._GuardarModulos                = this.$uriCrud('GuardarModulos', this.controlador, this.carpeta);
        this._EliminarModulos               = this.$uriCrud('EliminarModulos', this.controlador, this.carpeta);
        this._SubirModulo                   = this.$uriCrud('SubirModulo', this.controlador, this.carpeta);
        this._BajarModulo                   = this.$uriCrud('BajarModulo', this.controlador, this.carpeta);

        this._ConsultarGraficas             = this.$uriCrud('ConsultarGraficas', this.controlador, this.carpeta);
        this._ConsultarGraficasAgregadas    = this.$uriCrud('ConsultarGraficasAgregadas', this.controlador, this.carpeta);
        this._GuardarGraficas               = this.$uriCrud('GuardarGraficas', this.controlador, this.carpeta);
        this._EliminarGraficas              = this.$uriCrud('EliminarGraficas', this.controlador, this.carpeta);
        this._SubirGrafica                  = this.$uriCrud('SubirGrafica', this.controlador, this.carpeta);
        this._BajarGrafica                  = this.$uriCrud('BajarGrafica', this.controlador, this.carpeta);

        var  str                            = this.controlador;
        this.uri                            = str.toLowerCase();
        this.idRetorno                      = idRetorno;

        if (idRetorno) {
            $(idRetorno).html('')
        }

        return true;
    },

    // Contenedor de Módulos
    parametrosModulos: function () {

        return {
            parametrizacion: [
                {
                    nombre: 'Subir',
                    icono: 'fa-level-up',
                    accion: 'Api.Dashboard.subirModulo',
                    color: '#428bca',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: true
                },
                {
                    nombre: 'Bajar',
                    icono: 'fa-level-down',
                    accion: 'Api.Dashboard.bajarModulo',
                    color: '#428bca',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: false
                }
            ]
        };
    },

    tablaModulo: function(pagina,tamanhio) {

        this.$ajaxC(this.nombreTablaModulo1,pagina,tamanhio);

        this.$ajaxT(
            this.nombreTablaModulo1,
            this.uri,
            this._ConsultarModulos,
            {
                objecto: 'Dashboard',
                metodo: 'tablaModulo',
                funcionalidades: this.$funcionalidadesT,
                opciones: null,
                checkbox: true,
                columnas: [
                    {nombre: 'icono',   edicion: false,	formato: 'icono',   alineacion: 'centrado'},
                    {nombre: 'nombre',  edicion: false,	formato: false,     alineacion: 'justificado'},
                    {nombre: 'descripcion',  edicion: false,	formato: false,     alineacion: 'justificado'},
                ]
            }
        );
    },

    tablaModuloAgregados: function(pagina,tamanhio) {

        this.$ajaxC(this.nombreTablaModuloAgregados,pagina,tamanhio);

        this.$ajaxT(
            this.nombreTablaModuloAgregados,
            this.uri,
            this._ConsultarModulosAgregados,
            {
                objecto: 'Dashboard',
                metodo: 'tablaModuloAgregados',
                funcionalidades: this.$funcionalidadesT,
                opciones: this.parametrosModulos(),
                checkbox: true,
                columnas: [
                    {nombre: 'icono',   edicion: false,	formato: 'icono',   alineacion: 'centrado'},
                    {nombre: 'nombre',  edicion: false,	formato: false,     alineacion: 'justificado'},
                    {nombre: 'descripcion',  edicion: false,	formato: false,     alineacion: 'justificado'},
                ]
            }
        );
    },

    agregarModulo: function() {

        $(this.idRetorno).html('');

        var ids = Api.Herramientas.obtenerCheck(this.nombreTablaModulo1,true);

        if (ids) {

            this._GuardarModulos['ids'] = ids;

            this.$ajaxS(
                this.idRetorno,
                this.uri,
                this._GuardarModulos,

                function (json) {

                    Api.Mensaje.json(json,Api.Dashboard.idRetorno);

                    if (json.resultado == 1) {

                        Api.Dashboard.tablaModuloAgregados();

                        $('#dashboard :checkbox').prop('checked',false);
                    }
                }
            );
        }
        else {
            this.$mensaje('advertencia',this.idRetorno,'Debe seleccionar un módulo para poderlo agregar al listado')
        }
    },

    quitarModulo: function() {

        $(this.idRetorno).html('');

        var ids = Api.Herramientas.obtenerCheck(this.nombreTablaModuloAgregados,true);

        if (ids) {

            this._EliminarModulos['ids'] = ids;

            this.$ajaxS(
                this.idRetorno,
                this.uri,
                this._EliminarModulos,

                function (json) {

                    Api.Mensaje.json(json,Api.Dashboard.idRetorno);

                    if (json.resultado == 1) {

                        Api.Dashboard.tablaModuloAgregados();
                    }
                }
            );
        }
        else {
            this.$mensaje('advertencia',this.idRetorno,'Debe seleccionar un módulo para poderlo quitar del listado')
        }
    },

    subirModulo: function(id) {

        if (id) {

            this._SubirModulo['id'] = id;

            this.$ajaxS(
                this.idRetorno,
                this.uri,
                this._SubirModulo,

                function (json) {

                    if (json.resultado == 1) {

                        $(Api.Dashboard.idRetorno).html('');
                        Api.Dashboard.tablaModuloAgregados();
                    }
                    else {
                        Api.Mensaje.json(json,Api.Dashboard.idRetorno);
                    }
                }
            );
        }
    },

    bajarModulo: function(id) {

        if (id) {

            this._BajarModulo['id'] = id;

            this.$ajaxS(
                this.idRetorno,
                this.uri,
                this._BajarModulo,

                function (json) {

                    if (json.resultado == 1) {

                        $(Api.Dashboard.idRetorno).html('');
                        Api.Dashboard.tablaModuloAgregados();
                    }
                    else {
                        Api.Mensaje.json(json,Api.Dashboard.idRetorno);
                    }
                }
            );
        }
    },
    // Fin contenedor de Módulos

    // Contenedor de Graficas
    parametrosGrafica: function () {

        return {
            parametrizacion: [
                {
                    nombre: 'Subir',
                    icono: 'fa-level-up',
                    accion: 'Api.Dashboard.subirGrafica',
                    color: '#428bca',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: false
                },
                {
                    nombre: 'Bajar',
                    icono: 'fa-level-down',
                    accion: 'Api.Dashboard.bajarGrafica',
                    color: '#428bca',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: false
                }
            ]
        };
    },

    tablaGrafica: function(pagina,tamanhio) {

        this.$ajaxC(this.nombreTablaGrafica,pagina,tamanhio);

        this.$ajaxT(
            this.nombreTablaGrafica,
            this.uri,
            this._ConsultarGraficas,
            {
                objecto: 'Dashboard',
                metodo: 'tablaGrafica',
                funcionalidades: this.$funcionalidadesT,
                opciones: null,
                checkbox: true,
                columnas: [
                    {nombre: 'icono',   edicion: false,	formato: 'icono',   alineacion: 'centrado'},
                    {nombre: 'nombre',  edicion: false,	formato: false,     alineacion: 'justificado'},
                    {nombre: 'modulo',  edicion: false,	formato: false,     alineacion: 'justificado'},
                ]
            }
        );
    },

    tablaGraficaAgregados: function(pagina,tamanhio) {

        this.$ajaxC(this.nombreTablaGraficaAgregadas,pagina,tamanhio);

        this.$ajaxT(
            this.nombreTablaGraficaAgregadas,
            this.uri,
            this._ConsultarGraficasAgregadas,
            {
                objecto: 'Dashboard',
                metodo: 'tablaGraficaAgregados',
                funcionalidades: this.$funcionalidadesT,
                opciones: this.parametrosGrafica(),
                checkbox: true,
                columnas: [
                    {nombre: 'icono',   edicion: false,	formato: 'icono',   alineacion: 'centrado'},
                    {nombre: 'nombre',  edicion: false,	formato: false,     alineacion: 'justificado'},
                    {nombre: 'modulo',  edicion: false,	formato: false,     alineacion: 'justificado'},
                ]
            }
        );
    },

    agregarGrafica: function() {

        $(this.idRetorno).html('');

        var ids = Api.Herramientas.obtenerCheck(this.nombreTablaGrafica,true);

        if (ids) {

            this._GuardarGraficas['ids'] = ids;

            this.$ajaxS(
                this.idRetorno,
                this.uri,
                this._GuardarGraficas,

                function (json) {

                    Api.Mensaje.json(json,Api.Dashboard.idRetorno);

                    if (json.resultado == 1) {

                        Api.Dashboard.tablaGraficaAgregados();

                        $('#dashboard :checkbox').prop('checked',false);
                    }
                }
            );
        }
        else {
            this.$mensaje('advertencia',this.idRetorno,'Debe seleccionar una grafica para poderlo agregar al listado')
        }
    },

    quitarGrafica: function() {

        $(this.idRetorno).html('');

        var ids = Api.Herramientas.obtenerCheck(this.nombreTablaGraficaAgregadas,true);

        if (ids) {

            this._EliminarGraficas['ids'] = ids;

            this.$ajaxS(
                this.idRetorno,
                this.uri,
                this._EliminarGraficas,

                function (json) {

                    Api.Mensaje.json(json,Api.Dashboard.idRetorno);

                    if (json.resultado == 1) {

                        Api.Dashboard.tablaGraficaAgregados();
                    }
                }
            );
        }
        else {
            this.$mensaje('advertencia',this.idRetorno,'Debe seleccionar una grafica para poderla quitar del listado')
        }
    },

    subirGrafica: function(id) {

        if (id) {

            this._SubirGrafica['id'] = id;

            this.$ajaxS(
                this.idRetorno,
                this.uri,
                this._SubirGrafica,

                function (json) {

                    var AD = Api.Dashboard;

                    if (json.resultado == 1) {

                        $(AD.idRetorno).html('');
                        AD.tablaGraficaAgregados();
                    }
                    else {
                        Api.Mensaje.json(json,AD.idRetorno);
                    }
                }
            );
        }
    },

    bajarGrafica: function(id) {

        if (id) {

            this._BajarGrafica['id'] = id;

            this.$ajaxS(
                this.idRetorno,
                this.uri,
                this._BajarGrafica,

                function (json) {

                    var AD = Api.Dashboard;

                    if (json.resultado == 1) {

                        $(AD.idRetorno).html('');
                        AD.tablaGraficaAgregados();
                    }
                    else {
                        Api.Mensaje.json(json,AD.idRetorno);
                    }
                }
            );
        }
    },
    // Fin contenedor de Graficas

    // Parametros de las tablas

    cargarDatos: function (tipo) {

        var AD = Api.Dashboard;

        this._GuardarTipo['tipo'] = tipo;

        this.$ajaxS(
            this.idRetorno,
            this.uri,
            this._GuardarTipo,

            function (json) {

                $(Api.Dashboard.idRetorno).html('');

                switch (tipo)
                {
                    case 1:
                        AD.tablaModulo();
                        AD.tablaModuloAgregados();
                        break;

                    case 2:
                        AD.tablaGrafica();
                        AD.tablaGraficaAgregados();
                        break;
                }
            }
        );
    },

    mostrarContenedor: function(tipo) {

        var contenedor = '#dashboard ';

        if (tipo == 1) {

            $(contenedor + '#graficas').slideUp(600,function(){
                $(contenedor + '#modulos').slideDown(600);
            });

            $(contenedor + '#btn-grafica').removeClass('active');
            $(contenedor + '#btn-modulo').addClass('active');
        }
        else {

            $(contenedor + '#modulos').slideUp(600,function(){
                $(contenedor + '#graficas').slideDown(600);
            });

            $(contenedor + '#btn-modulo').removeClass('active');
            $(contenedor + '#btn-grafica').addClass('active');
        }

        this.cargarDatos(tipo);
    }
};