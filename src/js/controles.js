'use strict'

//Dependencia de funciones de los estados del juego
var menu = require('./menu.js');
var juego = require('./juego.js');

//Inicializacion de los botones del menu
var botonMenu;
var botonJuego;

var controles = {

    create: function () {
        
        juego = this.game

        //Estados del juego llamados al pulsar los botones
        juego.state.add('menu', menu);
        juego.state.add('controles', controles);
        juego.state.add('juego', creditos);

        //Boton del juego principal
        botonJuego = game.add.button((9 * game.world.centerX)/10, (9 * game.world.centerY) / 10, 'button', actionOnClickJuego, this, 2, 1, 0);
        botonJuego.width = 150;
        botonJuego.height = 50;

        //Boton que lleva al jugador al sprite con los controles
        botonControles = game.add.button(game.world.centerX / 10, game.world.centerY / 10, 'button', actionOnClickMenu, this, 2, 1, 0);
        botonControles.width = 150;
        botonControles.height = 50;

    },
};

        //Funciones de pulsacion de los botones para cambio de estado
        function actionOnClickJuego() {
            juego.state.start('juego');
        }
        
        function actionOnClickMenu() {
            juego.state.start('menu');
        }
    
        //Exportado del menu para dependencias
        module.exports = controles;