// Get the canvas and its 2D rendering context
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// UI elements
const timeDisplay = document.getElementById("time");
const endGameBtn = document.getElementById("endGameBtn");
const gameOverScreen = document.getElementById("gameOverScreen");
const restartGameBtn = document.getElementById("restartGameBtn");
const splashScreen = document.getElementById("splashScreen");
const startButton = document.getElementById("startButton");
const gameScreen = document.getElementById("gameScreen");
const endGameMessage = document.getElementById("endGameMessage");
const replayButton = document.getElementById("replayButton");
const endGameFromMessageBtn = document.getElementById("endGameFromMessageBtn");
const pauseResumeButton = document.getElementById("pauseResumeButton");
const leftArrowButton = document.getElementById("leftArrowButton");
const rightArrowButton = document.getElementById("rightArrowButton");
const SPACE_BETWEEN_ARROWS = 2; // Adjust the space as needed

// Game state variables
let isGameRunning = false;
let isPaused = false;
let isLeftButtonPressed = false;
let isRightButtonPressed = false;

// Event listeners for the start button and pause/resume button
startButton.addEventListener("click", () => {
    splashScreen.style.display = "none";
    gameScreen.style.display = "block";
    isGameRunning = true; // set the game state to running.
    startGame();
});

pauseResumeButton.addEventListener("click", () => {
    isPaused = !isPaused;
    pauseResumeButton.textContent = isPaused ? "Resume Game" : "Pause Game";
});

// Set canvas dimensions based on window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - document.getElementById("gameHeader").offsetHeight;


// Function to return to the splash screen and reset the game
function returnToSplashScreen() {
    splashScreen.style.display = "block";
    canvas.style.display = "none";
    resetGame();
    pauseResumeButton.style.display = "none"; // Change - Hide pause/resume button on splash screen
    isGameRunning = false; // Ensure the game state is set to not running

    // Hide the gameHeader on the splash screen
    document.getElementById("gameHeader").style.display = "none";
}

// Initialize the canoe object with its properties
let canoe = {
    x: canvas.width / 2,
    y: canvas.height - 60,
    width: 100,
    height: 250,
    color: "blue",
    speed: 5,
    dx: 0,
    dy: 0,
    image: new Image(),
};

// Set the image source for the canoe
canoe.image.src = "./images/boat.png"; // Provide the path to your canoe image file

// Initialize arrays and intervals for rocks and game updates
let rocks = [];
let gameInterval;
let elapsedTime = 0;
let rockAdditionInterval;
let rockImg = new Image();
let collisionGap = 0.02;
rockImg.src = "./images/rock.png";

// Background image
let backgroundImage = new Image();
backgroundImage.src = "./images/river.jpg"; // Provide the path to your background image file

