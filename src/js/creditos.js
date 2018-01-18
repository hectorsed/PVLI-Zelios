'use strict'

//Dependencia de funciones de los estados del juego
var juego = require('./juego.js');
var controles = require('./controles.js');
var creditos = require('./creditos.js');

//Inicializacion de los botones del menu
var botonJuego;
var botonControles;
var botonCreditos;

var menu = {

    create: function () {
        juego = this.game

        //Estados del juego llamados al pulsar los botones
        juego.state.add('juego', juego);
        juego.state.add('controles', controles);
        juego.state.add('juego', creditos);

        //Boton del juego principal
        botonJuego = game.add.button(game.world.centerX - 95, game.world.centerY, 'button', actionOnClickJuego, this, 2, 1, 0);
        botonJuego.width = 150;
        botonJuego.height = 50;

        //Boton que lleva al jugador al sprite con los controles
        botonControles = game.add.button(game.world.centerX - 95, game.world.centerY / 3, 'button', actionOnClickControles, this, 2, 1, 0);
        botonControles.width = 150;
        botonControles.height = 50;

        //Boton que lleva al jugador al sprite con los creditos
        botonCreditos = game.add.button(game.world.centerX - 95, game.world.centerY / 5, 'button', actionOnClickCreditos, this, 2, 1, 0);
        botonCreditos.width = 150;
        botonCreditos.height = 50;

    },
};

        //Funciones de pulsacion de los botones para cambio de estado
        function actionOnClickJuego() {
            juego.state.start('juego');
        }
        
        function actionOnClickControles() {
            juego.state.start('controles');
        }

        function actionOnClickCreditos() {
            juego.state.start('creditos');
        }
    
        //Exportado del menu para dependencias
        module.exports = menu;