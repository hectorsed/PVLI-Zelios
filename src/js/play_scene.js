'use strict';

var GO = require('./ship.js');

var PlayScene = {
  create: function () {
    /*var logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo');
    logo.anchor.setTo(0.5, 0.5);*/

    // INICIALIZACIÓN DE LAS FÍSICAS ARCADE
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
  }
};

module.exports = PlayScene;
