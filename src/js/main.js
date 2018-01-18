'use strict';

var game = new Phaser.Game(640, 400, Phaser.AUTO, 'game');

//Sprite con propiedades, todas las armas lo usan
var Bullet = function (game, key) {


    Phaser.Sprite.call(this, game, 0, 0, key);

    this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

    this.anchor.set(0.5);

    //Activa la destruccion al salir del mapa, inicializa a inexistente y con velocidad 0
    this.checkWorldBounds = true;
    this.outOfBoundsKill = true;
    this.exists = false;
    this.tracking = false;
    this.scaleSpeed = 0;

};

//Prototypes para las balas, creamos el sprite y llamamos a la constructora
Bullet.prototype = Object.create(Phaser.Sprite.prototype);
Bullet.prototype.constructor = Bullet;

//Prototype funcion creadora
Bullet.prototype.fire = function (x, y, angle, speed, gx, gy) {

    this.reset(x, y);
    //Inicializa bala con los valores generados por cada metodo arma
    this.scale.set(1);
    this.angle = angle;
    this.body.gravity.set(gx, gy);

    //Metodo que permite corregir la velocidad en funcion del angulo
    this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);


};

//Prototype del update que mueve la bala
Bullet.prototype.update = function () {

    if (this.tracking) {
        this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
    }

    if (this.scaleSpeed > 0) {
        this.scale.x += this.scaleSpeed;
        this.scale.y += this.scaleSpeed;
    }

};

// La bala choca con el enemigo
Bullet.prototype.bulletHitsEnemy = function(enemy) {
    this.kill();
    enemy.kill();

    puntuacion += 100;
};

//Clase arma que se compone de los diferentes tipos de disparo y las diferentes maneras de llamarlos
var Weapon = {};

//Bala simple que avanza
Weapon.BalaSimple = function (game) {

    Phaser.Group.call(this, game, game.world, 'Bala Simple', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 100;

    for (var i = 0; i < 64; i++) {
        this.add(new Bullet(game, 'bullet1'), true);
    }

    return this;
};

//Creamos grupo de balas simples
Weapon.BalaSimple.prototype = Object.create(Phaser.Group.prototype);
Weapon.BalaSimple.prototype.constructor = Weapon.BalaSimple;

//Creadora de la Bala Simple
Weapon.BalaSimple.prototype.fire = function (source, dir) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    // getFirstExists(false): Busca en el grupo bala el primer objeto no existente para crearlo
    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed * dir, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};

//Misil simple que acelera en la posicion actual
Weapon.Misil = function (game) {

    Phaser.Group.call(this, game, game.world, 'Misil', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 20;
    this.fireRate = 1000;

    for (var i = 0; i < 64; i++) {
        this.add(new Bullet(game, 'bullet5'), true);
    }

    return this;

};

Weapon.Misil.prototype = Object.create(Phaser.Group.prototype);
Weapon.Misil.prototype.constructor = Weapon.Misil;

Weapon.Misil.prototype.fire = function (source, dir) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed * dir, 1000, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};

//Disparo triple, una bala con angulo superior y otra inferior
Weapon.Triple = function (game) {

    Phaser.Group.call(this, game, game.world, 'Triple', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 400;
    this.fireRate = 400;


    for (var i = 0; i < 32; i++) {
        this.add(new Bullet(game, 'bullet7'), true);
    }
    return this;

};

Weapon.Triple.prototype = Object.create(Phaser.Group.prototype);
Weapon.Triple.prototype.constructor = Weapon.Triple;

Weapon.Triple.prototype.fire = function (source, dir) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y+50, 340, this.bulletSpeed * dir, 0, 0);
    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed * dir, 0, 0);
    this.getFirstExists(false).fire(x, y-50, 20, this.bulletSpeed * dir, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};

