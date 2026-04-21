const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ⭐ Emily position (CENTER OF CANVAS)
const emily = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 40
};

let enemies = [];
let score = 0;
let health = 3;
let gameOver = false;

function startGame() {
  canvas.addEventListener("click", shootEnemy);
  setInterval(spawnEnemy, 1000);
  requestAnimationFrame(gameLoop);
}

function spawnEnemy() {
  if (gameOver) return;

  const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

  enemies.push({
    x: Math.random() * canvas.width,
    y: 0,
    size: type.size,
    speed: type.speed,
    color: type.color,
    points: type.points
  });
}

function shootEnemy(event) {
  if (gameOver) return;

  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  enemies = enemies.filter(enemy => {
    const dist = Math.hypot(enemy.x - mouseX, enemy.y - mouseY);
    if (dist < enemy.size) {
      score += enemy.points;
      return false;
    }
    return true;
  });
}
function updateEnemies() {
  enemies.forEach(enemy => {
    enemy.y += enemy.speed;

    // 💥 COLLISION WITH EMILY
    const dist = Math.hypot(enemy.x - emily.x, enemy.y - emily.y);

    if (dist < enemy.size + emily.size) {
      health--;
      enemy.y = canvas.height + 100; // remove enemy
    }

    // Optional: still damage if they reach bottom
    if (enemy.y > canvas.height) {
      health--;
      enemy.y = canvas.height + 100;
    }
  });

  enemies = enemies.filter(enemy => enemy.y < canvas.height);

  if (health <= 0) {
    gameOver = true;
  }
}

function drawEnemies() {
  enemies.forEach(enemy => {
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.size, 0, Math.PI * 2);
    ctx.fillStyle = enemy.color;
    ctx.fill();
  });
}

function drawUI() {
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";

  ctx.fillText("Score: " + score, 10, 30);
  ctx.fillText("Health: " + health, 10, 60);
}

function drawGameOver() {
  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.fillText("GAME OVER", canvas.width / 2 - 120, canvas.height / 2);

  ctx.font = "20px Arial";
  ctx.fillText("Click to Play Again", canvas.width / 2 - 100, canvas.height / 2 + 40);
}
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updateEnemies();   // movement + collision
  drawEnemies();     // enemies
  drawUI();          // score + health

  // ⭐ draw Emily LAST or middle
  ctx.fillStyle = "pink";
  ctx.beginPath();
  ctx.arc(emily.x, emily.y, emily.size, 0, Math.PI * 2);
  ctx.fill();

  if (gameOver) {
    drawGameOver();
  } else {
    requestAnimationFrame(gameLoop);
  }
}


window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  emily.x = canvas.width / 2;
  emily.y = canvas.height / 2;
});

// Restart game on click after game over
canvas.addEventListener("click", function () {
  if (gameOver) {
    enemies = [];
    score = 0;
    health = 3;
    gameOver = false;
    requestAnimationFrame(gameLoop);
  }
});

window.addEventListener("DOMContentLoaded", startGame);