var xBricks = 11;
var yBricks = 6;
var brickWidth = 90;
var brickHeight = brickWidth/3;
var brickSpacing = brickHeight*0.666;
var Bricks = [xBricks];

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
}

function draw() {
	paddle.tick();
	ball.tick();
	background(0);

	for(let i = 0; i < xBricks; i++)
		for(let j = 0; j < yBricks; j++){
			if(Bricks[i][j] != null)
				Bricks[i][j].draw();
		}

	paddle.draw();
	ball.draw();
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
	this.y = paddle.y - this.size*1.25;
	this.speed = 10;
	this.angle = -HALF_PI;
	this.isDocked = true;

	this.draw = function() {
		noStroke();
		fill(255);
		rect(this.x-this.size/2, this.y-this.size/2, this.size, this.size);
	}

	this.collide = function(paddle){
		if(this.x + this.size/2 >= paddle.x - paddle.width/2 && this.x - this.size/2 <= paddle.x + paddle.width/2){
			if(this.y + this.size/2 >= paddle.y - paddle.height/2 && this.y - this.size/2 <= paddle.y + paddle.height/2){
				return true;
			}
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
			if(this.collide(paddle))
				this.angle = ((this.x - paddle.x)/paddle.width-1)*HALF_PI;

			for(let i = 0; i < xBricks; i++)
				for(let j = 0; j < yBricks; j++)
					if(Bricks[i][j] != null && this.collide(Bricks[i][j])){
						this.angle = -this.angle;
						Bricks[i][j] = null;
					}

			if(this.y >= height - this.size/2){
				this.isDocked = true;
				this.angle = -HALF_PI;
				this.x = paddle.x;
				this.y = paddle.y - this.size - 1;
			}
		}
	}
}

function keyPressed() {
	if(keyCode == 32 && ball.isDocked)
		ball.isDocked = false;
	if(keyCode == ESCAPE)
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