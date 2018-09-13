var historyLength = 150;
var maxAge = 0;
var thickness = 3;

function Splash(x,y){
	this.x = x;
	this.y = y;
	this.age = 0;
	this.size = 0;
	this.radiusChange = random(1,5);
	this.color = new Color(true);
	this.pg = createGraphics(this.radiusChange*historyLength, this.radiusChange*historyLength);
	this.pg.ellipseMode(CENTER);
	this.pg.noStroke();
}

Splash.prototype.draw = function(){
	this.pg.fill(this.color.r, this.color.g, this.color.b, this.color.alpha);
	this.pg.ellipse(this.pg.width/2, this.pg.height/2, this.size, this.size);
	this.pg.fill(0);
	this.pg.ellipse(this.pg.width/2, this.pg.height/2, this.size-thickness, this.size-thickness);
	image(this.pg, this.x, this.y);
}

Splash.prototype.update = function(){
	this.age++;
	this.size += this.radiusChange;
	this.color.alpha-=255/historyLength;
	this.color.cycle();
}

function Color(log){
	picker = floor(random(0,6));
	this.r = [0,1,2].indexOf(picker) > -1 ? 255 : 0;
	this.g = [2,3,4].indexOf(picker) > -1 ? 255 : 0;
	this.b = [4,5,0].indexOf(picker) > -1 ? 255 : 0;
	this.alpha = 255;
	this.cycleRate = random(1,50);
}

function Circle(color){
	this.color = new Color(false);
	this.color.r = color.r;
	this.color.g = color.g;
	this.color.b = color.b;
	this.size = 1;
}

Color.prototype.cycle = function(){
		let step = this.cycleRate;
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