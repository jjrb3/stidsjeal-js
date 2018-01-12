/**
 * Created by Jeremy Jose Reyes Barrios on 3/07/2017.
 */

Api.Elementos = {
    tamanhioPaginacion: 5,
    paginas: [10, 25, 50, 100, 200, 500, 750, 1000],
    botonActivo: '<span class="label label-primary">ACTIVO</span>',
    botonInactivo: '<span class="label label-default">INACTIVO</span>',

    constructor: function() {

        $('#clonar-input').html('<input>');
        $('#clonar-select').html('<select></select>');
        $('#clonar-tabla').html('<div class="table-responsive"><table><thead></thead><tbody></tbody></table></div>');
        $('#clonar-boton').html('<button></button>');
    },

    funcionalidadesTabla: function() {
        return {
            buscador: true,
            resultados: true,
            paginacion: true
        }
    },

    opcionesTabla: function(objecto) {

        return {
            parametrizacion: [
                {
                    nombre: 'Ver detalle',
                    icono: 'fa-eye',
                    accion: 'Api.' + objecto + '.detalle',
                    color: '#428bca',
                    estado: false,
                    permiso: false,
                    informacion: true
                },
                {
                    nombre: 'Actualizar',
                    icono: 'fa-pencil-square-o',
                    accion: 'Api.' + objecto + '.editar',
                    color: '#1a7bb9',
                    estado: false,
                    permiso: 'actualizar',
                    informacion: false
                },
                {
                    accion: 'Api.' + objecto + '.cambiarEstado',
                    color: '#f7a54a',
                    estado: true,
                    condicion: {
                        1: {
                            icono: 'fa-toggle-off',
                            titulo: 'Desactivar',
                            etiqueta: '<span class="label label-primary ">ACTIVO</span>'
                        },
                        0: {
                            icono: 'fa-toggle-on',
                            titulo: 'Activar',
                            etiqueta: '<span class="label label-default">INACTIVO</span>'
                        }
                    },
                    permiso: 'estado',
                    informacion: false
                },
                {
                    nombre: 'Eliminar',
                    icono: 'fa-trash',
                    accion: 'Api.' + objecto + '.eliminar',
                    color: '#ec4758',
                    estado: false,
                    permiso: 'eliminar',
                    informacion: true
                }
            ]
        };
    },

    crearDivsTabla: function(id,nombre) {

        var idS = Api.Herramientas.verificarId(id,false);

        $('#' + idS).append('<div id="' + idS + '-' + nombre + '"></div>');

        return idS + '-' + nombre;
    },

    crearBuscador: function (div,id,$tabla) {

        var $herramientas = Api.Herramientas;

        var $input = $('#clonar-input > input')
            .addClass('form-control')
            .addClass('float-left')
            .addClass('wp50')
            .attr('id','buscador')
            .attr('placeholder','Buscar...')
            .attr('onkeypress','Api.Herramientas.buscarTablaEnter(event,'+"'" + $tabla.objecto + "','" + $tabla.metodo + "','" + $herramientas.verificarId(id,true) + "'"+')');

        $($herramientas.verificarId(div,true)).html($input);

        Api.Elementos.constructor();
    },

    crearListaResultados: function (div,$tabla,buscar) {

        var id = '#clonar-select > select';

        $.each(Api.Elementos.paginas, function(k, i) {
            $(id).append(
                $('<option>', {
                    value: i,
                    text: Api.Herramientas.formatoNumerico(String(i))
                })
            );
        });

        var $select = $(id)
            .addClass('form-control')
            .addClass('float-right')
            .addClass('w100')
            .attr('onchange','Api.' + $tabla.objecto + "." + $tabla.metodo + "(1,this.value,'" + buscar + "')")
            .parent()
            .html();


        $(Api.Herramientas.verificarId(div,true)).html($select);

        Api.Elementos.constructor();
    },

    crearPaginacion: function(div,objecto,metodo,json,tamanhio,buscar) {

        var cantidad        = json.last_page;
        var paginaActual    = json.current_page;
        var paginacion      = '<ul class="pagination">';
        var anterior        = '';
        var siguiente       = '';
        var activo          = '';

        if (cantidad > 1) {

            var rango = Api.Elementos.rangoPaginacion(paginaActual, cantidad);

            if (parseInt(paginaActual) - 1 > 0) {

                paginacion += '<li class="apuntar"><a onclick="Api.' + objecto + '.' + metodo + '(' + (parseInt(paginaActual) - 1) + ',' + tamanhio + ",'" + buscar + "'" + ')">«</a></li>';
            }

            for (var i=rango.inicio;i<=rango.fin;i++) {

                if (i === paginaActual) {
                    activo = ' class="active default" '
                }
                else {
                    activo = '';
                }
                paginacion += '<li '+activo+' class="apuntar"><a onclick="Api.' + objecto + '.' + metodo + '(' + i + ',' + tamanhio + ",'" + buscar + "'" + ')">' + i + '</a></li>';
            }

            if (parseInt(paginaActual) + 1 <= cantidad) {

                paginacion += '<li class="apuntar"><a onclick="Api.' + objecto + '.' + metodo + '(' + (parseInt(paginaActual) + 1) + ',' + tamanhio + ",'" + buscar + "'" + ')">»</a></li>';
            }
        }

        paginacion += '</ul>';

        $(Api.Herramientas.verificarId(div,true)).html(paginacion);
    },

    rangoPaginacion: function(pagina, cantidad) {

        var limite	 = Api.Elementos.tamanhioPaginacion - 1;
        var rango 	 = null;
        var distancia = Math.round(limite / 2);

        if (cantidad > limite) {

            if (pagina + limite > cantidad) {

                rango = {inicio: (cantidad - limite), fin: cantidad};
            }
            else {

                if (pagina - distancia < 1 || limite - distancia < 1) {
                    rango = {inicio: 1, fin: limite + 1};
                }
                else {
                    rango = {inicio: pagina - distancia, fin: (pagina + limite - distancia)};
                }
            }
        }
        else {
            rango = {inicio: 1, fin: cantidad};
        }

        return rango;
    },

    crearTablaJson: function(div,json,$tabla) {

        var id          = '#clonar-tabla ';
        var $contenido  = $(id).children('div').children('table');
        var $elementos  = Api.Elementos;

        $(id)
            .children('div')
            .children('table')
            .addClass('table')
            .addClass('table-bordered')
            .addClass('table-hover')
            .addClass('table-striped')
            .addClass('tablesorter')
            .parent()
            .css('width','100%');


        // Crear cabecera
        $elementos.crearCabeceraTabla(id,$contenido,$tabla,div);
        $elementos.crearCuerpoTabla(id,$contenido,$tabla,json,div);



        $(Api.Herramientas.verificarId(div + '-contenido',true)).html($(id).html());

        Api.Elementos.constructor();
    },

    crearCabeceraTabla: function(id,$contenido,$tabla,div) {

        $contenido.children('thead').append('<tr></tr>');

        // Se crea el checkbox si esta habilitado
        if ($tabla.checkbox) {

            $contenido
                .children('thead')
                .children('tr:last')
                .append('<th>' + $('#clonar-checkbox')
                    .children('label')
                    .addClass('m-left--16')
                    .children('input')
                    .attr('onclick',"Api.Herramientas.checkTabla('" + div + "');")
                    .attr('value','')
                    .parent()
                    .parent()
                    .html() + '</th>');

            $(id + 'th').addClass('centrado');
        }

        $.each($tabla.columnas, function(k,i) {

            $contenido
                .children('thead')
                .children('tr:last')
                .append('<th>' + Api.Herramientas.primeraMayuscula(i.nombre.replace(/_/g, " ")) + '</th>');

            $(id + 'th').addClass('centrado');
        });


        // Se crea las opciones
        if ($tabla.opciones !== null) {

            $contenido
                .children('thead')
                .children('tr:last')
                .append('<th>Opciones</th>');

            $(id + 'th').addClass('centrado');
        }
    },

    crearCuerpoTabla: function(id,$contenido,$tabla,json,div) {

        if (Object.keys(json.data).length !== 0) {

            var $cnt,
                $estado,
                textoFormateado,
                color,
                seleccion = '',
                cursor = '';

            $.each(json.data, function (kj, ij) {

                $contenido.children('tbody').append('<tr></tr>');

                $.each($tabla.columnas, function (kc, ic) {

                    // Si decidimos que la tabla tenga estados de colores
                    color = $tabla.color ? ij.color_estado : '';

                    // Si habilita que cuando presione click en una fila ejecute una funcion
                    if ($tabla.seleccionar) {
                        seleccion   = 'onclick="Api.' + $tabla.objecto + '.' + $tabla.metodo + 'Seleccionado(' + ij.id_seleccionar + ')"';
                        cursor      = ' apuntar';
                    }

                    // Si existe checkbox
                    if ($tabla.checkbox && kc === 0) {

                        $cnt = $contenido
                            .children('tbody')
                            .children('tr:last')
                            .append('<td class="centrado vertical ' + color + cursor + '" width="30px" ' + seleccion + '>' + $('#clonar-checkbox')
                                .children('label')
                                .addClass('m-left--20')
                                .children('input')
                                .val(ij.id)
                                .attr('onclick', '')
                                .parent()
                                .parent()
                                .html() + '</td>');
                    }
                    if (ic.nombre !== 'opciones' && ic.nombre !== 'estado' && ic.nombre !== 'etiqueta') {

                        textoFormateado = Api.Elementos.crearFormato(ic.formato, ij[ic.nombre]);

                        $cnt = $contenido
                            .children('tbody')
                            .children('tr:last')
                            .append('<td class="vertical ' + color + cursor + '" ' + seleccion + '>' + textoFormateado + '</td>');


                        $cnt.children('td:last').addClass(ic.alineacion);
                    }
                    if (ic.nombre === 'estado') {

                        var estado;

                        $.each($tabla.opciones.parametrizacion, function (ke, ie) {

                            if (ie.estado) {

                                $estado = ie.condicion[ij.estado];

                                $cnt = $contenido
                                    .children('tbody')
                                    .children('tr:last')
                                    .append('<td class="vertical ' + color + cursor + '" ' + seleccion + '>' + $estado.etiqueta + '</td>');

                                $cnt.children('td:last').addClass(ic.alineacion);
                            }
                        });
                    }
                    if (ic.nombre === 'etiqueta') {

                        var etiquetaSistema = '';

                        if (ij.etiqueta_clase) {

                            etiquetaSistema = '<span class="label label-' + ij.etiqueta_clase
                                + '" title="Diminutivo. ' + ij.etiqueta_diminutivo
                                + '">' + ij.etiqueta_nombre + '</span>';
                        }

                        $cnt = $contenido
                            .children('tbody')
                            .children('tr:last')
                            .append('<td class="vertical centrado' + color + cursor + '" ' + seleccion + '>' + etiquetaSistema + '</td>');

                        $cnt.children('td:last').addClass(ic.alineacion);
                    }
                });

                if ($tabla.opciones !== null) {
                    Api.Elementos.crearOpciones($contenido, $tabla, ij);
                }
            });
        }
        else {
            div = Api.Herramientas.verificarId(div,true);

            Api.Mensaje.publicar('informacion', div + '>' + div + '-paginacion', 'No se encontraron resultados');
        }
    },

    crearFormato: function (formato,texto) {

        texto = (texto === null) ? '' : texto;

        switch (formato)
        {
            case 'moneda':
                return '$' + Api.Herramientas.formatoNumerico(texto);
                break;

            case 'numerico':
                return Api.Herramientas.formatoNumerico(texto);
                break;

            case 'icono':
                return '<i class="fa ' + texto + ' size-20" aria-hidden="true"></i>';
                break;

            default:
                return texto;
        }
    },

    crearOpciones: function ($contenido,$tabla,json) {

        var $elementos = Api.Elementos;

        var $menu = $elementos.inicializarMenuDesplegable('#clonar-grupo-menu');

        $.each($tabla.opciones.parametrizacion, function(k, i) {

            // Si tiene habilitado el permiso verifica que si puede mostrar la opcion o no
            if (!i.permiso || i.permiso !== false && Api.permisos !== null && Api.permisos.indexOf(Api.descripcionPermisos[i.permiso]) > -1) {

                if (!i.estado) {

                    $menu = $elementos.iconosDeOpciones(
                        $menu,
                        i.accion,
                        json.id,
                        i.icono,
                        i.color,
                        i.nombre,
                        i.informacion,
                        json
                    );
                }
                else if(i.accion){

                    $menu = $elementos.iconosDeOpciones(
                        $menu,
                        i.accion,
                        json.id,
                        i.condicion[json.estado].icono,
                        i.color,
                        i.condicion[json.estado].titulo,
                        i.informacion,
                        json
                    );
                }
            }
        });


        var $cnt = $contenido
            .children('tbody')
            .children('tr:last')
            .append('<td class="vertical" width="1%">' + $menu.html() + '</td>');

        $cnt.addClass('centrado').css('padding','0px');

        $('#clonar-grupo-menu').html('<div class="btn-group"><button></button><ul></ul></div>');
    },

    crearBotonIcono: function(claseColor,titulo,icono) {

        var $boton  = $('#clonar-boton');
        var html    = '';

        $boton.children('button').addClass('btn').addClass('btn-' + claseColor).attr('title',titulo).html('<i class="fa ' + icono + '"></i>');

        html = $boton.html();

        $boton.html('<button></button>');

        return html;
    },

    crearEtiqueta: function(url, icono, titulo, descripcion) {
        var id          = '#clonar-etiqueta';
        var $id         = $(id);
        var anterior    = $id.html();
        var html        = '';

        $id.find('#href').attr('href',url);
        $id.find('#icono').addClass(icono);
        $id.find('#titulo').text(titulo);
        $id.find('#descripcion').text(descripcion);

        html = $id.html();

        $id.html(anterior);

        console.log(html);

        return html;
    },

    iconosDeOpciones: function($menu,accion,id,icono,color,texto,informacion,json) {

        var objeto = '';

        if (informacion === true) {
            objeto = ',' + JSON.stringify(json);
        }

        return $menu.children('div')
            .children('ul')
            .append('<li></li>')
            .children('li:last')
            .attr('onclick',accion + '(' + id + objeto+ ')')
            .append('<a></a>')
            .children('a')
            .append('<ul></ul>')
            .children('ul')
            .addClass('m-left--50')
            .append('<li>')
            .children('li:last')
            .addClass('icono-menu-boton')
            .append('<i class="fa ' + icono + ' size-16"></i>')
            .children('i')
            .addClass('posicion-icono-menu-boton')
            .css('color',color)
            .parent()
            .append('<li>')
            .children('li:last')
            .addClass('texto-menu-boton')
            .append(texto)
            .parent()
            .parent()
            .parent()
            .parent()
            .parent()
            .parent()
            .parent();
    },

    inicializarMenuDesplegable: function(id) {

        return $(id)
            .children('div')
            .addClass('btn-group')
            .addClass('grupo-menu')
            .children('button')
            .attr('data-toggle','dropdown')
            .attr('aria-expanded','false')
            .addClass('grupo-menu-boton')
            .addClass('btn')
            .addClass('dropdown-toggle')
            .append('<i class="fa fa-outdent size-20" aria-hidden="true"></i>')
            .parent()
            .children('ul')
            .addClass('dropdown-menu')
            .parent()
            .parent();
    }
};


