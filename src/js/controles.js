'use strict'

//Dependencia de funciones de los estados del juego
var juego = require('./juego.js');
var menu = require('./menu.js');

//Inicializacion de los botones del menu
var botonJuego;
var botonControles;

var controles = {

    create: function () {
        juego = this.game

        //Estados del juego llamados al pulsar los botones
        //Cada estado es un metodo en otro archivo js


        //Boton del juego principal
        botonJuego = this.game.add.button(100, 50, 'boton', actionOnClickJuego, this, 2, 1, 0);
        botonJuego.width = 150;
        botonJuego.height = 50;

        //Boton que lleva al menu
        botonControles = this.game.add.button(100, 500, 'boton', actionOnClickMenu, this, 2, 1, 0);
        botonControles.width = 150;
        botonControles.height = 50;


    }
};
//Funciones de pulsacion de los botones para cambio de estado
//Funciones almacenadas en Principal; llaman a cada .js con su nombre
function actionOnClickJuego() {
    juego.state.start('juego');      //No es una funcion dice
}
function actionOnClickMenu() {
    juego.state.start('menu');
}

//Exportado del menu para dependencias
module.exports = controles;