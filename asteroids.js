
// Asteroid
var Asteroid = function(x_pos, y_pos, x_vel, y_vel, game) {

  var that = this;
  that.game = game;

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
    ctx.arc(that.pos.x, that.pos.y, 13, 0, 2 * Math.PI, false);
    ctx.fillStyle = "#666";
    ctx.fill();
    ctx.stroke();
  }

  that.update = function() {
    that.pos.x += that.vel.x;
    that.pos.y += that.vel.y;

    if (this.pos.x > game.X_SIZE ||this.pos.y > game.Y_SIZE ||
        this.pos.x < 0 || this.pos.y < 0) {
      that.game.asteroids.splice(that.game.asteroids.indexOf(that), 1);
      // console.log(that.game.asteroids);
    }
  }

}

var Game = function(ctx){

  var that = this;

  that.X_SIZE = 400;
  that.Y_SIZE = 400;
  that.VELOCITY = 5;
  that.INTERVAL = 1000/8;

  that.asteroids = [];
  that.interval;
  that.ghettoCounter = 0;
  // console.log(that);

  that.createAsteroids = function() {
    for(var i=0; i<10; i++) {
      x_pos = Math.random()*that.X_SIZE;
      y_pos = Math.random()*that.Y_SIZE;
      x_vel = (Math.random()-.5)*that.VELOCITY;
      y_vel = (Math.random()-.5)*that.VELOCITY;
      that.asteroids.push(new Asteroid(x_pos, y_pos, x_vel, y_vel, that));
      console.log("hi!");
    }
  }

  that.drawAsteroids = function () {
    for(var i=0; i<10; i++) {
      console.log(i);
      console.log(that.asteroids);
      console.log(that.asteroids[i]);
      that.asteroids[i].draw(ctx);
    }
  }

  that.draw = function(){
    ctx.clearRect(0, 0, that.X_SIZE, that.Y_SIZE);
    that.drawAsteroids();
  }

  that.update = function() {
    $.each(that.asteroids, function(i, asteroid) {
      // console.log(i);
      asteroid.update();
    })
  }

  that.gameOver = function(){
    // is spaceship alive???
    that.ghettoCounter++;

    if(that.ghettoCounter > 50){
      clearInterval(that.interval);
      console.log("AAAAAH");
    }
  }

  that.playGame = function(){
    that.interval = setInterval(function(){
      console.log("interval..");
      that.update();
      that.draw();
      that.gameOver();
    }, that.INTERVAL);
  }


  // SCRIPT FOR RUNNING SHIT
  that.createAsteroids();
  that.draw();
  that.playGame();


}