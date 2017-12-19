'use strict';

/*var PlayScene = require('./play_scene.js');


var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
  },

  create: function () {
    this.game.state.start('preloader');
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(0, 240, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5);
    this.load.setPreloadSprite(this.loadingBar);

    // TODO: load here the assets for the game
    this.game.load.image('logo', 'images/phaser.png');
  },

  create: function () {
    this.game.state.start('play');
  }
};


window.onload = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);

  game.state.start('boot');
};*/


var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

function preload() {
	this.game.load.image('background', 'images/spacebackground.png');
	this.game.load.image('ship', 'images/spaceship.png');
	this.game.load.image('bullet', 'images/bullet.png');
	this.game.load.image('enemy', 'images/starman.png');

}
var newBullet = function (game, key) {

    Phaser.Sprite.call(this, game, 0, 0, key);

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

    this.anchor.set(0.5);

    //Activa cisualizacion en los limites de la pantalla
    this.checkWorldBounds = true;
    //Elimina el objeto si sale de la pantalla
    this.outOfBoundsKill = true;
    //Inicializa el objeto a inexistente
    this.exists = false;

    //Funcion de tracking para misiles
    this.tracking = false;
    this.scaleSpeed = 0;

};

newBullet.prototype = Object.create(Phaser.Sprite.prototype);
newBullet.prototype.constructor = newBullet;

//Definimos la funcion de disparo
//Posiciones X e Y, angulo, velocidad y gravedad X e Y que afectará a la bala
newBullet.prototype.fire = function (x, y, angle, speed, gx, gy) {

    gx = gx || 0;
    gy = gy || 0;

    this.reset(x, y);
    this.scale.set(1);
    //Funcion de arcade que aplica la velocidad correcta a los proyectiles con angulo
    this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);
    this.angle = angle;
    this.body.gravity.set(gx, gy);
};

var ship;
var Weapon = {};    //Arma de la nave
var cursors;

var bullet;
var bullets;
var fireButton;
var bulletTime = 0;
var fireRate = 300;

var enemy;

function create() {

    //this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
    //this.background.autoScroll(-40, 0);

	game.renderer.clearBeforeRender = false;
	game.renderer.roundPixels = true;

	// Activación de las físicas del juego
	game.physics.startSystem(Phaser.Physics.ARCADE);

	game.world.setBounds(0, 0, 5000, 600);
	game.add.tileSprite(0, 0, 800, 600, 'background');

	bullets = game.add.group();
	bullets.enableBody = true;
	bullets.physicsBodyType = Phaser.Physics.ARCADE;

	bullets.createMultiple(40, 'bullet');
	bullets.setAll('anchor.x', 0.5);
	bullets.setAll('anchor.y', 0.5);

    ship = game.add.sprite(100, 300, 'ship');
    ship.anchor.set(0.5);

    game.physics.enable(ship, Phaser.Physics.ARCADE);   //Crea cuerpo fisico sobre el que actuan las fisicas arcade

    ship.body.collideWorldBounds = true;

    ship.body.drag.set(100);
    ship.body.maxVelocity.set(200);

   //game.camera.follow(ship, Phaser.Camera.FOLLOW_TOPDOWN);

    // Input del juego
    cursors = game.input.keyboard.createCursorKeys();   //Cruceta para movimiento
    fireButton = game.input.keyboard.addKeyCapture([ Phaser.Keyboard.SPACEBAR ]);   //Espacio para disparo

    enemy = game.add.sprite(500, 300, 'enemy');
    enemy.anchor.set(0.5);

    game.physics.enable(enemy, Phaser.Physics.ARCADE);

    
}

function update() {

	ship.body.velocity.set(0);

	if (cursors.up.isDown)
    	ship.body.velocity.y = -300;
    
    else if (cursors.down.isDown)
    	ship.body.velocity.y = 300;

    if (cursors.left.isDown)
        ship.body.velocity.x = -300;

    else if (cursors.right.isDown)
        ship.body.velocity.x = 300;

    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
        //fireBullet();
        this.weapons[this.currentWeapon].fire(this.player);
    
    if (ship.y < enemy.y)
    	enemy.body.velocity.y = -100;
	
	else if (ship.y > enemy.y)
		enemy.body.velocity.y = 100;

	else if (ship.y === enemy.y)
		enemy.body.velocity.y = 0;

	if (ship.x < enemy.x)
		enemy.body.velocity.x = -100;

	else if (ship.x > enemy.x)
		enemy.body.velocity.x = 100;

	else if (ship.x > enemy.x)
		enemy.body.velocity.y = 0;

    //Actualizacion de las balas
	

    game.physics.arcade.collide(enemy, bullet, collisionHandler, null, this);
}

newBullet.prototype.update = function () {

    //Aplica seguimiento si está activado
    if (this.tracking) {
        this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
    }

    if (this.scaleSpeed > 0) {
        this.scale.x += this.scaleSpeed;
        this.scale.y += this.scaleSpeed;
    }
};

Weapon.SingleBullet = function (game) {

    Phaser.Group.call(this, game, game.world, 'Single Bullet', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 100;

    for (var i = 0; i < 64; i++) {
        this.add(new newBullet(game, 'bullet'), true);
    }

    return this;

};

Weapon.SingleBullet.prototype = Object.create(Phaser.Group.prototype);
Weapon.SingleBullet.prototype.constructor = Weapon.SingleBullet;

Weapon.SingleBullet.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
    //this.getFirstExists(false).fire(x, y, 45, this.bulletSpeed, 0, 0);


    this.nextFire = this.game.time.time + this.fireRate;

};
/*
function fireBullet(){

	if (game.time.now > bulletTime) {

		bullet = bullets.getFirstExists(false);

		// hay un pequeño error con las balas pero mola mazo
		if (bullet) {
			bullet.reset(ship.body.x +  16, ship.body.y + 16);
			bullet.lifespan = 2000;
			//game.physics.arcade.moveToPointer(bullet, 300);
			game.physics.arcade.velocityFromRotation(ship.rotation, 400, bullet.body.velocity);
			bulletTime = game.time.now + fireRate;
		}
	}
} 
*/
function collisionHandler (obj1, obj2) {
	enemy.kill();
	bullets.remove(bullet);
}

function render() {

}
