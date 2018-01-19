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
        //Cada estado es un metodo en otro archivo js


        //Boton del juego principal
        botonJuego = this.game.add.button(100, 100, 'boton', actionOnClickJuego, this, 2, 1, 0);
        botonJuego.width = 150;
        botonJuego.height = 50;

        //Boton que lleva al jugador al sprite con los controles
        botonControles = this.game.add.button(300, 100, 'boton', actionOnClickControles, this, 2, 1, 0);
        botonControles.width = 150;
        botonControles.height = 50;

        //Boton que lleva al jugador al sprite con los creditos
        botonCreditos = this.game.add.button(500, 100, 'boton', actionOnClickCreditos, this, 2, 1, 0);
        botonCreditos.width = 150;
        botonCreditos.height = 50;

    }
};
//Funciones de pulsacion de los botones para cambio de estado
//Funciones almacenadas en Principal; llaman a cada .js con su nombre
function actionOnClickJuego() {
    juego.state.start('juego');      //No es una funcion dice
}
function actionOnClickControles() {
    juego.state.start('controles');
}
function actionOnClickCreditos() {
    juego.state.start('creditos');
}


//Exportado del menu para dependencias
module.exports = menu;