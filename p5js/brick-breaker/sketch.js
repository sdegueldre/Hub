const xBricks = 11;
const yBricks = 6;
const brickWidth = 90;
const brickHeight = brickWidth / 3;
const brickSpacing = brickHeight * 0.666;
const bricks = new Set();
const particles = new Set();
let lives;
let score;
let combo;
let gameover;
let paddle, ball;

function setup() {
	createCanvas(1280, 720);
	background(0);
	paddle = new Paddle(150, 15);
	ball = new Ball(15);
	bricks.clear();
	for (let i = 0; i < xBricks; i++) {
		for (let j = 0; j < yBricks; j++) {
			bricks.add(new Brick(width / 2 + (i - (xBricks - 1) / 2) * (brickWidth + brickSpacing), brickSpacing + brickHeight / 2 + (j * (brickHeight + brickSpacing)), brickWidth, brickHeight));
		}
	}
	lives = 1;
	score = 0;
	combo = 0;
	gameover = false;
}

function draw() {
	if (!gameover) {
		paddle.tick();
		ball.tick();
	}
	background(0);

	for (const brick of bricks) {
		brick.draw();
	}
	paddle.draw();
	ball.draw();
	for (const particle of particles) {
		particle.draw();
		particle.tick();
		if (particle.life <= 0)
			particles.delete(particle);
	}

	drawLives();
	drawScore();
	if (gameover) {
		fill(127, 127);
		rect(0, 0, width, height);
		drawGameOver();
	}
}

function drawGameOver() {
	push();
	fill(0);
	stroke(255);
	strokeWeight(4);
	textSize(100);
	textAlign(CENTER, BASELINE);
	text('GAME OVER', width / 2, height / 2 - 20);
	textSize(50);
	textAlign(CENTER, TOP);
	text('press space to play again', width / 2, height / 2 + 20);
	textAlign(CENTER, TOP);
	text('Final score: ' + score, width / 2, 3 * height / 4);
	pop();
}

function drawLives() {
	push();
	fill(0);
	stroke(255);
	strokeWeight(4);
	textSize(50);
	textAlign(RIGHT, BASELINE);
	text(lives, width - 3.5, height - 7);
	pop();
}

function drawScore() {
	push();
	fill(0);
	stroke(255);
	strokeWeight(4);
	textSize(50);
	textAlign(LEFT, BASELINE);
	text(score, 3.5, height - 7);
	pop();
}

class Paddle {
	constructor(w, h) {
		this.w = w;
		this.h = h;
		this.x = width / 2;
		this.y = height - 25;
		this.speed = 15;
	}

	draw() {
		noStroke();
		fill(255);
		rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
	}

	tick() {
		if (keyIsDown(RIGHT_ARROW))
			this.x += this.speed;
		if (keyIsDown(LEFT_ARROW))
			this.x -= this.speed;
		this.x = constrain(this.x, this.w / 2 + 1, width - this.w / 2 - 1);
	}
}

class Ball {
	constructor(size) {
		this.size = size;
		this.x = paddle.x;
		this.y = paddle.y - this.size - 5;
		this.speed = 10;
		this.angle = -HALF_PI;
		this.isDocked = true;
	}

	draw() {
		const sz = this.size + 5;
		noStroke();
		fill(255);
		ellipseMode(CORNER);
		ellipse(this.x - sz / 2, this.y - sz / 2, sz, sz);
	}

	collide(paddle) {
		const collision = ((this.x + this.size / 2) >= (paddle.x - paddle.w / 2) &&
			(this.x - this.size / 2) <= (paddle.x + paddle.w / 2) &&
			(this.y + this.size / 2) >= (paddle.y - paddle.h / 2) &&
			(this.y - this.size / 2) <= (paddle.y + paddle.h / 2))
		return collision;
	}

	tick() {
		if (this.isDocked)
			this.x = paddle.x;
		else {
			this.x += this.speed * cos(this.angle);
			this.y += this.speed * sin(this.angle);
			if (this.x <= this.size / 2 || this.x > width - this.size / 2)
				this.angle = -this.angle + PI;
			if (this.y <= this.size / 2)
				this.angle = -this.angle;
			if (this.collide(paddle)) {
				this.angle = ((this.x - paddle.x) / paddle.w - 1) * HALF_PI;
				combo = 0;
			}

			for (const brick of bricks) {
				if (this.collide(brick)) {
					let counter = random(3, 15);
					for (let i = 0; i < counter; i++) {
						let xv = 0.5 * random(-this.speed, this.speed);
						let yv = 0.5 * random(-this.speed, this.speed);
						particles.add(new Particle(this.x, this.y, xv, yv));
					}
					this.angle = -this.angle;
					bricks.delete(brick);
					combo++;
					score += combo;
				}
			}

			if (this.y >= height - this.size / 2) {
				lives--;
				if (lives <= 0) {
					gameover = true;
				}
				this.isDocked = true;
				if (!gameover) {
					this.angle = -HALF_PI;
					this.x = paddle.x;
					this.y = paddle.y - this.size - 1;
				}
				combo = 0;
			}
		}
	}
}

function keyPressed() {
	if (keyCode == 32 && ball.isDocked)
		ball.isDocked = false;
	if (keyCode == ESCAPE || (keyCode == 32 && gameover))
		setup();
}

class Brick {
	constructor(x, y, w, h) {
		Object.assign(this, { x, y, w, h })
	}

	draw() {
		noStroke();
		fill(255);
		rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
	}
}

class Particle {
	constructor(x, y, xv, yv) {
		Object.assign(this, {
			x, y, xv, yv,
			r: 3, life: 50,
			gravity: 0.5,
		});
	}

	tick() {
		this.life--;
		this.x += this.xv;
		this.y += this.yv;
		this.yv += this.gravity;
	}

	draw() {
		ellipseMode(CENTER);
		fill(255, 255, 255, this.life / 50 * 255);
		ellipse(this.x, this.y, this.r * 2, this.r * 2);
	}
}
