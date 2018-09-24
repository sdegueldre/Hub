function Vertex(x,y,z){
	this.x = parseFloat(x);
	this.y = parseFloat(y);
	this.z = parseFloat(z);
}

function Face(v1,v2,v3){
	this.v1 = parseInt(v1);
	this.v2 = parseInt(v2);
	this.v3 = parseInt(v3);
}

function normal(f){
	u = sub(vertices[f.v1], vertices[f.v2]);
	v = sub(vertices[f.v2], vertices[f.v3]);
	return normalize(cross(u,v));
}

function dot(u, v){
	return u.x*v.x+u.y*v.y+u.z*v.z;
}

function sub(a, b){
	return new Vertex(a.x-b.x, a.y-b.y, a.z-b.z);
}

function cross(u, v){
	return new Vertex(u.y*v.z-u.z*v.y, u.z*v.x-u.x*v.z, u.x*v.y-u.y*v.x);
}

function center(f){
	return new Vertex(	(vertices[f.v1].x + vertices[f.v2].x + vertices[f.v3].x)/3,
						(vertices[f.v1].y + vertices[f.v2].y + vertices[f.v3].y)/3,
						(vertices[f.v1].z + vertices[f.v2].z + vertices[f.v3].z)/3)
}

function normalize(v){
	let norm = length(v);
	return new Vertex(v.x/norm, v.y/norm, v.z/norm);
}

function length(v){
	return sqrt(v.x*v.x+v.y*v.y+v.z*v.z);
}

function mult(m, v){
	return new Vertex(	m[0][0]*v.x+m[0][1]*v.y+m[0][2]*v.z,
						m[1][0]*v.x+m[1][1]*v.y+m[1][2]*v.z,
						m[2][0]*v.x+m[2][1]*v.y+m[2][2]*v.z)
}

function drawTriangle(face, image){
	
}

function avgZ(f){
	return (vertices[f.v1].z + vertices[f.v2].z + vertices[f.v3].z)/3;
}