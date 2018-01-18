'use strict';

var menu = require('./menu.js');


//Pantalla de carga de assets
var BootScene = {
  preload: function () {

    //Se inicia la barra de carga
    this.game.load.image('preloader_bar', 'images/loadbar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};

//Carga de todos los recursos del juego
//Imagenes, audios y demas
var PreloaderScene = {
  preload: function () {

    //Carga de la imagen de la barra de carga y la inicializa como barra de carga por defecto
    this.loadingBar = this.game.add.sprite(0, 500, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 5);
    this.load.setPreloadSprite(this.loadingBar);

    //Carga de imagenes para el juego
    this.game.load.image('jugador', 'images/spaceship.png');
    this.load.image('foreground', 'images/fore.png');
    this.load.image('enemy1', 'images/enemy1.png');
    this.load.bitmapFont('shmupfont', 'images/shmupfont.png', 'images/shmupfont.xml');

    for (var i = 1; i <= 9; i++) {
            this.load.image('bullet' + i, 'assets/bullet' + i + '.png');
        }
  },

  create: function () {

    //Una vez hemos cargado todo pasamos al menu
    this.game.state.start('menu');
  }
};


window.onload = function () {
  var game = new Phaser.Game(1280, 720, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('menu', Menu);

  game.state.start('boot');
};