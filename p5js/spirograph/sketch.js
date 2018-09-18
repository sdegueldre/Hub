var arms;
var iter = 300;
var nbArms = 3;
var angle = 0.5;
var len = 500;
var nextCol;
var paused = false;

function setup() {
	arms = [];
	createCanvas(windowWidth, windowHeight);
	background(255);
	angleMode(DEGREES);
	//fill(255,25)
	noFill();
	stroke(0);
	strokeWeight(1);
	for(let i = 0; i < nbArms; i++){
		arms.push(new Arm(len/2**(i+1), random(-angle, angle)));
	}
	colorMode(HSL);
	nextCol = ColorCycler(0.1);
	//blendMode(ADD);
}

function draw() {
	if(paused)
		return;
	for(let i = 0; i < iter; i++){
		push();
		translate(width/2, height/2);
		for(arm of arms){
			arm.update();
			translate(arm.length, 0);
		}
		//stroke(nextCol.next().value, 100, 50);
		render();
		pop();
	}
}

function render(){
	point(0,0);
	//rect(0,0,random(10,50), random(3,5));
}

function Arm(length, speed){
	this.length = length;
	this.speed = speed;
	this.angle = 0;
}

Arm.prototype.update = function(){
	this.angle += this.speed;
	rotate(this.angle);
}

Arm.prototype.render = function(){
	line(0,0,this.length,0);
}

function mousePressed(){
	paused = !paused;
}

function* ColorCycler(step){
	this.col = 0;
	this.step = step
	while(true){
		this.col += this.step;
		this.col %= 360;
		yield(this.col);
	}
}

function keyPressed(){
	//32 is space bar
	if(keyCode == 32){
		setup();
		paused = false;
	}
}