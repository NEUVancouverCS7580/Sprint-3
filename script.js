// Get the game canvas and its 2D rendering context
const canvas = document.getElementById("gameCanvas");

// Initializes the CanvasRenderingContext2D Interface. 
// Also 2D rendering context of HTML canvas.
const ctx = canvas.getContext("2d");

// Build UI components - reference to HTML element with their respective ids.
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


// Adjust space between control arrows for canoe movement.
const SPACE_BETWEEN_ARROWS = 2; 

// Configuration settings for the game
const config = {
    canoeImgSrc: "./images/boat.png", // Canoe image source
    rockImgSrc: "./images/rock.png",  // Rock image source    
    backgroundImgSrc: "./images/river.jpg", // 
    canoeSpeed: 5, // speed of the canoe movement
    rockSpeed: 3, // speed of the rocks falling
    riverMargin: 200, // margin for the river banks
    canoeWidthMin: 80,  // Canoe minimum width
    canoeWidthMax: 200, // Canoe maximum width
  };

// Set canvas dimensions based on window size.
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - document.getElementById("gameHeader").offsetHeight;


// Game state variables
let isGameRunning = false;
let isPaused = false;
let isLeftButtonPressed = false;
let isRightButtonPressed = false;

// Adds a click event listener to the start button on the splash screen.
startButton.addEventListener("click", () => {
    
    // Resets game running state to true.
    isGameRunning = true;

    // Hide the splash screen.
    splashScreen.style.display = "none";

    // Display the game screen.
    gameScreen.style.display = "block";
    if (!isGameRunning) {
        document.getElementById("gameHeader").style.display = "none";
    }
});

// Adds a click event listener to the pauseResumeButton
pauseResumeButton.addEventListener("click", () => {

    // Toggle the isPaused state (switch between true and false)
    isPaused = !isPaused;

    // Change the button text based on the current isPaused state
    pauseResumeButton.textContent = isPaused ? "Resume Game" : "Pause Game";
});


// Function to return to the splash screen and reset the game
function returnToSplashScreen() {
    splashScreen.style.display = "block";       // Display the splash screen.
    canvas.style.display = "none";             // Hide the canvas.
    resetGame();                              // Reset the game state.
    pauseResumeButton.style.display = "none"; // Hides the pause/resume button on the splash screen.
    isGameRunning = false; // Ensure the game state is set to not running.

    // Hide the gameHeader on the splash screen
    document.getElementById("gameHeader").style.display = "none";
}

// Create images object for the canoe and point to source.
let canoeImg = new Image();
canoeImg.src = config.canoeImgSrc;

// Create image for the rock and point to source.
let rockImg = new Image();
rockImg.src = config.rockImgSrc;

// Background image
let backgroundImg = new Image();
backgroundImg.src = config.backgroundImgSrc;; // Provide the path to your background image file


// Initializing canoe object.
let canoe = {
    x: canvas.width / 2,  //  Set canoe to horizontal center of the canvas (along x-axis).
    y: canvas.height - 30, // Set canoe to vertical distance specified.
    // Keeps canoe within specified range in config.
    width: Math.max(config.canoeWidthMin, Math.min(config.canoeWidthMax, canvas.width / 10)),
    color: "blue",  // Replaces canone image if image not present.
    speed: config.canoeSpeed, // initializes canoe speed to config specification. 
    dx: 0,  // keeps canoe from moving forward.
    dy: 0,  // Keeps canoe from moving backwards outside viewport.
};

// Set the image source for the canoe
// canoe.image.src = "./images/boat.png"; // Provide the path to your canoe image file

// Move to configFile.
// Initialize control variables and arrays for rocks and game state updates.
let rocks = []; // Stores rocks generated during game play.
let gameInterval; // // Decleared for clearing/resetting game loop
let elapsedTime = 0;  // Tracks time elapsed when playing the game.
let rockAdditionInterval; //  Decleared to manage interval of adding rock.
let collisionGap = 0.02;    // Initializes the collisionGap between canoe and rock.

