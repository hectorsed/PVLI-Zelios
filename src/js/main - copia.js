'use strict'

var arma = require('.bullet')

//  The core game loop
/*var PlayScene = require('./play_scene.js');
var ship = require('./ship.js');

var BootScene = {
    preload: function(){

    },

    create: function(){
        this.game.state.start('preloader');
    }
};

/*var PreloaderScene = {
    preload: function(){

        // CARGA DE IMÁGENES
        this.game.load.image('foreground', 'images/fore.png');
        this.game.load.image('player', 'images/ship.png');
        this.game.load.image('enemy', 'images/enemy1.png');

        for (var i = 1; i <= 9; i++) {
            this.load.image('bullet' + i, 'images/bullet' + i + '.png');
        }
    }
    
};

window.onload = function (){
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

    game.state.add('boot', BootScene);
    game.state.add('preloader', PreloaderScene);
    game.state.add('play', PlayScene);
    //game.state.add('Menu', mainMenu);
    game.state.start('boot');
}*/

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

SpaceAccountants.prototype = {

    init: function () {

        //Iniciamos renderizador y activamos fisicas arcade
        this.game.renderer.renderSession.roundPixels = true;
        this.physics.startSystem(Phaser.Physics.ARCADE);
    },

    preload: function () {

        //  We need this because the assets are on Amazon S3
        //  Remove the next 2 lines if running locally
        this.load.baseURL = 'http://files.phaser.io.s3.amazonaws.com/codingtips/issue007/';
        this.load.crossOrigin = 'anonymous';

        //this.load.image('background', 'assets/backgroud.png');
        this.load.image('foreground', 'assets/fore.png');
        this.load.image('player', 'assets/ship.png');
        this.load.image('enemy1', 'images/enemy1.png');
        this.load.bitmapFont('shmupfont', 'assets/shmupfont.png', 'assets/shmupfont.xml');

        
        for (var i = 1; i <= 9; i++) {
            this.load.image('bullet' + i, 'assets/bullet' + i + '.png');
        }
        //this.load.image('bullet5', 'images/bullet.png');

        //  Note: Graphics are not for use in any commercial project

    },

    create: function () {

        //this.background = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
        //this.background.autoScroll(-40, 0);

        this.weapons.push(new Weapon.BalaSimple(this.game));
        this.weapons.push(new Weapon.Misil(this.game));
        this.weapons.push(new Weapon.Triple(this.game));
        this.weapons.push(new Weapon.EightWay(this.game));
        this.weapons.push(new Weapon.ScatterShot(this.game));
        this.weapons.push(new Weapon.Beam(this.game));
        this.weapons.push(new Weapon.SplitShot(this.game));
        this.weapons.push(new Weapon.Pattern(this.game));
        this.weapons.push(new Weapon.Rockets(this.game));
        this.weapons.push(new Weapon.ScaleBullet(this.game));

        this.currentWeapon = 0;

        for (var i = 1; i < this.weapons.length; i++) {
            this.weapons[i].visible = false;
        }

        //Crea sprite jugador, activa sus fisicas y la colision con el mundo
        this.player = this.add.sprite(64, 200, 'player');
        this.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;

        //Crea sprite enemigo, activa sus físicas y la colision con el mundo
        this.enemy1 = this.add.sprite(1000, 200, 'enemy1');
        this.physics.arcade.enable(this.enemy1);
        this.checkWorldBounds = true;
        this.outOfBoundsKill = true;

        this.enemyWeapon = new Weapon.Misil(this.game);

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

    nextWeapon: function () {

        //  Reinicia al arma
        if (this.currentWeapon > 9) {
            this.weapons[this.currentWeapon].reset();
        }
        else {
            //Debug: Elimina arma antigua
            //this.weapons[this.currentWeapon].visible = false;
            //this.weapons[this.currentWeapon].callAll('reset', null, 0, 0);
            //this.weapons[this.currentWeapon].setAll('exists', false);
        }

        //  Activa nuevo arma
        this.currentWeapon++;

        if (this.currentWeapon === this.weapons.length) {
            this.currentWeapon = 0;
        }

        this.weapons[this.currentWeapon].visible = true;

        this.weaponName.text = this.weapons[this.currentWeapon].name;

    },

    update: function () {

        this.player.body.velocity.set(0);
        console.log('puntuacion');

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
            this.weapons[this.currentWeapon].fire(this.player);
        }

        this.enemy1.body.velocity.x = -this.enemySpeed;
        //this.enemyWeapon.fire(this.enemy1, -1);

    },

    collisionHandler: function (){

    }, 
};

game.state.add('Game', SpaceAccountants, true);
