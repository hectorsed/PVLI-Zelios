'use strict';
var bala = require ('./bala.js')

//Clase arma que se compone de los diferentes tipos de disparo y las diferentes maneras de llamarlos
var Weapon = {};

//Bala simple que avanza
Weapon.BalaSimple = function (game) {

    Phaser.Group.call(this, game, game.world, 'Bala Simple', false, true, Phaser.Physics.ARCADE);

    //Latencia entre disparo, velocidad del proyectir y cadencia
    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 100;

    for (var i = 0; i < 64; i++) {
        this.add(new bala(game, 'bullet1'), true);
    }

    return this;
};

//Creamos grupo de balas simples
Weapon.BalaSimple.prototype = Object.create(Phaser.Group.prototype);
Weapon.BalaSimple.prototype.constructor = Weapon.BalaSimple;

//Creadora de la Bala Simple
Weapon.BalaSimple.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    // getFirstExists(false): Busca en el grupo bala el primer objeto no existente para crearlo
    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};

//Misil simple que acelera en la posicion actual
Weapon.Misil = function (game) {

    Phaser.Group.call(this, game, game.world, 'Misil', false, true, Phaser.Physics.ARCADE);

    //Latencia entre disparo, velocidad del proyectir y cadencia
    this.nextFire = 0;
    this.bulletSpeed = 20;
    this.fireRate = 1000;

    for (var i = 0; i < 64; i++) {
        this.add(new bala(game, 'bullet5'), true);
    }

    return this;

};

Weapon.Misil.prototype = Object.create(Phaser.Group.prototype);
Weapon.Misil.prototype.constructor = Weapon.Misil;

Weapon.Misil.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 1000, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};

//Disparo triple, una bala con angulo superior y otra inferior
Weapon.Triple = function (game) {

    Phaser.Group.call(this, game, game.world, 'Triple', false, true, Phaser.Physics.ARCADE);

    //Latencia entre disparo, velocidad del proyectir y cadencia
    this.nextFire = 0;
    this.bulletSpeed = 400;
    this.fireRate = 400;


    for (var i = 0; i < 32; i++) {
        this.add(new bala(game, 'bullet7'), true);
    }
    return this;

};

Weapon.Triple.prototype = Object.create(Phaser.Group.prototype);
Weapon.Triple.prototype.constructor = Weapon.Triple;

Weapon.Triple.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y+50, 340, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y-50, 20, this.bulletSpeed, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};

//Dispara en 8 direcciones
Weapon.EightWay = function (game) {

    Phaser.Group.call(this, game, game.world, 'Eight Way', false, true, Phaser.Physics.ARCADE);
    
    //Latencia entre disparo, velocidad del proyectir y cadencia
    this.nextFire = 0;
    this.bulletSpeed = 200;
    this.fireRate = 100;

    for (var i = 0; i < 96; i++) {
        this.add(new bala(game, 'bullet5'), true);
    }

    return this;

};

Weapon.EightWay.prototype = Object.create(Phaser.Group.prototype);
Weapon.EightWay.prototype.constructor = Weapon.EightWay;

Weapon.EightWay.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 16;
    var y = source.y + 10;

    for (var i = 0; i > 8; i++) {
        this.getFirstExists(false).fire(x, y, 45 * i, this.bulletSpeed, 1000, 0);
        
    };

    this.nextFire = this.game.time.time + this.fireRate;

};

//Disparo de dispersion, se desvia ligeramente de manera aleatoria
Weapon.ScatterShot = function (game) {

    Phaser.Group.call(this, game, game.world, 'Scatter Shot', false, true, Phaser.Physics.ARCADE);

    //Latencia entre disparo, velocidad del proyectir y cadencia
    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 40;

    for (var i = 0; i < 32; i++) {
        this.add(new bala(game, 'bullet5'), true);
    }

    return this;

};

Weapon.ScatterShot.prototype = Object.create(Phaser.Group.prototype);
Weapon.ScatterShot.prototype.constructor = Weapon.ScatterShot;

Weapon.ScatterShot.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 16;
    var y = (source.y + source.height / 2) + this.game.rnd.between(-10, 10);

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};

//Rayo laser

