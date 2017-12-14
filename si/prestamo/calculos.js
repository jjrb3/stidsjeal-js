Api.Calculos = {
    arregloPrestamo: null,
    cadenaPrestamo: null,
    totalMonto: null,
    totalIntereses: null,
    totalGeneral: null,


    calculosPrestamo: function(montoSolicitado,interes,cuotas,fechaPago,formaPago,tipoPrestamo,callback) {

        this.arregloPrestamo = [];
        this.cadenaPrestamo  = '';
        this.totalMonto      = parseInt(montoSolicitado);
        this.totalIntereses  = 0;
        this.totalGeneral    = 0;

        var prestamo = [];

        var abonoInteres    = 0;
        var amortizacion    = 0;
        var fecha           = '';
        var capital         = montoSolicitado;
        var porcentaje      = interes / 100;
        var montoFijo       = Math.round((porcentaje * Math.pow(1+porcentaje,cuotas)* montoSolicitado)/(Math.pow(1+porcentaje,cuotas)-1));

        for(var i=0;i<cuotas;i++) {

            if (tipoPrestamo == 1) {

                abonoInteres = Math.round(montoSolicitado * interes / 100);
                amortizacion = Math.round(montoSolicitado / cuotas);
                montoFijo = abonoInteres + amortizacion;
            }
            else if (tipoPrestamo == 2) {

                abonoInteres = Math.round(capital * interes / 100);
                amortizacion = montoFijo - abonoInteres;
            }

            fecha = this.obtenerFecha(formaPago,i - 1,fechaPago);


            this.cadenaPrestamo += (i + 1)      + ';';
            this.cadenaPrestamo += fecha        + ';';
            this.cadenaPrestamo += capital      + ';';
            this.cadenaPrestamo += amortizacion + ';';
            this.cadenaPrestamo += abonoInteres + ';';
            this.cadenaPrestamo += montoFijo    + ';}';

            this.arregloPrestamo.push({
                'no_cuota': (i + 1),
                'fecha_pago':fecha,
                'capital':capital,
                'amortizacion':amortizacion,
                'interes':abonoInteres,
                'total': montoFijo,
            });

            this.totalIntereses += abonoInteres;
            this.totalGeneral   += montoFijo;

            capital -= amortizacion;
        }

        callback({
            'arreglo':this.arregloPrestamo,
            'cadena':this.cadenaPrestamo
        })
    },

    obtenerFecha: function(formaPago,noCuota,fechaPago) {

        var fecha = '';

        switch (parseInt(formaPago))
        {
            case 1:
                fecha = _sumarDia(noCuota,fechaPago);
                break;
            case 2:
                fecha = _sumarDia(noCuota * 7,fechaPago);
                break;
            case 3:
                fecha = _sumarDia(noCuota * 15,fechaPago);
                break;
            case 4:
                fecha = _sumarMes(noCuota,fechaPago);
                break;
        }

        return fecha;
    }
};