var iconoActualizar = 'fa fa-pencil-square-o fa-2x';
var iconoActualizarRapido = 'fa fa-pencil fa-2x';
var iconoActivo = 'fa fa-toggle-on fa-2x';
var iconoInactivo = 'fa fa-toggle-off fa-2x';
var iconoEliminar = 'fa fa-trash fa-2x';
var iconoDetalle = 'fa fa-eye fa-2x';
var iconoMover = 'fa fa-arrows fa-2x';
var iconoPagar = 'fa fa-money fa-2x';
var iconoBorrar = 'fa fa-eraser fa-2x';

var iconoExcel = 'fa fa-file-excel-o';
var iconoWord = 'fa fa-file-word-o';
var iconoPDF = 'fa fa-file-pdf-o';
var iconoTexto = 'fa fa-file-text-o';
var iconoImportar = 'fa fa-cloud-upload';
var iconoCancelar = 'fa fa-times';


var tiempoMostrarIconos = 500;


function _crearTabla(cabecera,edicion,json,opciones,estados,nombreTabla,exportarImportar,controlador,tamanhioPagina,funcion){

    var tabla  = _inputBuscador(funcion)+_botonesExportarImportar(exportarImportar,controlador)+_selectCantidadPagina(tamanhioPagina,funcion)+'<div class="col-lg-12"><div class="table-responsive"><table class="table table-bordered table-hover table-striped tablesorter"><thead><tr>';

    // Se llena la cabecera
    $.each(cabecera, function(i, item) {
        tabla += '<th>'+_primeraMayuscula(item.replace(/_/g, " "))+'</th>';
    });

    // Se crea las opciones
    if (opciones.length > 0) {
        tabla += '<th>Opciones</th>';
    }

    tabla += '</tr></thead><tbody>';

    $.each(json, function(ji, jItem) {
        tabla += '<tr id="'+nombreTabla+'_'+jItem['id']+'">';
        $.each(cabecera, function(i, item) {
            if (item != 'opciones' && item != 'estado'){

                if (edicion[i]) {
                    tabla += '<td class="editable '+item+'">'+(jItem[item] == null ? '' : jItem[item])+'</td>';
                }
                else {
                    tabla += '<td>'+(jItem[item] == null ? '' : jItem[item])+'</td>';
                }
            }
            if (item == 'estado') {
                tabla += '<td align="center">'+estados[jItem[item]]+'</td>';
            }
        });

        // Si hay opciones se llena los campos de opciones
        if (opciones.length > 0) {

            tabla += '<td>';

            if (opciones.indexOf('actualizacionRapida') > -1) {
                tabla += '<a onclick="actualizacionRapida'+controlador+'('+ jItem['id'] +',true,event)" title="Rapida Edición" class="iconoActualizarRapido" style="display:none"><i class="'+iconoActualizarRapido+'" aria-hidden="true"></i></a> ';
            }

            if (opciones.indexOf('estado') > -1) {

                if (jItem['estado'] == 1) {
                    tabla += '<a onclick="estado'+controlador+'('+ jItem['id']+',0)" title="Activo" class="iconoEstado" style="display:none"><i class="'+iconoActivo+'" aria-hidden="true"></i></a> ';
                }
                else {
                    tabla += '<a onclick="estado'+controlador+'('+ jItem['id']+',1)" title="Inactivo" class="iconoEstado" style="display:none"><i class="'+iconoInactivo+'" aria-hidden="true"></i></a> ';
                }
            }

            if (opciones.indexOf('actualizar') > -1) {
                tabla += '<a onclick="actualizar'+controlador+'('+ jItem['id'] +')" title="Edición completa" class="iconoActualizar" style="display:none"><i class="'+iconoActualizar+'" aria-hidden="true"></i></a> ';
            }

            if (opciones.indexOf('eliminar') > -1) {
                tabla += '<a onclick="eliminar'+controlador+'('+ jItem['id']+',false)" title="Eliminar" class="iconoEliminar" style="display:none"><i class="'+iconoEliminar+'" aria-hidden="true"></i></a> ';
            }

            if (opciones.indexOf('detalle') > -1) {
                tabla += '<a onclick="detalle'+controlador+'('+ jItem['id']+')" title="Ver detalle" class="iconoDetalle" style="display:none"><i class="'+iconoDetalle+'" aria-hidden="true"></i></a> ';
            }

            if (opciones.indexOf('mover') > -1) {
                tabla += '<a onclick="mover'+controlador+'('+ jItem['id']+')" title="Mover" class="iconoMover" style="display:none"><i class="'+iconoMover+'" aria-hidden="true"></i></a> ';
            }

            if (opciones.indexOf('pagar') > -1) {
                tabla += '<a onclick="pagar'+controlador+'('+ jItem['id']+')" title="Pagar" class="iconoPagar" style="display:none"><i class="'+iconoPagar+'" aria-hidden="true"></i></a> ';
            }

            if (opciones.indexOf('borrar') > -1) {
                tabla += '<a onclick="borrar'+controlador+'('+ jItem['id']+')" title="Borrar" class="icono-borrar" style="display:none"><i class="'+iconoBorrar+'" aria-hidden="true"></i></a> ';
            }

            tabla +='</td>';
        }

        tabla += '</tr>';
    });

    tabla += '</tbody>';
    tabla += '</table></div></div>';

    return tabla;
}


