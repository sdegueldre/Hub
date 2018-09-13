let splashes = [];
let spawnRate = 0.05;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	noStroke();
	imageMode(CENTER);
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
	if(random(0,1) <= spawnRate){
		splashes.push(new Splash(random(0,width), random(0,height)));
	}
}

function mousePressed(){
	splashes.push(new Splash(mouseX, mouseY));
}

function windowResized(){
	setup();
}