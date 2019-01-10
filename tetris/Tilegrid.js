class TileGrid {
  constructor(width, height){
    this.width = width;
    this.height = height;
    this.tile = [];
    for(let i = 0; i < width; i++){
      this.tile[i] = [];
      for(let j = 0; j < height; j++){
        this.tile[i][j] = spriteArray["background"];
      }
    }
  }

  display(tileSize){
    for(let i = 0; i < this.width; i++)
      for(let j = 0; j < this.height; j++){
        backCanvas.context.drawImage(this.tile[i][j], i*tileSize, j*tileSize, tileSize, tileSize);
      }
  }

  collide(blockArray){
    for(let block of blockArray){
      if(block[0] < 0 || block[0] >= boardWidth ||
        block[1] < 0 || block[1] >= boardHeight ||
        this.tile[block[0]][block[1]] != spriteArray.background)
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
      gameState.score += 40*(gameState.level+1);
      break;
    case 2:
      gameState.score += 100*(gameState.level+1);
      break;
    case 3:
      gameState.score += 300*(gameState.level+1);
      break;
    case 4:
      gameState.score += 1200*(gameState.level+1);
      break;
    }
    gameState.clearedLines += clearedLines;
    gameState.level = ~~(gameState.clearedLines/10);
  }

  lineIsFull(y){
    for(let i = 0; i < this.width; i++)
      if(this.tile[i][y] == spriteArray.background)
        return false;
    return true;
  }

  shiftDown(y){
    for(let j = y; j > 0; j--)
      for(let i = 0; i < this.width; i++)
        this.tile[i][j] = this.tile[i][j-1];
    for(let i = 0; i < this.width; i++)
      this.tile[i][0] = spriteArray.background;
  }
}
