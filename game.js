
//Beginning of IIFE
(function () {

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let yum_sound = new Audio('./sounds/yum.mp3');
let eww_sound = new Audio('./sounds/eww.mp3');
let gameover_sound = new Audio('./sounds/gameover.mp3');
let sounds = -1;

let pizza_img = new Image();
pizza_img.src = "./images/pizza.png";
let hamburger_img = new Image();
hamburger_img.src = "./images/hamburger.png";
let rum_img = new Image();
rum_img.src = "./images/rum.png";
let hotdog_img = new Image();
hotdog_img.src = "./images/hotdog.png";
let icecream_img = new Image();
icecream_img.src = "./images/icecream.png";
let life_img = new Image();
life_img.src = "./images/life.png";
let broccoli_img = new Image();
broccoli_img.src = "./images/broccoli.png";
let apple_img = new Image();
apple_img.src = "./images/apple.png";
let salad_img = new Image();
salad_img.src = "./images/salad.png";
let fish_img = new Image();
fish_img.src = "./images/fish.png";
let book_img = new Image();
book_img.src = "./images/book.png";
let korsan_r_img = new Image();
korsan_r_img.src = "./images/korsan_r.png";
let korsan_l_img = new Image();
korsan_l_img.src = "./images/korsan_l.png";
let background_img = new Image();
background_img.src = "./images/background_img.jpg";

let items = [];
let korsan = new Korsan();
let highscore = 0;

//Constructors
function Food (x, type, speed) {
	this.x = x;
	this.y = -100;
	this.type = type;
	if (type<10) this.w = this.h = 100;
	else this.w = this.h = 50;

	//[0]pizza [1]hamburger [2]rum [3]hotdog [4]icecream [5]broccoli [6]apple [7]salad [8]fish [9]book [10]life
	this.speed = speed;
}

function Korsan ( ) {
	this.dx = 0;
	this.x = 500;
	this.y = 300;
	this.life = 3;
	this.looks = "left";
	this.score = 0;
}




//Loop

setInterval ( function() {
	clean();
	update();
	draw();
	playSounds();
},30);


// Main funcs

function clean() {
	ctx.drawImage(background_img, 0,0,1000,500);
}

function update() {
	items = cleanArray(items);

	if (luck(10)) korsan.score++;

	korsan.x += korsan.dx;
	if (korsan.dx < 0) korsan.dx++;
	else if (korsan.dx > 0) korsan.dx--;
	if (korsan.x > 900) korsan.x = 900;
	else if (korsan.x < 0) korsan.x = 0;
	if (korsan.dx > 20) korsan.dx = 20;
	else if (korsan.dx < -20) korsan.dx = -20;

	if (luck(3)) {
		items[items.length] = new Food(random(0,10,true)*100, random(0,11,true), random(1,10,true) );
	}

	for (let i = 0; i<items.length; i++) {

		items[i].y += items[i].speed;

		if (collides(korsan.x, korsan.y, 100, 200, items[i].x, items[i].y, items[i].w, items[i].h)) {
				if (items[i].type==10) {
					korsan.life++;
					sounds = 0;
				}
				else if (between(items[i].type, 4, 10)) {
					korsan.life--;
					sounds = 1;
				}
				else {
					korsan.score += 137;
					sounds = 0;
				}

				items[i] = undefined;
			}
		
		if (items[i]) if (items[i].y > 400) items[i] = undefined;

		if (korsan.life < 0) gameover();
			
	}
}

function draw() {

	if (korsan.looks == "left") ctx.drawImage(korsan_l_img, korsan.x , korsan.y, 100,200)
	if (korsan.looks == "right") ctx.drawImage(korsan_r_img, korsan.x , korsan.y, 100,200)	

	ctx.drawImage(life_img, 830, 10, 50, 50);

	for (let i = 0; i<items.length; i++) {
		if (items[i]) switch(items[i].type) {
			//[0]pizza [1]hamburger [2]rum [3]hotdog [4]icecream [5]broccoli [6]apple [7]salad [8]fish [9]book [10]life
			case 0:
				ctx.drawImage(pizza_img, items[i].x, items[i].y, items[i].w, items[i].h);
				break;
			case 1:
				ctx.drawImage(hamburger_img, items[i].x, items[i].y, items[i].w, items[i].h);
				break;
			case 2:
				ctx.drawImage(rum_img, items[i].x, items[i].y, items[i].w, items[i].h);
				break;
			case 3:
				ctx.drawImage(hotdog_img, items[i].x, items[i].y, items[i].w, items[i].h);
				break;
			case 4:
				ctx.drawImage(icecream_img, items[i].x, items[i].y, items[i].w, items[i].h);
				break;
			case 5:
				ctx.drawImage(broccoli_img, items[i].x, items[i].y, items[i].w, items[i].h);
				break;
			case 6:
				ctx.drawImage(apple_img, items[i].x, items[i].y, items[i].w, items[i].h);
				break;
			case 7:
				ctx.drawImage(salad_img, items[i].x, items[i].y, items[i].w, items[i].h);
				break;
			case 8:
				ctx.drawImage(fish_img, items[i].x, items[i].y, items[i].w, items[i].h);
				break;
			case 9:
				ctx.drawImage(book_img, items[i].x, items[i].y, items[i].w, items[i].h);
				break;
			case 10:
				ctx.drawImage(life_img, items[i].x, items[i].y, items[i].w, items[i].h);
		}
	}

	ctx.font = "50px Helvetica";
	ctx.fillText(`x ${korsan.life}`,900, 50);

	ctx.font = "20px Helvetica";
	ctx.fillText(`SCORE ${korsan.score}`,10, 30);
	ctx.fillText(`HIGH ${highscore}`,10, 55);
	
}

onkeydown = function(x) {
	if (x.key == "ArrowLeft") {
		korsan.dx-=10;
		korsan.looks = "left";
	}
	if (x.key == "ArrowRight") {
		korsan.dx+=10;
		korsan.looks = "right";
	}
}

function gameover() {
	sounds = 2;
	if (highscore < korsan.score) highscore = korsan.score;
	korsan.score = 0;
	items = [];
	korsan.x = 500;
	korsan.life = 3;
}

function playSounds() {
	switch(sounds) {
		case 0:
		yum_sound.play();
		break;
		case 1:
		eww_sound.play();
		break;
		case 2:
		gameover_sound.play();
		break;
	}
	sounds = -1;
}









//helper functions

function distance (x1, y1, x2, y2) {
	return Math.sqrt( (x2-x1)**2 + (y2-y1)**2);
}

function between ( what, a, b ) {
	return what>a && what<b;
}

function collides (x1, y1, w1, h1, x2, y2, w2, h2) {
	return (x1 < x2 + w2 &&
		x1 + w1 > x2 &&
		y1 < y2 + h2 &&
		h1 + y1 > y2)
}

function random (between, and, int) {
	if (int) return Math.floor(Math.random()* (and-between) + between);
	else return Math.random()* (and-between) + between;
}

function cleanArray(x) {
	let result = []
	for (let i = 0; i<x.length; i++) {
		if (x[i]!=undefined && x[i]!=null ) result[result.length] = x[i];
	}
	return result;
}

function luck (percent) {
	return Math.floor(Math.random()*100) < percent;
}


// End of IIFE
})();
