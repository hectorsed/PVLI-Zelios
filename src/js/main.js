'use strict';

var game = new Phaser.Game(800, 400, Phaser.AUTO, 'game');

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

    // Balas del jugador
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(64, 'bullet1');
    this.bullets.setAll('anchor.x', 0,5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);

    // Balas del enemigo
    this.enemyBullets = game.add.group();
    this.enemyBullets.enableBody = true;
    this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyBullets.createMultiple(64, 'bullet1');
    this.enemyBullets.setAll('anchor.x', 0,5);
    this.enemyBullets.setAll('anchor.y', 0.5);
    this.enemyBullets.setAll('checkWorldBounds', true);
    this.enemyBullets.setAll('outOfBoundsKill', true);

    this.game = game;
    this.nextFire = 0;
    this.nextEnemyFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 100;

    /*for (var i = 0; i < 64; i++) {
        this.bullets.add(new Bullet(game, 'bullet1'), true);
    }*/

    return this;
};

//Creamos grupo de balas simples
Weapon.BalaSimple.prototype = Object.create(Phaser.Group.prototype);
Weapon.BalaSimple.prototype.constructor = Weapon.BalaSimple;

// Disparo de una bala simple
Weapon.BalaSimple.prototype.fire = function (source, dir) {
    // Comprobamos si se puede disparar
    if (this.nextFire > this.game.time.now) { return };

    // Comprobamos si hay balas disponibles
    if (this.bullets.countDead() == 0) { return };

    // Añadimos el tiempo de disparo entre disparo
    this.nextFire = this.game.time.now + this.fireRate;
    this.nextEnemyFire = this.game.time.now + this.fireRate;

    var x = source.x + 10;
    var y = source.y + 10;

    // Hacemos el disparo: 1. Cogemos una bala 2. La ponemos en las coordenadas del "disparador" 3. Le damos velocidad
    var bullet = this.bullets.getFirstExists(false);
    bullet.reset(x, y);
    bullet.body.velocity.x = this.bulletSpeed * dir;
     /*else {
        var enemyBullet = this.enemyBullets.getFirstExists(false);
        enemyBullet.reset(source.x, source.y);
        enemyBullet.body.velocity.x = this.bulletSpeed * dir;

    }*/
    /*if (this.game.time.time < this.nextFire) { return; }

    

    // getFirstExists(false): Busca en el grupo bala el primer objeto no existente para crearlo
    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed * dir, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;*/


};

//Misil simple que acelera en la posicion actual
Weapon.Misil = function (game) {

    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(64, 'bullet5');
    this.bullets.setAll('anchor.x', 0,5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);

    this.game = game;
    this.nextFire = 0;
    this.nextEnemyFire = 0;
    this.bulletSpeed = 200;
    this.fireRate = 1000;

    return this;

};

Weapon.Misil.prototype = Object.create(Phaser.Group.prototype);
Weapon.Misil.prototype.constructor = Weapon.Misil;

Weapon.Misil.prototype.fire = function (source, dir) {

    if (this.game.time.time < this.nextFire) { return; }

    if (this.bullets.countDead() == 0) { return; }

    this.nextFire = this.game.time.time + this.fireRate;
    
    var x = source.x + 10;
    var y = source.y + 10;

    var bullet = this.bullets.getFirstExists(false);
    bullet.reset(x, y);
    bullet.body.velocity.x = this.bulletSpeed * dir;

    /*

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed * dir, 1000, 0);*/

   

};

Weapon.Misil.prototype.hit = function (obj1, obj2) {
    obj2.kill();
    obj1.kill();
}

//Disparo triple, una bala con angulo superior y otra inferior
Weapon.Triple = function (game) {

    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(32, 'bullet7');
    this.bullets.setAll('anchor.x', 0,5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);

    this.game = game;
    this.nextFire = 0;
    this.bulletSpeed = 400;
    this.fireRate = 400;

    return this;

};

