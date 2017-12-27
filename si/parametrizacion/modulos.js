
Api.Modulos = {
    ie: null,
    id: null,
    carpeta: 'Parametrizacion',
    controlador: 'Modulo',
    uri: null,
    idRetorno: null,
    idModulo: 1,
    idTablaModulo: 'tabla-modulo',
    idTablaSesion: 'tabla-sesion',

    $ajaxC: Api.Ajax.constructor,
    $ajaxT: Api.Ajax.ajaxTabla,
    $ajaxS: Api.Ajax.ajaxSimple,
    $uriCrud: Api.Uri.crudObjecto,
    $mensaje: Api.Mensaje.publicar,
    $funcionalidadesT: Api.Elementos.funcionalidadesTabla(),

    _ConsultarCheckearPorEmpresa: null,
    _GuardarIdsModulosPorEmpresa: null,

    constructor: function () {
        this._ConsultarCheckearPorEmpresa               = this.$uriCrud('ConsultarCheckearPorEmpresa', this.controlador, this.carpeta);
        this._ConsultarSesionCheckearPorEmpresaModulo   = this.$uriCrud('ConsultarSesionCheckearPorEmpresaModulo', this.controlador, this.carpeta);
        this._GuardarIdsModulosPorEmpresa               = this.$uriCrud('GuardarIdsModulosPorEmpresa', this.controlador, this.carpeta);

        var  str                            = this.controlador;
        this.uri                            = str.toLowerCase();

        this.tablaModulo();
        this.tablaSesion();
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

        this._ConsultarSesionCheckearPorEmpresaModulo['id_empresa'] = this.ie;
        this._ConsultarSesionCheckearPorEmpresaModulo['id_modulo'] = this.idModulo;

        this.$ajaxT(
            this.idTablaSesion,
            this.uri,
            this._ConsultarSesionCheckearPorEmpresaModulo,
            {
                objecto: 'Modulos',
                metodo: 'tablaSesion',
                funcionalidades: this.$funcionalidadesT,
                opciones: null,
                checkbox: true,
                color: true,
                seleccionar: false,
                columnas: [
                    {nombre: 'icono',   edicion: false,	formato: 'icono',   alineacion: 'centrado'},
                    {nombre: 'nombre',  edicion: false,	formato: false,     alineacion: 'justificado'}
                ],
                automatico: false
            }
        );
    },

    agregar: function() {

        var ids = this.obtenerIdsTablas();

        if (ids) {

            this._GuardarIdsModulosPorEmpresa['id_empresa'] = this.ie;
            this._GuardarIdsModulosPorEmpresa['ids']        = ids;

            this.$ajaxS(
                this.idRetorno,
                this.uri,
                this._GuardarIdsModulosPorEmpresa,

                function (json) {

                    Api.Mensaje.jsonSuperior(json);
                    Api.Modulos.constructor();
                }
            );
        }
        else {
            Api.Mensaje.superior('informacion','Información','Debe seleccionar algun módulo o sesión para continuar');
        }
    },

    quitar: function() {

    },

    obtenerIdsTablas: function() {

        var AHoC        = Api.Herramientas.obtenerCheck,
            ids         = '',
            idsModulos  = '',
            idsSesiones = '';

        idsModulos  = AHoC('tabla-modulo-contenido',true);
        idsSesiones = AHoC('tabla-sesion-contenido',true);

        if (idsModulos) {
            ids = idsModulos + (idsSesiones ? ',' + idsSesiones : idsSesiones);
        }
        else {
            ids = idsSesiones;
        }

        return ids;
    }
};