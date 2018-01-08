
Api.Modulo = {
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
    _EliminarIdsModulosPorEmpresa: null,
    _ConsultarPorEmpresa: null,
    _ConsultarSesionPorEmpresaModulo: null,

    constructor: function () {
        this._ConsultarPorEmpresa                       = this.$uriCrud('ConsultarPorEmpresa', this.controlador, this.carpeta);
        this._ConsultarSesionPorEmpresaModulo           = this.$uriCrud('ConsultarSesionPorEmpresaModulo', this.controlador, this.carpeta);
        this._ConsultarCheckearPorEmpresa               = this.$uriCrud('ConsultarCheckearPorEmpresa', this.controlador, this.carpeta);
        this._ConsultarSesionCheckearPorEmpresaModulo   = this.$uriCrud('ConsultarSesionCheckearPorEmpresaModulo', this.controlador, this.carpeta);
        this._GuardarIdsModulosPorEmpresa               = this.$uriCrud('GuardarIdsModulosPorEmpresa', this.controlador, this.carpeta);
        this._EliminarIdsModulosPorEmpresa              = this.$uriCrud('EliminarIdsModulosPorEmpresa', this.controlador, this.carpeta);

        var  str                            = this.controlador;
        this.uri                            = str.toLowerCase();

        this.tablaModulo();
        this.tablaSesion();
    },

    tablaModulo: function(pagina,tamanhio) {

        this.$ajaxC(this.idTablaModulo,pagina,tamanhio);

        if (Api.ie > 1) {

            this._ConsultarPorEmpresa['id_empresa'] = this.ie;

            this.$ajaxT(
                this.idTablaModulo,
                this.uri,
                this._ConsultarPorEmpresa,
                {
                    objecto: this.controlador,
                    metodo: 'tablaModulo',
                    funcionalidades: this.$funcionalidadesT,
                    opciones: null,
                    checkbox: false,
                    color: false,
                    seleccionar: true,
                    columnas: [
                        {nombre: 'icono', edicion: false, formato: 'icono', alineacion: 'centrado'},
                        {nombre: 'nombre', edicion: false, formato: false, alineacion: 'justificado'}
                    ],
                    automatico: false
                }
            );
        }
        else {

            this._ConsultarCheckearPorEmpresa['id_empresa'] = this.ie;

            this.$ajaxT(
                this.idTablaModulo,
                this.uri,
                this._ConsultarCheckearPorEmpresa,
                {
                    objecto: this.controlador,
                    metodo: 'tablaModulo',
                    funcionalidades: this.$funcionalidadesT,
                    opciones: null,
                    checkbox: true,
                    color: true,
                    seleccionar: true,
                    columnas: [
                        {nombre: 'icono', edicion: false, formato: 'icono', alineacion: 'centrado'},
                        {nombre: 'nombre', edicion: false, formato: false, alineacion: 'justificado'}
                    ],
                    automatico: false
                }
            );
        }
    },

    tablaModuloSeleccionado: function(id) {

        this.idModulo = id;

        this.tablaSesion();
    },

    tablaSesion: function(pagina,tamanhio) {

        this.$ajaxC(this.idTablaSesion,pagina,tamanhio);

        if (Api.ie > 1) {

            this._ConsultarSesionPorEmpresaModulo['id_empresa'] = this.ie;
            this._ConsultarSesionPorEmpresaModulo['id_modulo'] = this.idModulo;

            this.$ajaxT(
                this.idTablaSesion,
                this.uri,
                this._ConsultarSesionPorEmpresaModulo,
                {
                    objecto: this.controlador,
                    metodo: 'tablaSesion',
                    funcionalidades: this.$funcionalidadesT,
                    opciones: null,
                    checkbox: false,
                    color: false,
                    seleccionar: false,
                    columnas: [
                        {nombre: 'icono',   edicion: false,	formato: 'icono',   alineacion: 'centrado'},
                        {nombre: 'nombre',  edicion: false,	formato: false,     alineacion: 'justificado'}
                    ],
                    automatico: false
                }
            );
        }
        else {

            this._ConsultarSesionCheckearPorEmpresaModulo['id_empresa'] = this.ie;
            this._ConsultarSesionCheckearPorEmpresaModulo['id_modulo'] = this.idModulo;

            this.$ajaxT(
                this.idTablaSesion,
                this.uri,
                this._ConsultarSesionCheckearPorEmpresaModulo,
                {
                    objecto: this.controlador,
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
        }
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
                    Api.ModuloEmpresa.constructor();
                }
            );
        }
        else {
            Api.Mensaje.superior('informacion','Información','Debe seleccionar algun módulo o sesión para continuar');
        }
    },

    quitar: function() {

        var AM  = Api.ModuloEmpresa;
        var ids = this.obtenerIdsTablas();


        if (ids) {

            this._EliminarIdsModulosPorEmpresa['id_empresa'] = this.ie;
            this._EliminarIdsModulosPorEmpresa['ids']        = ids;

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
                    AM.uri,
                    AM._EliminarIdsModulosPorEmpresa,

                    function (json) {

                        if (json.resultado === 1) {

                            swal("Eliminado!", json.mensaje, "success");
                            Api.ModuloEmpresa.constructor();
                        }
                        else {
                            swal("Error", json.mensaje , "error");
                        }
                    }
                );
            });
        }
        else {
            Api.Mensaje.superior('informacion','Información','Debe seleccionar algun módulo o sesión para continuar');
        }
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