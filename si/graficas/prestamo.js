
Api.Graficas.Prestamo = {
    uri: null,
    carpeta: 'Prestamo',
    controlador: 'Prestamo',

    $ajaxS: Api.Ajax.ajaxSimple,
    $uriCrudObjecto: Api.Uri.crudObjecto,

    _ConsultarTransacciones: null,
    _ConsultarTotalEstado: null,

    constructor: function() {
        this._ConsultarTransacciones    = this.$uriCrudObjecto('ConsultarTotales',this.controlador,this.carpeta);
        str             		        = this.controlador;
        this.uri        		        = str.toLowerCase();
    },

    totales: function(url) {

        this.constructor();

        var $AHfN = Api.Herramientas.formatoNumerico;

        $('#bg-prestamo-total-cliente').removeClass('ocultar');
        $('#bg-prestamo-total-realizados').removeClass('ocultar');
        $('#bg-prestamo-total-completados').removeClass('ocultar');
        $('#bg-prestamo-total-sin-completar').removeClass('ocultar');

        this.$ajaxS(
            '',
            url + this.uri,
            this._ConsultarTransacciones,

            function (json) {

                $('#bg-prestamo-total-cliente').find('.valor-total').text($AHfN(json.clientes));
                $('#bg-prestamo-total-realizados').find('.valor-total').text($AHfN(json.realizados));
                $('#bg-prestamo-total-completados').find('.valor-total').text($AHfN(json.completados));
                $('#bg-prestamo-total-sin-completar').find('.valor-total').text($AHfN(json.sin_completar));
            }
        );
    }
};