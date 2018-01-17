'use strict';

// CONSTRUCTORA DE ELEMENTOS DEL MAPA
var gameObject = function (game, sprite, posX, posY, anchorX, anchorY, scaleX, scaleY){
    Phaser.Sprite.call(this, game, posX, posY, sprite);
    this.anchor.set(anchorX, anchorY);
    this.scale.setTo(scaleX,scaleY);

    this.game.physics.enable(this.Phaser.Physics.ARCADE);
    this.body.colliderWorldBounds = true;

};
gameObject.prototype = Object.create(Phaser.Sprite.prototype);
gameObject.prototype.constructor = gameObject;

// CONSTRUCTORA DE NAVES
var ship = function (game, sprite, posX, posY, anchorX, anchorY, scaleX, scaleY, vel){
    this.game = game;
    this.speed = vel;

    gameObject.call(this, game, sprite, posX, posY, anchorX, anchorY, scaleX, scaleY);
};
ship.prototype = Object.create(gameObject.prototype);
ship.prototype.constructor = ship;

// CONSTRUCTORA DEL JUGADOR
var player = function(game, sprite, posX, posY, anchorX, anchorY, scaleX, scaleY, velocity, cursors, fireButton ){
    this.game = game;
    this.cursors = cursors;
    this.fireButton = fireButton;
    ship.call(this, game, sprite, posX, posY, anchorX, anchorY, scaleX, scaleY, vel);
};
player.prototype = Object.create(ship.prototype);
player.prototype.constructor = player;

player.prototype.update = function(){
    this.player.body.velocity.set(0);

    if (this.cursors.left.isDown) {
        this.player.body.velocity.x = -this.speed;
        console.log('Pulsado');
    }

    else if (this.cursors.right.isDown) {
        this.player.body.velocity.x = this.speed;
    }

    if (this.cursors.up.isDown) {
        this.player.body.velocity.y = -this.speed;
    }
    else if (this.cursors.down.isDown) {
         this.player.body.velocity.y = this.speed;
    }

    if (this.fireButton) {
        this.weapons[this.currentWeapon].fire(this.player);
    }
};