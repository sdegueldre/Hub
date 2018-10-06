let frontCanvas; // Only used for the falling tetromino
let backCanvas;  // Background: only rerendered once after a tetromino drops

let boardWidth = 10;
let boardHeight = 20;

let tileGrid;
let gameState = {};
let backgroundColor = "dimgray";
let spriteArray = {};
let tileSize;

function preload(){
	spriteArray.background = loadImage("assets/bg.png");
	for(shape of Tetromino.shapes){
		spriteArray[shape] = loadImage(`assets/${shape}.png`);
	}
}

function setup(){
	frontCanvas = createCanvas(windowWidth, windowHeight);
  backCanvas = createCanvas(windowWidth, windowHeight);
  frontCanvas.style.zIndex = 0;
  backCanvas.style.zIndex = -1;

  tileSize = Math.floor(windowHeight*0.95/boardHeight);
  frontCanvas.context.translate(windowWidth/2 - boardWidth*tileSize/2, windowHeight/2 - boardHeight*tileSize/2);
  backCanvas.context.translate(windowWidth/2 - boardWidth*tileSize/2, windowHeight/2 - boardHeight*tileSize/2);
  initGameState();
}

function initGameState(){
  tileGrid = new TileGrid(boardWidth, boardHeight);
  gameState.paused = false;
  gameState.score = 0;
  gameState.sequence = [0,1,2,3,4,5,6].shuffle();
  gameState.current = 0;
  gameState.active;
  gameState.next = new Tetromino(gameState.sequence[0]);
  gameState.nextTetromino = function(){
    gameState.active = gameState.next;
    gameState.current++;
    if(gameState.current == 7){
      gameState.sequence.shuffle();
      gameState.current = 0;
    }
    gameState.next = new Tetromino(gameState.sequence[gameState.current]);
  }
  gameState.nextTetromino();
}

function draw(repaint){
	if(!gameState.paused){
    let toRedraw = (typeof repaint == "undefined") ? update() : repaint;

    if(toRedraw == "backCanvas"){
    	backCanvas.clear()
    	backCanvas.context.fillStyle ='red';
    	backCanvas.context.fillRect(0, 0, boardWidth*tileSize, boardHeight*tileSize);
    	tileGrid.display(0, 0, tileSize);
      gameState.next.display(8,2,tileSize, backCanvas);
      backCanvas.context.font = `${tileSize}px monospace`;
      backCanvas.context.fillStyle = 'black';
      backCanvas.context.fillText("Score: " + gameState.score, tileSize*boardWidth, tileSize);
      toRedraw = "frontCanvas";
    }
    if(toRedraw == "frontCanvas"){
      frontCanvas.clear();
    	gameState.active.display(0,0,tileSize, frontCanvas);
    }
    	
  } else {
		drawMenu(tileSize);
  }
}

function drawMenu(scale){
	background(0,50);
	fill(255);
	stroke(0)
	strokeWeight(scale*0.1);
	//rect(0,0,500,500);
	translate(Math.floor(width/2),Math.floor(scale*2));
	textAlign(CENTER);
	textSize(scale*2);
	text("Paused",0,0);
}

function windowResized(){
	resizeCanvas(windowWidth, windowHeight);
}


let lastUpdate = 0;
let tickSpeed = 60;
let baseSpeed = tickSpeed;
function update(){
	let now = frameCount;
  if(now == 0)
    return "backCanvas";
	if(now - lastUpdate > tickSpeed){
		lastUpdate = now;
		if(!gameState.active.canDrop){
			gameState.active.anchor();
			tileGrid.removeFullLines();
			gameState.nextTetromino();
			if(tileGrid.collide(gameState.active.levelSpace(gameState.active.blocks)))
				gameOver();
      return "backCanvas";
		} else {
			gameState.active.y++;
      return "frontCanvas";
		}
	}
  return "nothing";
}

function gameOver(){
	console.log("Game over");
	initGameState();
}

function keyPressed(event){
	switch(event.code){
	case "ArrowLeft":
		gameState.active.moveLeft();
		break;
	case "ArrowRight":
		gameState.active.moveRight();
		break;
	case "ArrowUp":
		gameState.active.rotateClockwise();
		break;
	case "ArrowDown":
		tickSpeed = 1;
		break;
	case "Escape":
		gameState.paused ^= true;
		break;
	}
  draw("frontCanvas");
}

function keyReleased(event){
	switch(event.code){
	case "ArrowDown":
		tickSpeed = baseSpeed;
		break;
	}
  draw("frontCanvas");
}

Array.prototype.shuffle = function(){
	for(let i = this.length-1; i > 0; i--){
		const j = Math.floor(Math.random() * (i + 1));
    let temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }
  return this;
}