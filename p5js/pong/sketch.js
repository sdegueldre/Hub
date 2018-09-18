var P1;
var P2;
var ball;
var menuActive;
var resumeButton;
var playVsCPUbutton;

function setup() {
	createCanvas(1280,720);
	noStroke();
	fill(0);
	rect(0,0,1280,720);
	P1 = new Paddle(50, height/2, 25, 200, 90, 83); //z = 90, s = 83
	P2 = new Paddle(width-50, height/2, 25, 200, UP_ARROW, DOWN_ARROW);
	ball = new Ball(width/2, 12, 25, 255, 0, 0);
	menuActive = false;
	resumeButton = new Button(width/2, height/2, 300, 75, "Resume");
	playVsCPUbutton = new Button(width/2, height/2 + 100, 300, 75, "CPU OFF");
}

function draw() {
	if(!menuActive){
		tickGame();
	}

	render();
}

function tickGame() {
	P1.tick();
	P2.tick();
	ball.tick();
	if(ball.x < 0 || ball.x > width){
		P1 = new Paddle(50, height/2, 25, 200, 90, 83); //z = 90, s = 83
		P2 = new Paddle(width-50, height/2, 25, 200, UP_ARROW, DOWN_ARROW);
		ball = new Ball(width/2, height/2, 25, 255, 0, 0);
	}

}

function drawGame() {
	background(0);
  	P1.draw();
  	P2.draw();
  	ball.drawHistory();
  	ball.draw();
}

function drawMenu() {
	fill(127,127,127,100); //RGBA
	rect(0,0,1280,720);
	fill(255);
	textSize(75);
	textAlign(CENTER,CENTER);
	stroke(255);
	strokeWeight(3);
	text("Menu", width/2, 50);
	resumeButton.draw();
	playVsCPUbutton.draw();

}

function render() {
	drawGame();
	if(menuActive){
		rectMode(CORNER);
		drawMenu();
	} else if(ball.speed == 0){
		fill(255);
		textSize(25);
		textAlign(CENTER,CENTER);
		stroke(255);
		strokeWeight(1);
		text("Press space to start", width/2, 50);
	}
}

function Paddle(x,y,w,h, keyUp, keyDown){
	this.x = x;
	this.y = y;
	this.height = h;
	this.width = w;
	this.speed = 15;
	this.keyUp = keyUp;
	this.keyDown = keyDown;
	this.draw = function() {
		noStroke();
		fill(255,255,255);
		rectMode(CENTER)
		rect(this.x,this.y,this.width,this.height);
	}

	this.tick = function() {
		if(playVsCPUbutton.text == "CPU OFF" || this == P2){
			if(keyIsDown(keyDown))
				this.y += this.speed
			else if(keyIsDown(keyUp))
				this.y -= this.speed
		} else {
			if(this.y - ball.y > 50)
				this.y -= this.speed;
			else if(this.y - ball.y < -50)
				this.y += this.speed;
		}
		this.y = constrain(this.y, this.height/2, height-this.height/2);
	}
}

function Ball(x,y,size, r, g, b) {
	this.x = x;
	this.y = y;
	this.size = size;
	this.speed = 0;
	this.angle = 0;
	this.r = r;
	this.g = g;
	this.b = b;
	this.history = [];

	this.draw = function() {
		noStroke();
		fill(this.r,this.g,this.b);
		ellipseMode(CENTER);
		ellipse(this.x,this.y,this.size,this.size);
	}

	this.drawHistory = function() {
		for(let i = 0; i < this.history.length; i++){
			noStroke();
			fill(this.history[i].r,this.history[i].g,this.history[i].b, i/this.history.length*100*0.7);
			ellipseMode(CENTER);
			ellipse(this.history[i].x,this.history[i].y,this.size*((i+1)/this.history.length/2+0.5),this.size*((i+1)/this.history.length/2+0.5));
		}
	}

	this.collide = function(paddle){
		if(abs(this.x - paddle.x) <= (this.size + paddle.width)/2){
			if(this.y + this.size/2 >= paddle.y - paddle.height/2 && this.y - this.size/2 <= paddle.y + paddle.height/2){
				return true;
			}
		}
		return false;
	}

	this.tick = function() {
		let steps = ceil(this.speed/this.size*5);
		for(let i = 0; i < steps; i++){
			this.history.push(new Ball(this.x, this.y, this.size, this.r, this.g, this.b));
			this.cycleColor();
			while(this.history.length > 10*steps+10)
				this.history.splice(0,1);
			this.x += this.speed * cos(this.angle) / steps;
			this.y += this.speed * sin(this.angle) / steps;
			if(this.collide(P1)){
				this.angle = (this.y - P1.y)/P1.height*HALF_PI;
				this.speed++;
			} else if(this.collide(P2)){
				this.angle = PI-(this.y - P2.y)/P2.height*HALF_PI;
				this.speed++;
			}
			if(this.y - this.size/2 <= 0 || this.y + this.size/2 >= height){
				this.angle = -this.angle;
			}
		}
		if(this.speed == 0 && keyIsDown(32)) //32 = space bar
			this.speed = 10;
		
	}

	this.cycleColor = function() {
		let step = 7;
		if(this.r >= 255 && this.b <= 0 && this.g < 255)
			this.g+=step;
		if(this.g >= 255 && this.r > 0)
			this.r-=step;
		if(this.g >= 255 && this.r <= 0 && this.b < 255)
			this.b+=step;
		if(this.b >= 255 && this.g > 0)
			this.g-=step;
		if(this.b >= 255 && this.g <= 0 && this.r < 255)
			this.r+=step;
		if(this.r >= 255 && this.b > 0)
			this.b-=step;
	}
}

function Button(x,y,w,h,t){
	this.x = x;
	this.y = y;
	this.width = w;
	this.height = h;
	this.text = t;

	this.draw = function(){
		stroke(255,255,255);
		if(this.hover()){
			fill(75,75,75);
		} else {
			fill(0,0,0);
		}
		strokeWeight(3);
		rect(this.x-this.width/2,this.y-this.height/2,this.width,this.height);
		textAlign(CENTER, CENTER);
		textSize(this.height*0.666);
		fill(255,255,255);
		strokeWeight(2);
		text(this.text, this.x, this.y+0.05*this.height);
	}

	this.hover = function() {
		if(inRect(mouseX, mouseY, this.x, this.y, this.width, this.height))
			return true;
		return false;
	}
}

function inRect(x,y,xRect, yRect, w,h) {
	xRect -= w/2;
	yRect -= h/2;
	if(x >= xRect && x <= xRect+w && y >= yRect && y <= yRect+h){
		return true;
	}
	return false;
}

function keyPressed() {
	if(keyCode == ESCAPE)
		menuActive = menuActive ? false : true;
	else if(keyCode == 107  && ball.speed != 0)
		ball.speed++;
	else if(keyCode == 109 && ball.speed != 0){
		ball.speed--;
		ball.speed = ball.speed < 1 ? 1 : ball.speed;
	}
}

function mousePressed(){
	if(mouseButton == LEFT){
		if(resumeButton.hover())
			menuActive = false;
		if(playVsCPUbutton.hover()){
			if(playVsCPUbutton.text == "CPU OFF")
				playVsCPUbutton.text = "CPU ON";
			else
				playVsCPUbutton.text = "CPU OFF";
		}
	}
	return false;
}