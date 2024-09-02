const dino = document.getElementById('dino');
const gameContainer = document.querySelector('.game-container');
let isJumping = false;
let tokenInterval;
let score = 0;

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
    token.style.left = `${Math.random() * (gameContainer.offsetWidth - 20)}px`;
    token.style.top = `${Math.random() * (gameContainer.offsetHeight - 200)}px`;
    gameContainer.appendChild(token);

    // Collision detection between dino and token
    const tokenInterval = setInterval(() => {
        if (checkCollision(dino, token)) {
            token.remove();
            score++;
            console.log('Tokens collected: ', score);
            clearInterval(tokenInterval);
        }
    }, 20);

    // Remove token after 10 seconds if not collected
    setTimeout(() => {
        token.remove();
        clearInterval(tokenInterval);
    }, 10000);
}

// Function to check collision between dino and token
function checkCollision(dino, token) {
    const dinoRect = dino.getBoundingClientRect();
    const tokenRect = token.getBoundingClientRect();

    return !(
        dinoRect.top > tokenRect.bottom ||
        dinoRect.bottom < tokenRect.top ||
        dinoRect.right < tokenRect.left ||
        dinoRect.left > tokenRect.right
    );
}

// Generate tokens at regular intervals
tokenInterval = setInterval(createToken, 2000);

// Event listener for jumping
document.addEventListener('keydown', event => {
    if (event.code === 'Space') {
        jump();
    }
});
