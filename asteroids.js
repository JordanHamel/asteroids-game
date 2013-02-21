// Asteroid
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

var wrapCoords = function(coord, board_dim){
  if(coord % board_dim > 0){
    return coord % board_dim;
  }else{
    return board_dim + coord % board_dim;
  }
}

var Ship = function(x_pos, y_pos, radius) {

  var that = this;

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

  that.isHit = function() {
    for(var j = 0; j < 10; j++) {
      var distance = Math.sqrt(Math.pow((game.asteroids[j].pos.x - that.pos.x), 2) + Math.pow((game.asteroids[j].pos.y - that.pos.y), 2) )
      if (distance < game.asteroids[j].radius + that.radius ) {
        return true;
      }
    }
    return false;
  }
}

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

  that.asteroids = [];

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
    return new Ship(x_pos, y_pos, radius);
  }

  that.drawAsteroids = function () {
    for(var i=0; i<that.asteroids.length; i++) {
      that.asteroids[i].draw(ctx);
    }
  }

  that.draw = function(){
    ctx.clearRect(0, 0, that.X_SIZE, that.Y_SIZE);
    that.drawAsteroids();
    that.ship.draw(ctx);
  }

  that.update = function() {
    $.each(that.asteroids, function(i, asteroid) {
      asteroid.update();
    });
    that.ship.update();
  }

  that.gameOver = function(){
    if (that.ship.isHit()) {
      clearInterval(that.interval);
      alert("You lose!!!!");
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
  }

  that.playGame = function(){

    that.ship = that.createShip();
    that.createAsteroids();
    that.draw();
    that.bindKeys();
    that.interval = setInterval(function(){
      that.update();
      that.draw();
      that.gameOver();
    }, that.INTERVAL);
  }


  //script

  that.playGame();


}
