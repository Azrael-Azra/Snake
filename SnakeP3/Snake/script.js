const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const difficultySelect = document.querySelector("#difficulty-select");

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = [];
let velocityX = 0, velocityY = 0;
let setIntervalId;
let score = 0;
let difficulty = difficultySelect.value; // Get the selected difficulty

// Get the high score for each difficulty level
let highScoreEasy = localStorage.getItem("high-score-easy") || 0;
let highScoreMedium = localStorage.getItem("high-score-medium") || 0;
let highScoreHard = localStorage.getItem("high-score-hard") || 0;

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const handleGameOver = () => {
    clearInterval(setIntervalId);
    alert("Game Over! Press OK to replay...");
    location.reload();
}

const changeDirection = (e) => {
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    }
    else if (e.key ==="ArrowDown" && velocityY != -1){
        velocityX = 0;
        velocityY = 1;
    }
    else if (e.key ==="ArrowLeft" && velocityX != 1){
        velocityX = -1;
        velocityY = 0;
    }
    else if (e.key ==="ArrowRight" && velocityX  != -1){
        velocityX = 1;
        velocityY = 0;
    }
}

const initGame = () => {
   if (gameOver) return handleGameOver();

    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
   
    if(snakeX === foodX && snakeY === foodY)
    {
        changeFoodPosition();
        snakeBody.push([foodX,foodY]);
        score++;

        // Update the high score for each difficulty level
        if (difficulty === 'easy') {
            highScoreEasy = highScoreEasy > score ? highScoreEasy : score;
            localStorage.setItem("high-score-easy", highScoreEasy);
            highScoreElement.innerText         } else if (difficulty === 'medium') {
                highScoreMedium = highScoreMedium > score ? highScoreMedium : score;
                localStorage.setItem("high-score-medium", highScoreMedium);
                highScoreElement.innerText = `High Score: ${highScoreMedium}`;
            } else if (difficulty === 'hard') {
                highScoreHard = highScoreHard > score ? highScoreHard : score;
                localStorage.setItem("high-score-hard", highScoreHard);
                highScoreElement.innerText = `High Score: ${highScoreHard}`;
            }
    
            scoreElement.innerText = `Score: ${score}`;
        }
    
        for (let i = snakeBody.length -1; i > 0; i--)
        {
            snakeBody[i] = snakeBody[i - 1];
        }
        snakeBody [0] = [snakeX,snakeY];
    
        snakeX += velocityX;
        snakeY += velocityY;
    
        if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30 )
        {
            gameOver = true;
        }
    
        for (let i = 0; i < snakeBody.length; i++)
            {
                htmlMarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
                if( i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]){
                    gameOver = true;
                }
            }
    
        playBoard.innerHTML = htmlMarkup;
    }
    
    // Adjust game speed and food spawn rate based on difficulty
    switch (difficulty) {
        case 'easy':
            setIntervalId = setInterval(initGame, 150); // Slower game speed
            highScoreElement.innerText = `High Score: ${highScoreEasy}`;
            break;
        case 'medium':
            setIntervalId = setInterval(initGame, 100); // Medium game speed
            highScoreElement.innerText = `High Score: ${highScoreMedium}`;
            break;
        case 'hard':
            setIntervalId = setInterval(initGame, 50); // Faster game speed
            highScoreElement.innerText = `High Score: ${highScoreHard}`;
            break;
    }
    
    changeFoodPosition();
    document.addEventListener("keydown", changeDirection);
    
    // Update difficulty when the select option changes
    difficultySelect.addEventListener("change", () => {
        clearInterval(setIntervalId);
        difficulty = difficultySelect.value;
        switch (difficulty) {
            case 'easy':
                setIntervalId = setInterval(initGame, 150); // Slower game speed
                highScoreElement.innerText = `High Score: ${highScoreEasy}`;
                break;
            case 'medium':
                setIntervalId = setInterval(initGame, 100); // Medium game speed
                highScoreElement.innerText = `High Score: ${highScoreMedium}`;
                break;
            case 'hard':
                setIntervalId = setInterval(initGame, 50); // Faster game speed
                highScoreElement.innerText = `High Score: ${highScoreHard}`;
                break;
        }
    });