// Draws the background.
function drawBackground() {

    // Checks if the background image has loaded and has a natural height.
    if (backgroundImg.complete && backgroundImg.naturalHeight !== 0) {

        // Draw the background image on the canvas.
        ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
    
    } else {

        // Draw a default background if the image is not loaded.
        ctx.fillStyle = "skyblue";

        // Draw a filled rectangle covering the entire canvas.
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
}

// Event listeners for arrow buttons and touch events.
leftArrowButton.addEventListener("mousedown", () => {
    // Set the state to indicate that the left arrow button is pressed.
    isLeftButtonPressed = true;
    startMovingLeft();     // Calls the function to start moving left.
});

rightArrowButton.addEventListener("mousedown", () => {
    // Set the state to indicate that the right arrow button is pressed.
    isRightButtonPressed = true;
    startMovingRight();    // Calls the function to start moving right.

});

leftArrowButton.addEventListener("touchstart", (event) => {
    // Prevent touch scrolling.
    event.preventDefault(); // Prevent touch scrolling.

    // Set the state to indicate that the left arrow button is pressed.
    isLeftButtonPressed = true;
    startMovingLeft();    // Calls the function to start moving left.
});

rightArrowButton.addEventListener("touchstart", (event) => {
    event.preventDefault(); // Prevent touch scrolling.

    // Set the state to indicate that the right arrow button is pressed.
    isRightButtonPressed = true;
    startMovingRight();     // Calls the function to start moving right.
});

document.addEventListener("mouseup", stopMoving);
document.addEventListener("touchend", (event) => {
    event.preventDefault(); // Prevent touch scrolling.
    stopMoving();    // Calls the function to stop moving.
});

// Handles canoe left movements.
function startMovingLeft() {
    canoe.dx = -canoe.speed;      // Set the horizontal speed of the canoe to the left.
}

// Handles canoe right movements.
function startMovingRight() {
    canoe.dx = canoe.speed;     // Set the horizontal speed of the canoe to the right.
}

// Stops canoe movement.
function stopMoving() {
    canoe.dx = 0;
    isLeftButtonPressed = false;
    isRightButtonPressed = false;
}

// Draws the canoe to the canvas.
function drawCanoe() {
    // Checks if the canoe image has loaded and has a natural height
    if (canoe.complete && canoe.naturalHeight !== 0) {

        // Draw the canoe image on the canvas with correct positioning and scaling
        ctx.drawImage(
            canoeImg,
            canoe.x - canoe.width,
            canoe.y - (canoe.width) * (canoeImg.height / canoeImg.width),
            canoe.width,
            canoe.width * (canoeImg.height / canoeImg.width)
        );
    }
    // Draws a default circular shape if the image is not loaded
    else {
        ctx.beginPath();      // Begin a new path for drawing

        // Draw a filled circle representing the canoe
        // ctx.rect(canoe.x - canoe.width / 2, canoe.y - canoe.height / 2, canoe.width, canoe.height);
        
        // ctx.arc(canoe.x, canoe.y, canoeImg.width / 2, 0, Math.PI * 2);
        // Set the fill style to the canoe's color
        ctx.fillStyle = canoe.color;

        // Fill the circle with the specified color
        ctx.fill();

        // Close the path
        ctx.closePath();
    }
}

// Adds a new rock to the array.
function addRock() {

    // Define the maximum and minimum width of the rock.
    let maxWidth = canvas.width / 5;
    let minWidth = canvas.width / 20;

    // Calculate a random size for the rock within the specified range.
    let size = Math.random() * (maxWidth - minWidth) + minWidth;

    // Create a new rock object with random attributes.
    let rock = {
        // Randomly position the rock to the left or right of the canoe.
        x: Math.random() < 0.5 ? canoe.x - size / 2 : canoe.x + size / 2,
        y: -size,   // Set the initial y-coordinate above the canvas
        width: size,    // Set the width of the rock
        height: size,   // Set the height of the rock
        speed: Math.random() * (8 - 5) + 5, // Set a random speed for the rock within the specified range
    };
    // Add the newly created rock object to the rocks array
    rocks.push(rock);
}

// Draw rock on the canvas.
function drawRocks() {
    // Loops through rocks (array) and draws a new rock.
    rocks.forEach((rock) => {
        // Check if the rock image is loaded and has a natural height.
        if (rockImg.complete && rockImg.naturalHeight !== 0) {
            // Draw the rock image with appropriate scaling.
            ctx.drawImage(rockImg, rock.x, rock.y, rock.width, rock.height);
        } else {
            // Draw a default rectangle if the rock image is not loaded.

            ctx.beginPath();    // Start a new path for the rock.
            ctx.rect(rock.x, rock.y, rock.width, rock.height);  // Draws a rectangle to overlay rock.
            ctx.fillStyle = "rgba(255, 255, 255, 0)";   // Set rectangle fill style to fully transparent.
            ctx.fill();     // Fill the rectangle with the transparent color.
            ctx.closePath();    // Closes the current path for the rock generated
        }
    });
}

// Function to update the position of rocks and check for collisions
function updateRocks() {
    // Iterate backward through the rocks array to safely remove rock elements gone past canvas height.
    for (let i = rocks.length - 1; i >= 0; i--) { 
      const rock = rocks[i];
  
      // Moves each rocks downwards based on the configured speed.
      // Move the rock downward based on the rock speed specified.
      rock.y += config.rockSpeed;
  
      // Check if the rock has moved past the canvas height.
      if (rock.y >= canvas.height) {
        // Remove the rock object from the array.
        rocks.splice(i, 1);
      } else if (rock.y + rock.height > canoe.y && !rock.passed) {
        
        // Check if the canoe passes the rock within a certain range and update the score.
        if (rock.x + rock.width / 3.5 > canoe.x - 7 * canoe.width && rock.x - rock.width / 3.5 < canoe.x + 7 * canoe.width) {
          rock.passed = true;
          //score++;
        }
      }
      
      // If collision is detected, end game.
      // Once collision occurs, remove rocks that collide with the canoe and end the game.
      if (collisionDetection(canoe, rock)) {
        rocks.splice(i, 1);
        endGame();
      }
    }
  }

// Creates collision boundary and detects collision between canoe and rock.
function collisionDetection(canoe, rock) {
    // Expand the rectangle by the collisionGap
    let expandedRect = {
        x: rock.x - collisionGap,
        y: rock.y - collisionGap,
        width: rock.width + 2 * collisionGap,
        height: rock.height + 2 * collisionGap,
    };

    // Simple AABB (Axis-Align Bounding Box) collision detection with expanded rectangle
    if (
        // Checks if right edge of the canoe touches left edge of the rock.
        canoe.x + canoeImg.width / 2 > expandedRect.x &&

        // Checks if left edge of the canoe touches right edge of the rock.
        canoe.x - canoeImg.width / 2 < expandedRect.x + expandedRect.width &&

        // Checks if bottm edge of the canoe touches the top edge of the rock.
        canoe.y + canoeImg.height / 2 > expandedRect.y &&

        // Checks if top edge of the canoe touches the bottom edge of the rock.
        canoe.y - canoeImg.height / 2 < expandedRect.y + expandedRect.height
    ) {
        // If collision is detected, end game and return true
        endGame();
        return true;
    }
    // If no collision, return false.
    return false;
}

// Handles many scenarios for the game to end. 
function endGame() {
    clearInterval(gameInterval);    // Stops the game loop.
    pauseResumeButton.style.display = "none"; // Hide pause/resume button during game over.
    isGameRunning = false;  // Set game state to not running.

    // Overlay addition - Draw a semi-transparent overlay.
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)"; // Specifies the level of transparency of the overlay.
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Makes overlay cover the entire canvas.

    // Game over message and button dimensions. 
    const message = "Uh-oh! Game Lost. You've slammed into a colossal rock!";  // Game over message on the overlay.
    const buttonWidth = 150;    //  The width of the buttons on the overlay.
    const buttonHeight = 40;    //  The height of the buttons on the overlay.

    // Display game over message and buttons
    ctx.fillStyle = "white";    // Sets previous fillStyle to white for subsequent drawings.
    ctx.font = "20px Arial";    // Sets the fonts for the game over message.
    ctx.fillText(message, canvas.width / 2 - 200, canvas.height / 2 - 40); // Draw the game over message.

    // Button drawing and placement of text on the overlay.
    ctx.fillStyle = "blue"; // Sets the fill color style for buttons.

    // Draws the Replay Game button.
    ctx.fillRect(canvas.width / 2 - buttonWidth - 20, canvas.height / 2 + 20, buttonWidth, buttonHeight);

    // Draws the End Game button.
    ctx.fillRect(canvas.width / 2 + 20, canvas.height / 2 + 20, buttonWidth, buttonHeight);

    // Resets the fill color style for texts on buttons.
    ctx.fillStyle = "white";

    // Draw the Replay Game text on the button.
    ctx.fillText("Replay Game", canvas.width / 2 - buttonWidth - 10, canvas.height / 2 + 40);

    // Draw the End Game text on the button.
    ctx.fillText("End Game", canvas.width / 2 + 30, canvas.height / 2 + 40);

    // Add event listeners for the Replay Game and End Game buttons.
    canvas.addEventListener("click", handleButtonClick);
}

