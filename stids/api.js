/**
 * Created by Jeremy Jose Reyes Barrios on 08/11/2017.
 *
 * Api
 */

var Api = {
    descripcionPermisos: {
        crear: 1,
        actualizar: 2,
        estado: 3,
        eliminar: 4,
        exportar: 5,
        importa: 6
    },
    permisos: null,
    ie: null,

    consultarDashboard: function() {

        Api.Ajax.ajaxSimple(
            '',
            'si/dashboard',
            Api.Uri.crudObjecto('ConsultarDashboard','Dashboard','Parametrizacion'),

            function (json) {

                if (Object.keys(json.datos).length > 0) {

                    if (json.tipo === 1) {

                        $('#bloque-de-etiquetas').removeClass('ocultar');

                        $.each(json.datos, function(k, i) {

                            $('#etiquetas:last').append(
                                Api.Elementos.crearEtiqueta(
                                    i.enlace_administrador + '?padre=' + i.id,
                                    i.icono,
                                    i.nombre,
                                    i.descripcion
                                )
                            )
                        });
                    }
                    else if (json.tipo === 2) {

                        $('#bloque-de-graficas').removeClass('ocultar');

                        $.each(json.datos, function(k, i) {

                            Api.Graficas[i.objeto][i.metodo]('si/');
                        });
                    }
                }
            }
        );
    }
};