/**
 * @autor Jeremy Reyes B.
 * @version 1.0
 * @see _inputBuscador, _botonesExportarImportar, _selectCantidadPagina, _primeraMayuscula.
 *
 * Realiza una peticion por ajax y crea una tabla en la pagina con resultados, paginacion, buscador y opciones.
 *
 * @param array  informacion:       Arreglo con la informacion que se colocara.
 * @param json   json:              JSON con los resultados de la peticion.
 * @param array  opciones:          Arreglo de las opciones que se habilitaran (eliminar, detalle).
 * @param string controlador:       Nombre del controlador al que va dirigido.
 * @param string tamanhioPagina:    Tamaño de la pagina a mostrar.
 * @param string funcion:           Nombre de la funcion que se utilizará.
 * @param string ruta:              Ruta donde esta ubicada la imagen.
 * @param interger ruta:            Tamaño de los bloques.
 *
 * @return string: Tabla.
 */
function _crearBloque(informacion,json,opciones,controlador,tamanhioPagina,funcion,ruta,tamanhioBloque){

    var bloque = '';

    $.each(json, function(ji, jItem) {

        bloque += '<div class="col-lg-'+tamanhioBloque+'">';
        bloque += '<div class="ibox float-e-margins">';
        bloque += '<div class="ibox-title" align="center">';

        if (jItem.titulo && jItem.titulo != null) {bloque += jItem.titulo;}

        bloque += '</div>';
        bloque += '<div class="ibox-content ibox-heading" align="center">';
        bloque += '<img src="'+$('#directorioRecursos').val()+ruta+jItem.id+'.png" width="100%">';
        bloque += '</div>';
        bloque += '<div class="ibox-content inspinia-timeline">';
        bloque += '<p>';

        if (jItem.descripcion) {
            bloque += jItem.descripcion;
        }

        if (jItem.nombre_boton) {
            bloque += '<div><strong>Nombre Boton: </strong>'+jItem.nombre_boton+'</div>';
        }

        if (jItem.enlace) {

            if (jItem.enlace.indexOf('http') > -1 || jItem.enlace.indexOf('www') > -1) {
                bloque += '<div><strong>Enlace: </strong><a href="' + jItem.enlace + '" target="_blank">' + jItem.enlace + '</a></div>';
            }
            else {
                bloque += '<div><strong>Enlace: </strong><a href="../../' + jItem.enlace + '" target="_blank">' + jItem.enlace + '</a></div>';
            }
        }

        if (jItem.posicion_horizontal) {
            bloque += '<div><strong>Posición horizontal: </strong>'+jItem.posicion_horizontal+'</div>';
        }

        if (jItem.posicion_vertical) {
            bloque += '<div><strong>Posición vertical: </strong>'+jItem.posicion_vertical+'</div>';
        }

        bloque += '</p><p align="center"><br>';

        if (opciones.indexOf('actualizar') > -1) {
            bloque += '<button type="button" class="btn btn-primary iconoActualizar" onclick="actualizar'+controlador+'('+ jItem['id']+')" title="Actualizar" style="display:none">Actualizar</button>&nbsp;';
        }

        if (opciones.indexOf('detalle') > -1) {
            bloque += '<button type="button" class="btn btn-success iconoDetalle" onclick="detalle'+controlador+'('+ jItem['id']+')" title="Ver detalle" style="display:none">Ver imagen</button>&nbsp;';
        }

        if (opciones.indexOf('eliminar') > -1) {
            bloque += '<button type="button" class="btn btn-default iconoEliminar" onclick="eliminar'+controlador+'('+ jItem['id']+',false)" title="Eliminar" style="display:none">Eliminar</button>';
        }


        bloque += '</p>';
        bloque += '</div>';
        bloque += '</div>';
        bloque += '</div>';

    });

    return bloque;
}


