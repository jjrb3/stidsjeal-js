
Api.Calculos = {
    totalMonto: null,
    totalIntereses: null,
    totalGeneral: null,

    calcularPrestamo: function() {

        $prestamo = this.obtenerParametrosPrestamo();

        if ($prestamo.tipo && $prestamo.monto > 0 && $prestamo.interes > 0 && $prestamo.cuotas > 0) {

            var abonoInteres    = 0,
                saldoFinal      = 0,
                totalInteres    = 0,
                totalGeneral    = 0,
                saldoInicial    = $prestamo.monto,
                fecha           = '',
                abonoACapital    = 0,
                porcentaje      = $prestamo.interes / 100,
                cuota           = Math.round((porcentaje * Math.pow(1 + porcentaje, $prestamo.cuotas) * $prestamo.monto) / (Math.pow(1 + porcentaje, $prestamo.cuotas) - 1)),
                cadenaCuotas    = '',
                $tablaCuotas    = [];


            for (var i = 0; i < $prestamo.cuotas; i++) {

                // Calculo fijo
                if ($prestamo.tipo === '1') {

                    saldoInicial = i === 0 ? $prestamo.monto : saldoFinal;

                    // Si es el ultimo pago entonces realiza un calculo diferente
                    if (i + 1 === parseInt($prestamo.cuotas)) {

                        abonoInteres    = cuota - saldoInicial;
                        abonoACapital   = cuota - abonoInteres;
                        saldoFinal      = 0;
                    }
                    else {
                        abonoInteres    = Math.round(saldoInicial * $prestamo.interes / 100);
                        abonoACapital   = cuota - abonoInteres;
                        saldoFinal      = saldoInicial - abonoACapital;
                    }
                }
                // Calculo a capital uniforme
                else if ($prestamo.tipo === '2') {

                    saldoInicial = i === 0 ? $prestamo.monto : saldoFinal;

                    abonoACapital = Math.round($prestamo.monto / $prestamo.cuotas);
                    abonoInteres  = Math.round(saldoInicial * $prestamo.interes / 100);

                    // Si es el ultimo pago entonces realiza un calculo diferente
                    if (i + 1 === parseInt($prestamo.cuotas)) {

                        cuota       = abonoACapital - abonoInteres;
                        saldoFinal  = 0;
                    }
                    else {

                        cuota       = abonoACapital + abonoInteres;
                        saldoFinal  = saldoInicial - abonoACapital;
                    }
                }
                else {
                    return false;
                }

                if ($prestamo.forma_pago && $prestamo.fecha_pago) {
                    fecha = this.obtenerFecha($prestamo.forma_pago, i - 1, $prestamo.fecha_pago);
                }

                cadenaCuotas += (i + 1) + ';';
                cadenaCuotas += fecha + ';';
                cadenaCuotas += saldoInicial + ';';
                cadenaCuotas += cuota + ';';
                cadenaCuotas += abonoInteres + ';';
                cadenaCuotas += abonoACapital + ';';
                cadenaCuotas += abonoInteres + ';}';

                $tablaCuotas.push({
                    no_cuota:      (i + 1),
                    fecha_pago:    fecha,
                    saldo_inicial: saldoInicial,
                    cuota:         cuota,
                    interes:       abonoInteres,
                    abono_capital: abonoACapital,
                    saldo_final:   saldoFinal
                });

                totalInteres += abonoInteres;
                totalGeneral += cuota;
            }

            return {
                lista_cuotas:   $tablaCuotas,
                cadena:         cadenaCuotas,
                total_interes:  totalInteres,
                total_general:  totalGeneral,
                informacion:    $prestamo
            };
        }

        return false;
    },

    obtenerParametrosPrestamo: function () {

        var cuota           = $('#no-cuotas').val(),
            interes         = $('#intereses').val(),
            monto           = $('#monto-requerido').val(),
            clienteNombre   = $('#id-cliente option:selected').text();

        return {
            cliente_nombre:     clienteNombre ? clienteNombre.split('-')[1].trim() : '',
            forma_pago_nombre:  $('#id-forma-pago option:selected').text(),
            tipo_nombre:        $('#id-tipo-prestamo option:selected').text(),
            forma_pago:         $('#id-forma-pago').val(),
            fecha_pago:         $('#fecha-pago-inicial').val(),
            tipo:               $('#id-tipo-prestamo').val(),
            monto:              !monto      ? 0 : parseInt(monto.replace(/,/g,'')),
            interes:            !interes    ? 0 : interes,
            cuotas:             !cuota      ? 0 : cuota
        };
    },

    obtenerFecha: function(formaPago,noCuota,fechaPago) {

        var fecha   = '',
            AH      = Api.Herramientas;

        switch (parseInt(formaPago))
        {
            case 1:
                fecha = AH.sumarDia(noCuota,fechaPago);
                break;
            case 2:
                fecha = AH.sumarDia(noCuota * 7,fechaPago);
                break;
            case 3:
                fecha = AH.sumarDia(noCuota * 15,fechaPago);
                break;
            case 4:
                fecha = AH.sumarMes(noCuota,fechaPago);
                break;
        }

        return fecha;
    }
};