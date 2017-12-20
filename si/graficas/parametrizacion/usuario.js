
Api.Graficas.Usuario = {
    uri: null,
    carpeta: 'Parametrizacion',
    controlador: 'Usuario',

    $ajaxS: Api.Ajax.ajaxSimple,
    $uriCrudObjecto: Api.Uri.crudObjecto,

    _ConsultarTransacciones: null,
    _ConsultarTotalEstado: null,

    constructor: function() {
        this._ConsultarTransacciones    = this.$uriCrudObjecto('ConsultarTransacciones',this.controlador,this.carpeta);
        this._ConsultarTotalEstado	    = this.$uriCrudObjecto('ConsultarTotalEstado',this.controlador,this.carpeta);
        str             		        = this.controlador;
        this.uri        		        = str.toLowerCase();
    },

    transacciones: function() {

        this.constructor();

        this.$ajaxS(
            '',
            this.uri,
            this._ConsultarTransacciones,

            function (json) {

                if (json.resultado === 1) {

                    var lineData = {
                        labels: json.transacciones.mes,
                        datasets: [
                            {
                                label: "Activos",
                                backgroundColor: 'rgba(26,179,148,0.5)',
                                borderColor: "rgba(26,179,148,0.7)",
                                pointBackgroundColor: "rgba(26,179,148,1)",
                                pointBorderColor: "#fff",
                                data: json.transacciones[1]
                            }, {
                                label: "Desactivados",
                                backgroundColor: '#b5b8cf',
                                pointBorderColor: "#fff",
                                data: json.transacciones[0]
                            }, {
                                label: "Eliminados",
                                backgroundColor: 'rgba(220, 220, 220, 0.5)',
                                pointBorderColor: "#fff",
                                data: json.transacciones[-1]
                            }
                        ]
                    };

                    var lineOptions = {
                        responsive: true
                    };


                    var ctx = document.getElementById("grafica-usuario-transacciones").getContext("2d");
                    new Chart(ctx, {type: 'line', data: lineData, options: lineOptions});
                }
            }
        );
    },

    total: function() {

        this.constructor();

        this.$ajaxS(
            '',
            this.uri,
            this._ConsultarTotalEstado,

            function (json) {

                if (json.resultado === 1) {

                    var doughnutData = {
                        labels: ["Activos","Eliminados","Desactivados" ],
                        datasets: [{
                            data: [json.total.activo,json.total.eliminado,json.total.inactivo],
                            backgroundColor: ["#a3e1d4","#dedede","#b5b8cf"]
                        }]
                    } ;


                    var doughnutOptions = {
                        responsive: true
                    };


                    var ctx4 = document.getElementById("grafica-usuario-total").getContext("2d");
                    new Chart(ctx4, {type: 'doughnut', data: doughnutData, options:doughnutOptions});
                }
            }
        );
    }
};