/**
 * @autor Jeremy Reyes B.
 * @version 1.0
 *
 * Crea una lista desplegable con los tamaño de la pagina para la tabla.
 *
 * @param string tamanhioPagina: Tamaño de la pagina que se seleccionará.
 * @param string funcion:        Nombre de la funcion que se utilizará.
 *
 * @return string: Listado de paginas a mostrar.
 */
function _selectCantidadPagina(tamanhioPagina,funcion) {

    var numeroPagina = [10,25,50,100,200,500];

    var selectCantidadPagina = '<div class="col-lg-4"><select id="tamanhioPagina" class="form-control" style="width:100px;margin-left:auto" onchange="'+funcion+'(1,this.value)"></div>';

    $.each(numeroPagina, function(i, item) {
        if (tamanhioPagina == item) {
            selectCantidadPagina += '<option value="'+item+'" selected>'+item+'</option>';
        }
        else {
            selectCantidadPagina += '<option value="'+item+'">'+item+'</option>';
        }
    });

    selectCantidadPagina += '</select></div><br>';

    return selectCantidadPagina;
}


/**
 * @autor Jeremy Reyes B.
 * @version 1.0
 *
 * Crea la paginacion para la tabla.
 *
 * @param string    elemento:       Nombre del indentificador donde aparecerá la paginación.
 * @param string    metodoJS:       Nombre del metodo JS que se uzará al momento de presionar clic en un boton.
 * @param interger  cantidad:       Cantidad de resultados.
 * @param ingerger  paginaActual:   Pagina actual.
 */
