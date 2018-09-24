//Use a separate script to load an obj file as a string in the file global var!

var vertices = [];
var fvertices = [];
var faces = [];
var renderNormals = false;
var normalsLength = 0.2;
var matrix;
var rotY = 0;
var turnRate = 0.5;
var lightTurnRate = 0;
var ldir;
var doShading = true;
var zBuffer;

function preload(){
	parse_file();
}

function setup(){
	createCanvas(windowWidth, windowHeight);
	noStroke();
	strokeWeight(0.005);
	noSmooth();
	angleMode(DEGREES);
	updateMatrix();
	ldir = new Vertex(0.577,0.577,0.577);
	zBuffer = createImage(windowWidth, windowHeight);
	zBuffer.loadPixels();
}

function draw(){
  if(turnRate != 0){
  	rotateScene(0,turnRate,0);
  	rotateLight();
  	background(0);
  	rotate(180)
  	translate(-width/2, -height+50);
  	scale(200);
  	render();
  }
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
	zBuffer = createImage(windowWidth, windowHeight);
	zBuffer.loadPixels();
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
  faces.stableSort((a,b) => (avgZ(a) > avgZ(b)));
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
/*
function drawFace(n){
	let f = faces[n];
	triangle(vertices[f.v1].x, vertices[f.v1].y, vertices[f.v2].x, vertices[f.v2].y, vertices[f.v3].x, vertices[f.v3].y);
}*/

//sf = size factor
function drawVect(v, origin, sf){
	line(origin.x, origin.y, origin.x+v.x*sf, origin.y+v.y*sf);
}

function updateMatrix(){
	matrix = [	[cos(rotY), 0, -sin(rotY)],
				[0,1,0],
				[sin(rotY), 0, cos(rotY)]];
	for(let i = 0; i < fvertices.length; i++)
		vertices[i] = mult(matrix, fvertices[i]);
	for(f of faces){
		f.normal = normal(f);
		f.center = center(f);
	}
}

function rotateScene(x,y,z){
	rotY += y;
	updateMatrix();
}

function rotateLight(){
	ldir = new Vertex(ldir.x*cos(lightTurnRate)-ldir.z*sin(lightTurnRate),ldir.y,ldir.x*sin(lightTurnRate)+ldir.z*cos(lightTurnRate))
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

Array.prototype.stableSort = function(cmp) {
  let stabilizedThis = this.map((el, index) => [el, index]);
  let stableCmp = (a, b) => {
    let order = cmp(a[0], b[0]);
    if (order != 0) return order;
    return a[1] - b[1];
  }
  stabilizedThis.sort(stableCmp);
  for (let i=0; i<this.length; i++) {
    this[i] = stabilizedThis[i][0];
  }
  return this;
}