'use strict'

var weapon = require('./armas.js');

var juego = {

    //Crea e inicializa las variables del juego
  create:function(){
  
   this.background = null;
   this.foreground = null;
  
   //Variables del jugador
   this.player = null;
   this.cursors = null;
   this.speed = 300;
   this.puntuacion = 1000;
  
   // Variables del enemigo
   this.enemies = null;
   this.nextEnemyAt = 0;
   this.enemyDelay = 1000;
   this.enemyWeapon = null;
  
   this.weapons = [];
   this.currentWeapon = 0;
   this.weaponName = null;
  //},

  //create: function () {

    //this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
    //this.background.autoScroll(-40, 0);

    this.weapons.push(new weapon.Weapon.BalaSimple(this.game));
    weapons.push(new Weapon.Misil(this.game));
    weapons.push(new Weapon.Triple(this.game));
    weapons.push(new Weapon.EightWay(this.game));
    weapons.push(new Weapon.ScatterShot(this.game));
    weapons.push(new Weapon.Beam(this.game));
    weapons.push(new Weapon.SplitShot(this.game));
    weapons.push(new Weapon.Pattern(this.game));
    weapons.push(new Weapon.Rockets(this.game));
    weapons.push(new Weapon.ScaleBullet(this.game));

    this.currentWeapon = 0;

    for (var i = 1; i < this.weapons.length; i++) {
        this.weapons[i].visible = false;
    }

    //Crea sprite jugador, activa sus fisicas y la colision con el mundo
    this.player = this.add.sprite(64, 200, 'player');
    this.physics.arcade.enable(this.player);
    this.player.body.collideWorldBounds = true;

    // Crea un grupo de enemigos, activa sus físicas y la colision con el mundo
    this.enemies = game.add.group();
    this.enemies.enableBody = true;
    this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemies.createMultiple(50, 'enemy');
    this.enemies.setAll('anchor.x', 0,5);
    this.enemies.setAll('anchor.y', 0.5);
    this.enemies.setAll('checkWorldBounds', true);
    this.enemies.setAll('outOfBoundsKill', true);
    
    //this.enemyWeapon = new Weapon.BalaSimple(this.game);

    //Fondo y autoscroll
    this.foreground = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'foreground');
    this.foreground.autoScroll(-60, 0);

    this.weaponName = this.add.bitmapText(8, 364, 'shmupfont', "ENTER = Cambio de arma", 24);
    this.weaponName = this.add.bitmapText(8, 340, 'shmupfont', "SPACEBAR = Disparo", 24);
    this.weaponName = this.add.bitmapText(8, 316, 'shmupfont', "FLECHAS = Movimiento", 24);


    //Cursores para moverse y espacio para disparar
    this.cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

    //Controles del cambio de arma
    var changeKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
    changeKey.onDown.add(this.nextWeapon, this);

   },
  
  update:function(){
  
   this.player.body.velocity.set(0);
   console.log('puntuacion');
  
   this.nextEnemy();
   //this.enemyFire();
  
   // Sistema de colisiones :: Para que sea más "bonito" podemos hacer otro método en la clase que recoja todas las llamadas y en el main solo llamar a ese método
   this.physics.arcade.overlap(this.player, this.enemies, this.playerHit, null, this);
   this.physics.arcade.overlap(this.weapons[this.currentWeapon].bullets, this.enemies, this.enemyHit, null, this);
  
   // Detección de input :: Al implementar la clase de jugador aquí solo sería hacer llamada a this.playe.input(cursors, fireButton);
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
  
   if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
       this.weapons[this.currentWeapon].fire(this.player, 1);
   }
  
   //this.enemy1.body.velocity.x = -this.enemySpeed;
   //this.enemyWeapon.fire(this.enemy1, -1);
  }

};

module.exports = juego;