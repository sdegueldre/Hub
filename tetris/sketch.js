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
	frontCanvas = createCanvas();
  backCanvas = createCanvas();
  frontCanvas.style.zIndex = 1;
  backCanvas.style.zIndex = 0;
  initGameState();
	windowResized();
}

function windowResized(){
  frontCanvas.width = backCanvas.width = windowWidth;
  frontCanvas.height = backCanvas.height = windowHeight;
  tileSize = Math.floor((windowHeight-29)*0.95/boardHeight);
  let horizontal = Math.floor(windowWidth/2 - boardWidth*tileSize/2);
  let vertical = Math.floor(windowHeight/2 - boardHeight*tileSize/2);
  frontCanvas.context.translate(horizontal, vertical);
  backCanvas.context.translate(horizontal, vertical);
  gameState.menuOverlay = false;
  draw("backCanvas");
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
  gameState.menuOverlay = false;
	gameState.level = 0;
	gameState.clearedLines = 0;
}

function draw(repaint){
	if(!gameState.paused || repaint == "backCanvas"){
    let toRedraw = (typeof repaint == "undefined") ? update() : repaint;

    if(toRedraw == "backCanvas"){
    	backCanvas.clear()
    	backCanvas.context.fillStyle ='red';
    	backCanvas.context.fillRect(0, 0, boardWidth*tileSize, boardHeight*tileSize);
    	tileGrid.display(tileSize);
      backCanvas.context.font = `${tileSize}px monospace`;
      backCanvas.context.fillStyle = '#ff8a00';
      backCanvas.context.fillText("Score: " + gameState.score, tileSize*(boardWidth+0.5), tileSize);
			backCanvas.context.fillText("Level " + gameState.level, tileSize*(boardWidth+0.5), tileSize*2.5);
			backCanvas.context.fillText("Up next: ", tileSize*-5, tileSize);
			gameState.next.display(-8,1.5,tileSize, backCanvas);
      toRedraw = "frontCanvas";
    }
    if(toRedraw == "frontCanvas"){
      frontCanvas.clear();
    	gameState.active.display(0,0,tileSize, frontCanvas);
    }

  }
  if(gameState.paused && gameState.menuOverlay == false){
		drawMenu(tileSize);
  }
}

function drawMenu(scale){
  frontCanvas.context.save();
  frontCanvas.context.resetTransform();
  frontCanvas.context.fillStyle = 'rgba(50,50,50,0.5)';
	frontCanvas.context.fillRect(0,0,windowWidth,windowHeight);

  frontCanvas.context.strokeStyle = `black`;
  frontCanvas.context.lineWidth = 0.1*scale;
	frontCanvas.context.font = `${scale*2}px sans-serif`;
  frontCanvas.context.textAlign = 'center';
  frontCanvas.context.fillStyle = 'white';
	frontCanvas.context.strokeText("Paused", windowWidth/2, 2*scale);
  frontCanvas.context.fillText("Paused", windowWidth/2, 2*scale);

  frontCanvas.context.restore();
  gameState.menuOverlay = true;
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
    gameState.menuOverlay = false;
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