function _mostrarPaginacion(elemento,metodoJS,cantidad,paginaActual) {

    var paginacion = '<div class="col-lg-12"><ul class="pagination">';
    var anterior = '';
    var siguiente = '';
    var activo = '';

    if (cantidad > 1) {

        if (paginaActual - 1 > 0) {

            paginacion += '<li><a style="cursor:pointer;" onclick="'+metodoJS+'('+(paginaActual - 1)+')">«</a></li>';
        }

        for (var i=1;i<=cantidad;i++) {

            if (i == paginaActual) {
                activo = ' class="active default" '
            }
            else {
                activo = '';
            }
            paginacion += '<li '+activo+'><a style="cursor:pointer;" onclick="'+metodoJS+'('+i+')">'+i+'</a></li>';
        }

        if (paginaActual + 1 <= cantidad) {

            paginacion += '<li><a style="cursor:pointer;" onclick="'+metodoJS+'(' + (paginaActual + 1) + ')">»</a></li>';
        }
    }

    paginacion += '</ul></div>';

    $("#"+elemento).html(paginacion);
}


/**
 * @autor Jeremy Reyes B.
 * @version 1.0
 *
 * Crea listado de botones para exportar e importar
 *
 * @param string exportarImportar:  Opciones que se habilitaran de exportar e importar.
 * @param string controlador:       Controlador que se usará.
 *
 * @return string: Listado de botones.
 */
