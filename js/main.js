var canvas;
var stage;
var txt;
var img;
var bang;
var boom;
var gun;
var blimp;
var bmap;
var cannon;
var bullet;
var shooting = false;
var exploding = 0;
var ships_crossed = 0;
var score = 0;

document.onkeydown = handleKeyDown;

function init(){
	canvas = document.getElementById("canvas1");
	stage = new createjs.Stage(canvas);

	txt = new createjs.Text("Score " + score,"24px arial","#fff");
	txt.x = 700;
	txt.y = 0;

	gun = new Image();
	gun.src = "img/cannon.png";
	gun.onload = drawCannon;

	boom = new Image();
	boom.src = "img/boom.png";
	boom.onload = drawExplosion;

	blimp = new Image();
	blimp.src = "img/blimp.png";
	blimp.onload = drawBlimp;

	drawBullet();

	createjs.Ticker.setFPS(30);
	createjs.Ticker.addListener(window);

	console.log(window.devicePixelRatio);
}

function drawBlimp(event){
	bmap = new createjs.Bitmap(blimp);
	bmap.x = 800;
	bmap.y = 300;
	bmap.speed = 3;
	stage.addChild(bmap);
	stage.addChild(txt);
	stage.update();
}

function drawCannon(event){
	cannon = new createjs.Bitmap(gun);
	cannon.x = 200;
	cannon.y = 530;
	stage.addChild(cannon);
	stage.update();
}

function drawBullet(){
	bullet = new createjs.Shape();
	bullet.graphics.beginFill("black").drawCircle(0,0,5);
	bullet.x = -20;
	bullet.y = -20;
	stage.addChild(bullet);
	stage.update();
}

function drawExplosion(){
	bang = new createjs.Bitmap(boom);
	bang.x = -100;
	bang.y = -100;
	stage.addChild(bang);
	stage.update();
}

function tick(){
	//移动图像
	bmap.x -= bmap.speed;
	//如果飞船出现在屏幕之外，将图像这反倒RHS
	if(bmap.x < -200){
		restartShip();
		ships_crossed++;
		if(ships_crossed > 5){
			endGame();
		}
	}

	//如果存在炮弹的话，移动炮弹
	if(shooting){
		bullet.x += 6;
		bullet.y -= 8;
		if((bullet.x > 800)||(bullet.y < 0)||(blimpHit())){
			shooting = false;
			bullet.x = -20;
			bullet.y = -20;
		}
	}

	//如果击中，显示爆炸
	if(exploding > 0){
		exploding--;
	}else{
		//重置爆炸图像
		bang.x = -100;
		bang.y = -100;
	}

	//重绘canvas元素
	stage.update();
}

function blimpHit(){
	if((bullet.x - bmap.x < 50)&&(bullet.x - bmap.x > 0)&&(bullet.y - bmap.y < 30)&&(bullet.y - bmap.y > 0)){
		//击中了
		exploding = 5;

		//增加得分
		score++;
		txt.text = "Score " + score;

		//显示爆炸
		bang.x = bmap.x //- 50;
		bang.y = bmap.y //- 40;

		bullet.x = -20;
		bullet.y = -20;

		//重置飞船位置
		restartShip();
	}
}

function endGame(){
	bmap.speed = 0;
	txt.x = 300;
	txt.y = 200;
	txt.text = "GAME OVER!\n\nYou scored " + score + " hits!\n\nRefresh to play again...";
	stage.update();
}

function handleKeyDown(e){
	//处理KeyDown事件
	var key = e.keyCode;
	if(key == 37){
		//向左箭头，将炮弹向左移动
		if(cannon.x > 3){
			cannon.x -= 3;
		}
	}

	if(key == 39){
		//向右箭头，将炮弹向右移动
		if(cannon.x < 400){
			cannon.x += 3
		}
	}

	if(key == 32){
		//空格键，发射炮弹
		if(!shooting){
			bullet.x = cannon.x + 40;
			bullet.y = cannon.y + 5;
			shooting = true;
		}
	}
}

function restartShip(){
	bmap.x = 800;
	bmap.y = Math.floor(0.6*canvas.height*Math.random());
	bmap.speed = (Math.random()*4) + 3;
}