Weapon.Beam = function (game) {

    Phaser.Group.call(this, game, game.world, 'Beam', false, true, Phaser.Physics.ARCADE);

    //Latencia entre disparo, velocidad del proyectir y cadencia
    this.nextFire = 0;
    this.bulletSpeed = 1000;
    this.fireRate = 4;

    for (var i = 0; i < 64; i++) {
        this.add(new bala(game, 'bullet6'), true);
    }

    return this;

};

Weapon.Beam.prototype = Object.create(Phaser.Group.prototype);
Weapon.Beam.prototype.constructor = Weapon.Beam;

Weapon.Beam.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 40;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};

//Disparo tripe con los extremos curvandose

Weapon.SplitShot = function (game) {

    Phaser.Group.call(this, game, game.world, 'Split Shot', false, true, Phaser.Physics.ARCADE);

    //Latencia entre disparo, velocidad del proyectir y cadencia
    this.nextFire = 0;
    this.bulletSpeed = 700;
    this.fireRate = 40;

    for (var i = 0; i < 64; i++) {
        this.add(new bala(game, 'bullet8'), true);
    }

    return this;

};

Weapon.SplitShot.prototype = Object.create(Phaser.Group.prototype);
Weapon.SplitShot.prototype.constructor = Weapon.SplitShot;

Weapon.SplitShot.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 20;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, -500);
    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 500);

    this.nextFire = this.game.time.time + this.fireRate;

};

//Balas que siguen un array de gravedades emitiendo un patron

Weapon.Pattern = function (game) {

    Phaser.Group.call(this, game, game.world, 'Pattern', false, true, Phaser.Physics.ARCADE);

    //Latencia entre disparo, velocidad del proyectir y cadencia
    this.nextFire = 0;
    this.bulletSpeed = 600;
    this.fireRate = 40;

    this.pattern = Phaser.ArrayUtils.numberArrayStep(-800, 800, 200);
    this.pattern = this.pattern.concat(Phaser.ArrayUtils.numberArrayStep(800, -800, -200));

    this.patternIndex = 0;

    for (var i = 0; i < 64; i++) {
        this.add(new bala(game, 'bullet4'), true);
    }

    return this;

};

Weapon.Pattern.prototype = Object.create(Phaser.Group.prototype);
Weapon.Pattern.prototype.constructor = Weapon.Pattern;

Weapon.Pattern.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 20;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, this.pattern[this.patternIndex]);

    this.patternIndex++;

    if (this.patternIndex === this.pattern.length) {
        this.patternIndex = 0;
    }

    this.nextFire = this.game.time.time + this.fireRate;

};

//Cohetes que visualmente persiguen al enemigo

Weapon.Rockets = function (game) {

    Phaser.Group.call(this, game, game.world, 'Rockets', false, true, Phaser.Physics.ARCADE);

    //Latencia entre disparo, velocidad del proyectir y cadencia
    this.nextFire = 0;
    this.bulletSpeed = 400;
    this.fireRate = 250;

    for (var i = 0; i < 32; i++) {
        this.add(new bala(game, 'bullet5'), true);
    }

    this.setAll('tracking', true);

    return this;

};

Weapon.Rockets.prototype = Object.create(Phaser.Group.prototype);
Weapon.Rockets.prototype.constructor = Weapon.Rockets;

Weapon.Rockets.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, -700);
    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 700);

    this.nextFire = this.game.time.time + this.fireRate;

};

//Bala que aumenta de tamaño conforme avanza
Weapon.balaEscalada = function (game) {

    Phaser.Group.call(this, game, game.world, 'Bala Escalada', false, true, Phaser.Physics.ARCADE);

    //Latencia entre disparo, velocidad del proyectir y cadencia
    this.nextFire = 0;
    this.bulletSpeed = 800;
    this.fireRate = 500;

    for (var i = 0; i < 32; i++) {
        this.add(new bala(game, 'bullet9'), true);
    }

    this.setAll('scaleSpeed', 0.10);

    return this;

};

Weapon.balaEscalada.prototype = Object.create(Phaser.Group.prototype);
Weapon.balaEscalada.prototype.constructor = Weapon.balaEscalada;

Weapon.balaEscalada.prototype.fire = function (source) {

    if (this.game.time.time < this.nextFire) { return; }

    var x = source.x + 10;
    var y = source.y + 10;

    this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);

    this.nextFire = this.game.time.time + this.fireRate;

};



module.exports = Weapon;