function _botonesExportarImportar(exportarImportar,controlador) {

    var boton = '<div class="col-lg-4">';

    $.each(exportarImportar, function(i, item) {
        switch(item)
        {
            case 'excel':
                boton += '<button type="button" class="btn btn-primary iconoExportar" title="Exportar archivo de Excel" onclick="_exportar(\''+item+'\',\''+controlador+'\')" style="display:none"><i class="'+iconoExcel+'"></i></button>&nbsp;';
                break;

            case 'word':
                boton += '<button type="button" class="btn btn-success iconoExportar" title="Exportar archivo de Word" onclick="_exportar(\''+item+'\',\''+controlador+'\')" style="display:none"><i class="'+iconoWord+'"></i></button>&nbsp;';
                break;

            case 'pdf':
                boton += '<button type="button" class="btn btn-danger iconoExportar" title="Exportar archivo de PDF" onclick="_exportar(\''+item+'\',\''+controlador+'\')" style="display:none"><i class="'+iconoPDF+'"></i></button>&nbsp;';
                break;

            case 'texto':
                boton += '<button type="button" class="btn btn-default iconoExportar" title="Exportar archivo de Texto" onclick="_exportar(\''+item+'\',\''+controlador+'\')" style="display:none"><i class="'+iconoTexto+'"></i></button>&nbsp;';
                break;

            case 'importar':
                boton += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<button type="button" class="btn btn-primary iconoImportar" title="Importar listado CSV " onclick="_importar(\''+controlador+'\')" style="display:none">Importar CSV <i class="'+iconoImportar+'"></i></button>&nbsp;';
                break;
        }
    });

    boton += '</div>';

    return boton;
}


