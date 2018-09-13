var pitch = -5;
var yaw = -30;
var fps = "";

var zoom = 100;
speed = 0.25;

var vertices = [];
var edges = [];
var transformed = [];
var rasterized = [];

function setup(){
	createCanvas(windowWidth, windowHeight);
	background(0);
	angleMode(DEGREES);
	stroke(255);

	strokeWeight(10);
	noFill();
	textSize(20);
	textStyle()
	textAlign(LEFT, TOP);

	vertices.push(new Point(0,1,1.5))
	vertices.push(new Point(1.5,2.5,1.5))
	vertices.push(new Point(2.5,2.25,1.5))
	vertices.push(new Point(2.5,0.5,1.5))
	vertices.push(new Point(0,-2,1.5))
	vertices.push(new Point(-2.5,0.5,1.5))
	vertices.push(new Point(-2.5,2.25,1.5))
	vertices.push(new Point(-1.5,2.5,1.5))

	vertices.push(new Point(0,3,0))
	vertices.push(new Point(1,3.75,0))
	vertices.push(new Point(3,3.5,0))
	vertices.push(new Point(4,1.75,0))
	vertices.push(new Point(4,1,0))
	vertices.push(new Point(3,-1,0))
	vertices.push(new Point(0,-4,0))
	vertices.push(new Point(-3,-1,0))
	vertices.push(new Point(-4,1,0))
	vertices.push(new Point(-4,1.75,0))
	vertices.push(new Point(-3,3.5,0))
	vertices.push(new Point(-1,3.75,0))

	vertices.push(new Point(0,1,-1.5))
	vertices.push(new Point(1.5,2.5,-1.5))
	vertices.push(new Point(2.5,2.25,-1.5))
	vertices.push(new Point(2.5,0.5,-1.5))
	vertices.push(new Point(0,-2,-1.5))
	vertices.push(new Point(-2.5,0.5,-1.5))
	vertices.push(new Point(-2.5,2.25,-1.5))
	vertices.push(new Point(-1.5,2.5,-1.5))

	edges.push(new Pair(0,1))
	edges.push(new Pair(1,2))
	edges.push(new Pair(2,3))
	edges.push(new Pair(3,4))
	edges.push(new Pair(4,5))
	edges.push(new Pair(5,6))
	edges.push(new Pair(6,7))
	edges.push(new Pair(7,0))

	edges.push(new Pair(8,9))
	edges.push(new Pair(9,10))
	edges.push(new Pair(10,11))
	edges.push(new Pair(11,12))
	edges.push(new Pair(12,13))
	edges.push(new Pair(13,14))
	edges.push(new Pair(14,15))
	edges.push(new Pair(15,16))
	edges.push(new Pair(16,17))
	edges.push(new Pair(17,18))
	edges.push(new Pair(18,19))
	edges.push(new Pair(19,8))

	edges.push(new Pair(20,21))
	edges.push(new Pair(21,22))
	edges.push(new Pair(22,23))
	edges.push(new Pair(23,24))
	edges.push(new Pair(24,25))
	edges.push(new Pair(25,26))
	edges.push(new Pair(26,27))
	edges.push(new Pair(27,20))

	edges.push(new Pair(0,8))
	edges.push(new Pair(8,20))

	edges.push(new Pair(1,9))
	edges.push(new Pair(9,21))

	edges.push(new Pair(2,10))
	edges.push(new Pair(10,22))

	edges.push(new Pair(2,11))
	edges.push(new Pair(11,22))

	edges.push(new Pair(3,12))
	edges.push(new Pair(12,23))

	edges.push(new Pair(3,13))
	edges.push(new Pair(13,23))

	edges.push(new Pair(4,14))
	edges.push(new Pair(14,24))

	edges.push(new Pair(5,15))
	edges.push(new Pair(15,25))

	edges.push(new Pair(5,16))
	edges.push(new Pair(16,25))

	edges.push(new Pair(6,17))
	edges.push(new Pair(17,26))

	edges.push(new Pair(6,18))
	edges.push(new Pair(18,26))

	edges.push(new Pair(7,19))
	edges.push(new Pair(19,27))

	for(v of vertices){
		t = v.y;
		v.y = v.z;
		v.z = -t;
	}

	/*
	for(v of vertices){
		v.x /= 2;
		v.y /= 2;
		v.z /= 2;
	}*/

	setInterval(function(){fps = frameRate().toFixed(1)}, 100)
}

var maxDepth;
var minDepth;

function draw(){
	background(0, 255);
	blendMode(LIGHTEST);
	//blendMode(ADD);	
	translate(width/2, height/2);
	transform();
	minDepth = maxDepth = 0;
	for(e of edges){
		e.depth = (depth(transformed[e.a])+depth(transformed[e.b]))/2;
		if(e.depth > maxDepth)
			maxDepth = e.depth;
		if(e.depth < minDepth)
			minDepth = e.depth;
	}
	for(e of edges){
		let brightness = map(e.depth, minDepth, maxDepth, 255, 20);
		stroke(brightness, Math.pow(brightness,0.7), Math.pow(brightness,0.4));
		line(rasterized[e.a].x, rasterized[e.a].y, rasterized[e.b].x, rasterized[e.b].y);
	}
	yaw += speed;

	blendMode(BLEND);
	fill(255);
	noStroke();
	text("FPS: " + fps, -width/2 + 10, -height/2 + 10);

}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
	redraw();
}

function Point(x,y,z){
	this.x = x;
	this.y = y;
	this.z = z;
}

function Pair(a,b){
	this.a = a;
	this.b = b;
}

function transform(){
	transformed = [];
	rasterized = [];
	for(v of vertices)
		transformed.push(new Point((v.x*cos(yaw)-v.y*sin(yaw))*zoom, (v.x*sin(yaw)+v.y*cos(yaw))*zoom, v.z*zoom));
	for(t of transformed)
		rasterized.push(new Point(t.x, t.z*cos(pitch)+sin(pitch)*t.y, 0));
}

function keyPressed(){
	switch(keyCode){
		case(UP_ARROW):
		pitch += 5;
		break;
		case(DOWN_ARROW):
		pitch -= 5;
		break;
		case(LEFT_ARROW):
		speed -= 0.25;
		break;
		case(RIGHT_ARROW):
		speed += 0.25;
		break;
	}
}

function depth(p){
	return cos(pitch)*p.y-sin(pitch)*p.z;
}