# Canoe Rampage (v3) – MVP Demo Documentation

## Description:

The Canoe Rampage MVP demo is a simplified version of an extensible two-word canoe mobile game where the player navigates a canoe downstream, earning points by avoiding collisions with rocks. The primary goal is to create a basic and engaging experience that focuses on the core gameplay mechanics. Additional feature for end build would aims to enable players to control the game using voice commands through voice recognition technology.

## Relevant Project Links:

[Deployment Link](https://neuvancouvercs7580.github.io/Sprint-3/)

[Wireframe](https://drive.google.com/file/d/1Nzswc2aT1KRZgVgZ5TesrwcTiMKDVJk-/view?usp=drive_link)

[Play video demo](https://drive.google.com/file/d/1T8bndG2ym6VpvjMHl4QVfiJkqg4b37J0/view?usp=drive_link)

[UI Test video demo](https://drive.google.com/file/d/1FLYzkKxQoFuQiIgVyFncV92GAFRuf1Q7/view?usp=drive_link)

## Purpose of the Game:

To serve as an aid for teaching language, especially for reclamation of endangered languages.

## Key Features:

1. Current Game UI:

- River: the game is set in a river environment with a canoe placed at the bottom-center of the screen.
- Obstacles: scattered rocks.
- Motion: vertical scrolling effect as rocks move towards the canoe and against the blue background simulating a downstream motion.
- Elapsed Time: onscreen display of how long a player has been in the game.

2. Current Player Controls:

- A/D Keyboard Control: Current base controls are the A/D keys on a keyboard which would move the canoe Left/Right
- End Game Button: Ends the game.
- Restart Game Button: Restarts the game.

3. Current Notification:

- On Collision: game ends once a player collides with a rock.

## Design

- Canoe
- River background as canvas
- Left and right controls
- Rockes/obstacles which should be avoided. If player hits a rock, game ends.
- Pause/Resume - toggle keys for pausing and resuming the game

## MVP Demo Flow:

1. Start Screen:

- The game launches straight with the player needing to navigate the canoe away from the rocks.

2. Gameplay:

- The player starts with the canoe positioned at the bottom-centre of the screen.
- Rocks begin to appear, and the player steers left or right using the A/D keys on the keyboard to avoid collisions.
- Time elapsed during play is displayed at the top left-hand corner of the screen.

3. End Game:

- The game ends when the canoe collides with a rock.
- The total time spent playing is displayed on screen.
- A restart button for replaying the game can be activated.

## Sprint-3 Upgrades:

- Splash Screen: added a splash screen with a start game button
- Exensibility: rock, canoe and environment are extensible
- Pause/Resume Button on Canvas: so game can be paused or resumed.
- Features Removed: End Game button and Restart Button
- Left Button: moves the canoe left
- Right Button: moves the canoe right
- Overlay on canvas: introduced overlay on canvas for messaging and control
- Collision Detection: new collision triggers notification
- Notification: Notification display on overlay
- Notification Button - Replay: restarts a new game instance
- Notification Button - End Game: Ends the game.
- Extensibility: game UI extensibility for canoe, rock and background.

# Backlogs:

## Codebase

- Modularize codebase: ensure single responsibility per module.

## Sound

- Sound: add soundtrack for rock collision
- Sound: add speaker toggle control for all sounds
- Sound: add soundtrack for game play
- Sound: add soundtrack for game intro
- Sound: add soundtrack for rock collision

## Controls

- Left Control Button: add to move canoe left with a button.
- Right Control Button: add to move canoe right with a button.

## Testing

- UX Testing: video
- UI Testing: video
- Code Testing: Unit Tests - for config file, etc.
- Extensibility Test: test if game is fully extensible.

## Documentation:

- Comments on codebase: add comments to codebase
- User/Player documentation: add instructions on how to play the game and change configuration
- Investor documentation: describe the business features of the game
- Design documentation: describe the design design - code, layout and features.

## Features

- Score Board: upgrade the scoreboard.
- Score Tracking: track and store player scores.
- Leaderboard: add a high-score leaderboard for competitiveness.

## Configuration file

- Downriver Speed
- Jump speed for left and right buttons
- Collision detection overlap gap

## Voice Recognition

- Microphone: add toggle microphone for voice inputs

## Layout

- Position Game Elapsed Timer, Pause/Resume Button, and Game Score, on the gameHeader.
- Provide a link to the configuration file display panel.
  - Include configuration for canvas size, show/hide details, etc.

## Bugs fixes
