'use strict'
var varmenu = require ('./menu.js')
var varcontroles = require ('./controles.js')

var BootScene = {

  preload: function () {
    // load here assets required for the loading screen
  },
      create: function () {
      this.state.start('preloader');   //Llama al metodo preloaderscene
    }
  };

  var PreloaderScene = {
preload: function(){

    //Carga de imagenes
    this.game.load.image('jugador', 'images/spaceship.png');
    this.game.load.image('boton', 'images/boton.png');
    this.game.load.image('menu', 'images/menu.png');

  },

  create: function(){
    this.state.start('menu');
  }
}


window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('preloader', PreloaderScene);  //Metodo en este js
  game.state.add('boot', BootScene);            //Metodo en este js
  game.state.add('menu', varmenu);          //Metodo menu de menu.js
  game.state.add('juego', juego);
  game.state.add('controles', controles);
  game.state.add('creditos', creditos);
  game.state.start('boot');
};