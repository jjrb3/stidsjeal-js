/**
 * Created by Jeremy Jose Reyes Barrios on 3/07/2017.
 */

Api.Herramientas = {

    selectDefault: function(apuntador,seleccion) {

        apuntador = Api.Herramientas.verificarId(apuntador,true);

        $(apuntador + '> option[value=' + seleccion + ']').attr('selected',true);
        $(apuntador).val(seleccion).trigger("chosen:updated");
    },

    cargarSelectJSON: function(apuntador,json,mensaje,valorSelecionado) {

        if (Object.keys(json).length !== 0) {

            apuntador = Api.Herramientas.verificarId(apuntador,true);

            $(apuntador).html('');

            if (mensaje) {

                $(apuntador)
                    .html('')
                    .append(
                        $('<option>', {
                            value: '',
                            text: 'Seleccione...'
                        })
                    );
            }

            $.each(json, function(k, i) {

                $(apuntador).append(
                    $('<option>',{
                        value: i.id,
                        text: !i.nombre ? i.descripcion : i.nombre
                    })
                )
            });

            if (valorSelecionado) {
                $(apuntador + '> option[value=' + valorSelecionado + ']').attr('selected',true);
                $(apuntador).val(valorSelecionado).trigger("chosen:updated");
            }
            else {
                $(apuntador)
                    .find('option:first-child')
                    .prop('selected', true)
                    .end()
                    .trigger("chosen:updated");
            }

            Api.Inicializador.select();
        }
    },

    primeraLetraMayuscula: function(cadena) {

        return cadena.charAt(0).toUpperCase() + cadena.slice(1);
    },

    presionarEnter: function(evento) {

        if (evento.keyCode == 13) {
            return true;
        }
        else {
            return false;
        }
    },

    mostrarInput: function(contenedor,mostrar) {

        var input = $(contenedor + '> input');

        if (mostrar) {

            $(contenedor + '> input[type=password]').get(0).type = 'text';

            $(contenedor + '> span').attr('onclick',"Api.Herramientas.mostrarInput('" + contenedor + "',false)");

            $(contenedor + '> span > i')
                .removeClass('fa-eye')
                .addClass('fa-eye-slash');
        }
        else {

            $(contenedor + '> input[type=text]').get(0).type = 'password';

            $(contenedor + '> span').attr('onclick',"Api.Herramientas.mostrarInput('" + contenedor + "',true)");

            $(contenedor + '> span > i')
                .removeClass('fa-eye-slash')
                .addClass('fa-eye');
        }
    },

    verificarId: function(id,conClave) {

        if (conClave) {

            return id.substr(0, 1) === '#' ? id : '#' + id;
        }
        else {
            return id.substr(0, 1) === '#' ? id.substr(1, id.length) : id;
        }
    },

    formatoNumerico: function(numero) {

        return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    tablaExiste: function(id) {

        return parseInt($(Api.Herramientas.verificarId(id,true)).children('div').length) > 0 ? true : false;
    },

    primeraMayuscula: function (string){
        return string.charAt(0).toUpperCase() + string.slice(1);
    },

    buscarTablaEnter: function(evento, objeto, metodo, id) {

        var $herramientas = Api.Herramientas;

        if ($herramientas.presionarEnter(evento)) {

            objeto = objeto.split('.');

            if (objeto.length === 2) {
                Api[objeto[0].trim()][objeto[1].trim()][metodo.trim()](
                    1,
                    parseInt($($herramientas.verificarId(id, true) + '-resultados > select').val())
                );
            }
            else {
                Api[objeto[0].trim()][metodo.trim()](
                    1,
                    parseInt($($herramientas.verificarId(id, true) + '-resultados > select').val())
                );
            }
        }
    },

    checkTabla: function(id) {

        var id              = this.verificarId(id,true);
        var contenedor      = $(id).find('table');
        var checkboxPadre   = contenedor.children('thead').find('input[type=checkbox]');

        if (checkboxPadre.is(':checked')) {
            contenedor.find(':input').prop('checked',true);
        }
        else {
            contenedor.find(':input').prop('checked',false);
        }
    },

    obtenerCheck: function(id,checkeados) {

        var ids = '';

        if (checkeados) {
            checkeados = 'checked';
        }
        else {
            checkeados = 'not(:checked)';
        }

        $(this.verificarId(id,true) + ' :input:checkbox:' + checkeados).each(function() {

            if ($(this).val()) {
                ids += $(this).val() + ',';
            }
        });

        return ids.substr(0,ids.length - 1);
    },

    cambiarPestanhia: function(id,idPestanhia) {

        var AH      = Api.Herramientas;

        id          = AH.verificarId(id,true);
        idPestanhia = AH.verificarId(idPestanhia,true);

        $(id +' li').each(function() {

            if ($(this).children('a').attr('href') === idPestanhia) {
                $(this).addClass('active');
            }
            else {
                $(this).removeClass('active');
            }
        });

        $(id +' .tab-pane').each(function() {

            if ($(this).attr('id') === AH.verificarId(idPestanhia,false)) {
                $(this).addClass('active');
            }
            else {
                $(this).removeClass('active');
            }
        });
    },

    mostrarBotonesActualizar: function(id) {

        id = Api.Herramientas.verificarId(id,false);

        $('#ca-botones-' + id)
            .find('#btn-guardar')
            .addClass('ocultar')
            .parent()
            .find('#btn-cancelar')
            .removeClass('ocultar')
            .parent()
            .find('#btn-actualizar')
            .removeClass('ocultar');
    },

    cancelarCA: function(id) {

        id = Api.Herramientas.verificarId(id,false);

        document.getElementById('formulario-' + id).reset();

        $('#ca-botones-' + id)
            .find('#btn-guardar')
            .removeClass('ocultar')
            .parent()
            .find('#btn-cancelar')
            .addClass('ocultar')
            .parent()
            .find('#btn-actualizar')
            .addClass('ocultar');
    },

    checkboxOnclick: function(onclick,checked) {

        var $checkbox       = $('#clonar-checkbox');
        var $checkboxHTML   = $checkbox.html();
        var input           = '';

        $checkbox.find('input').attr('onclick',onclick);

        if (checked) {
            $checkbox.find('input').attr('checked','checked');
        }

        input = $checkbox.html();

        $checkbox.html($checkboxHTML);

        return input;
    },

    validarEmail: function(email) {

        if (email.trim()) {
            return /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(email.trim()) ? true : false;
        }
        else {
            return false;
        }
    }
};


/**
 * @autor Jeremy Reyes B.
 * @version 1.0
 *
 * Oculta botones para crear registro y limpia el formulario.
 *
 * @param string formulario: nombre del formulario.
 */
function cancelarGuardar(formulario) {
    $('#botonCancelar').slideUp('300');
    $('#botonActualizar').slideUp('300',function(){
        if (globalPermisos.indexOf(1) > -1) {
            $('#botonGuardar').slideDown('300');
        }
    });
    document.getElementById(formulario).reset();
}


/**
 * @autor Jeremy Reyes B.
 * @version 1.0
 *
 * Reemplaza datos internos de un String
 *
 * @param string: Texto.
 * @param string: Valor a buscar.
 * @param string: Valor se se colocará.
 *
 * @return string reemplazada.
 */
function _reemplazar(text, busca, reemplaza ){

    while (text.toString().indexOf(busca) != -1) {

        text = text.toString().replace(/busca/g, reemplaza);
    }

    return text;
}


/**
 * @autor Jeremy Reyes B.
 * @version 1.0
 *
 * Sumar dias a una fecha
 *
 * @param string dias:  Dias a sumar.
 * @param string fecha: Fecha a sumar.
 *
 * @return string fecha sumada.
 */
function _sumarDia(dias, fecha)
{
    fecha= new Date(fecha);
    fecha.setDate(fecha.getDate()+parseInt(dias)+1);

    var anno=fecha.getFullYear();
    var mes= fecha.getMonth()+1;
    var dia= fecha.getDate();

    mes = (mes < 10) ? ("0" + mes) : mes;
    dia = (dia < 10) ? ("0" + dia) : dia;

    var rFecha = anno+'-'+mes+'-'+dia;

    return rFecha;
}


/**
 * @autor Jeremy Reyes B.
 * @version 1.0
 *
 * Sumar dias a una fecha
 *
 * @param string dias:  Dias a sumar.
 * @param string fecha: Fecha a sumar.
 *
 * @return string fecha sumada.
 */
function _sumarMes(mes, fecha)
{
    fecha= new Date(fecha);

    fecha.setMonth(fecha.getMonth()+parseInt(mes)+1);

    var anno=fecha.getFullYear();
    var mes= fecha.getMonth() + 1;
    var dia= fecha.getDate() + 1;

    mes = (mes < 10) ? ("0" + mes) : mes;
    dia = (dia < 10) ? ("0" + dia) : dia;

    var rFecha = anno+'-'+mes+'-'+dia;


    return rFecha;
}

function _diferenciaEntreFechas(fechaInicial,fechaFinal,tipo) {

    switch (tipo)
    {
        case 'dias':
            var fecha1 = new Date(fechaInicial);
            var fecha2 = new Date(fechaFinal);

            var diasDif = fecha2.getTime() - fecha1.getTime();

            return Math.round(diasDif/(1000 * 60 * 60 * 24));
            break;
    }
}