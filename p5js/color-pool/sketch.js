let splashes = [];
let spawnRate = 5;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	fill(255);
	ellipseMode(CENTER);
	textSize(15);
}

function draw() {
	blendMode(BLEND);
	background(0);
	blendMode(ADD);
	for(splash of splashes){
		splash.draw();
		splash.update();
		if(splash.age >= 150)
			splashes.splice(splashes.indexOf(splash), 1);
	}
	if(random(0,100) <= spawnRate){
		splashes.push(new Splash(random(0,width), random(0,height)));
	}
	Math.random() > .5 && splashes.push(new Splash(width / 2, height / 2));
	noStroke();
	fill(255);
	blendMode(BLEND);
	text("Spawn rate: " + spawnRate +"%", 10, 50);
}

function mousePressed(){
	splashes.push(new Splash(mouseX, mouseY));
}

function windowResized(){
	setup();
}

function keyPressed(){
	switch(keyCode){
		case UP_ARROW:
			spawnRate++;
			spawnRate = spawnRate > 100 ? 100 : spawnRate;
			break;
		case DOWN_ARROW:
			spawnRate--;
			spawnRate = spawnRate < 0 ? 0 : spawnRate;
			break;
	}
}

var lifeTime = 150;
var maxAge = 0;
var thickness = 25;

function Splash(x,y){
	this.x = x;
	this.y = y;
	this.age = 0;
	this.size = 0;
	this.radiusChange = random(1,15);
	this.hue = random(360);
	this.alpha = 100;
}

Splash.prototype.draw = function(){
	push();
	colorMode(HSB, 360, 100, 100, 100);
	noFill();
	strokeWeight(thickness * random(.8, 1.2))
	stroke(this.hue, 100, 50, this.alpha);
	ellipse(this.x, this.y, this.size, this.size);
	pop();
}

Splash.prototype.update = function(){
	this.age++;
	this.size += this.radiusChange;
	this.alpha -= 100/lifeTime;
	this.hue = (this.hue+5)%360;
}