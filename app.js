
// Function to create empty 2d Array
function createEmptyMap(n) {
  var map = [];
  for (i = 0; i < n; i++) {
    var row = [];
    for (j = 0; j < n; j++) {
      row.push(null);
    }
    map.push(row);
  }
  return map;
}

// Function to draw the visual grid in the Html Canvasdraw Grid with m rows and n columns


//Function to draw Visual Grid in <canvas> 
// element according to map length
// REQUIRES global variable ctx and cellSize to be defined
function drawWorld(map, xDisplacement, yDisplacement) {
  for (row=0; row<map.length;row++) {
    for (col=0;col<map.length;col++) {
      let localX = cellSize * col + xDisplacement;
      let localY = cellSize * row + yDisplacement;
      ctx.strokeStyle = "white";
      ctx.strokeRect(localX, localY, cellSize, cellSize); 
    }
  }
}

//Helper function for black circle 
//with radius 2 at screen position x,y
function drawBlackCircle(x, y) {
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(x, y, 2, 0, 2 * Math.PI);
  ctx.fill();
}

//Helper function for drawing rover body
function drawRoverBody(rover) {
  var localX = rover.positionX * cellSize + xDisplacement + cellSize * 0.1;
  var localY = rover.positionY * cellSize + yDisplacement + cellSize * 0.1;
  var roverSize = cellSize * .8;
  ctx.fillStyle = 'black';       
  ctx.fillRect(localX, localY, roverSize, roverSize);
  ctx.fillStyle = rover.color;
  ctx.fillRect(localX, localY, roverSize*.98, roverSize*.98);
}

//Helper function for drawing Rover Direction Indicator
function drawRoverDirectionIndicator(rover) {
  var localX = rover.positionX * cellSize + xDisplacement + cellSize * 0.1;
  var localY = rover.positionY * cellSize + yDisplacement + cellSize * 0.1;
  var roverSize = cellSize * .8;
  switch (rover.direction) {
    case "N":
      drawBlackCircle(localX + roverSize / 2, localY + roverSize*0.15);
      break;
    case "E":
      drawBlackCircle(localX + roverSize*.85, localY + roverSize / 2);
      break;
    case "W":
      drawBlackCircle(localX + roverSize*0.15, localY + roverSize / 2);
      break;
    case "S":
      drawBlackCircle(localX + roverSize / 2, localY + roverSize*.85)
  }
}

//Removes Rover's Previous Position from Map and Grid
function eraseRover(rover) {
  let prevX = rover.travelLog[rover.travelLog.length-1][0]
  let prevY = rover.travelLog[rover.travelLog.length-1][1]
  mars[prevY][prevX] = null;
  let localX = prevX * cellSize + xDisplacement + cellSize * 0.1;
  let localY = prevY * cellSize + yDisplacement + cellSize * 0.1;
  let roverSize = cellSize * .8;
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(localX-1, localY-1, roverSize+2, roverSize+2);
}

//Add Rover's Current Position to Map and Grid
function drawRover(rover) {
  mars[rover.positionY][rover.positionX] = rover.nickname;    //logs position in 2d Array
  drawRoverBody(rover);
  drawRoverDirectionIndicator(rover);
}

function updateRoverPosition(rover) {
  eraseRover(rover);
  drawRover(rover);
  var coordinates = [rover.positionX, rover.positionY];
  rover.travelLog.push(coordinates);
}





//Displays Information about the Users Rover: Direction and Position
function updateControlPanel() {
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(5, canvas.height - (yDisplacement - 10), canvas.width - 10, yDisplacement - 30);
  ctx.textAlign = 'center';
  ctx.font = '28px Courier New';
  ctx.fillStyle = "white";
  ctx.fillText("Current Direction: " + rover.direction, canvas.width * .25, canvas.height - yDisplacement / 2);
  ctx.fillText("Current Position: " + rover.positionX + "," + rover.positionY, canvas.width * .75, canvas.height - yDisplacement / 2);
}

//Functions for the computer rovers:
// createComptRover to place a new rover on the map at random coordinates
// moveRoverRandom to move a computer rover, according to a predefined (random) logic
// moveAllComputers to iterate through list of computer rovers, moving them all