/**
 * @autor Jeremy Reyes B.
 * @version 1.0
 *
 * Guarda los datos modificados de la edicion rapida
 *
 * @param string id:            Identificador de la fila en la que se habilitará la edicion.
 * @param string nombreTabla:   Nombre de la tabla en la que se editará.
 * @param string controlador:   Controlador que se usará.
 * @param string formulario:    Nombre del formulario que se reseteará.
 */
function _guardarEdicionRapida(id,nombreTabla,controlador,formulario) {

    var urlActualizar = '&id='+id;

    $('#'+nombreTabla+'_'+id+' .editable').each(function(){

        var nombreCampo = this.className;
        nombreCampo = nombreCampo.replace("editable ", "");

        var valor = $('#'+nombreTabla+'_'+id+' .editable #'+nombreCampo).val();

        $(this).html(valor)

        urlActualizar += '&'+nombreCampo+'='+valor;
    });

    var data = _urlCrud('Actualizar',controlador)+urlActualizar+'&actualizacionRapida=true';

    _ajax(controlador.toLowerCase(),data,formulario);
}


/**
 * @autor Jeremy Reyes B.
 * @version 1.0
 *
 * Crea el codigo para el buscador de la tabla
 *
 * @param string funcion: Nombre de la funcion que ejecutará.
 *
 * @return string: Codigo del buscador.
 */