//Dispara en 8 direcciones
Weapon.EightWay = function (game) {

    Phaser.Group.call(this, game, game.world, 'Eight Way', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 200;
    this.fireRate = 100;

    for (var i = 0; i < 96; i++) {
        this.add(new Bullet(game, 'bullet5'), true);
    }

    return this;

};

Weapon.EightWay.prototype = Object.create(Phaser.Group.prototype);
Weapon.EightWay.prototype.constructor = Weapon.EightWay;

Weapon.EightWay.prototype.fire = function (source , dir) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 16;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed * dir, 1000, 0);
    this.getFirstExists(false).fire(x, y, 45, this.bulletSpeed * dir, 1000, 0);
    this.getFirstExists(false).fire(x, y, 90, this.bulletSpeed * dir, 1000, 0);
    this.getFirstExists(false).fire(x, y, 135, this.bulletSpeed * dir, 1000, 0);
    this.getFirstExists(false).fire(x, y, 180, this.bulletSpeed * dir, 1000, 0);
    this.getFirstExists(false).fire(x, y, 225, this.bulletSpeed * dir, 1000, 0);
    this.getFirstExists(false).fire(x, y, 270, this.bulletSpeed * dir, 1000, 0);
    this.getFirstExists(false).fire(x, y, 315, this.bulletSpeed * dir, 1000, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};

//Disparo de dispersion, se desvia ligeramente de manera aleatoria
Weapon.ScatterShot = function (game) {

    Phaser.Group.call(this, game, game.world, 'Scatter Shot', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 40;

    for (var i = 0; i < 32; i++) {
        this.add(new Bullet(game, 'bullet5'), true);
    }

    return this;

};

Weapon.ScatterShot.prototype = Object.create(Phaser.Group.prototype);
Weapon.ScatterShot.prototype.constructor = Weapon.ScatterShot;

Weapon.ScatterShot.prototype.fire = function (source, dir) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 16;
    var y = (source.y + source.height / 2) + this.game.rnd.between(-10, 10);

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed * dir, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};

//////////////////////////////////////////////////////////////////////////
//  Fires a streaming beam of lazers, very fast, in front of the player //
//////////////////////////////////////////////////////////////////////////

Weapon.Beam = function (game) {

    Phaser.Group.call(this, game, game.world, 'Beam', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 1000;
    this.fireRate = 4;

    for (var i = 0; i < 64; i++) {
        this.add(new Bullet(game, 'bullet6'), true);
    }

    return this;

};

Weapon.Beam.prototype = Object.create(Phaser.Group.prototype);
Weapon.Beam.prototype.constructor = Weapon.Beam;

Weapon.Beam.prototype.fire = function (source, dir) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 40;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed * dir, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};

///////////////////////////////////////////////////////////////////////
//  A three-way fire where the top and bottom bullets bend on a path //
///////////////////////////////////////////////////////////////////////

Weapon.SplitShot = function (game) {

    Phaser.Group.call(this, game, game.world, 'Split Shot', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 700;
    this.fireRate = 40;

    for (var i = 0; i < 64; i++) {
        this.add(new Bullet(game, 'bullet8'), true);
    }

    return this;

};

Weapon.SplitShot.prototype = Object.create(Phaser.Group.prototype);
Weapon.SplitShot.prototype.constructor = Weapon.SplitShot;

Weapon.SplitShot.prototype.fire = function (source, dir) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 20;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed * dir, 0, -500);
    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed * dir, 0, 0);
    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed * dir, 0, 500);

    this.nextFire = this.game.time.time + this.fireRate;

};

///////////////////////////////////////////////////////////////////////
//  Bullets have Gravity.y set on a repeating pre-calculated pattern //
///////////////////////////////////////////////////////////////////////

