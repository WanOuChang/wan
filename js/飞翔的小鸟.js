//获取对象
var wrapGame = document.getElementById("wrapGame");
//头部div
var headDiv = document.getElementById("head");
//点击开始的按钮
var startMenuBtn = document.getElementById("startMenu");
//结束菜单
var endMenuBtn = document.getElementById("endMenu");
//当前得分
var currentScore = document.getElementById("currentScore");
//最高得分
var bestScore = document.getElementById("bestScore"); 
//获得管道所在的ul
var pipeUls = document.getElementById("pipes");
//飞翔的小鸟
var birdImg = document.getElementById("bird");
//草坪
var grass = document.getElementById("grass");
//显示总得分的对象
var score = document.getElementById("score");
//游戏背景音乐
var gameMusic = document.getElementById("gameMusic");
//小鸟飞翔的音乐
var bulletMusic = document.getElementById("bulletMusic");
//小鸟game over的音乐
var gameOverMusic = document.getElementById("gameOverMusic");

var birdDownTimer;//存储小鸟下落的定时器



//为点击开始按钮添加事件
startMenuBtn.onclick = function () {
	//获取事件对象
	var event1 = window.event || e;
	//1.播放背景音乐
	gameMusic.play();
	//设置循环播放
	gameMusic.loop = true;
	//取消事件冒泡
	event1.cancelBubble = true;
	event1.stopPropagation();
	//2.隐藏开始菜单
	startMenuBtn.style.display = "none";
	headDiv.style.display = "none";
	//3.显示界面上的小鸟和分数项
	birdImg.style.display = "block";
	score.style.display = "block";
	//4.草坪移动
//	grassMove();
	//第二种方式
	setInterval(grassMove,30	);
	//5.小鸟下落事件
	birdDownTimer = setInterval(birdDown,30);
	//6.小鸟上升事件
	wrapGame.onclick = clickGameBirdUp;
	//7.生成管道
	setInterval(createPipes,3000);
	//8.碰撞检测
	setInterval(function () {
		//获取所有的li管道(上下管道)
		var lis = pipeUls.getElementsByTagName("li");
		//判断所有的上下管道是否和小鸟发生碰撞
		for (var i = 0;i < lis.length;i++) {
			//当管道右边距小于小鸟的左边距时,说明已经飞过去的管道,不用再碰撞检测了;反之,则需要判断
			if (lis[i].offsetParent.offsetLeft + lis[i].offsetWidth > birdImg.offsetLeft) {
				//判断上管道是否和小鸟发生碰撞
				if (isCrash(birdImg,lis[i].firstElementChild)) {
					//碰撞
					gameOver();//游戏结束
				}
				//判断下管道是否和小鸟复制碰撞
				if (isCrash(birdImg,lis[i].lastElementChild)) {
					//碰撞
					gameOver();//游戏结束
				}
			}
		}
	},15);
}


//草坪移动
var index = 0;
//function grassMove () {
//	setInterval(function () {
//		index += 2;
//		if (index >= 343) {
//			index = 0;
//		}
//		grass.style.left = -index + 'px';
//	},30);
//}
function grassMove () {
	index += 2;
	if (index >= 343) {
		index = 0;
	}
	grass.style.left = -index + 'px';
}
//小鸟下落事件
var speed = 0;//存储速度
function birdDown () {
	//修改图片
	birdImg.src = "newImg/down_bird.png";
	//修改速度
	speed += 0.5;
	//设置最大速度
	if (speed >= 10) {
		speed = 10;
	}
	//修改位置
	birdImg.style.top = birdImg.offsetTop + speed + 'px';
	//判断是否碰撞地面
	if (birdImg.offsetHeight + birdImg.offsetTop >= 423) {
		//game over 游戏结束
		gameOver();
	}
}

//游戏结束,调用的函数
function gameOver () {
	//暂停游戏背景音乐
	gameMusic.pause();
	//播放游戏结束音乐
	gameOverMusic.play();
	//显示gameover菜单
	endMenuBtn.style.display = "block";
	//设置结束菜单的z-index值
	endMenuBtn.style.zIndex = 2;
	
	//停止所有的定时器
	//当前网页加载完成后,创建的计时器的id是递增的,只要能获取最后一个定时器的id,就能遍历得到所有的定时器,然后通过id清除对应的定时器
	//获取所有的定时器
	var alltimer = setInterval(function () {
		
	},1);
	for (var i = 1;i <= alltimer;i++) {
		//清除定时器
		clearInterval(i);
	}
	//显示当前得分
	currentScore.innerHTML = scoreNum;
	//显示最好成绩
	//必须使用本地存储
	if (localStorage.best) {
		 //获取本地存储的最高分与当前得分比较,获取最高分
		localStorage.best = localStorage.best > scoreNum ? localStorage.best : scoreNum;
		//显示最高分
		bestScore.innerHTML = localStorage.best;
	} else{
		//第一次使用,最高得分就是当前得分
		bestScore.innerHTML = scoreNum;
		localStorage.best = scoreNum;
	}
}


