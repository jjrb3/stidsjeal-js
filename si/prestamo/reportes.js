Api.Reportes = {
    carpeta: 'Prestamo',
    controlador: 'Reportes',

    prestamosFinalizados: function() {

        $('#mensaje').html('');

        var contenedor      = '#form-prestamos-finalizados ';
        var fechaInicial    = $(contenedor + '#fecha-inicio').val();
        var fechaFinal      = $(contenedor + '#fecha-fin').val();

        if (!fechaInicial || !fechaFinal) {
            _mensaje('advertencia','mensaje','Debe llenar todo los campos de fecha para continuar');
            return false;
        }

        if (_diferenciaEntreFechas(fechaInicial,fechaFinal,'dias') < 0) {
            _mensaje('advertencia','mensaje','La fecha final no puede ser menor que la fecha inicial');
            return false;
        }

        $(contenedor).attr('onsubmit','');
        $(contenedor).submit();
        $(contenedor).attr('onsubmit','return Api.Reportes.prestamosFinalizados();');

        setTimeout(function(){ document.getElementById("form-prestamos-finalizados").reset(); }, 2000);
    },

    relacionPrestamo: function() {

        $('#mensaje').html('');

        var contenedor      = '#form-relacion-prestamo ';
        var fechaInicial    = $(contenedor + '#fecha-inicio').val();
        var fechaFinal      = $(contenedor + '#fecha-fin').val();

        if (!fechaInicial || !fechaFinal) {
            _mensaje('advertencia','mensaje','Debe llenar todo los campos de fecha para continuar');
            return false;
        }

        if (_diferenciaEntreFechas(fechaInicial,fechaFinal,'dias') < 0) {
            _mensaje('advertencia','mensaje','La fecha final no puede ser menor que la fecha inicial');
            return false;
        }

        $(contenedor).attr('onsubmit','');
        $(contenedor).submit();
        $(contenedor).attr('onsubmit','return Api.Reportes.relacionPrestamo();');

        setTimeout(function(){ document.getElementById("form-relacion-prestamo").reset(); }, 2000);
    },

    prestamosSinCompletar: function() {

        $('#mensaje').html('');

        var contenedor      = '#form-prestamos-sin-completar ';
        var fechaInicial    = $(contenedor + '#fecha-inicio').val();
        var fechaFinal      = $(contenedor + '#fecha-fin').val();

        if (!fechaInicial || !fechaFinal) {
            _mensaje('advertencia','mensaje','Debe llenar todo los campos de fecha para continuar');
            return false;
        }

        if (_diferenciaEntreFechas(fechaInicial,fechaFinal,'dias') < 0) {
            _mensaje('advertencia','mensaje','La fecha final no puede ser menor que la fecha inicial');
            return false;
        }

        $(contenedor).attr('onsubmit','');
        $(contenedor).submit();
        $(contenedor).attr('onsubmit','return Api.Reportes.prestamosSinCompletar();');

        setTimeout(function(){ document.getElementById("form-prestamos-sin-completar").reset(); }, 2000);
    },

    recaudoDiario: function() {

        $('#mensaje').html('');

        var contenedor  = '#form-recaudo-diario ';
        var fecha       = $(contenedor + '#fecha').val();

        if (!fecha) {
            _mensaje('advertencia','mensaje','Debe seleccionar la fecha para continuar');
            return false;
        }

        $(contenedor).attr('onsubmit','');
        $(contenedor).submit();
        $(contenedor).attr('onsubmit','return Api.Reportes.RecaudoDiario();');

        setTimeout(function(){ document.getElementById("form-recaudo-diario").reset(); }, 2000);
    }
};
