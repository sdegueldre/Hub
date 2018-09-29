let boardWidth = 10;
let boardHeight = 20;

let tileGrid;
let gameState = {};
let backgroundColor = "dimgray";

function setup(){
	createCanvas(windowWidth, windowHeight);
	tileGrid = new TileGrid(boardWidth, boardHeight);
	gameState.active = new Tetromino();
	gameState.next = new Tetromino();
	greyBlock = loadImage("block.png");
	gameState.paused = false;
	gameState.score = 0;
}

function draw(){
	if(!gameState.paused)
		update();

	let tileSize = Math.floor(windowHeight*0.95/boardHeight);
	background(255);

	push();
	rectMode(CENTER);
	noStroke();
	fill(0);
	translate(width/2, height/2);
	rect(0, 0, boardWidth*tileSize, boardHeight*tileSize)

	translate(-boardWidth/2*tileSize, -boardHeight/2*tileSize);
	rectMode(CORNER);
	tileGrid.display(0, 0, tileSize);

	gameState.active.display(0,0,tileSize);
	gameState.next.display(8,2,tileSize);
	translate(boardWidth*tileSize, tileSize/2);
	textSize(tileSize);
	fill(0);
	textFont("monospace");
	textAlign(LEFT, CENTER);
	text("Score: " + gameState.score, 0, 0);
	pop();

	if(gameState.paused)
		drawMenu(tileSize);
}

function drawMenu(scale){
	background(0,50);
	fill(255);
	stroke(0)
	strokeWeight(scale*0.1);
	//rect(0,0,500,500);
	translate(width/2,scale*2);
	textAlign(CENTER);
	textSize(scale*2);
	text("Paused",0,0);
}


class TileGrid {
	constructor(width, height){
		this.width = width;
		this.height = height;
		this.tile = [];
		colorMode(HSB);
		for(let i = 0; i < width; i++){
			this.tile[i] = [];
			for(let j = 0; j < height; j++){
				this.tile[i][j] = backgroundColor;
			}
		}
		colorMode(RGB);
	}

	display(x, y, tileSize){
		translate(x,y);
		for(let i = 0; i < this.width; i++)
			for(let j = 0; j < this.height; j++){
				push();
				translate((i+0.5)*tileSize, (j+0.5)*tileSize)
				rectMode(CENTER)
				fill(this.tile[i][j]);
				rect(0,0, tileSize, tileSize);
				if(this.tile[i][j] != backgroundColor){
					imageMode(CENTER);
					image(greyBlock,0,0,tileSize,tileSize);
					blendMode(BURN);
					rect(0,0, tileSize, tileSize);
				}
				pop();
			}
	}

	collide(blockArray){
		for(let block of blockArray){
			if(block[0] < 0 || block[0] >= boardWidth ||
				block[1] < 0 || block[1] >= boardHeight ||
				this.tile[block[0]][block[1]] != backgroundColor)
			{
				return true;
			}
		}
		return false;
	}

	removeFullLines(){
		let clearedLines = 0;
		for(let i = 0; i < this.height; i++){
			if(this.lineIsFull(i)){
				this.shiftDown(i);
				clearedLines++;
			}
		}
		switch(clearedLines){
		case 1:
			gameState.score += 40;
			break;
		case 2:
			gameState.score += 100;
			break;
		case 3:
			gameState.score += 300;
			break;
		case 4:
			gameState.score += 1200;
			break;
		}
	}

	lineIsFull(y){
		for(let i = 0; i < this.width; i++)
			if(this.tile[i][y] == backgroundColor)
				return false;
		return true;
	}

	shiftDown(y){
		for(let j = y; j > 0; j--)
			for(let i = 0; i < this.width; i++)
				this.tile[i][j] = this.tile[i][j-1];
		for(let i = 0; i < this.width; i++)
			this.tile[i][0] = backgroundColor;
	}
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
}

class Tetromino {
	constructor(){
		this.x = 5;
		this.y = 0;
		let selector = Math.floor(random(7));
		this.shape = Tetromino.shapes[selector];
		this.color = Tetromino.colors[selector];
		this.blocks = Tetromino.tiles[selector];
	}

