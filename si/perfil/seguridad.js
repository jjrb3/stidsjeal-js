Api.Seguridad = {
    carpeta: 'Parametrizacion',
    controlador: 'PreguntasSeguridad',
    uri: null,
    idRetorno: null,

    $ajaxS: Api.Ajax.ajaxSimple,
    $uriCrud: Api.Uri.crudObjecto,
    $cargarSelect: Api.Herramientas.cargarSelectJSON,
    $mensaje: Api.Mensaje.publicar,
    $preguntas: null,
    $respuestas: null,

    _ConsultarPR: null,
    _GuardarRespuestas: null,

    constructor: function (idRetorno) {
        this._ConsultarPR       = this.$uriCrud('ConsultarPreguntasConRespuestas', this.controlador, this.carpeta);
        this._GuardarRespuestas = this.$uriCrud('GuardarRespuestas', this.controlador, this.carpeta);
        var  str                = this.controlador;
        this.uri                = str.toLowerCase();
        this.idRetorno          = idRetorno;

        if (idRetorno) {
            $(idRetorno).html('')
        }

        this.cargarDatos();

        return true;
    },

    cargarDatos: function () {

        this.$ajaxS(
            this.idRetorno,
            this.uri,
            this._ConsultarPR,

            function (json) {

                if (json.resultado == 1) {

                    var $AS = Api.Seguridad;

                    $(Api.Herramientas.verificarId($AS.idRetorno,true)).html('');

                    $AS.$preguntas  = json.datos;
                    $AS.$respuestas = json.respuesta;

                    $AS.llenarSelect($AS.$preguntas,json.seguridad_usuario);
                }
            }
        );
    },

    llenarSelect: function($preguntas,$seguridad) {

        var $select     = Api.Herramientas.cargarSelectJSON;
        var contenedor  = '#seguridad ';

        $select(contenedor + '#pregunta-1',$preguntas,true,(Object.keys($seguridad).length !== 0 ? $seguridad[0].id_preguntas_seguridad : null));
        $select(contenedor + '#pregunta-2',$preguntas,true,(Object.keys($seguridad).length !== 0 ? $seguridad[1].id_preguntas_seguridad : null));
        $select(contenedor + '#pregunta-3',$preguntas,true,(Object.keys($seguridad).length !== 0 ? $seguridad[2].id_preguntas_seguridad : null));
        $select(contenedor + '#pregunta-4',$preguntas,true,(Object.keys($seguridad).length !== 0 ? $seguridad[3].id_preguntas_seguridad : null));

        if (Object.keys($seguridad).length !== 0) {
            this.llenarRespuestas($seguridad);
        }
    },

    llenarRespuestas: function($seguridad) {

        var contenedor = '#seguridad #respuesta-';

        for (var i=0;i<4;i++) {

            this.verificarSeleccion(i + 1,$seguridad[i].id_preguntas_seguridad);

            if ($seguridad[i].id_respuesta_seguridad !== null) {

                $(contenedor + (i + 1) + '> option[value=' + $seguridad[i].id_respuesta_seguridad + ']').attr('selected',true);
                $(contenedor + (i + 1)).val($seguridad[i].id_respuesta_seguridad).trigger("chosen:updated");
            }
            else {
                $('#respuesta-' + (i + 1)).val($seguridad[i].respuesta);
            }
        }
    },

    verificarSeleccion: function(noPregunta,valor) {

        var $preguntas = Api.Seguridad.$preguntas;
        var $select    = Api.Herramientas.cargarSelectJSON;
        var contenedor = '#seguridad ';

        $(contenedor + '#mensaje').html('');

        if (!valor) {
            return false;
        }

        if (noPregunta !== 1 && $(contenedor + '#pregunta-1').val() === valor) {
            this.$mensaje('advertencia',contenedor + '#mensaje','Esta pregunta es igual a la primera pregunta');
            $select(contenedor + '#pregunta-' + noPregunta,$preguntas,true);
            return false;
        }

        if (noPregunta !== 2 && $(contenedor + '#pregunta-2').val() === valor) {
            this.$mensaje('advertencia',contenedor + '#mensaje','Esta pregunta es igual a la segunda pregunta');
            $select(contenedor + '#pregunta-' + noPregunta,$preguntas,true);
            return false;
        }

        if (noPregunta !== 3 && $(contenedor + '#pregunta-3').val() === valor) {
            this.$mensaje('advertencia',contenedor + '#mensaje','Esta pregunta es igual a la tercera pregunta');
            $select(contenedor + '#pregunta-' + noPregunta,$preguntas,true);
            return false;
        }

        if (noPregunta !== 4 && $(contenedor + '#pregunta-4').val() === valor) {
            this.$mensaje('advertencia',contenedor + '#mensaje','Esta pregunta es igual a la cuarta pregunta');
            $select(contenedor + '#pregunta-' + noPregunta,$preguntas,true);
            return false;
        }

        var $contenedor = $(contenedor + '#respuesta-' + noPregunta)
            .parent()
            .html('');


        if (Object.keys(this.$respuestas[valor]).length !== 0) {

            $contenedor.html('<select id="respuesta-' + noPregunta + '" class="form-control m-b chosen-select"></select>');

            $select(contenedor + '#respuesta-'+noPregunta,this.$respuestas[valor],false);
        }
        else {
            $contenedor.html('<input type="text" class="form-control" id="respuesta-' + noPregunta + '" placeholder="Digite su respuesta" maxlength="200">')
        }

    },

    guardar: function () {

        var parametros  = this.verificarFormulario();
        var AS          = Api.Seguridad;

        setTimeout(function(){

            if (parametros) {
                AS.$ajaxS(
                    AS.idRetorno,
                    AS.uri,
                    parametros,

                    function (json) {

                        Api.Mensaje.json(json,Api.Seguridad.idRetorno);
                    }
                );
            }
        }, 1000);
    },

    verificarFormulario: function() {

        var contenedor = '#seguridad ';

        // For de preguntas y respuestas
        for(var i=1;i<=4;i++) {

            this._GuardarRespuestas['pregunta_' + i]   = $(contenedor + '#pregunta-' + i).val();
            this._GuardarRespuestas['respuesta_' + i]  = $(contenedor + '#respuesta-' + i).val();

            if (!this._GuardarRespuestas['pregunta_'+i]) {
                this.$mensaje('advertencia',contenedor + '#mensaje','No puede dejar vacio la pregunta No. ' + i);
                return false;
            }

            if (!this._GuardarRespuestas['respuesta_'+i]) {
                this.$mensaje('advertencia',contenedor + '#mensaje','No puede dejar vacio la respuesta de la pregunta No. ' + i);
                return false;
            }
        }

        return this._GuardarRespuestas;
    }
};