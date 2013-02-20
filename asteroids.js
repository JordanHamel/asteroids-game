
// ***************** ASTEROID **********************
var Asteroid = function(x_pos, y_pos, x_vel, y_vel, radius, game) {

  var that = this;
  that.game = game;
  that.radius = radius;

  that.pos = {
    x: x_pos,
    y: y_pos
  };

  that.vel = {
    x: x_vel,
    y: y_vel
  }


  that.draw = function(ctx) {
    ctx.beginPath();
    ctx.arc(that.pos.x, that.pos.y, that.radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#666";
    ctx.fill();
    ctx.stroke();
  }

  that.update = function() {
    that.pos.x = wrapCoords(that.pos.x + that.vel.x, game.X_SIZE );
    that.pos.y = wrapCoords(that.pos.y + that.vel.y, game.Y_SIZE );
  }

}

// ***************** Global Function(s) **********************
var wrapCoords = function(coord, board_dim){
  if(coord % board_dim > 0){
    return coord % board_dim;
  }else{
    return board_dim + coord % board_dim;
  }
}

var isHit = function(hitter, hittee) {
  // console.log("Hit???");
  var distance = Math.sqrt(Math.pow((hitter.pos.x - hittee.pos.x), 2) + Math.pow((hitter.pos.y - hittee.pos.y), 2) );
  // console.log(hitter);
  // console.log(hittee);
  if (distance < hitter.radius + hittee.radius ) {
    return true;
  }
  return false;
}

// ***************** SHIP **********************
var Ship = function(x_pos, y_pos, radius, game) {

  var that = this;
  that.game = game;
  that.direction = Math.PI/2;

  that.pos = {
    x: x_pos,
    y: y_pos
  }

  that.vel = {
    x: 0,
    y: 0
  }

  that.radius = radius;

  that.draw = function(ctx) {
    ctx.beginPath();
    ctx.arc(that.pos.x, that.pos.y, radius, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#00F";
    ctx.fill();
    ctx.stroke();

    // Rocket boosters
    ctx.beginPath();
    ctx.arc(that.pos.x+radius/2, that.pos.y+radius, radius/2, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#F00";
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(that.pos.x-radius/2, that.pos.y+radius, radius/2, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#F00";
    ctx.fill();
    ctx.stroke();

    that.power = function(dx, dy) {
      that.vel.x += dx;
      that.vel.y += dy;
    }
  }

  that.update = function(){
    that.pos.x = wrapCoords(that.pos.x + that.vel.x, game.X_SIZE );
    that.pos.y = wrapCoords(that.pos.y + that.vel.y, game.Y_SIZE );
  }

}

// ***************** BULLET **********************
var Bullet = function(ship, game){

  var that = this;
  that.game = game;
  that.direction = ship.direction;
  that.radius = game.BULLET_SIZE;

  that.pos = {
    x: ship.pos.x + game.SHIP_RADIUS*Math.cos(that.direction),
    y: ship.pos.y - game.SHIP_RADIUS*Math.sin(that.direction)
  }

  that.vel = {
    x: ship.vel.x + Math.cos(ship.direction) * game.BULLET_SPEED,
    y: ship.vel.y - Math.sin(ship.direction) * game.BULLET_SPEED
  }

  that.draw = function(){
    ctx.beginPath();
    ctx.arc(that.pos.x, that.pos.y, game.BULLET_SIZE, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#FF0";
    ctx.fill();
    ctx.stroke();
  }

  that.update = function(){
    that.pos.x = wrapCoords(that.pos.x + that.vel.x, game.X_SIZE );
    that.pos.y = wrapCoords(that.pos.y + that.vel.y, game.Y_SIZE );
  }
}

// ***************** GAME **********************
var Game = function(ctx) {

  var that = this;

  that.X_SIZE = 400;
  that.Y_SIZE = 400;
  that.VELOCITY = 5;
  that.INTERVAL = 1000/8;
  that.ASTEROID_MAX = 20;
  that.ASTEROID_MIN = 5;
  that.SHIP_RADIUS = 15;
  that.POWER = 3;
  that.BULLET_SPEED = that.VELOCITY*3
  that.BULLET_SIZE = 2;

  that.asteroids = [];
  that.bullets = [];

  that.createAsteroids = function() {
    for(var i=0; i<10; i++) {
      x_pos = Math.random()*that.X_SIZE;
      y_pos = Math.random()*that.Y_SIZE;
      x_vel = (Math.random()-.5)*that.VELOCITY;
      y_vel = (Math.random()-.5)*that.VELOCITY;
      radius = Math.random()*(that.ASTEROID_MAX-that.ASTEROID_MIN)+that.ASTEROID_MIN;
      that.asteroids.push(new Asteroid(x_pos, y_pos, x_vel, y_vel, radius, that));
    }
  }

  that.createShip = function() {
    var x_pos = that.X_SIZE/2;
    var y_pos = that.Y_SIZE/2;
    var radius = that.SHIP_RADIUS;
    //add direction here
    return new Ship(x_pos, y_pos, radius, that);
  }

  that.drawAsteroids = function () {
    for(var i=0; i<that.asteroids.length; i++) {
      that.asteroids[i].draw(ctx);
    }
  }

  that.drawBullets = function() {
    for(var i=0; i<that.bullets.length; i++) {
      that.bullets[i].draw(ctx);
    }
  }

  that.draw = function(){
    ctx.clearRect(0, 0, that.X_SIZE, that.Y_SIZE);
    that.drawAsteroids();
    that.ship.draw(ctx);
    that.drawBullets();
  }

  that.update = function() {
    $.each(that.asteroids, function(i, asteroid) {
      asteroid.update();
    });
    that.ship.update();
    $.each(that.bullets, function(i, bullet){
      bullet.update();
    });
  }

  that.checkBulletHits = function() {
    console.log("BH's");

    var destroyedAsteroids = [];
    var destroyedBullets = [];
    for(var i=0; i < that.asteroids.length; i++) {
      for(var j=0; j < that.bullets.length; j++) {
          console.log(isHit(that.bullets[j], that.asteroids[i]));
        if(isHit(that.bullets[j], that.asteroids[i])){
          destroyedAsteroids.push(that.asteroids[i]);
          destroyedBullets.push(that.bullets[i]);
        }
      }
    }
    // subtract away destroyed arrays from the main arrays
    that.bullets = that.bullets.filter(function(b){
      return ( destroyedBullets.indexOf(b) == -1 );
    });
    that.asteroids = that.asteroids.filter(function(a){
      return ( destroyedAsteroids.indexOf(a) == -1 );
    });
    //console.log("tired yet?");
  }

  that.gameOver = function(){
    for(var i=0; i < that.asteroids.length; i++) {
      if (isHit(that.asteroids[i], that.ship)) {
        clearInterval(that.interval);
        alert("You lose!!!!");
      }
    }
  }

  that.bindKeys = function(){
    key('up', function(){
      that.ship.power(0, -that.POWER);
    });
    key('down', function(){
      that.ship.power(0, that.POWER);
    });
    key('left', function(){
      that.ship.power(-that.POWER, 0);
    });
    key('right', function(){
      that.ship.power(that.POWER, 0);
    });
    key('space', function(){
      that.bullets.push(new Bullet(that.ship, that));
    });
  }

  that.playGame = function(){

    that.ship = that.createShip();
    that.createAsteroids();
    that.draw();
    that.bindKeys();
    that.interval = setInterval(function(){
      that.update();
      that.checkBulletHits();
      that.draw();
      that.gameOver();
    }, that.INTERVAL);
  }


  // SCRIPT FOR RUNNING SHIT

  that.playGame();


}