Weapon.Pattern = function (game) {

    Phaser.Group.call(this, game, game.world, 'Pattern', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 40;

    this.pattern = Phaser.ArrayUtils.numberArrayStep(-800, 800, 200);
    this.pattern = this.pattern.concat(Phaser.ArrayUtils.numberArrayStep(800, -800, -200));

    this.patternIndex = 0;

    for (var i = 0; i < 64; i++) {
        this.add(new Bullet(game, 'bullet4'), true);
    }

    return this;

};

Weapon.Pattern.prototype = Object.create(Phaser.Group.prototype);
Weapon.Pattern.prototype.constructor = Weapon.Pattern;

Weapon.Pattern.prototype.fire = function (source, dir) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 20;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed * dir, 0, this.pattern[this.patternIndex]);

    this.patternIndex++;

    if (this.patternIndex === this.pattern.length) {
        this.patternIndex = 0;
    }

    this.nextFire = this.game.time.time + this.fireRate;

};

///////////////////////////////////////////////////////////////////
//  Rockets that visually track the direction they're heading in //
///////////////////////////////////////////////////////////////////

Weapon.Rockets = function (game) {

    Phaser.Group.call(this, game, game.world, 'Rockets', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 400;
    this.fireRate = 250;

    for (var i = 0; i < 32; i++) {
        this.add(new Bullet(game, 'bullet5'), true);
    }

    this.setAll('tracking', true);

    return this;

};

Weapon.Rockets.prototype = Object.create(Phaser.Group.prototype);
Weapon.Rockets.prototype.constructor = Weapon.Rockets;

Weapon.Rockets.prototype.fire = function (source, dir) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed * dir, 0, -700);
    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed * dir, 0, 700);

    this.nextFire = this.game.time.time + this.fireRate;

};

//Bala que aumenta de tamaño conforme avanza
Weapon.ScaleBullet = function (game) {

    Phaser.Group.call(this, game, game.world, 'Scale Bullet', false, true, Phaser.Physics.ARCADE);

    this.nextFire = 0;
    this.bulletSpeed = 800;
    this.fireRate = 500;

    for (var i = 0; i < 32; i++) {
        this.add(new Bullet(game, 'bullet9'), true);
    }

    this.setAll('scaleSpeed', 0.10);

    return this;

};

Weapon.ScaleBullet.prototype = Object.create(Phaser.Group.prototype);
Weapon.ScaleBullet.prototype.constructor = Weapon.ScaleBullet;

Weapon.ScaleBullet.prototype.fire = function (source, dir) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed * dir, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};

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

    // Variables del enemigo
    this.enemies = null;
    this.nextEnemyAt = 0;
    this.enemyDelay = 1000;
    this.enemyWeapon = null;

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
        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemies.createMultiple(50, 'enemy');
        this.enemies.setAll('anchor.x', 0,5);
        this.enemies.setAll('anchor.y', 0.5);
        this.enemies.setAll('checkWorldBounds', true);
        this.enemies.setAll('outOfBoundsKill', true);
        
        //this.enemyWeapon = new Weapon.BalaSimple(this.game);

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

    nextEnemy: function() {
        console.log ('Enemigo Generado');
        if (this.nextEnemyAt < this.time.now && this.enemies.countDead() > 0) {
            this.nextEnemyAt = this.time.now + this.enemyDelay;
            var enemy = this.enemies.getFirstExists(false);
            enemy.reset (600 , this.rnd.integerInRange(20, 780));
            enemy.body.velocity.x = this.rnd.integerInRange(30, 60) * -1;
        }
    },

    enemyFire: function(){
        this.enemies.forEachAlive(function(enemy) { this.weapons[2].fire(enemy, -1); }, this);
        /*if (this.enemies.countDead() > 0) {
            var enemy = this.enemies.getFirstExists(false);
            
        }*/
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

    playerHit: function (player, enemy) {
        enemy.kill();
        this.puntuacion -= 50;
        if (this.puntuacion < 1000)
            console.log(this.puntuacion);
    }, 

    update: function () {

        this.player.body.velocity.set(0);
        console.log('puntuacion');

        this.nextEnemy();
        this.enemyFire();

        this.physics.arcade.overlap(this.player, this.enemies, this.playerHit, null, this);

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

    },

    
};

game.state.add('Game', SpaceAccountants, true);
