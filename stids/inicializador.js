
Api.Inicializador = {

    parametrosPagina: function($ciudades) {

        this.select();
        this.fecha();
        this.rangoDeFecha();
        this.botonNumerico();
        this.mascaras();
        this.autocompletarCiudades($ciudades);
    },

    autocompletarCiudades: function($json) {

        var $input = $(".autocompletar-ciudades")
            .attr('placeholder','Digite una ciudad')
            .attr('autocomplete','off');

        $input
            .parent()
            .append('<input>')
            .children('input:last')
            .attr('id',$input.attr('data-id'))
            .attr('name',$input.attr('data-name'))
            .attr('type','hidden');

        // Ciudades
        $.getJSON($json, function(json) {

            $input.typeahead({
                source: json,
                autoSelect: true
            });

            $input.change(function() {

                var current = $input.typeahead("getActive");

                if (current) {
                    if (current.name === $input.val()) {

                        console.log($input.attr('id'));
                        $input
                            .parent()
                            .children('input:last')
                            .val(current.id);
                    }
                    else {
                        /* Al presionar enter y no estar en la lista */
                    }
                }
                else {
                    /* Si esta vacio */
                }
            });
        });

        if ($('.autocompletar-ciudades-2').length > 0) {

            var $input2 = $(".autocompletar-ciudades-2")
                .attr('placeholder', 'Digite una ciudad')
                .attr('autocomplete', 'off');

            $input2
                .parent()
                .append('<input>')
                .children('input:last')
                .attr('id', $input2.attr('data-id'))
                .attr('name', $input2.attr('data-name'))
                .attr('type', 'hidden');

            // Ciudades
            $.getJSON($json, function (json) {

                $input2.typeahead({
                    source: json,
                    autoSelect: true
                });

                $input2.change(function () {

                    var current = $input2.typeahead("getActive");

                    if (current) {
                        if (current.name === $input2.val()) {

                            console.log($input2.attr('id'));
                            $input2
                                .parent()
                                .children('input:last')
                                .val(current.id);
                        }
                        else {
                            /* Al presionar enter y no estar en la lista */
                        }
                    }
                    else {
                        /* Si esta vacio */
                    }
                });
            });
        }
    },

    mascaras: function() {

        $('.formato-numerico').mask('000.000.000.000.000', {reverse: true});
        $('.formato-celular').mask('(000) 000 0000').attr('placeholder','(___) ___ ____');
    },

    botonNumerico: function() {

        $(".numerico").TouchSpin({verticalbuttons: true});
    },

    rangoDeFecha: function() {

        var $contenedor = $('.rangedatepicker');

        $contenedor.daterangepicker();

        $contenedor.on('apply.daterangepicker', function(e, picker) {

            $(this).children('.fecha-inicio').val(picker.startDate.format('YYYY-MM-DD'));
            $(this).children('.fecha-fin').val(picker.endDate.format('YYYY-MM-DD'));
        });
    },

    fecha: function() {
        $('.datepicker').datepicker();
    },

    select: function() {
        $(".chosen-select").chosen(
            {
                disable_search_threshold: 10
            }
        ).attr('data-placeholder','Seleccione...');
    }
};