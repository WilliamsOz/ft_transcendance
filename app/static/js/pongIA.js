const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

const paddleHeight = 66;
const paddleWidth = 6;
let paddle1Y = (canvas.height - paddleHeight) / 2;
let paddle2Y = (canvas.height - paddleHeight) / 2;
let player1UpPressed = false;
let player1DownPressed = false;
let scorePlayerOne = 0;
let scorePlayerTwo = 0;
let gameStarted = false;
let gamePaused = false;
const iaSpeed = 5;
const iaUpdateInterval = 1000; // Mise à jour toutes les secondes

function drawStartText() {
    document.addEventListener("keydown", function(event) {
        if (event.key === " " && !gameStarted) {
            gameStarted = true;
            gameLoop();
        }
    });

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!gamePaused) {
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "20px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Appuyer sur espace pour jouer", canvas.width / 2, canvas.height / 2);
    }

    setTimeout(function() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setTimeout(drawStartText, 500);
    }, 500);
}

function setUpDataForGame() {
    gameStarted = false;
    gamePaused = false;
    scorePlayerOne = 0;
    scorePlayerTwo = 0;
    ballSpeedX = 5;
    ballSpeedY = 5;
    paddle1Y = (canvas.height - paddleHeight) / 2;
    paddle2Y = (canvas.height - paddleHeight) / 2;
}

function updateIaPaddle() {
    if (ballX > canvas.width / 2) {
        const targetY = ballY - paddleHeight / 2;

        if (Math.random() < 0.95) { // 85% chance to move correctly
            if (targetY < paddle2Y) {
                paddle2Y -= iaSpeed;
            } else if (targetY > paddle2Y) {
                paddle2Y += iaSpeed;
            }
        } else { // 15% chance to move incorrectly
            if (targetY < paddle2Y) {
                paddle2Y += iaSpeed;
            } else if (targetY > paddle2Y) {
                paddle2Y -= iaSpeed;
            }
        }
    }

    paddle2Y = Math.max(15, Math.min(canvas.height - paddleHeight - 15, paddle2Y));
}

function displayGame() {
    setUpDataForGame();
    canvas.style.display = "block";
    drawStartText();
}

function drawScores() {
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + scorePlayerOne, 42, canvas.height - 20);
    ctx.fillText("Score: " + scorePlayerTwo, canvas.width - 42, canvas.height - 20);
}

function drawBall() {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(ballX - 5, ballY - 5, 10, 10);
}

function drawPaddles() {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);
}

function drawDottedLine() {
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(canvas.width / 2, 15);
    ctx.lineTo(canvas.width / 2, canvas.height - 15);
    ctx.strokeStyle = "#FFFFFF";
    ctx.stroke();
    ctx.closePath();
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 5, canvas.width, 5);
    ctx.fillRect(0, canvas.height - 11, canvas.width, 5);
    drawDottedLine();
    drawBall();
    drawPaddles();
    drawScores();
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX;
}

function ballCollision() {
    if (ballX - 10 < 0) {
        scorePlayerTwo++;
        resetBall();
    }
    if (ballX + 10 > canvas.width) {
        scorePlayerOne++;
        resetBall();
    }
}

function paddleCollision() {
    if (ballX - 10 <= paddleWidth && ballY >= paddle1Y && ballY <= paddle1Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        ballX = paddleWidth + 10; // Eviter de rester coincé dans la raquette
    }
    if (ballX + 10 >= canvas.width - paddleWidth && ballY >= paddle2Y && ballY <= paddle2Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
        ballX = canvas.width - paddleWidth - 10; // Eviter de rester coincé dans la raquette
    }
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(event) {
    if (event.key === "e") {
        player1UpPressed = true;
    } else if (event.key === "d") {
        player1DownPressed = true;
    }
}

function keyUpHandler(event) {
    if (event.key === "e") {
        player1UpPressed = false;
    } else if (event.key === "d") {
        player1DownPressed = false;
    }
}

function updatePaddles() {
    if (player1UpPressed && paddle1Y > 15) {
        paddle1Y -= 7;
    } else if (player1DownPressed && paddle1Y + paddleHeight < canvas.height - 15) {
        paddle1Y += 7;
    }
    // Update IA paddle position
    updateIaPaddle();
}

document.addEventListener("keydown", function(event) {
    if (event.key === "p") {
        gamePaused = !gamePaused;
    }
});

function whoWinTheGame() {
    if (scorePlayerOne > scorePlayerTwo)
        return document.querySelector('.FightFont:nth-child(1)').textContent;
    else
        return document.querySelector('.FightFont:nth-child(3)').textContent;
}

function endGame() {
    gameStarted = false;
    canvas.style.display = "none";
    const winner = whoWinTheGame();
    const gameOverMessage = document.getElementById("gameOverMessage");
    gameOverMessage.textContent = "Partie terminée, vainqueur : " + winner;
    gameOverMessage.style.display = "block";
}

function gameLoop() {
    if (!gamePaused && gameStarted) {
        ballX += ballSpeedX;
        ballY += ballSpeedY;

        if (ballY - 10 < 10 || ballY + 10 > canvas.height - 15) {
            ballSpeedY = -ballSpeedY;
        }

        ballCollision();
        paddleCollision();
        updatePaddles();
        draw();

        if (scorePlayerOne === 10 || scorePlayerTwo === 10) {
            endGame();
        }
    }

    requestAnimationFrame(gameLoop);
}

document.addEventListener("DOMContentLoaded", () => {
    setUpDataForGame();
    displayGame();
});