function createCompRover() {
  let directions = ["N","W","E","S"];
  let colors = ["orange", "#FFFF00","#98FB98", "#BA55D3",]
  var newRover = {direction: "N", positionX: 0, positionY: 0, travelLog: [], nickname: "", color: "red"};
  newRover.direction = directions[Math.floor(Math.random() * 4)];
  while (true) {
    newRover.positionX = Math.floor(Math.random() * gridSize);
    newRover.positionY = Math.floor(Math.random() * gridSize);
    if (mars[newRover.positionY][newRover.positionX] == null) {
      break;
    }
  }
  newRover.travelLog.push([newRover.positionX,newRover.positionY]);
  newRover.nickname = "com_" + compRovers.length;
  newRover.color = colors[Math.floor(Math.random() * colors.length)];
  compRovers.push(newRover);      //Adds to list of all computer rovers
  drawRover(newRover);
}

function moveRoverRandom(rover) {
  var n = Math.random();
  if (n<0.20) { 
    turnRight(rover);   // 20% chance turning Right
  } else if (n<0.40){    // 20% chance turning Left
    turnLeft(rover);    // 60% moving forward
  } else {
    moveForward(rover);
  }
}


// Iterates through list of all computer rovers
function moveAllComputers() {
  for(i=0;i<compRovers.length;i++){     
    moveRoverRandom(compRovers[i]);
  }
}

//Functions for map obstacles: One for drawing a single obstacle,
//  a second for drawing n obstacles at random coordinates on the map

function drawObstacle(x,y) {
  var localX = x * cellSize + xDisplacement + cellSize * 0.1;
  var localY = y * cellSize + yDisplacement + cellSize * 0.1;
  var obstSize = cellSize * .80;
  ctx.fillStyle = "#663926";
  ctx.fillRect(localX, localY, obstSize, obstSize);
}

function addObstacles(n, map) {
  for (i=0;i<n;i++) {
    while (true) {
      x = Math.floor(Math.random() * map.length);
      y = Math.floor(Math.random() * map.length);
      if (map[y][x] == null) {     //checks that the coordinate is free
        break;
      }
    }
    map[y][x] = "obs";
    drawObstacle(x,y);
  }
}

//Functions for rover movement:
// Left, Right, moveForward, moveBack

function turnLeft(rover) {
  console.log("turnLeft was called!");
  switch (rover.direction) {
    case "N":
      rover.direction = "W";
      break;
    case "W":
      rover.direction = "S";
      break;
    case "S":
      rover.direction = "E";
      break;
    case "E":
      rover.direction = "N";
      break;
  }
  updateControlPanel();
  drawRover(rover);
}

function turnRight(rover) {
  console.log("turnRight was called!");
  switch (rover.direction) {
    case "N":
      rover.direction = "E";
      break;
    case "W":
      rover.direction = "N";
      break;
    case "S":
      rover.direction = "W";
      break;
    case "E":
      rover.direction = "S";
      break;
  }
  updateControlPanel();
  drawRover(rover);
}

function moveForward(rover) {
  console.log("moveForward was called");
  switch (rover.direction) {
    case "N":
      if (rover.positionY - 1 >= 0 && mars[rover.positionY - 1][rover.positionX] == null) {
        rover.positionY -= 1;
      } else {
        console.log("Path obstructed! Command ignored.");
        return;
      }
      break;
    case "W":
      if (rover.positionX - 1 >= 0 && mars[rover.positionY][rover.positionX - 1] == null) {
        rover.positionX -= 1;
      } else {
        console.log("Path obstructed! Command ignored.");
        return;
      }
      break;
    case "S":
      if (rover.positionY + 1 < gridSize && mars[rover.positionY+1][rover.positionX] == null) {
        rover.positionY += 1;
      } else {
        console.log("Path obstructed! Command ignored.");
        return;
      }
      break;
    case "E":
      if (rover.positionX + 1 < gridSize && mars[rover.positionY][rover.positionX + 1] == null) {
        rover.positionX += 1;
      } else {
        console.log("Path obstructed! Command ignored.");
        return;
      }
      break;
  }
  updateRoverPosition(rover);
  updateControlPanel();
}



