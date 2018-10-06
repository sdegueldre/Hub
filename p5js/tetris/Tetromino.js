class Tetromino {
  constructor(selector){
    this.x = 5;
    this.y = 0;
    this.shape = Tetromino.shapes[selector];
    this.sprite = spriteArray[this.shape];
    this.blocks = Tetromino.tiles[selector];
  }

  display(x, y, tileSize, canvas){
    for(let block of this.blocks){
      canvas.context.drawImage(this.sprite, (block[0]+this.x+x)*tileSize, (block[1]+this.y+y)*tileSize, tileSize, tileSize);
    }
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
      tileGrid.tile[block[0]+this.x][block[1]+this.y] = this.sprite;
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