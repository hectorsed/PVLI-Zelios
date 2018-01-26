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
    this.name = 'Simple';

    this.game = game;
    this.nextFire = 0;
    this.nextEnemyFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 100;

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
    this.name = 'Misil';

    this.game = game;
    this.nextFire = 0;
    this.nextEnemyFire = 0;
    this.bulletSpeed = 1000;
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
};

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
    this.name = 'Triple';

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
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(320, 'bullet5');
    this.bullets.setAll('anchor.x', 0,5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);
    this.name = 'EightWay';

    this.game = game;
    this.nextFire = 0;
    this.bulletSpeed = 200;
    this.fireRate = 600;

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
    bullet.reset(x, y);
    bullet.body.velocity.x = this.bulletSpeed * dir;
    var bullet1 = this.bullets.getFirstExists(false);
    bullet1.reset(x, y);
    bullet1.body.velocity.x = this.bulletSpeed * -dir;
    var bullet2 = this.bullets.getFirstExists(false);
    bullet2.reset(x, y);
    bullet2.body.velocity.y = this.bulletSpeed * -1;
    var bullet3 = this.bullets.getFirstExists(false);
    bullet3.reset(x, y);
    bullet3.body.velocity.y = this.bulletSpeed;
    var bullet4 = this.bullets.getFirstExists(false);
    bullet4.reset(x, y);
    bullet4.body.velocity.x = this.bulletSpeed * dir;
    bullet4.body.velocity.y = this.bulletSpeed/3;
    var bullet5 = this.bullets.getFirstExists(false);
    bullet5.reset(x, y);
    bullet5.body.velocity.x = this.bulletSpeed * dir;
    bullet5.body.velocity.y = this.bulletSpeed/3 * -1;
    var bullet6 = this.bullets.getFirstExists(false);
    bullet6.reset(x, y);
    bullet6.body.velocity.x = this.bulletSpeed * -dir;
    bullet6.body.velocity.y = this.bulletSpeed/3 * -1;
    var bullet7 = this.bullets.getFirstExists(false);
    bullet7.reset(x, y);
    bullet7.body.velocity.x = this.bulletSpeed * -dir;
    bullet7.body.velocity.y = this.bulletSpeed/3;
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
    this.name = 'ScatterShot';

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
    this.name = 'Beam';

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

    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(320, 'bullet4');
    this.bullets.setAll('anchor.x', 0,5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);
    this.name = 'Flamethrower';

    this.game = game;
    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 100;
    this.grades = -1;
    this.maxGrades = 1;
    this.minGrades = -1;
    
    return this;

};

Weapon.Pattern.prototype = Object.create(Phaser.Group.prototype);
Weapon.Pattern.prototype.constructor = Weapon.Pattern;

Weapon.Pattern.prototype.fire = function (source, dir) {

    if (this.game.time.time < this.nextFire) { return; }

    if (this.bullets.countDead() == 0) { return };

    this.nextFire = this.game.time.time + this.fireRate;

    var x = source.x + 20;
    var y = source.y + 10;

    
    if (this.grades < this.maxGrades){
        this.grades += 0.1;
    }

    if (this.grades >= this.maxGrades){
        this.grades = this.minGrades;
    }
    var bullet = this.bullets.getFirstExists(false);
    bullet.reset(x, y);
    bullet.body.velocity.x = this.bulletSpeed * dir;
    bullet.body.velocity.y = this.bulletSpeed * this.grades;
    
};

///////////////////////////////////////////////////////////////////
//  Rockets that visually track the direction they're heading in //
///////////////////////////////////////////////////////////////////

Weapon.Rockets = function (game) {

    this.bullets = game.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(32, 'bullet5');
    this.bullets.setAll('anchor.x', 0,5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('checkWorldBounds', true);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('tracking', true);
    this.name = 'Rockets';

    this.game = game;
    this.nextFire = 0;
    this.bulletSpeed = 400;
    this.fireRate = 250;

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
};

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
    this.name = 'Wave Bullet';

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

    // CANVAS
    // Variables del texto del canvas
    this.level = 1;
    this.levelString = '';
    this.levelTexte = null;

    this.puntuacion = 0;
    this.lostScore = 75;
    this.score = null;
    this.scoreString = '';
    this.scoreTexte = null;

    this.weaponName = '';
    this.weaponText = null;


    // JUGADOR
    this.player = null;
    this.cursors = null;
    this.speed = 300;

    // ENEMIGOS
    // Variables de enemigos que avanzan hacia la izquierda (desde el nivel 1)
    this.enemies = null;
    this.nextEnemyAt = 0;
    this.enemyDelay = 1000; 
    this.minSpeed = 30;
    this.maxspeed = 60;

    // Variables de enemigos que avanzan hacia arriba (desde el nivel 2)
    this.enemies1 = null;
    this.nextEnemy1At = 0;
    this.enemy1Delay = 1500;
    this.minSpeed1 = 70;
    this.maxspeed1 = 100;

    this.nextEnemy2At = 0;
    this.enemy2Delay = 1000;

    // ARMAS Y DISPAROS
    // Jugador
    this.weapons = [];
    this.currentWeapon = 0;
    this.maxWeapon = 0;

    // Enemigo
    this.enemyWeapon = null;
};