// Function to draw the background
function drawBackground() {
    if (backgroundImage.complete && backgroundImage.naturalHeight !== 0) {
        ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    } else {
        // Draw a default background if the image is not loaded
        ctx.fillStyle = "skyblue";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// Event listeners for arrow buttons and touch events
leftArrowButton.addEventListener("mousedown", () => {
    isLeftButtonPressed = true;
    startMovingLeft();
});

rightArrowButton.addEventListener("mousedown", () => {
    isRightButtonPressed = true;
    startMovingRight();
});

leftArrowButton.addEventListener("touchstart", (event) => {
    event.preventDefault(); // Prevent touch scrolling
    isLeftButtonPressed = true;
    startMovingLeft();
});

rightArrowButton.addEventListener("touchstart", (event) => {
    event.preventDefault(); // Prevent touch scrolling
    isRightButtonPressed = true;
    startMovingRight();
});

document.addEventListener("mouseup", stopMoving);
document.addEventListener("touchend", (event) => {
    event.preventDefault(); // Prevent touch scrolling
    stopMoving();
});

// Functions to handle movement
function startMovingLeft() {
    canoe.dx = -canoe.speed;
}

function startMovingRight() {
    canoe.dx = canoe.speed;
}

function stopMoving() {
    canoe.dx = 0;
    isLeftButtonPressed = false;
    isRightButtonPressed = false;
}

// Function to draw the canoe
function drawCanoe() {
    if (canoe.image.complete && canoe.image.naturalHeight !== 0) {
        ctx.drawImage(canoe.image, canoe.x - canoe.width / 2, canoe.y - canoe.height / 2, canoe.width, canoe.height);
    } else {
        ctx.beginPath();
        ctx.arc(canoe.x, canoe.y, canoe.width / 2, 0, Math.PI * 2);
        ctx.fillStyle = canoe.color;
        ctx.fill();
        ctx.closePath();
    }
}

// Function to add a new rock to the array
function addRock() {
    let maxWidth = canvas.width / 5;
    let minWidth = canvas.width / 20;
    let size = Math.random() * (maxWidth - minWidth) + minWidth;
    let rock = {
        x: Math.random() < 0.5 ? canoe.x - size / 2 : canoe.x + size / 2,
        y: -size,
        width: size,
        height: size,
        speed: Math.random() * (8 - 5) + 5,
    };
    rocks.push(rock);
}

// Function to draw rocks
function drawRocks() {
    rocks.forEach((rock) => {
        if (rockImg.complete && rockImg.naturalHeight !== 0) {
            ctx.drawImage(rockImg, rock.x, rock.y, rock.width, rock.height);
        } else {
            ctx.beginPath();
            ctx.rect(rock.x, rock.y, rock.width, rock.height);
            ctx.fillStyle = "black";
            ctx.fill();
            ctx.closePath();
        }
    });
}

// Function to update the position of rocks and check for collisions
function updateRocks() {
    rocks.forEach((rock) => {
        rock.y += rock.speed;
        if (collisionDetection(canoe, rock)) {
            endGame();
        }
    });
    rocks = rocks.filter((rock) => rock.y < canvas.height);
}

// Function for collision detection between a circle and a rectangle
function collisionDetection(circle, rect) {
    // Expand the rectangle by the collisionGap
    let expandedRect = {
        x: rect.x - collisionGap,
        y: rect.y - collisionGap,
        width: rect.width + 2 * collisionGap,
        height: rect.height + 2 * collisionGap,
    };

    // Simple AABB collision detection with the expanded rectangle
    if (
        circle.x + circle.width / 3 > expandedRect.x &&
        circle.x - circle.width / 3 < expandedRect.x + expandedRect.width &&
        circle.y + circle.height / 3 > expandedRect.y &&
        circle.y - circle.height / 3 < expandedRect.y + expandedRect.height
    ) {
        return true;
    }
    return false;
}

// Function to handle the end of the game
function endGame() {
    clearInterval(gameInterval);
    pauseResumeButton.style.display = "none"; // Hide pause/resume button during game over
    isGameRunning = false;

    // Draw a semi-transparent overlay
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const message = "Uh-oh! Game Lost. You've slammed into a colossal rock!";
    const buttonWidth = 150;
    const buttonHeight = 40;

    // Display game over message and buttons
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(message, canvas.width / 2 - 200, canvas.height / 2 - 40);

    ctx.fillStyle = "blue";
    ctx.fillRect(canvas.width / 2 - buttonWidth - 20, canvas.height / 2 + 20, buttonWidth, buttonHeight);
    ctx.fillRect(canvas.width / 2 + 20, canvas.height / 2 + 20, buttonWidth, buttonHeight);

    ctx.fillStyle = "white";
    ctx.fillText("Replay Game", canvas.width / 2 - buttonWidth - 10, canvas.height / 2 + 40);
    ctx.fillText("End Game", canvas.width / 2 + 30, canvas.height / 2 + 40);

    // Add event listeners for the replay and end game buttons
    canvas.addEventListener("click", handleButtonClick);
}

// Function to handle button clicks during game over
function handleButtonClick(event) {
    const buttonWidth = 150;
    const buttonHeight = 40;
    const replayButtonBounds = {
        left: canvas.width / 2 - buttonWidth - 20,
        top: canvas.height / 2 + 20,
        right: canvas.width / 2 - 20,
        bottom: canvas.height / 2 + 20 + buttonHeight,
    };
    const endGameButtonBounds = {
        left: canvas.width / 2 + 20,
        top: canvas.height / 2 + 20,
        right: canvas.width / 2 + 20 + buttonWidth,
        bottom: canvas.height / 2 + 20 + buttonHeight,
    };

    const clickX = event.clientX - canvas.getBoundingClientRect().left;
    const clickY = event.clientY - canvas.getBoundingClientRect().top;

    if (
        clickX >= replayButtonBounds.left &&
        clickX <= replayButtonBounds.right &&
        clickY >= replayButtonBounds.top &&
        clickY <= replayButtonBounds.bottom
    ) {
        resetGame();
    } else if (
        clickX >= endGameButtonBounds.left &&
        clickX <= endGameButtonBounds.right &&
        clickY >= endGameButtonBounds.top &&
        clickY <= endGameButtonBounds.bottom
    ) {
        // Implement logic to return to the splash screen or any desired action
        // For now, let's return to the splash screen
        splashScreen.style.display = "block";
        canvas.style.display = "none";
    }
    canvas.removeEventListener("click", handleButtonClick);
}

// Function to reset the game state
function resetGame() {
    rocks = [];
    canoe.x = canvas.width / 2;
    canoe.y = canvas.height - 60;
    canoe.dx = 0;
    canoe.dy = 0;
    elapsedTime = 0;
    pauseResumeButton.style.display = "block";
    gameOverScreen.classList.add("hidden");
    startGame();
}

// Function to update the game state
function updateGame() {
    if (isPaused) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    drawCanoe();
    drawRocks();
    updateRocks();
    canoe.x += canoe.dx;
    canoe.y += canoe.dy;

    // Ensure the canoe stays within the canvas boundaries
    if (canoe.x + canoe.width / 2 > canvas.width) {
        canoe.x = canvas.width - canoe.width / 2;
    } else if (canoe.x - canoe.width / 2 < 0) {
        canoe.x = canoe.width / 2;
    }
    if (canoe.y - canoe.height / 2 < 0) {
        canoe.y = canoe.height / 2;
    } else if (canoe.y + canoe.height / 2 > canvas.height) {
        canoe.y = canvas.height - canoe.height / 2;
    }

    displayTime();
}

// Function to display elapsed time
function displayTime() {
    elapsedTime += 1 / 60;
    let minutes = Math.floor(elapsedTime / 60);
    let seconds = Math.floor(elapsedTime % 60);
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    timeDisplay.textContent = `${minutes}:${seconds}`;
}

// Event listeners for keyboard input
document.addEventListener("keydown", function (event) {
    if (event.key === "a" || event.key === "A") {
        canoe.dx = -canoe.speed;
    } else if (event.key === "d" || event.key === "D") {
        canoe.dx = canoe.speed;
    } else if (event.key === "w" || event.key === "W") {
        canoe.dy = -canoe.speed;
    } else if (event.key === "s" || event.key === "S") {
        canoe.dy = canoe.speed;
    }
});

document.addEventListener("keyup", function (event) {
    if (
        event.key === "a" ||
        event.key === "A" ||
        event.key === "d" ||
        event.key === "D"
    ) {
        canoe.dx = 0;
    } else if (event.key === "w" || event.key === "W" || event.key === "s" || event.key === "S") {
        canoe.dy = 0;
    }
});

// Function to handle button release events
function onButtonRelease(event) {
    const releasedButton = determineReleasedButton(event);
    canoe.dx = 0;

    document.removeEventListener("mouseup", onButtonRelease);
    document.removeEventListener("touchend", onButtonRelease);
}

// Function to determine which arrow button was released
function determineReleasedButton(event) {
    const clickX = event.clientX || (event.touches && event.touches[0].clientX);
    const buttonLeft = leftArrowButton.offsetLeft;
    const buttonRight = rightArrowButton.offsetLeft + rightArrowButton.offsetWidth;

    return (clickX >= buttonLeft && clickX <= buttonRight)
        ? (clickX <= (buttonLeft + buttonRight) / 2 ? "left" : "right")
        : null;
}

// Function to resize the canvas and update canoe position
function resizeGame() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - document.getElementById("gameHeader").offsetHeight;

    // Update canoe position based on the space between arrow buttons
    canoe.x = canvas.width / 2;
    canoe.y = canvas.height - 60;

    // Calculate the center position for the arrow buttons
    const centerPosition = canvas.width / 2;

    // Set the left arrow button position
    leftArrowButton.style.left = centerPosition - leftArrowButton.offsetWidth / 2 + "px";
    leftArrowButton.style.bottom = "10px";

    // Set the right arrow button position
    rightArrowButton.style.left = centerPosition + leftArrowButton.offsetWidth / 2 + SPACE_BETWEEN_ARROWS + "px";
    rightArrowButton.style.bottom = "10px";
}

// Call resizeGame on window resize
window.addEventListener("resize", () => {
    resizeGame();
    startGame(); // Restart the game on resize
});

// Call resizeGame on window resize
window.addEventListener("resize", resizeGame);

// Function to start the game
function startGame() {
    if (gameInterval) clearInterval(gameInterval);
    if (rockAdditionInterval) clearInterval(rockAdditionInterval);

    gameInterval = setInterval(updateGame, 1000 / 60);
    rockAdditionInterval = setInterval(addRock, 2000);
}

// Start the game when the script is loaded
startGame();
