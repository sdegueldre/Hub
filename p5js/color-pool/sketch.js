let splashes = [];
let spawnRate = 5;

function setup() {
	createCanvas(windowWidth, windowHeight);
	background(0);
	fill(255);
	noStroke();
	imageMode(CENTER);
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
			break;
		case DOWN_ARROW:
			spawnRate--;
			break;
	}
}