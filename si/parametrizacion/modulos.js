
Api.Modulos = {
    ie: null,
    id: null,
    carpeta: 'Parametrizacion',
    controlador: 'Modulo',
    uri: null,
    idRetorno: null,
    idModulo: null,
    idTablaModulo: 'tabla-modulo',
    idTablaSesion: 'tabla-sesion',

    $ajaxC: Api.Ajax.constructor,
    $ajaxT: Api.Ajax.ajaxTabla,
    $ajaxS: Api.Ajax.ajaxSimple,
    $uriCrud: Api.Uri.crudObjecto,
    $mensaje: Api.Mensaje.publicar,
    $funcionalidadesT: Api.Elementos.funcionalidadesTabla(),

    _ConsultarCheckearPorEmpresa: null,
    _ConsultarSesionCheckearPorEmpresa: null,

    constructor: function () {
        this._ConsultarCheckearPorEmpresa       = this.$uriCrud('ConsultarCheckearPorEmpresa', this.controlador, this.carpeta);
        this._ConsultarSesionCheckearPorEmpresa = this.$uriCrud('ConsultarSesionCheckearPorEmpresa', this.controlador, this.carpeta);

        var  str                            = this.controlador;
        this.uri                            = str.toLowerCase();

        this.tablaModulo();
    },

    tablaModulo: function(pagina,tamanhio) {

        this.$ajaxC(this.idTablaModulo,pagina,tamanhio);

        this._ConsultarCheckearPorEmpresa['id_empresa'] = this.ie;

        this.$ajaxT(
            this.idTablaModulo,
            this.uri,
            this._ConsultarCheckearPorEmpresa,
            {
                objecto: 'Modulos',
                metodo: 'tablaModulo',
                funcionalidades: this.$funcionalidadesT,
                opciones: null,
                checkbox: true,
                color: true,
                seleccionar: true,
                columnas: [
                    {nombre: 'icono',   edicion: false,	formato: 'icono',   alineacion: 'centrado'},
                    {nombre: 'nombre',  edicion: false,	formato: false,     alineacion: 'justificado'}
                ],
                automatico: false
            }
        );
    },

    tablaModuloSeleccionado: function(id) {

        this.idModulo = id;

        this.tablaSesion();
    },

    tablaSesion: function(pagina,tamanhio) {

        this.$ajaxC(this.idTablaSesion,pagina,tamanhio);

        this._ConsultarSesionCheckearPorEmpresa['id_empresa'] = this.ie;
        this._ConsultarSesionCheckearPorEmpresa['id_modulo'] = this.idModulo;

        this.$ajaxT(
            this.idTablaSesion,
            this.uri,
            this._ConsultarSesionCheckearPorEmpresa,
            {
                objecto: 'Modulos',
                metodo: 'tablaModulo',
                funcionalidades: this.$funcionalidadesT,
                opciones: null,
                checkbox: true,
                color: true,
                seleccionar: true,
                columnas: [
                    {nombre: 'icono',   edicion: false,	formato: 'icono',   alineacion: 'centrado'},
                    {nombre: 'nombre',  edicion: false,	formato: false,     alineacion: 'justificado'}
                ],
                automatico: false
            }
        );
    },
};