// Handles button clicks during game over state.
function handleButtonClick(event) {
    // Define dimensions of the buttons.
    const buttonWidth = 150;
    const buttonHeight = 40;

    // Define bounding boxes for the "Replay Game" and "End Game" buttons.
    const replayButtonBounds = {
        left: canvas.width / 2 - buttonWidth - 20,  // Left boundary of the button. 
        top: canvas.height / 2 + 20,                // Top boundary of the button.
        right: canvas.width / 2 - 20,               // Right boundary of the button.
        bottom: canvas.height / 2 + 20 + buttonHeight,  // Bottom boundary of the button.
    };

    const endGameButtonBounds = {
        left: canvas.width / 2 + 20,     // Left boundary of the button.
        top: canvas.height / 2 + 20,    // Top boundary of the button.
        right: canvas.width / 2 + 20 + buttonWidth, // Right boundary of the button.
        bottom: canvas.height / 2 + 20 + buttonHeight,  // Bottom boundary of the button.
    };

    // Get the x and y coordinates of the click relative to the canvas.
    const clickX = event.clientX - canvas.getBoundingClientRect().left;
    const clickY = event.clientY - canvas.getBoundingClientRect().top;

    // Checks if the click is within the bounds of the "Replay Game" button.
    if (
        clickX >= replayButtonBounds.left &&
        clickX <= replayButtonBounds.right &&
        clickY >= replayButtonBounds.top &&
        clickY <= replayButtonBounds.bottom
    ) {
        // If clicked, reset the game
        resetGame();

    } else if (
        // Checks if the click is within the bounds of the "End Game" button.
        clickX >= endGameButtonBounds.left &&
        clickX <= endGameButtonBounds.right &&
        clickY >= endGameButtonBounds.top &&
        clickY <= endGameButtonBounds.bottom
    ) {
        // If clicked, reset and restart the game
        // resetAndRestartGame();}
        isGameRunning = false;
        
        returnToSplashScreen();
        
        // // Implements logic to return to the splash screen.
        // splashScreen.style.display = "block";   // Set the display style of the splash screen to "block" to make it visible.
        // canvas.style.display = "none";   // Set the display style of the game canvas to "none" to hide it.
    }

    // Remove the click event listener to prevent multiple clicks during animation
    canvas.removeEventListener("click", handleButtonClick);
}