function _inputBuscador(funcion) {

    return '<div class="col-lg-4"><input type="search" id="buscadorBasico'+funcion+'" class="form-control" placeholder="Buscador..." onkeypress="_enterBuscadorBasico(event,\''+funcion+'\')"></div>';
}


/**
 * @autor Jeremy Reyes B.
 * @version 1.0
 *
 * Crea una mascara o copia de un input con sus valores.
 *
 * @param array inputs: Arreglo con el listado de inputs a enmascarar.
 */
function _crearMascaraInput(inputs){

    $.each(inputs, function(i, item) {

        $('#'+item.substring(7)).css('display','none');

        switch($('#'+item.substring(7))[0].type)
        {
            case 'select-one':
                $('#'+item).append('<input type="text" value="'+$('#'+item.substring(7)+' option[value="'+$('#'+item.substring(7)).val()+'"]').text()+'" disabled="disabled" class="form-control m-b">');
                break;

            case 'text':
                $('#'+item).append('<input type="text" value="'+$('#'+item.substring(7)).val()+'" disabled="disabled" class="form-control m-b">');
                break;
        }
    });
}



// Sin definir
function _exportar(tipo,controlador) {
    console.log(tipo+' - '+controlador)
}

function _importar(controlador) {
    console.log(controlador)
}




function _crearIcono(onclick,tipo) {

    var titulo  = '';
    var clase   = '';
    var icono   = '';

    switch (tipo) {
        case 'editar':
            titulo = 'Editar';
            clase = 'icono-actualizar';
            icono = iconoActualizar;
            break;

        case 'eliminar':
            titulo = 'Eliminar';
            clase = 'icono-eliminar';
            icono = iconoEliminar;
            break;
    }

    return ' <a onclick="'+onclick+'" title="'+titulo+'" class="'+clase+'" style="display: none;">' +
                '<i class="'+icono+'" aria-hidden="true"></i>' +
            '</a>';
}