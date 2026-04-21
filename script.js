const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

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

    // If enemy reaches bottom → lose health
    if (enemy.y > canvas.height) {
      health--;
      enemy.y = canvas.height + 100; // remove it
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

  updateEnemies();
  drawEnemies();
  drawUI();

  if (gameOver) {
    drawGameOver();
  } else {
    requestAnimationFrame(gameLoop);
  }
}

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