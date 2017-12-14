/**
 * Created by Jeremy Jose Reyes Barrios on 3/07/2017.
 */

Api.Ajax = {
    pagina: 1,
    tamanhio: 10,
    buscar: '',


    constructor: function(id,pagina,tamanhio) {

        var $AA     = Api.Ajax;
        var $buscar = $(Api.Herramientas.verificarId(id,true)+'-buscador').find('input');

        pagina              ? $AA.pagina   = pagina         : null;
        tamanhio            ? $AA.tamanhio = tamanhio       : null;
        $buscar.length > 0  ? $AA.buscar   = $buscar.val()  : $AA.buscar = '';
    },

    inicializar: function(parametros) {

        var $ajax = Api.Ajax;

        parametros.pagina   = $ajax.pagina;
        parametros.tamanhio = $ajax.tamanhio;
        parametros.buscador = $ajax.buscar;

        return parametros;
    },

    ajaxSimple: function(id, uri, data, callback) {
        $.ajax({
            url: uri,
            type: 'post',
            data: data,
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            },
            dataType: 'json',
            beforeSend: function(){
                id ? $(Api.Herramientas.verificarId(id,true)).html($('#clonar-cargando').html()) : '';
            },
            success: function (json) {
                callback(json)
            },
            error: function(result) {
                Api.Mensaje.publicar('error',id,'Se encontraron errores al momento de procesar la solicitud');
            }
        });
    },

    ajaxTabla: function (id,uri,parametros,tabla) {

        var $ajax           = Api.Ajax;
        var $herramientas   = Api.Herramientas;
        var $elementos      = Api.Elementos;
        var tablaExiste     = $herramientas.tablaExiste(id);

        $ajax.ajaxSimple(
            tablaExiste ? '' : id,
            uri,
            $ajax.inicializar(parametros),

            function(json) {

                if (!tablaExiste) {
                    $ajax.agregarFuncionalidades(id, tabla, $elementos, json);
                }
                else {
                    $elementos.crearPaginacion(
                        $herramientas.verificarId(id,false) + '-paginacion',
                        tabla.objecto,
                        json,
                        $ajax.tamanhio,
                        $ajax.buscar
                    );
                }

                $elementos.crearTablaJson(id,json,tabla);
            }
        );
    },

    agregarFuncionalidades: function(id,tabla,$elementos,json) {

        var idS = Api.Herramientas.verificarId(id,false);

        $('#' + idS).html('');

        if (tabla.funcionalidades.buscador) {

            $elementos.crearBuscador(
                $elementos.crearDivsTabla(idS,'buscador'),
                idS,
                tabla
            );
        }

        if (tabla.funcionalidades.resultados) {

            $elementos.crearListaResultados(
                $elementos.crearDivsTabla(idS,'resultados'),
                tabla
            );
        }

        $elementos.crearDivsTabla(idS,'contenido');

        if (tabla.funcionalidades.paginacion) {

            $elementos.crearPaginacion(
                $elementos.crearDivsTabla(idS,'paginacion'),
                tabla.objecto,
                json,
                Api.Ajax.tamanhio,
                Api.Ajax.buscar
            );
        }

        return true;
    }
};


var limpiarFormulario = true;
var botonCancelar = true;

/**
 * @autor Jeremy Reyes B.
 * @version 1.0
 * @see _cargando, _mensaje, _crearBloque, _verificarPermisos, _mostrarPaginacion.
 *
 * Realiza una peticion por ajax y crea bloques con los resultados paginacion y con opciones.
 *
 * @param string controladorUrl:    Nombre del controlador al que va dirigido.
 * @param string data:              Datos que se envian.
 * @param string id:                Nombre del identificador donde se mostraran los resultados.
 * @param array  opciones:          Arreglo de las opciones que se habilitaran (eliminar, detalle).
 * @param array  informacion:       Arreglo con los nombres de la cabecera de la tabla.
 * @param array  paginacion:        Arreglo con las configuraciones de la paginacion.
 * @param string ruta:              Ruta donde esta ubicada la imagen.
 */
