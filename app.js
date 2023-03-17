const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const unit = 20;
const row = canvas.height / unit;
const column = canvas.width / unit;

let snake = [];
function makeSnake() {
  snake[0] = {
    x: 80,
    y: 0,
  };
  snake[1] = {
    x: 60,
    y: 0,
  };
  snake[2] = {
    x: 40,
    y: 0,
  };
  snake[3] = {
    x: 20,
    y: 0,
  };
}

class Fruit {
  constructor() {
    this.x = Math.floor(Math.random() * column) * unit;
    this.y = Math.floor(Math.random() * row) * unit;
  }

  drawFruit() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, unit, unit);
  }

  pickALocation() {
    let overLapping = false;
    let new_x;
    let new_y;

    function checkOverLapping(new_x, new_y) {
      for (let i = 0; i < snake.length; i++) {
        if (new_x == snake[i].x && new_y == snake[i].y) {
          overLapping = true;
          return;
        } else {
          overLapping = false;
        }
      }
    }

    do {
      new_x = Math.floor(Math.random() * column) * unit;
      new_y = Math.floor(Math.random() * row) * unit;
      checkOverLapping(new_x, new_y);
    } while (overLapping);

    this.x = new_x;
    this.y = new_y;
  }
}

makeSnake();
let myFruit = new Fruit();
let d = "Right";
window.addEventListener("keydown", changeDirection);
function changeDirection(event) {
  if ((event.keyCode == 87 || event.keyCode == 38) && d != "Down") {
    d = "Up";
  } else if ((event.keyCode == 65 || event.keyCode == 37) && d != "Right") {
    d = "Left";
  } else if ((event.keyCode == 83 || event.keyCode == 40) && d != "Up") {
    d = "Down";
  } else if ((event.keyCode == 68 || event.keyCode == 39) && d != "Left") {
    d = "Right";
  }

  window.removeEventListener("keydown", changeDirection);
}

//初始化分數
let score = 0;
document.getElementById("myScore").innerHTML = "遊戲分數：" + score;

//尋找最高分
let highestScore;
if (localStorage.getItem("highestScore") == null) {
  highestScore = 0;
} else {
  highestScore = Number(localStorage.getItem("highestScore"));
}
document.getElementById("myScore2").innerHTML = "最高分：" + highestScore;

function checkHighestScore(score) {
  if (score > highestScore) {
    localStorage.setItem("highestScore", score);
    highestScore = score;
    document.getElementById("myScore2").innerHTML = "最高分：" + highestScore;
  }
}

function draw() {
  //判斷蛇是否咬到自己
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      clearInterval(mygame);
      alert("Game Over");
      return;
    }
  }

  //覆蓋黑色背景
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  //製作水果
  myFruit.drawFruit();

  //設定填色風格，判斷蛇頭是否超出範圍，繪製蛇
  for (let i = 0; i < snake.length; i++) {
    if (i == 0) {
      ctx.fillStyle = "lightblue";
    } else {
      ctx.fillStyle = "lightgreen";
    }
    ctx.strokeStyle = "white";

    if (snake[i].x >= canvas.width) {
      snake[i].x = 0;
    } else if (snake[i].x < 0) {
      snake[i].x = canvas.width;
    } else if (snake[i].y >= canvas.height) {
      snake[i].y = 0;
    } else if (snake[i].y < 0) {
      snake[i].y = canvas.height;
    }

    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
  }

  //設定新蛇頭位置
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (d == "Right") {
    snakeX += unit;
  } else if (d == "Left") {
    snakeX -= unit;
  } else if (d == "Up") {
    snakeY -= unit;
  } else if (d == "Down") {
    snakeY += unit;
  }

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  //判斷是否吃到果實，將新蛇頭加入陣列並決定是否拉長身體，改變分數
  snake.unshift(newHead);

  if (snakeX == myFruit.x && snakeY == myFruit.y) {
    myFruit.pickALocation();
    score++;
    checkHighestScore(score);
  } else {
    snake.pop();
  }

  window.addEventListener("keydown", changeDirection);
  document.getElementById("myScore").innerHTML = "遊戲分數：" + score;
}

let mygame = setInterval(draw, 100);
