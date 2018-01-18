'use strict';

var GO = require('./ship.js');

var PlayScene = {
  create: function () {
    /*var logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo');
    logo.anchor.setTo(0.5, 0.5);*/

    juego = this.game;

    // INICIALIZACIÓN DE LAS FÍSICAS ARCADE
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    fondo = juego.add.sprite(0,0,'background');
  	fondo.width = 1280;
	fondo.height = 720;

    //Crea sprite jugador, activa sus fisicas y la colision con el mundo
    this.player = this.add.sprite(64, 200, 'player');
    this.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;

    //Crea sprite enemigo, activa sus físicas y la colision con el mundo
    this.enemy1 = this.add.sprite(1000, 200, 'enemy1');
    this.physics.arcade.enable(this.enemy1);
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
  }
};

module.exports = PlayScene;
