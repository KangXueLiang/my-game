var canvas = document.getElementById('myCanvas') //定义画布
var ctx = canvas.getContext('2d')
    //小球每次轨迹改变值
var dx = 2
var dy = 2
//小球初始位置
var x = canvas.width / 2
var y = canvas.height / 2
//小球半径
var bollRadius = 10
//游戏初始状态
var itemStatus = false
    //定义球板
var paddleWidth = 75
var paddleHeight = 10
var paddleX = canvas.width - paddleWidth / 2 //球板初始位置
var paddleY = 0
var fail = document.querySelector('#fail')
//画砖块
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;
var b
var bricks = [];
//初始分数
var score = 0
//小球初始颜色
var color = "#0095DD"
    //随机颜色获取函数
var getRandomColor = function() {
    return '#' +
        (function(color) {
            return (color += '0123456789abcdef' [Math.floor(Math.random() * 16)]) && (color.length == 6) ? color : arguments.callee(color);
        })('');
}
//画小球函数
function drawBoll() {
    ctx.beginPath()
    ctx.arc(x, y, bollRadius, 0, Math.PI * 2)
    ctx.fillStyle = color
    ctx.fill()
    ctx.closePath()
    if (x + dx > canvas.width - bollRadius || x + dx < 0 + bollRadius) {
        dx = -dx
        color = getRandomColor()
    }
    if (y + dy < 0 + bollRadius + paddleY) {
        dy = -dy
        color = getRandomColor()
    } else if (y + dy > canvas.height - bollRadius - paddleY) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy
            color = getRandomColor()
        } else {
            fail.classList.remove('hide')
            itemStatus = false
        }
    }
}
//画球板
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight - paddleY, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
    if (leftPress) {
        paddleX -= 7
        if (paddleX < 0) {
            paddleX = 0
        }
    }
    if (rightPress) {
        paddleX += 7
        if (paddleX > canvas.width - paddleWidth) {
            paddleX = canvas.width - paddleWidth
        }
    }
}
//左右键事件绑定
var leftPress = false
var rightPress = false
document.addEventListener('keydown', function(e) {
    if (e.keyCode === 39) {
        rightPress = true
    }
    if (e.keyCode === 37) {
        leftPress = true
    }
})
document.addEventListener('keyup', function(e) {
    if (e.keyCode === 39) {
        rightPress = false
    }
    if (e.keyCode === 37) {
        leftPress = false
    }
})
document.addEventListener('keydown', function(e) {
    if (e.keyCode === 38) {
        paddleY += paddleHeight
    }
    if (e.keyCode === 40) {
        paddleY -= paddleHeight
    }
    if (paddleY > 3 * paddleHeight) {
        paddleY = 3 * paddleHeight
    }
    if (paddleY < 0) {
        paddleY = 0
    }
})
for (c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}
//碰撞函数
function collisionDirection() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            b = bricks[c][r]
            if (b.status == 1) {
                if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
                    dy = -dy
                    b.status = 0
                    score++
                    ctx.beginPath()
                    ctx.clearRect(b.x, b.y, brickWidth, brickHeight)
                    ctx.rect(b.x, b.y, brickWidth, brickHeight)
                    ctx.fillStyle = 'red'
                    ctx.fill()
                    ctx.closePath()
                }
            }
        }
    }
}
//画砖块函数
function drawBricks() {
    for (c = 0; c < brickColumnCount; c++) {
        for (r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status == 1) {
                var bricksX = (c * (brickWidth + brickPadding)) + brickOffsetLeft
                var bricksY = (r * (brickHeight + brickPadding)) + brickOffsetTop
                bricks[c][r].x = bricksX
                bricks[c][r].y = bricksY
                ctx.beginPath()
                ctx.rect(bricksX, bricksY, brickWidth, brickHeight)
                ctx.fillStyle = "#0095DD"
                ctx.fill()
                ctx.closePath()
            }
        }
    }
}
//选择难度
var select = document.querySelector('#select')
var val
//form按钮事件绑定
var begin = document.querySelector('#begin')
var start = document.querySelector('#start')
var end = document.querySelector('#end')
begin.addEventListener('click', function(e) {
    e.preventDefault()
    itemStatus = true
    start.classList.add('hide')
    val = 10 / parseInt(select.options[select.selectedIndex].value) * 2
    setInterval(draw, val)
})
var stop = document.querySelector('#stop')
stop.addEventListener('click', function(e) {
    e.preventDefault()
    itemStatus = false
})
var reset = document.querySelector('#reset')
reset.addEventListener('click', function(e) {
    e.preventDefault()
    document.location.reload()
})
//画画总函数
function draw() {
    if (itemStatus) {
        ctx.clearRect(0, 0, canvas.width, canvas.height) //清理画板
        drawBoll() //执行画画
        drawPaddle() //执行球板
        collisionDirection()
        drawBricks()
        if (score === brickRowCount * brickColumnCount) {
            end.classList.remove('hide')
            itemStatus = false
        }
        //改变小球的位置
        x += dx
        y += dy
    }
}
