// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 原始游戏尺寸
const originalWidth = 400;
const originalHeight = 300;

// 游戏状态
let gameOver = false;

// 计分
let kissCount = 0;

// 触摸控制状态
let isLeftPressed = false;
let isRightPressed = false;

// 键盘控制状态
let rightPressed = false;
let leftPressed = false;

// 游戏元素
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballRadius = 10;
let dx = 2;
let dy = -2;

let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

// 图片资源
let ballImage = new Image();
let paddleImage = new Image();
let imagesLoaded = 0;
const totalImages = 2;

// 调整canvas尺寸以适应屏幕
function resizeCanvas() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    
    // 计算缩放比例，保持原始宽高比
    const scale = Math.min(windowWidth / originalWidth, windowHeight / originalHeight);
    
    // 设置canvas显示尺寸
    canvas.style.width = `${originalWidth * scale}px`;
    canvas.style.height = `${originalHeight * scale}px`;
}

// 图片加载完成处理
function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        // 所有图片加载完成后开始游戏
        initGame();
    }
}

// 初始化游戏
function initGame() {
    // 初始化时调整尺寸
    resizeCanvas();
    
    // 监听窗口大小变化
    window.addEventListener('resize', resizeCanvas);
    
    // 开始游戏循环
    draw();
}

// 加载本地图片
ballImage.onload = imageLoaded;
ballImage.onerror = function() {
    console.error('Failed to load ball image');
    imagesLoaded++;
    if (imagesLoaded === totalImages) initGame();
};
ballImage.src = 'jpg/shr.png';

paddleImage.onload = imageLoaded;
paddleImage.onerror = function() {
    console.error('Failed to load paddle image');
    imagesLoaded++;
    if (imagesLoaded === totalImages) initGame();
};
paddleImage.src = 'jpg/byt.jpg';

// 监听鼠标点击事件，处理重新开始按钮点击
canvas.addEventListener('click', function(e) {
    if (gameOver) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const mouseX = (e.clientX - rect.left) * scaleX;
        const mouseY = (e.clientY - rect.top) * scaleY;
        
        // 检查是否点击了重新开始按钮
        if (mouseX >= canvas.width / 2 - 75 && mouseX <= canvas.width / 2 + 75 &&
            mouseY >= canvas.height / 2 + 20 && mouseY <= canvas.height / 2 + 70) {
            restartGame();
        }
    }
});

// 监听控制按钮事件
const leftBtn = document.getElementById('left-btn');
const rightBtn = document.getElementById('right-btn');

if (leftBtn && rightBtn) {
    // 左按钮事件
    leftBtn.addEventListener('touchstart', function(e) { 
        isLeftPressed = true; 
        e.preventDefault();
    });
    leftBtn.addEventListener('touchend', function(e) { 
        isLeftPressed = false; 
        e.preventDefault();
    });
    leftBtn.addEventListener('touchcancel', function(e) { 
        isLeftPressed = false; 
        e.preventDefault();
    });
    leftBtn.addEventListener('mousedown', function() { 
        isLeftPressed = true; 
    });
    leftBtn.addEventListener('mouseup', function() { 
        isLeftPressed = false; 
    });
    
    // 右按钮事件
    rightBtn.addEventListener('touchstart', function(e) { 
        isRightPressed = true; 
        e.preventDefault();
    });
    rightBtn.addEventListener('touchend', function(e) { 
        isRightPressed = false; 
        e.preventDefault();
    });
    rightBtn.addEventListener('touchcancel', function(e) { 
        isRightPressed = false; 
        e.preventDefault();
    });
    rightBtn.addEventListener('mousedown', function() { 
        isRightPressed = true; 
    });
    rightBtn.addEventListener('mouseup', function() { 
        isRightPressed = false; 
    });
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d" || e.key == "D") {
        rightPressed = true;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a" || e.key == "A") {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == "Right" || e.key == "ArrowRight" || e.key == "d" || e.key == "D") {
        rightPressed = false;
    }
    else if (e.key == "Left" || e.key == "ArrowLeft" || e.key == "a" || e.key == "A") {
        leftPressed = false;
    }
}

function drawBall() {
    // 使用图片绘制小球
    ctx.drawImage(ballImage, ballX - ballRadius, ballY - ballRadius, ballRadius * 2, ballRadius * 2);
}

function drawPaddle() {
    // 使用图片绘制 paddle
    ctx.drawImage(paddleImage, paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
}

function collisionDetection() {
    if (ballY + dy < ballRadius) {
        dy = -dy;
    } else if (ballY + dy > canvas.height - ballRadius) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            dy = -dy;
            // 增加接吻次数
            kissCount++;
        }
        else {
            // 游戏结束
            gameOver = true;
        }
    }

    if (ballX + dx < ballRadius || ballX + dx > canvas.width - ballRadius) {
        dx = -dx;
    }
}

// 重新开始游戏
function restartGame() {
    gameOver = false;
    ballX = canvas.width / 2;
    ballY = canvas.height - 30;
    dx = 2;
    dy = -2;
    paddleX = (canvas.width - paddleWidth) / 2;
    // 重置计分
    kissCount = 0;
}





function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制计分板
    ctx.fillStyle = 'rgba(255, 105, 180, 0.8)';
    ctx.beginPath();
    ctx.roundRect(canvas.width - 150, 10, 140, 40, 10);
    ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('接吻次数: ' + kissCount, canvas.width - 140, 35);

    if (!gameOver) {
        drawBall();
        drawPaddle();
        collisionDetection();

        // 控制paddle移动（同时支持键盘和触摸）
        if ((rightPressed || isRightPressed) && paddleX < canvas.width - paddleWidth) {
            paddleX += 7;
        }
        else if ((leftPressed || isLeftPressed) && paddleX > 0) {
            paddleX -= 7;
        }

        ballX += dx;
        ballY += dy;
    } else {
        // 游戏结束界面
        // 绘制半透明背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // 绘制游戏结束文字
        ctx.font = 'bold 30px Arial';
        ctx.fillStyle = '#ff1493';
        ctx.textAlign = 'center';
        ctx.fillText('白雨桐没能接住他的新娘', canvas.width / 2, canvas.height / 2 - 40);
        
        // 绘制重新开始按钮
        ctx.fillStyle = '#ff69b4';
        ctx.beginPath();
        ctx.roundRect(canvas.width / 2 - 75, canvas.height / 2 + 20, 150, 50, 15);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 20px Arial';
        ctx.fillText('重新开始', canvas.width / 2, canvas.height / 2 + 55);
    }

    requestAnimationFrame(draw);
}