SpaceAccountants.prototype = {

    init: function () {

        //Iniciamos renderizador y activamos fisicas arcade
        this.game.renderer.renderSession.roundPixels = true;
        this.physics.startSystem(Phaser.Physics.ARCADE);
    },

    preload: function () {

        /*this.load.baseURL = 'http://files.phaser.io.s3.amazonaws.com/codingtips/issue007/';
        this.load.crossOrigin = 'anonymous';*/

        this.load.image('foreground', './images/fore.png');
        this.load.image('player', './images/ship.png');
        this.load.image('enemy', './images/enemy.png');
        this.load.image('enemy1', './images/enemy1.png');

        for (var i = 1; i <= 9; i++) {
            this.load.image('bullet' + i, './images/bullet' + i + '.png');
        }
    },

    create: function () {

        // CREACIÓN DE ARMAS
        // Creamos todas las armas del jugador
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

        // Creación del arma del enmigo
        this.enemyWeapon = new Weapon.Triple(this.game);

        // JUGADOR
        //Crea sprite jugador, activa sus fisicas y la colision con el mundo
        this.player = this.add.sprite(64, 200, 'player');
        this.physics.arcade.enable(this.player);
        this.player.body.collideWorldBounds = true;

        //Cursores para moverse y espacio para disparar
        this.cursors = this.input.keyboard.createCursorKeys();
        this.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);

        //Controles del cambio de arma
        var changeKey = this.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        changeKey.onDown.add(this.nextWeapon, this);

        // ENEMIGOS
        // Crea un grupo de enemigos, activa sus físicas y la colision con el mundo
        this.enemies = game.add.group();
        this.enemies.enableBody = true;
        this.enemies.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemies.createMultiple(100, 'enemy');
        this.enemies.setAll('anchor.x', 0,5);
        this.enemies.setAll('anchor.y', 0.5);
        this.enemies.setAll('checkWorldBounds', true);
        this.enemies.setAll('outOfBoundsKill', true);
        
        // Crea un segundo grupo de enemigos
        this.enemies1 = game.add.group();
        this.enemies1.enableBody = true;
        this.enemies1.physicsBodyType = Phaser.Physics.ARCADE;
        this.enemies1.createMultiple(50, 'enemy1');
        this.enemies1.setAll('anchor.x', 0,5);
        this.enemies1.setAll('anchor.y', 0.5);
        this.enemies1.setAll('checkWorldBounds', true);
        this.enemies1.setAll('outOfBoundsKill', true);

        // OTROS ELEMENTOS
        this.foreground = this.add.tileSprite(0, 0, this.game.width, this.game.height, 'foreground');
        this.foreground.autoScroll(-60, 0);

        this.scoreString = 'Score : ';
        this.scoreTexte = this.add.text(10, 10, this.scoreString + this.puntuacion, {font: '34px Arial', fill: '#fff'});       
        
        this.weaponName = 'Weapon : ';
        this.weaponText = this.add.text(10, this.game.height - 50, this.weaponName + this.weapons[this.currentWeapon].name, {font: '34px Arial', fill: '#fff'}); 

        this.levelString = 'Level : ';
        this.levelTexte = this.add.text(this.game.width - 150, 10, this.levelString+ this.level, {font: '34px Arial', fill: '#fff'});
    },

    nextEnemy: function() {
        if (this.nextEnemyAt < this.time.now && this.enemies.countDead() > 0) {
            this.nextEnemyAt = this.time.now + this.enemyDelay;
            var enemy = this.enemies.getFirstExists(false);
            enemy.reset (700 , this.rnd.integerInRange(50, 300));
            enemy.body.velocity.x = this.rnd.integerInRange(this.minSpeed, this.maxspeed) * -1;
        }

        // Creación de enemigos que empiezan a salir en distintos niveles
        if (this.level > 2) {
            if (this.nextEnemy2At < this.time.now && this.enemies.countDead() > 0) {
                this.nextEnemy2At = this.time.now + this.enemy2Delay;
                var enemy2 = this.enemies.getFirstExists(false);
                enemy2.scale.x = enemy2.scale.x * -1;
                enemy2.reset (20 , this.rnd.integerInRange(50, 300));
                enemy2.body.velocity.x = this.rnd.integerInRange(this.minSpeed, this.maxspeed) * 1;
            
            }
            
            if (this.level > 3){
                    if (this.nextEnemy1At < this.time.now && this.enemies1.countDead() > 0) {
                        this.nextEnemy1At = this.time.now + this.enemy1Delay;
                        var enemy1 = this.enemies1.getFirstExists(false);
                        enemy1.reset (this.rnd.integerInRange(100, 700) , 0);
                        enemy1.body.velocity.y = this.rnd.integerInRange(this.minSpeed1, this.maxspeed1) * 1;
                }
            }
        }
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

        this.weapons[this.currentWeapon].visible = true;

        // Actualización del canvas
        this.weaponText.text = this.weaponName + this.weapons[this.currentWeapon].name;
    },

    // Al detectar la colisión jugador con enemigo, se llama a este método
    playerHit: function (player, enemy) {
        enemy.kill();
        this.puntuacion -= this.lostScore;
        // Actualización del canvas
        this.scoreTexte.text = this.scoreString + this.puntuacion;
    }, 

    // Al detectar la colisión bala con enemigo, se llama a este método
    enemyHit: function(bullet, enemy) {
        if (this.currentWeapon == 0){
            bullet.kill();
        }

        this.enemyWeapon.fire(enemy, -1);
        enemy.kill();
        this.puntuacion += 100;
        // Actualización del canvas
        this.scoreTexte.text = this.scoreString + this.puntuacion;
    },
    
    enemy1Hit: function(bullet, enemy) {
        bullet.kill();
        enemy.body.velocity.x = -700;
        enemy.body.velocity.y = 0;
        // Actualización del canvas
        this.scoreTexte.text = this.scoreString + this.puntuacion;
    },

    // Todo lo relacionado con las colisiones recogido en un método
    colisionEffects: function(){
        this.physics.arcade.overlap(this.player, this.enemies, this.playerHit, null, this);
        this.physics.arcade.overlap(this.player, this.enemies1, this.playerHit, null, this);
        this.physics.arcade.overlap(this.weapons[this.currentWeapon].bullets, this.enemies, this.enemyHit, null, this);
        this.physics.arcade.overlap(this.weapons[this.currentWeapon].bullets, this.enemies1, this.enemy1Hit, null, this);
        this.physics.arcade.overlap(this.player, this.enemyWeapon.bullets, this.playerHit, null, this);
    },

    scoreEffects: function() {
        this.weapons[0].bulletSpeed = 600;
        this.weapons[0].fireRate = 100;
        this.speed = 300;
        var reduces = 2;

        if (this.puntuacion <= -50) {
            this.weapons[0].bulletSpeed = this.weapons[0].bulletSpeed / reduces;
            this.weapons[0].fireRate = this.weapons[0].fireRate * reduces;

            if (this.puntuacion <= -150) {
                this.speed = this.speed/reduces;

                if (this.puntuacion <= -200){
                    this.weapons[0].bulletSpeed = this.weapons[0].bulletSpeed / (reduces + 1);
                    this.speed = this.speed /(reduces + 1);
                }
            }
        }
    },

    nextLevel: function() {
        var limitScore = 1000;

        // Para evitar que se baje de nivel
        var lastLevel = 5;

        if (this.puntuacion >= limitScore && this.puntuacion < limitScore * 2 && this.level != lastLevel) {
           this.level = 2;
        }
        else if (this.puntuacion >= limitScore * 2 && this.puntuacion < limitScore * 3 && this.level != lastLevel)
            this.level = 3;

        else if (this.puntuacion >= limitScore * 3 && this.puntuacion < limitScore * 4  && this.level != lastLevel)
            this.level = 4;

        else if (this.puntuacion >= limitScore * 4)
            this.level = 5;

        // Actualización del canvas
        this.levelTexte.text = this.levelString + this.level;
    },

    levelsEffects : function() {
        if (this.level == 2){
            this.lostScore = 85;
            this.enemyDelay = 800;
            this.minSpeed = 100;
            this.maxspeed = 130;
        }

        else if (this.level == 3){
            this.enemyDelay = 700;
            this.lostScore = 95;
        }

        else if (this.level == 4){
            this.lostScore = 95
            this.enemy1Delay = 600;
            this.enemy2Delay = 900;
        }

        else if (this.level == 5){
            this.lostScore = 105;
            this.minSpeed = 130;
            this.maxspeed = 160;
            this.enemy1Delay = 1000;
            this.minSpeed1 = 60;
            this.maxspeed1 = 90;
        }
    },

    playerInput: function() {
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
    }, 

    update: function () {
        this.speed = 300;
        this.player.body.velocity.set(0);

        this.nextEnemy();
        this.colisionEffects();
        this.nextLevel();
        this.levelsEffects();
        this.scoreEffects();
        this.playerInput();
    },
};

game.state.add('Game', SpaceAccountants, true);