// Reset the game state.
function resetGame() {
    rocks = []; // Clear the falling rocks array.
    canoe.x = canvas.width / 2;  // Reset the canoe's horizontal position to the center of the canvas.
    canoe.y = canvas.height - 90;   // Reset the canoe's vertical position near the bottom of the canvas.
    canoe.dx = 0;     // Reset the canoe's horizontal speed.
    canoe.dy = 0;     // Reset the canoe's vertical speed (assuming it has a vertical speed property).
    elapsedTime = 0;  // Reset the elapsed time.
    pauseResumeButton.style.display = "block";    // Make the pause/resume button visible.
    gameOverScreen.classList.add("hidden");  // Hide the game over screen.
    startGame();    // Restart the game.
}

// Updates the game state.
function updateGame() {
    if (isPaused) return;   // If the game is paused, exit the function to prevent further updates.
    ctx.clearRect(0, 0, canvas.width, canvas.height);   // Clear the entire canvas to prepare for redrawing.
    drawBackground();   // Draw the background (assuming there is a drawBackground function).
    drawCanoe();    // Draw the canoe on the canvas.
    drawRocks();    // Draw the falling rocks on the canvas.
    updateRocks();  // Update the positions of the falling rocks and handle collisions.
    
    canoe.x += canoe.dx;    // Update the horizontal position of the canoe based on its speed.
    canoe.y += canoe.dy;    // Update the vertical position of the canoe based on its speed.


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

    displayTime();  // Update and display the elapsed time
}