//小鸟上升事件
var birdFlyTimer;//小鸟上升的定时器
function clickGameBirdUp () {
	//播放音乐
	bulletMusic.play();
	//清除小鸟下降的定时器
	clearInterval(birdDownTimer);
	//修改速度值
	speed = 5;
	//每次清除掉上次的小鸟上升定时器
	clearInterval(birdFlyTimer);
	//创建上升的定时器
	birdFlyTimer = setInterval(function () {
		//改变鸟的状态
		birdImg.src = "newImg/up_bird.png";
		speed -= 0.5;
		//当speed小于0时,就会下落,调用函数即可
		if (speed < 0) {
			//清除小鸟上升的操作
			clearInterval(birdFlyTimer);
			
			speed = 0;
			//小鸟下落
			birdDownTimer = setInterval(birdDown,30);
			
		}
		//修改位置
		birdImg.style.top = birdImg.offsetTop - speed + 'px';
		//判断是否碰到顶部
		if (birdImg.offsetTop <= 0) {
			//调用gameover
			gameOver();
		}
	},30);
}

//随机函数
function randomNum (m,n) {
	return Math.floor(Math.random() * (n - m + 1) + m);
}
//生成管道
function createPipes () {
	//创建一个管道li(上下管道)
	var li = document.createElement("li");
	//添加样式
	li.className = "pipe";
	li.style.left = pipeUls.offsetWidth + 'px';
	//添加li节点
	pipeUls.appendChild(li);
	//随机上管道的高度
	var top_Height = randomNum(50,200);
	//获得下管道的高度  通道口的高度为130
	var bottom_height = li.offsetHeight - 130 - top_Height;
	//分别创建上下管道
	var topDiv = document.createElement("div");
	topDiv.className = "up_pipe";
	topDiv.style.height = top_Height + 'px';
	//添加上管道
	li.appendChild(topDiv);
	var bottomDiv = document.createElement("div"	);
	bottomDiv.className = "down_pipe";
	bottomDiv.style.height = bottom_height + 'px';
	//添加下管道
	li.appendChild(bottomDiv);
	//设置移动距离
	var distance = pipeUls.clientWidth;
	//让管道移动
	var pipeMoveTimer = setInterval(function () {
		distance--;
		//设置li的位置
		li.style.left = distance + 'px';
		//当创建的li管道超出屏幕时,则删除li节点
		if (distance <= -li.offsetWidth) {
			//删除li管道
			pipeUls.removeChild(li);
			//取消管道滚动的定时器
			clearInterval(pipeMoveTimer);
		}
		//处理得分
		if (distance == 0) {
			//处理显示的得分
			changeAllScores();
		}
	},15);
}


//处理得分
var scoreNum = 0;//记录得分
function changeAllScores () {
	scoreNum++;
	//清空score  div里的img图片
	score.innerHTML = "";
	//添加分数
	if (scoreNum < 10) {
		//显示一张图片
		var img = document.createElement("img");
		img.src = "newImg/" + scoreNum + ".jpg";
		//添加图片
		score.appendChild(img);
	} else {
		//当得分是两位数时
		//十位的图片
		var img1 = document.createElement("img");
		img1.src = "newImg/" + Math.floor(scoreNum / 10) + ".jpg";
		score.appendChild(img1);
		//个位的图片
		var img2 = document.createElement("img");
		img2.src = "newImg/" + scoreNum % 10 + ".jpg";
		score.appendChild(img2);
	}
}





//判断两个对象是否发生碰撞,如果碰撞,返回true,反之,返回false
function isCrash (obj1,obj2) {
	//设置一个bool,存储是否碰撞
	var boolCrash = true;//假设true为碰撞
	
	//获取obj1的左边距
	var left1 = obj1.offsetLeft;
	//obj1的右边距
	var right1 = obj1.offsetLeft + obj1.offsetWidth;
	//obj1的上边距
	var top1 = obj1.offsetTop;
	//obj1的下边距
	var bottom1 = obj1.offsetTop + obj1.offsetHeight;
	
	//获取obj2的左边距
	var left2 = obj2.offsetParent.offsetLeft;
	//obj2的右边距
	var right2 = obj2.offsetParent.offsetLeft + obj2.offsetWidth;
	//obj2的上边距
	var top2 = obj2.offsetTop;
	//obj2的下边距
	var bottom2 = obj2.offsetTop + obj2.offsetHeight;
	
	//判断碰撞的条件
	//不碰撞的条件right1 < left2 || left1 > right2 || bottom1 < top2 || top1 > bottom2
	if (!(right1 < left2 || left1 > right2 || bottom1 < top2 || top1 > bottom2)) {
		boolCrash = true;//碰撞
	} else{
		boolCrash = false;//不碰撞
	}
	
	return boolCrash;
}