Weapon.Triple.prototype = Object.create(Phaser.Group.prototype);
Weapon.Triple.prototype.constructor = Weapon.Triple;

Weapon.Triple.prototype.fire = function (source, dir) {

    if (this.game.time.time < this.nextFire) { return; }

    if (this.bullets.countDead() == 0) { return };

    this.nextFire = this.game.time.time + this.fireRate;

    var x = source.x + 10;
    var y = source.y + 10;
    
    var bullet = this.bullets.getFirstExists(false);
    bullet.reset(x, y);
    bullet.body.velocity.x = this.bulletSpeed * dir;
    bullet.body.velocity.y = this.bulletSpeed/3 * -1;
    
    var bullet1 = this.bullets.getFirstExists(false);
    bullet1.reset(x, y);
    bullet1.body.velocity.x = this.bulletSpeed * dir;
    var bullet2 = this.bullets.getFirstExists(false);
    bullet2.reset(x, y);
    bullet2.body.velocity.x = this.bulletSpeed * dir;
    bullet2.body.velocity.y = this.bulletSpeed/3;

};

//Dispara en 8 direcciones
Weapon.EightWay = function (game) {

    this.bullets = game.add.group();
    /*this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(1, 'bullet5');
    this.bullets.setAll('anchor.x', 0,5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);*/

    this.game = game;
    this.nextFire = 0;
    this.bulletSpeed = 200;
    this.fireRate = 100;

    for (var i = 0; i < 32; i++){
        this.bullets.add(new Bullet(game, 'bullet5') , true);
    }

    return this;
};

Weapon.EightWay.prototype = Object.create(Phaser.Group.prototype);
Weapon.EightWay.prototype.constructor = Weapon.EightWay;

Weapon.EightWay.prototype.fire = function (source , dir) {

    if (this.game.time.time < this.nextFire) { return; }

    if (this.bullets.countDead() == 0) { return };

    this.nextFire = this.game.time.time + this.fireRate;

    var x = source.x + 16;
    var y = source.y + 10;

    var bullet = this.bullets.getFirstExists(false);
    bullet.fire(source.x, source.y, 0, this.bulletSpeed * dir, 1000, 0);
    //bullet.body.angle = 340;
    var bullet1 = this.bullets.getFirstExists(false);
    bullet1.fire(source.x, source.y, 45, this.bulletSpeed * dir, 1000, 0);
    //bullet1.body.velocity.x = this.bulletSpeed * dir;
    var bullet2 = this.bullets.getFirstExists(false);
    bullet2.fire(source.x, source.y, 90, this.bulletSpeed * dir, 1000, 0);
    //bullet2.reset(source.x, source.y - 50);
    //bullet2.body.velocity.x = this.bulletSpeed * dir;
    //bullet.body.angle = 20
    var bullet3 = this.bullets.getFirstExists(false);
    bullet3.fire(source.x, source.y, 135, this.bulletSpeed * dir, 1000, 0);
    var bullet4 = this.bullets.getFirstExists(false);
    bullet4.fire(source.x, source.y, 180, this.bulletSpeed * dir, 1000, 0);
    var bullet5 = this.bullets.getFirstExists(false);
    bullet5.fire(source.x, source.y, 225, this.bulletSpeed * dir, 1000, 0);
    var bullet6 = this.bullets.getFirstExists(false);
    bullet6.fire(source.x, source.y, 270, this.bulletSpeed * dir, 1000, 0);
    var bullet7 = this.bullets.getFirstExists(false);
    bullet7.fire(source.x, source.y, 315, this.bulletSpeed * dir, 1000, 0);
};

//Disparo de dispersion, se desvia ligeramente de manera aleatoria
Weapon.ScatterShot = function (game) {

    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(64, 'bullet5');
    this.bullets.setAll('anchor.x', 0,5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);

    this.game = game;
    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 40;

    return this;

};