// Displays elapsed time
function displayTime() {
    elapsedTime += 1 / 60;  // Increment the elapsed time by 1/60 seconds (assuming a 60 FPS update rate).

    // Calculates the total minutes and seconds from the elapsed time.
    let hours = Math.floor(elapsedTime / 24);
    let minutes = Math.floor(elapsedTime / 60);
    let seconds = Math.floor(elapsedTime % 60);

    // Format minutes and seconds to have leading zeros if less than 10.
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    // Update the "timeDisplay" element with the formatted time, displaying MM:SS.
    timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

// Event listeners for keyboard input.
document.addEventListener("keydown", function (event) {
    // Check if the pressed key is 'A' or 'a' (left movement).
    if (event.key === "a" || event.key === "A") {
        canoe.dx = -canoe.speed;
    } 
    // Check if the pressed key is 'D' or 'd' (right movement).
    else if (event.key === "d" || event.key === "D") {
        canoe.dx = canoe.speed;
    }
    // Check if the pressed key is 'W' or 'w' (upward movement).
    else if (event.key === "w" || event.key === "W") {
        canoe.dy = -canoe.speed;
    }
    // Check if the pressed key is 'S' or 's' (downward movement).
    else if (event.key === "s" || event.key === "S") {
        canoe.dy = canoe.speed;     // Set canoe's vertical speed to its speed.
    }
});

// Event listener for keyboard keyup events.
document.addEventListener("keyup", function (event) {
    // Check if the released key is 'A', 'a', 'D', or 'd' (horizontal movement keys).
    if (
        event.key === "a" ||
        event.key === "A" ||
        event.key === "d" ||
        event.key === "D"
    ) {
        canoe.dx = 0;   // Set canoe's horizontal speed to 0 when the movement key is released.
    }
    // Check if the released key is 'W', 'w', 'S', or 's' (vertical movement keys).
    else if (event.key === "w" || event.key === "W" || event.key === "s" || event.key === "S") {
        canoe.dy = 0;     // Set canoe's vertical speed to 0 when the movement key is released.
    }
});

// Handles the release of a button (mouse or touch).
function onButtonRelease(event) {

    // Determines which button was released.
    const releasedButton = determineReleasedButton(event);
    canoe.dx = 0;   // Stop the canoe's horizontal movement.

    // Removes event listeners for mouseup and touchend to prevent multiple calls.
    document.removeEventListener("mouseup", onButtonRelease);
    document.removeEventListener("touchend", onButtonRelease);
}

// Determines which arrow button was released based on event coordinates.
function determineReleasedButton(event) {

    // Determine the X-coordinate of the click or touch.
    const clickX = event.clientX || (event.touches && event.touches[0].clientX);

    // Get the left and right boundaries of the arrow buttons.
    const buttonLeft = leftArrowButton.offsetLeft;
    const buttonRight = rightArrowButton.offsetLeft + rightArrowButton.offsetWidth;

    // Return "left" if the click is in the left arrow button, "right" if in the right arrow button, or null if outside.
    return (clickX >= buttonLeft && clickX <= buttonRight)
        ? (clickX <= (buttonLeft + buttonRight) / 2 ? "left" : "right")
        : null;
}

// Resizes the canvas and update canoe position.
function resizeGame() {
    // Set the canvas width to the window inner width.
    canvas.width = window.innerWidth;

    // Set the canvas height to the window inner height minus the height of the game header.
    canvas.height = window.innerHeight - document.getElementById("gameHeader").offsetHeight;

    // Update canoe position based on the space between arrow buttons.
    canoe.x = canvas.width / 2;
    canoe.y = canvas.height - 60;

    // Calculate the center position for the arrow buttons.
    const centerPosition = canvas.width / 2;

    // Set the left arrow button position.
    leftArrowButton.style.left = centerPosition - leftArrowButton.offsetWidth / 2 + "px";
    leftArrowButton.style.bottom = "10px";

    // Set the right arrow button position.
    rightArrowButton.style.left = centerPosition + leftArrowButton.offsetWidth / 2 + SPACE_BETWEEN_ARROWS + "px";
    rightArrowButton.style.bottom = "10px";
}

// Call resizeGame on window resize.
window.addEventListener("resize", () => {
    //s Call the resizeGame function to adjust the game layout based on the new window dimensions.
    resizeGame();

    // Restart the game by calling the startGame function on resize
    startGame();
});

// Add an event listener to the window's resize event
window.addEventListener("resize", resizeGame);

// Function to start the game
function startGame() {

    // Clear any existing game intervals to prevent multiple instances
    if (gameInterval) clearInterval(gameInterval);

    // Clear the rock addition interval if it exists.
    if (rockAdditionInterval) clearInterval(rockAdditionInterval);

    // Set up new intervals for game updates and rock additions.
    gameInterval = setInterval(updateGame, 1000 / 60);
    rockAdditionInterval = setInterval(addRock, 2000);
}

// Start the game when the script is loaded.
startGame();
