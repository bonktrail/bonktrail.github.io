const dino = document.getElementById('dino');
const gameContainer = document.querySelector('.game-container');
const scoreboard = document.getElementById('scoreboard');
const timerDisplay = document.getElementById('timer');
let isJumping = false;
let score = 0;
let time = 0;
let isInvincible = false;
let gameInterval;
let obstacleInterval;
let timerInterval;
let powerupInterval;

// Add ground element to the game
const ground = document.createElement('div');
ground.classList.add('ground');
gameContainer.appendChild(ground);

// Function to make the dino jump
function jump() {
    if (isJumping) return;
    isJumping = true;
    let upInterval = setInterval(() => {
        if (dino.offsetTop <= 150) {
            clearInterval(upInterval);
            let downInterval = setInterval(() => {
                if (dino.offsetTop >= gameContainer.offsetHeight - dino.offsetHeight) {
                    clearInterval(downInterval);
                    isJumping = false;
                } else {
                    dino.style.top = dino.offsetTop + 5 + 'px';
                }
            }, 20);
        } else {
            dino.style.top = dino.offsetTop - 5 + 'px';
        }
    }, 20);
}

// Function to create tokens at random positions
function createToken() {
    const token = document.createElement('div');
    token.classList.add('token');
    token.style.left = `${gameContainer.offsetWidth}px`;  // Start off-screen on the right
    token.style.top = `${Math.random() * (gameContainer.offsetHeight - 200)}px`;
    gameContainer.appendChild(token);

    // Move the token to the left to simulate the scrolling effect
    let tokenMoveInterval = setInterval(() => {
        token.style.left = `${token.offsetLeft - 5}px`;

        if (checkCollision(dino, token)) {
            token.remove();
            score++;
            updateScore();
            clearInterval(tokenMoveInterval);
        }

        // Remove token if it goes off-screen
        if (token.offsetLeft + token.offsetWidth < 0) {
            token.remove();
            clearInterval(tokenMoveInterval);
        }
    }, 20);
}

// Function to create obstacles at random intervals
function createObstacle() {
    const obstacle = document.createElement('div');
    const obstacleType = Math.floor(Math.random() * 3) + 1;
    obstacle.classList.add('obstacle', `obstacle-${obstacleType}`);
    obstacle.style.left = `${gameContainer.offsetWidth}px`;  // Start off-screen on the right
    gameContainer.appendChild(obstacle);

    // Move the obstacle to the left to simulate the scrolling effect
    let obstacleMoveInterval = setInterval(() => {
        obstacle.style.left = `${obstacle.offsetLeft - 5}px`;

        if (!isInvincible && checkCollision(dino, obstacle)) {
            endGame();
            clearInterval(obstacleMoveInterval);
        }

        // Remove obstacle if it goes off-screen
        if (obstacle.offsetLeft + obstacle.offsetWidth < 0) {
            obstacle.remove();
            clearInterval(obstacleMoveInterval);
        }
    }, 20);
}

// Function to create power-ups at random intervals
function createPowerUp() {
    const powerup = document.createElement('div');
    powerup.classList.add('powerup');
    powerup.style.left = `${gameContainer.offsetWidth}px`;  // Start off-screen on the right
    powerup.style.top = `${Math.random() * (gameContainer.offsetHeight - 200)}px`;
    gameContainer.appendChild(powerup);

    // Move the power-up to the left to simulate the scrolling effect
    let powerupMoveInterval = setInterval(() => {
        powerup.style.left = `${powerup.offsetLeft - 5}px`;

        if (checkCollision(dino, powerup)) {
            powerup.remove();
            activatePowerUp();
            clearInterval(powerupMoveInterval);
        }

        // Remove power-up if it goes off-screen
        if (powerup.offsetLeft + powerup.offsetWidth < 0) {
            powerup.remove();
            clearInterval(powerupMoveInterval);
        }
    }, 20);
}

// Function to activate the power-up
function activatePowerUp() {
    isInvincible = true;
    dino.style.backgroundColor = '#ffeb3b';  // Change dino color to indicate invincibility

    setTimeout(() => {
        isInvincible = false;
        dino.style.backgroundColor = '#333';  // Revert dino color back to normal
    }, 20000);  // 20 seconds of invincibility
}

// Function to update the scoreboard
function updateScore() {
    scoreboard.textContent = `Score: ${score}`;
}

// Function to update the timer
function updateTimer() {
    time++;
    timerDisplay.textContent = `Time: ${time}s`;
}

// Function to check collision between dino and another object (token, obstacle, or power-up)
function checkCollision(dino, object) {
    const dinoRect = dino.getBoundingClientRect();
    const objectRect = object.getBoundingClientRect();

    return !(
        dinoRect.top > objectRect.bottom ||
        dinoRect.bottom < objectRect.top ||
        dinoRect.right < objectRect.left ||
        dinoRect.left > objectRect.right
    );
}

// Function to end the game
function endGame() {
    clearInterval(gameInterval);
    clearInterval(obstacleInterval);
    clearInterval(timerInterval);
    clearInterval(powerupInterval);
    alert(`Game Over! Your final score is ${score} and you survived for ${time} seconds.`);
    location.reload();  // Reload the game
}

// Generate tokens, obstacles, and power-ups at regular intervals
gameInterval = setInterval(createToken, 2000);
obstacleInterval = setInterval(createObstacle, 3000);
powerupInterval = setInterval(createPowerUp, 10000);  // Power-up appears every 10 seconds
timerInterval = setInterval(updateTimer, 1000);  // Update timer every second

// Event listener for jumping
document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        jump();
    }
});