Weapon.ScatterShot.prototype = Object.create(Phaser.Group.prototype);
Weapon.ScatterShot.prototype.constructor = Weapon.ScatterShot;

Weapon.ScatterShot.prototype.fire = function (source, dir) {

    if (this.game.time.time < this.nextFire) { return; }

    if (this.bullets.countDead() == 0) { return; }

    this.nextFire = this.game.time.time + this.fireRate;

    var x = source.x + 16;
    var y = (source.y + source.height / 2) + this.game.rnd.between(-10, 10);

    var bullet = this.bullets.getFirstExists(false);
    bullet.reset(x, y);
    bullet.body.velocity.x = this.bulletSpeed * dir;

   

};

//////////////////////////////////////////////////////////////////////////
//  Fires a streaming beam of lazers, very fast, in front of the player //
//////////////////////////////////////////////////////////////////////////

Weapon.Beam = function (game) {

    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(64, 'bullet3');
    this.bullets.setAll('anchor.x', 0,5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.name = 'Beam';
    console.log(this.bullets.name);

    this.game = game;
    this.nextFire = 0;
    this.bulletSpeed = 1000;
    this.fireRate = 4;

    return this;

};

Weapon.Beam.prototype = Object.create(Phaser.Group.prototype);
Weapon.Beam.prototype.constructor = Weapon.Beam;

Weapon.Beam.prototype.fire = function (source, dir) {

    if (this.game.time.time < this.nextFire) { return; }

    if (this.bullets.countDead() == 0) { return; }

    this.nextFire = this.game.time.time + this.fireRate;

    var x = source.x + 40;
    var y = source.y + 10;

    var bullet = this.bullets.getFirstExists(false);
    bullet.reset(x, y);
    bullet.body.velocity.x = this.bulletSpeed * dir;

};

///////////////////////////////////////////////////////////////////////
//  A three-way fire where the top and bottom bullets bend on a path //
///////////////////////////////////////////////////////////////////////

Weapon.SplitShot = function (game) {

    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(128, 'bullet8');
    this.bullets.setAll('anchor.x', 0,5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);
    this.name = 'SplitShot';

    this.game = game;

    this.nextFire = 0;
    this.bulletSpeed = 700;
    this.fireRate = 40;

    return this;

};

Weapon.SplitShot.prototype = Object.create(Phaser.Group.prototype);
Weapon.SplitShot.prototype.constructor = Weapon.SplitShot;

Weapon.SplitShot.prototype.fire = function (source, dir) {

    if (this.game.time.time < this.nextFire) { return; }

    if (this.bullets.countDead() == 0) { return };

    this.nextFire = this.game.time.time + this.fireRate;

    var x = source.x + 20;
    var y = source.y + 10;

    var bullet = this.bullets.getFirstExists(false);
    bullet.reset(x, y);
    bullet.body.velocity.x = this.bulletSpeed * dir;
    bullet.body.velocity.y = this.bulletSpeed * -0.1;
    
    var bullet1 = this.bullets.getFirstExists(false);
    bullet1.reset(x, y);
    bullet1.body.velocity.x = this.bulletSpeed * dir;
    var bullet2 = this.bullets.getFirstExists(false);
    bullet2.reset(x, y);
    bullet2.body.velocity.x = this.bulletSpeed * dir;
    bullet2.body.velocity.y = this.bulletSpeed * 0.1;

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

    //Phaser.Group.call(this, game, game.world, 'Rockets', false, true, Phaser.Physics.ARCADE);
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(32, 'bullet5');
    this.bullets.setAll('anchor.x', 0,5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('tracking', true);
    this.game = game;
    this.nextFire = 0;
    this.bulletSpeed = 400;
    this.fireRate = 250;

    /*for (var i = 0; i < 32; i++) {
        this.add(new Bullet(game, 'bullet5'), true);
    }

    this.setAll('tracking', true);
    */
    return this;

};

Weapon.Rockets.prototype = Object.create(Phaser.Group.prototype);
Weapon.Rockets.prototype.constructor = Weapon.Rockets;

Weapon.Rockets.prototype.fire = function (source, dir) {

    if (this.game.time.time < this.nextFire) { return; }

    if (this.bullets.countDead() == 0) { return };

    this.nextFire = this.game.time.time + this.fireRate;

    var x = source.x + 10;
    var y = source.y + 10;

    var bullet = this.bullets.getFirstExists(false);
    bullet.reset(x,y);
    bullet.body.velocity.x = this.bulletSpeed * dir;
    bullet.body.velocity.y = this.bulletSpeed;
    bullet.rotation = 90;
    var bullet1 = this.bullets.getFirstExists(false);
    bullet1.reset(x,y);
    bullet1.body.velocity.x = this.bulletSpeed * dir;
    bullet1.body.velocity.y = this.bulletSpeed * -1;
    /*this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed * dir, 0, -700);
    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed * dir, 0, 700);*/

    

};

//Bala que aumenta de tamaño conforme avanza
Weapon.ScaleBullet = function (game) {

    Phaser.Group.call(this, game, game.world, 'Scale Bullet', false, true, Phaser.Physics.ARCADE);
    
    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(128, 'bullet9');
    this.bullets.setAll('anchor.x', 0,5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);
    this.name = 'Scale Bullet';

    this.game = game;

    this.nextFire = 0;
    this.bulletSpeed = 800;
    this.fireRate = 700;

    return this;

};

Weapon.ScaleBullet.prototype = Object.create(Phaser.Group.prototype);
Weapon.ScaleBullet.prototype.constructor = Weapon.ScaleBullet;

Weapon.ScaleBullet.prototype.fire = function (source, dir) {

    if (this.game.time.time < this.nextFire) { return; }

    if (this.bullets.countDead() == 0) { return };

    this.nextFire = this.game.time.time + this.fireRate;

    var x = source.x + 10;
    var y = source.y + 10;

    var bullet = this.bullets.getFirstExists(false);
    bullet.reset(x, y);
    bullet.body.velocity.x = this.bulletSpeed * dir;
    bullet.scale.x = 4;
    bullet.scale.y = 4;

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

    // Variables de la gestión del nivel
    this.level = 3;
    this.levels  = [3];
    this.currentLevel = 0;

    this.player = null;
    this.cursors = null;
    this.speed = 300;
    this.puntuacion = 19303;

    // ENEMIGOS
    // Variables de enemigos que avanzan hacia la izquierda (desde el nivel 1)
    this.enemies = null;
    this.nextEnemyAt = 0;
    this.enemyDelay = 1000;
    this.enemyWeapon = null;
    this.minSpeed = 30;
    this.maxspeed = 60;

    // Variables de enemigos que avanzan hacia arriba (desde el nivel 2)
    this.enemies1 = null;
    this.nextEnemy1At = 0;
    this.enemy1Delay = 1000;
    this.minSpeed1 = 70;
    this.maxspeed1 = 100;

    this.nextEnemy2At = 0;
    this.enemy2Delay = 1000;

    this.weapons = [];
    this.currentWeapon = 0;
    this.weaponName = null;
    this.maxWeapon = 0;
    this.newWeapon = 0;

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
        /*this.load.baseURL = 'http://files.phaser.io.s3.amazonaws.com/codingtips/issue007/';
        this.load.crossOrigin = 'anonymous';*/

        //this.load.image('background', 'assets/backgroud.png');
        this.load.image('foreground', './images/fore.png');
        this.load.image('player', './images/ship.png');
        this.load.image('enemy', './images/enemy.png');
        this.load.image('enemy1', './images/enemy1.png');
        //this.load.bitmapFont('shmupfont', 'assets/shmupfont.png', 'assets/shmupfont.xml');

        
        for (var i = 1; i <= 9; i++) {
            this.load.image('bullet' + i, './images/bullet' + i + '.png');
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

        this.enemyWeapon = new Weapon.Triple(this.game);

        //Crea sprite jugador, activa sus fisicas y la colision con el mundo
        this.player = this.add.sprite(64, 200, 'player');
        this.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;

        // Crea un grupo de enemigos, activa sus físicas y la colision con el mundo
        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemies.createMultiple(100, 'enemy');
        this.enemies.setAll('anchor.x', 0,5);
        this.enemies.setAll('anchor.y', 0.5);
        this.enemies.setAll('checkWorldBounds', true);
        this.enemies.setAll('outOfBoundsKill', true);

        this.enemies1 = game.add.group();
        this.enemies1.enableBody = true;
        this.enemies1.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemies1.createMultiple(50, 'enemy1');
        this.enemies1.setAll('anchor.x', 0,5);
        this.enemies1.setAll('anchor.y', 0.5);
        this.enemies1.setAll('checkWorldBounds', true);
        this.enemies1.setAll('outOfBoundsKill', true);

        this.foreground = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'foreground');
        this.foreground.autoScroll(-60, 0);

        /*this.weaponName = this.add.bitmapText(8, 364, 'shmupfont', "ENTER = Cambio de arma", 18);
        this.weaponName = this.add.bitmapText(8, 340, 'shmupfont', "SPACEBAR = Disparo", 18);
        this.weaponName = this.add.bitmapText(8, 316, 'shmupfont', "FLECHAS = Movimiento", 18);
        this.weaponName = this.add.bitmapText(8, 292, 'shmupfont', "NIVEL = " + this.level, 18);*/


        //Cursores para moverse y espacio para disparar
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

        //Controles del cambio de arma
        var changeKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        changeKey.onDown.add(this.nextWeapon, this);
        
    },

    nextEnemy: function() {
        console.log(this.enemies.countDead());
        if (this.nextEnemyAt < this.time.now && this.enemies.countDead() > 0) {
            this.nextEnemyAt = this.time.now + this.enemyDelay;
            var enemy = this.enemies.getFirstExists(false);
            console.log(enemy.scale.x);
            enemy.reset (600 , this.rnd.integerInRange(20, 780));
            enemy.body.velocity.x = this.rnd.integerInRange(this.minSpeed, this.maxspeed) * -1;
        }

        // Creación de enemigos que empiezan a salir en distintos niveles
        if (this.level > 1) {
            //console.log(this.enemies1.countDead());
            if (this.nextEnemy1At < this.time.now && this.enemies1.countDead() > 0) {
                this.nextEnemy1At = this.time.now + this.enemy1Delay;
                var enemy1 = this.enemies1.getFirstExists(false);
                enemy1.reset (this.rnd.integerInRange(20, 780) , 0);
                enemy1.body.velocity.y = this.rnd.integerInRange(this.minSpeed1, this.maxspeed1) * 1;
                console.log("generado");
            }
            
            if (this.level > 2){
                if (this.nextEnemy2At < this.time.now && this.enemies.countDead() > 0) {
                    this.nextEnemy2At = this.time.now + this.enemy2Delay;
                    var enemy2 = this.enemies.getFirstExists(false);
                    enemy2.scale.x = enemy2.scale.x * -1;
                    enemy2.reset (20 , this.rnd.integerInRange(20, 780));
                    enemy2.body.velocity.x = this.rnd.integerInRange(this.minSpeed, this.maxspeed) * 1;
    
                }
            }
        }
    },

    enemyFire: function(){
        this.enemies.forEachAlive(function(enemy) { this.weapons[0].fire(enemy, -1) }, this);
        /*if (this.enemies.countDead() > 0) {
            var enemy = this.enemies.getFirstExists(false);
            
        }*/
    },

    nextWeapon: function () {
        // Esta varible nos sirve para hacer la restrincción del uso de las armas
        // Si llegamos a los 500 puntos, tendremos los misiles 
        // *(es decir 500/500 = 1 luego weapons[1] = miles)*
        this.maxWeapon = this.puntuacion / 500;

        // Solo tenemos 9 armas, luego si superamos el los 1999 puntos tenemos que
        // hacer que el máximo de armas sigua siendo 9 y no 10 (2000/500 = 10)
        if (this.maxWeapon >= 10) {
            this.maxWeapon = 9;
        }

        this.currentWeapon++;

        //  Reinicia al arma
        if (this.currentWeapon > this.maxWeapon) {
            this.currentWeapon = 0;
        }

        console.log(this.currentWeapon);
        this.weapons[this.currentWeapon].visible = true;
    },
    
    nextLevel: function() {
        var limitScore = 1000;
        if (this.puntuacion >= limitScore && this.puntuacion < limitScore) {
           this.level++;
        }

    },

    // Al detectar la colisión jugador con enemigo (más adelante servirá para jugador, bala enemigo), se lla a este método
    playerHit: function (player, enemy) {
        enemy.kill();
        this.puntuacion -= 300;
    }, 

    // Al detectar la colisión bala con enemigo, se llama a este método
    enemyHit: function(bullet, enemy) {
        if (this.currentWeapon == 0){
            bullet.kill();
        }

        this.enemyWeapon.fire(enemy, -1);
        enemy.kill();
        this.puntuacion += 100;
    },
    
    enemy1Hit: function(bullet, enemy) {
        bullet.kill();
        enemy.body.velocity.x = -700;
        enemy.body.velocity.y = 0
    },

    scoreEffects: function() {
        this.weapons[0].bulletSpeed = 600;
        this.weapons[0].fireRate = 100;
        this.speed = 300;
        var reduces = 2;

        // Efectos de score negativos
        if (this.puntuacion <= -50) {
            this.weapons[0].bulletSpeed = this.weapons[0].bulletSpeed / reduces;
            this.weapons[0].fireRate = this.weapons[0].fireRate * reduces;

            if (this.puntuacion <= -100) {
                this.speed = this.speed/reduces;

                if (this.puntuacion <= -200){
                    this.weapons[0].bulletSpeed = this.weapons[0].bulletSpeed / (reduces + 1);
                    this.speed = this.speed /(reduces + 1);
                }
            }
        }
    },

    levelsEffects : function() {
        if (this.level == 2){
            this.minSpeed = 100;
            this.maxspeed = 130;
        }
    },

    colisionEffects: function(){
        this.physics.arcade.overlap(this.player, this.enemies, this.playerHit, null, this);
        this.physics.arcade.overlap(this.player, this.enemies1, this.playerHit, null, this);
        this.physics.arcade.overlap(this.weapons[this.currentWeapon].bullets, this.enemies, this.enemyHit, null, this);
        this.physics.arcade.overlap(this.weapons[this.currentWeapon].bullets, this.enemies1, this.enemy1Hit, null, this);
        this.physics.arcade.overlap(this.player, this.enemyWeapon.bullets, this.playerHit, null, this);
    },

    update: function () {
        this.speed = 300;
        this.player.body.velocity.set(0);

        this.nextEnemy();
        //this.enemyFire();

        // Sistema de colisiones :: Para que sea más "bonito" podemos hacer otro método en la clase que recoja todas las llamadas y en el main solo llamar a ese método
        this.colisionEffects();
        this.levelsEffects();
        this.scoreEffects();

        // Detección de input :: Al implementar la clase de jugador aquí solo sería hacer llamada a this.playe.input(cursors, fireButton);
        if (this.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
            this.weapons[this.currentWeapon].fire(this.player, 1);
           
        }
        if (this.cursors.left.isDown) {
            this.player.body.velocity.x = -this.speed;
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

        
        //this.nextLevel();
        
        

    },

    
};

game.state.add('Game', SpaceAccountants, true);
