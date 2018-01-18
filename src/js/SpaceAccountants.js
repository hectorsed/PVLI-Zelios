'use strict';

var SpaceAccountants = function () {

    this.background = null;
    this.foreground = null;

    this.player = null;
    this.cursors = null;
    this.speed = 300;
    this.puntuacion = 1000;

    this.enemy1 = null;
    this.enemyWeapon = null;
    this.enemySpeed = 200;

    this.weapons = [];
    this.currentWeapon = 0;
    this.weaponName = null;

};

modules.exports = SpaceAccountants;