var xBricks = 11;
var yBricks = 6;
var brickWidth = 90;
var brickHeight = brickWidth/3;
var brickSpacing = brickHeight*0.666;
var Bricks = [xBricks];
var ps = []; //particle system
let lives;
let score;
let combo;
let gameover;

function setup() {
	createCanvas(1280,720);
	background(0);
	paddle = new Paddle(150, 15);
	ball = new Ball(15);
	for(let i = 0; i < xBricks; i++){
		Bricks[i] = [yBricks];
		for(let j = 0; j < yBricks; j++){
			Bricks[i][j] = new Brick(width/2 + (i-(xBricks-1)/2)*(brickWidth+brickSpacing), brickSpacing + brickHeight/2 + (j*(brickHeight+brickSpacing)), brickWidth, brickHeight);
		}
	}
  lives = 1;
  score = 0;
  combo = 0;
  gameover = false;
}

function draw() {
  if(!gameover){
    paddle.tick();
  	ball.tick();
  }
	background(0);

	for(let i = 0; i < xBricks; i++)
		for(let j = 0; j < yBricks; j++){
			if(Bricks[i][j] != null)
				Bricks[i][j].draw();
		}

	paddle.draw();
	ball.draw();
	for(let i = 0; i < ps.length; i++){
		ps[i].draw();
		ps[i].tick();
		if(ps[i].life <= 0)
			ps.splice(i, 1);
	}

  drawLives();
  drawScore();
  if(gameover){
    fill(127, 127);
    rect(0,0,width, height);
    drawGameOver();
  }
}

function drawGameOver(){
  push();
  fill(0);
	stroke(255);
	strokeWeight(4);
	textSize(100);
	textAlign(CENTER, BASELINE);
	text('GAME OVER', width/2, height/2 - 20);
  textSize(50);
	textAlign(CENTER, TOP);
	text('press space to play again', width/2, height/2 + 20);
	textAlign(CENTER, TOP);
	text('Final score: '+score, width/2, 3*height/4);
	pop();
}

function drawLives(){
  push();
  fill(0);
	stroke(255);
	strokeWeight(4);
	textSize(50);
	textAlign(RIGHT, BASELINE);
	text(lives, width-3.5, height-7);
	pop();
}

function drawScore(){
  push();
  fill(0);
	stroke(255);
	strokeWeight(4);
	textSize(50);
	textAlign(LEFT, BASELINE);
	text(score, 3.5, height-7);
	pop();
}

function Paddle(w,h) {
	this.width = w;
	this.height = h;
	this.x = width/2;
	this.y = height-25;
	this.speed = 15;

	this.draw = function() {
		noStroke();
		fill(255);
		rect(this.x-this.width/2, this.y-this.height/2, this.width, this.height);
	}

	this.tick = function() {
		if(keyIsDown(RIGHT_ARROW))
			this.x += this.speed;
		if(keyIsDown(LEFT_ARROW))
			this.x -= this.speed;
		this.x = constrain(this.x, this.width/2 + 1, width-this.width/2 - 1);
	}
}

function Ball(size) {
	this.size = size;
	this.x = paddle.x;
	this.y = paddle.y - this.size - 5;
	this.speed = 10;
	this.angle = -HALF_PI;
	this.isDocked = true;

	this.draw = function() {
    let sz = size + 5;
		noStroke();
		fill(255);
    ellipseMode(CORNER);
		ellipse(this.x-sz/2, this.y-sz/2, sz, sz);
	}

	this.collide = function(paddle){
		if((this.x + this.size/2) >= (paddle.x - paddle.width/2) &&
       (this.x - this.size/2) <= (paddle.x + paddle.width/2) &&
       (this.y + this.size/2) >= (paddle.y - paddle.height/2) &&
       (this.y - this.size/2) <= (paddle.y + paddle.height/2)){
			return true;
		}
		return false;
	}

	this.tick = function() {
		if(this.isDocked)
			this.x = paddle.x;
		else {
			this.x += this.speed*cos(this.angle);
			this.y += this.speed*sin(this.angle);
			if(this.x <= this.size/2 || this.x > width - this.size/2)
				this.angle = -this.angle + PI;
			if(this.y <= this.size/2)
				this.angle = -this.angle;
			if(this.collide(paddle)){
        this.angle = ((this.x - paddle.x)/paddle.width-1)*HALF_PI;
        combo = 0;
      }

			for(let i = 0; i < xBricks; i++)
				for(let j = 0; j < yBricks; j++)
					if(Bricks[i][j] != null && this.collide(Bricks[i][j])){
						let counter = random(3,15);
						for(let i = 0; i < counter; i++){
							let xv = 0.5*random(-this.speed, this.speed);
							let yv = 0.5*random(-this.speed, this.speed);
							ps.push(new Particle(this.x, this.y, xv, yv));
						}
						this.angle = -this.angle;
						Bricks[i][j] = null;
            combo++;
            score += combo;
					}

			if(this.y >= height - this.size/2){
        lives--;
        if(lives <= 0){
          gameover = true;
        }
				this.isDocked = true;
        if(!gameover){
          this.angle = -HALF_PI;
          this.x = paddle.x;
  				this.y = paddle.y - this.size - 1;
        }
        combo = 0;
			}
		}
	}
}

function keyPressed() {
	if(keyCode == 32 && ball.isDocked)
		ball.isDocked = false;
	if(keyCode == ESCAPE || (keyCode == 32 && gameover))
    setup();
}

function Brick(x,y,w,h) {
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;

	this.draw = function() {
		noStroke();
		fill(255);
		rect(this.x-this.width/2, this.y-this.height/2, this.width, this.height);
	}
}

function Particle(x,y,xv,yv) {
	({this} = {x: x, xv: xv, y: y, yv: yv});
	this.gravity = 0.5;
	this.r = 3;
	this.life = 50;


	this.tick = function() {
		this.life--;
		this.x += this.xv;
		this.y += this.yv;
		this.yv += this.gravity;
	}

	this.draw = function(){
		ellipseMode(CENTER);
		fill(255,255,255, this.life/50*255);
		ellipse(this.x, this.y, this.r*2, this.r*2);
	}
}