function moveBackward(rover) {
  console.log("moveBackward was called");
  switch (rover.direction) {
    case "N":
      if (rover.positionY + 1 < gridSize && mars[rover.positionY + 1][rover.positionX] == null) {
        rover.positionY += 1;
      } else {
        console.log("Move out of bounds! Command ignored.");
        return;
      }
      break;
    case "W":
      if (rover.positionX + 1 < gridSize && mars[rover.positionY][rover.positionX + 1] == null) {
        rover.positionX += 1;
      } else {
        console.log("Move out of bounds! Command ignored.");
        return;
      }
      break;
    case "S":
      if (rover.positionY - 1 >= 0 && mars[rover.positionY - 1][rover.positionX] == null) {
        rover.positionY -= 1;
      } else {
        console.log("Move out of bounds! Command ignored.");
        return;
      }
      break;
    case "E":
      if (rover.positionX - 1 >= 0 && mars[rover.positionY][rover.positionX - 1] == null) {
        rover.positionX -= 1;
      } else {
        console.log("Move out of bounds! Command ignored.");
        return;
      }
      break;
  }
  updateRoverPosition(rover);
  updateControlPanel();
}

// Executes several commands in sequence on a rover 
// only available in Console
function commands(rover, commands) {
  for (i = 0; i < commands.length; i++) {
    switch (commands[i]) {
      case "f":
        moveForward(rover);
        break;
      case "b":
        moveBackward(rover);
        break;
      case "l":
        turnLeft(rover);
        break;
      case "r":
        turnRight(rover);
        break;
      default:
        break;
    }
  }
}

//binds keydown event with rover action
function keyboardAction(e) {
  var button = document.querySelector('input[data-key="' + e.keyCode + '"]');
  if (!button) return;
  button.classList.add('pressed');
  if (e.keyCode == 82) {
    turnRight(rover);
  } else if (e.keyCode == 76) {
    turnLeft(rover);
  } else if (e.keyCode == 70) {
    moveForward(rover);
  } else if (e.keyCode == 66) {
    moveBackward(rover);
  } else if (e.keyCode == 78) {
    createCompRover();
  } 
}


//Removes Transition effect for buttons
function removeTransition(e) {
  if (e.propertyName !== "transform") return;
  this.classList.remove('pressed');
}


//Cache a reference to the html <canvas> element 
var canvas = document.querySelector("#mars");

// Set the drawing surfance dimensions to match the canvas
canvas.width = canvas.scrollWidth;
canvas.height = canvas.scrollHeight;

// Get a reference to the 2d drawing context / api
var ctx = canvas.getContext('2d');


// Establish global settings
var gridSize = 12;
var xDisplacement = 75;
var yDisplacement = 75;
var cellSize = (canvas.width - 2 * xDisplacement) / gridSize;
var backgroundColor = "#E27B58";  // Terracotta


//Set up the canvas Title and Empty Grid
ctx.fillStyle = backgroundColor;
ctx.fillRect(0,0,canvas.width, canvas.height);
ctx.fillStyle = "white";
ctx.font = '40px Courier New';
ctx.textAlign = 'center';
ctx.fillText("'Mars'", canvas.width / 2, 10 + yDisplacement / 2);
//drawGrid(gridSize, gridSize, xDisplacement, yDisplacement);

var mars = createEmptyMap(gridSize);    //Creates empty data map of the world mars (2d 
drawWorld(mars, xDisplacement, yDisplacement);

//Defines parameters of the user's Rover and places on map
var rover = { direction: "N", positionX: 0, positionY: 0, travelLog: [[0, 0]], nickname: "rov", color: "red"}
drawRover(rover);

var compRovers = [];             //List of all computer Rovers

//Places rover and obstacles on the map & Displays initial position and direction

addObstacles(18, mars);
updateControlPanel();


//Event listeners so controlling rover and adding new rovers is possible
const buttons = document.querySelectorAll('.button');
buttons.forEach(button => button.addEventListener('transitionend', removeTransition));
window.addEventListener('keydown', keyboardAction);   
setInterval(moveAllComputers,0750);