	display(x, y, tileSize){
		push();
		translate((this.x+x)*tileSize, (this.y+y)*tileSize);
		for(let block of this.blocks){
			imageMode(CORNER);
			blendMode(BLEND);
			image(greyBlock, block[0]*tileSize, block[1]*tileSize, tileSize, tileSize);
			blendMode(BURN);
			fill(this.color);
			rect(block[0]*tileSize, block[1]*tileSize, tileSize, tileSize);
		}
		pop();
	}

	rotateClockwise(){
		let rotatedBlocks = this.blocks.map((v) => [-v[1],v[0]]);
		if(!tileGrid.collide(this.levelSpace(rotatedBlocks))){
			this.blocks = rotatedBlocks;
		}
	}

	rotateCounterClockwise(){
		let rotatedBlocks = this.blocks.map((v) => [v[1],-v[0]]);
		if(!tileGrid.collide(this.levelSpace(rotatedBlocks))){
			this.blocks = rotatedBlocks;
		}
	}

	levelSpace(blocks){
		return blocks.map(b => [b[0]+this.x, b[1]+this.y])
	}

	// Transfers the tile of the active tile to the grid
	anchor(){
		for(let block of this.blocks)
			tileGrid.tile[block[0]+this.x][block[1]+this.y] = this.color;
	}

	moveLeft(){
		let movedBlocks = this.blocks.map((v) => [v[0]-1,v[1]]);
		if(!tileGrid.collide(this.levelSpace(movedBlocks)))
			this.x--;
	}

	moveRight(){
		let movedBlocks = this.blocks.map((v) => [v[0]+1,v[1]]);
		if(!tileGrid.collide(this.levelSpace(movedBlocks)))
			this.x++;
	}

	get canDrop(){
		let droppedBlocks = this.blocks.map((v) => [v[0],v[1]+1]);
		return (!tileGrid.collide(this.levelSpace(droppedBlocks)));
	}
}

Tetromino.shapes = ["I", "J", "L", "O", "S", "T", "Z"]; 
Tetromino.colors = ["rgb(0,165,255)","rgb(1,1,254)","orange","rgb(254,254,1)","rgb(1,254,1)","rgb(254,1,254)","rgb(254,1,1)"];
Tetromino.tiles = [
[[-2,0], [-1,0], [0,0], [1,0]], // I
[[-1,0], [0,0], [1,0], [-1,1]], // J
[[-1,0], [0,0], [1,0], [1,1]],  // L
[[-1,0], [0,0], [-1,1], [0,1]], // O
[[0,0], [1,0], [-1,1], [0,1]],  // S
[[-1,0], [0,0], [1,0], [0,1]],  // T
[[-1,0], [0,0], [0,1], [1,1]]   // Z
]

/*function mousePressed(){
	gameState.active = gameState.next;
	gameState.next	= new Tetromino();
}*/

let lastUpdate = 0;
let tickSpeed = 60;
let currentSpeed = tickSpeed;
function update(){
	let now = frameCount;
	if(now - lastUpdate > tickSpeed){
		lastUpdate = now;
		if(!gameState.active.canDrop){
			gameState.active.anchor();
			tileGrid.removeFullLines();
			gameState.active = gameState.next;
			if(tileGrid.collide(gameState.active.levelSpace(gameState.active.blocks)))
				gameOver();
			gameState.next	= new Tetromino();
		} else {
			gameState.active.y++;
		}
	}
}

function gameOver(){
	console.log("Game over");
	setup();
}

function keyPressed(){
	switch(keyCode){
	case LEFT_ARROW:
		gameState.active.moveLeft();
		break;
	case RIGHT_ARROW:
		gameState.active.moveRight();
		break;
	case UP_ARROW:
		gameState.active.rotateClockwise();
		break;
	case DOWN_ARROW:
		tickSpeed = 1;
		break;
	case ESCAPE:
		gameState.paused ^= true;
		break;
	}
}

function keyReleased(){
	switch(keyCode){
	case DOWN_ARROW:
		tickSpeed = currentSpeed;
		break;
	}
}