function _ajaxBloques(controladorUrl,data,id,opciones,informacion,paginacion,ruta,tamanhioBloque) {

    $.ajax({
        url: controladorUrl.toLowerCase(),
        type: 'post',
        data: data+paginacion[0]+'&carpetaControlador='+carpetaControlador,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        },
        dataType: 'json',
        beforeSend: function(){
            $('#'+id).html(_cargando());
        },
        success: function (json) {

            if (parseInt(json.total) > 0) {
                var bloques = _crearBloque(informacion,json.data,opciones,controladorUrl,paginacion[3],paginacion[1],ruta,tamanhioBloque);

                $("#"+id).html(bloques);

                setTimeout(function(){ _verificarPermisos(); }, tiempoMostrarIconos);


                if (paginacion.length > 0) {

                    _mostrarPaginacion(paginacion[2],paginacion[1],json.last_page,json.current_page);
                }
            }
            else {
                _mensaje('advertencia',id,'No se encontraron resultados para esta consulta')
            }
        },
        error: function(result) {
            mensaje('error',id, 'Se encontraron errores al momento de procesar la solicitud');
        }
    });
}


/**
 * @autor Jeremy Reyes B.
 * @version 1.0
 * @see _cargando, _mensaje.
 *
 * Realiza una peticion por ajax y llena los imputs de la pagina.
 *
 * @param string controladorUrl:    Nombre del controlador al que va dirigido.
 * @param string data:              Datos que se envian.
 * @param string id:                Nombre del identificador donde se mostraran los resultados.
 * @param array  input:             Tipo de elemento.
 * @param array  predeterminado:    Mensaje predeterminado.
 * @param string carpeta:           Nombre de la carpeta si no quiere seleccionar la predeterminada.
 */
function _ajaxLlenarInputs(controladorUrl,data,id,input,predeterminado,carpeta) {

    $.ajax({
        url: controladorUrl.toLowerCase(),
        type: 'post',
        data: data+'&carpetaControlador='+ (carpeta ? carpeta : carpetaControlador),
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        },
        dataType: 'json',
        beforeSend: function(){
            $('#'+id).html(_cargando());
        },
        success: function (json) {

            var cnt = 0;
            switch (input) {
                case 'select':
                    $.each(json, function(i, item) {
                        if (cnt == 0) {
                            $('#' + id).append('<option value="">Seleccione un ' + predeterminado + '</option>');
                        }

                        $('#'+id).append('<option value="'+item.id+'">'+item.nombre+'</option>');

                        cnt++;
                    });

                    if (cnt == 0)
                        $('#'+id).append('<option value="">Seleccione una '+predeterminado+'</option>');
                    break;
            }

        },
        error: function(result) {
            _mensaje('error',id, 'Se encontraron errores al momento de procesar la solicitud');
        }
    });
}


/**
 * @autor Jeremy Reyes B.
 * @version 1.0
 * @see _cargando, _mensaje.
 *
 * Realiza una peticion por ajax y llena los imputs de la pagina.
 *
 * @param string url:           url a la que va dirigida.
 * @param string data:          Datos que se envian.
 * @param string id:            Nombre del identificador donde se mostraran los resultados.
 * @param string formulario:    Nombre del formulario que se limpiará.
 * @param string idActualizar:  Indentificador que se enviará de parametro en la funcion de actualizar.
 * @param bool botonCancelar:   Habilita o deshabilita el boton de cancelar.
 */
function _ajaxLlenarCamposActualizar(url,data,campos,id,formulario,idActualizar,botonCancelar) {

    $.ajax({
        url: url,
        type: 'post',
        data: data+'&carpetaControlador='+carpetaControlador,
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
        },
        dataType: 'json',
        beforeSend: function(){
            $('#'+id).html(_cargando());
        },
        success: function (json) {

            $.each(campos, function(i, item) {
                if(item == 'id_municipio') {
                    $('#'+item).append('<option value="'+json[0][item]+'">'+json[0]['nombre_municipio']+'</option>').val(json[0][item]);
                }
                else {

                    if(json[0]) {
                        $('#'+item).val(json[0][item])
                    }
                    else {
                        $('#'+item).val(json[item])
                    }

                }
            });


            if (botonCancelar) {
                if (!$("#botonCancelar").length) {
                    $('#divGuardar').append('<button id="botonCancelar" class="btn btn-default " type="button" onclick="cancelarGuardar(\'' + formulario + '\')"><i class="' + iconoCancelar + '"></i> Cancelar</button>');
                }
            }

            $('#botonGuardar').slideUp(300,function(){
                if (botonCancelar) {
                    $('#botonCancelar').slideDown(300);
                }
                $('#botonActualizar').attr('onClick',"guardar('true',"+idActualizar+")").slideDown(300);
            });

            $('#'+id).html('');
        },
        error: function(result) {
            _mensaje('error',id, 'Se encontraron errores al momento de procesar la solicitud');
        }
    });
}


