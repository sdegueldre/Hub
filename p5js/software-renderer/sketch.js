//Use a separate script to load an obj file as a string in the file global var!

var vertices = [];
var fvertices = [];
var faces = [];
var matrix;
var rotY = 0;
var turnRate = 0.5;
var ldir;

function preload(){
	parse_file();
}

function setup(){
	createCanvas(windowWidth, windowHeight);
	strokeWeight(0.006);
  strokeJoin(BEVEL);
	angleMode(DEGREES);
	ldir = new Vertex(0.577,0.577,0.577);
}

function draw(){
  if(turnRate != 0){
  	rotateScene(0,turnRate,0);
  	background(0);
  	rotate(180)
  	translate(-width/2, -0.9*height);
  	scale(200);
  	render();
  }
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
}

function parse_file(){
	//pushing an arbitrary vertex at index 0 since obj faces index vertices from 1
	fvertices.push(new Vertex(0,0,0));

	file = file.split("\n");
	for(e of file){
		e = e.split(" ");
		if(e[0] == 'v')
			fvertices.push(new Vertex(e[1], e[2], e[3]));
		if(e[0] == 'f')
			faces.push(new Face(e[1], e[2], e[3]));
	}
}

function render(){
  faces.sort((a,b) => (avgZ(a) - avgZ(b)));
	for(f of faces){
    // z < 0 => faces away from camera (backface culling)
		if(f.normal.z > 0){
			// gamma correction
			let col = pow(map(dot(f.normal, ldir),-1,1,0,1), 2.2)*255;
			fill(col);
			stroke(col);
			triangle(vertices[f.v1].x, vertices[f.v1].y, vertices[f.v2].x, vertices[f.v2].y, vertices[f.v3].x, vertices[f.v3].y);
		}
	}
}

function rotateScene(x,y,z){
	rotY += y;
	matrix = [ [cos(rotY), 0, -sin(rotY)],
        [0,1,0],
        [sin(rotY), 0, cos(rotY)]];
  for(let i = 0; i < fvertices.length; i++)
    vertices[i] = mult(matrix, fvertices[i]);
  for(f of faces){
    f.normal = normal(f);
  }
}

function keyPressed(){
	switch(keyCode){
		case LEFT_ARROW:
		turnRate -= 0.5;
		break;
		case RIGHT_ARROW:
		turnRate += 0.5;
		break;
	}

}