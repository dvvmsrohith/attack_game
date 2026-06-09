const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width=800;
canvas.height=1000;

// Buttons
const playBtn = document.getElementById("playBtn");
const restartBtn = document.getElementById("restartBtn");

// Loading screen
const loadingScreen =
document.getElementById("loadingScreen");

// Game state
let gameStarted = false;
let gameOver = false;

canvas.addEventListener("click", function(e) {

  if (!cardFigure || !cardFigure.showGun) {
    return;
  }

  shoot(
    cardFigure,
    e.offsetX,
    e.offsetY
  );
});


// Selected figure number

let cardFigure  = null;
// Flip animation
let flipAngle = 0;
let flipping = false;
let pageTurn=0;

// bullet 
let bullets = [];


//stick figures_A
const figures_A= [
  { x: 700, y: 100, number: 1 },
  { x: 700, y: 240, number: 3 },
  { x: 700, y: 400, number: 5 },
  { x: 700, y: 565, number: 7 },
  { x: 700, y: 725, number: 9 }
];

// Stick figures_B
const figures_B= [
  { x: 100, y: 100, number: 0 },
  { x: 100, y: 240, number: 2 },
  { x: 100, y: 400, number: 4 },
  { x: 100, y: 565, number: 6 },
  { x: 100, y: 725, number: 8 }
];
 
//comdine both arrays
const figures = [...figures_A,...figures_B];
 
playBtn.addEventListener("click", function () {

  // Show loading screen
  loadingScreen.style.display = "flex";

  // Wait for animation
  setTimeout(function () {

    // Hide loading
    loadingScreen.style.display = "none";

    // START GAME
    gameStarted = true;

    // Hide play button
    playBtn.style.display = "none";

    // Start animation loop
    addRandomPart();

  }, 4000);

});
 
restartBtn.addEventListener("click", function() {

  if(!gameStarted) {

    gameStarted = true;
    cardVisible = false;
  }
  // Reset figures
  figures.forEach(f => {
    f.showBody = false;
    f.showLeftArm = false;
    f.showRightArm = false;
    f.showLeftLeg = false;
    f.showRightLeg = false;

    f.showGun = false;
    f.showShield = false;

    f.health = 100;
    f.shieldHealth = 0;

    // gun magazine
    f.magazine = 0;
    f.maxMagazine = 2;

    // IMPORTANT
    f.magazineLevel = 0;
  });

  
  // Reset bullets
  bullets = [];

  // Reset selections
  cardFigure = null;
  cardFigureNumber = "";

  // Reset options
  waitingForChoice = false;
  option1 = "";
  option2 = "";

  // Reset turns
  currentTurn = "B";

  // Restart game
  gameOver = false;
  gameStarted = true;

  addRandomPart();
});

// Body parts
figures.forEach(f => {
  f.showBody = false;
  f.showLeftArm = false;
  f.showRightArm = false;
  f.showLeftLeg = false;
  f.showRightLeg = false;
  f.showGun = false;
  f.showShield = false;
  f.health = 100
  f.shieldHealth = 0;
  //gun magazine
  f.magazine = 0 ;
  f.maxMagazine = 2;

});

function drawStickFigure(f) {

  if(f.health <=0) return

  let x = f.x;
  let y = f.y;

  ctx.lineWidth = 3;

  // Health text
  ctx.font = "17px Arial";
  ctx.fillStyle = "green";
  ctx.fillText("HP: " + f.health, x - 40, y -30);
  
  // Figure number
  ctx.font = "20px Arial";
  ctx.fillStyle = "black";
  ctx.fillText(f.number, x - 70, y);
   

  // Head
  ctx.beginPath();
  ctx.arc(x, y, 20, 0, Math.PI * 2);
  ctx.stroke();

  // Body
  if (f.showBody) {
    ctx.beginPath();
    ctx.moveTo(x, y + 20);
    ctx.lineTo(x, y + 80);
    ctx.stroke();
  }

  // Left Arm
  if (f.showLeftArm) {
    ctx.beginPath();
    ctx.moveTo(x, y + 40);
    ctx.lineTo(x - 30, y + 60);
    ctx.stroke();
  }

  // Right Arm
  if (f.showRightArm) {
    ctx.beginPath();
    ctx.moveTo(x, y + 40);
    ctx.lineTo(x + 30, y + 60);
    ctx.stroke();
  }

  // Left Leg
  if (f.showLeftLeg) {
    ctx.beginPath();
    ctx.moveTo(x, y + 80);
    ctx.lineTo(x - 25, y + 120);
    ctx.stroke();
  }

  // Right Leg
  if (f.showRightLeg) {
    ctx.beginPath();
    ctx.moveTo(x, y + 80);
    ctx.lineTo(x + 25, y + 120);
    ctx.stroke();
  }
    // Gun
  if (f.showGun) {

   ctx.beginPath();

   // gun handle
   ctx.moveTo(x + 30, y + 60);
   ctx.lineTo(x + 50, y + 60);

   // gun barrel
   ctx.lineTo(x + 60, y + 50);
   ctx.stroke();
   }

   // Shield
  if (f.showShield) {

   ctx.beginPath();

   ctx.arc(x - 45, y + 60, 15, 0, Math.PI * 2);

   ctx.stroke();
  }
  // Shield HP
  if(f.showShield) {

   ctx.font = "14px Arial";
   ctx.fillStyle = "blue";

   ctx.fillText(
    "Shield: " + f.shieldHealth,
    x - 40,
    y - 50
   );
  }
  // Ammo text
  if(f.showGun) {

   ctx.font = "14px Arial";
   ctx.fillStyle = "brown";

   ctx.fillText(
     "Ammo: " + f.magazine,
     x - 30,
     y - 65
   );
  }
}
// ---------------- PAGE TURN ----------------
function drawPageTurnAnimation() {

  if (!flipping) return;

  pageTurn += 0.08;

  ctx.fillStyle = "rgba(142, 54, 54, 0.9)";

  ctx.beginPath();

  ctx.moveTo(canvas.width / 2, 0);

  ctx.quadraticCurveTo(
    canvas.width / 2 - 300 * Math.sin(pageTurn),
    canvas.height / 2,
    canvas.width / 2,
    canvas.height
  );

  ctx.fill();

  ctx.fillStyle = "rgba(185, 15, 15, 0.2)";

  ctx.beginPath();

  ctx.moveTo(canvas.width / 2, 0);

  ctx.quadraticCurveTo(
    canvas.width / 2 + 300 * Math.sin(pageTurn),
    canvas.height / 2,
    canvas.width / 2,
    canvas.height
  );

  ctx.fill();

  if (pageTurn >= Math.PI) {

    flipping = false;
  }
}


// ---------------- SELECTED FIGURE CARD ----------------
let waitingForChoice = false;

let option1 = "";
let option2 = "";

let currentTurn = "B";

let cardVisible = false;
function drawSelectedFigureCard() {
  if (!cardVisible) return;
  if (!cardFigure) return;
  
  if (cardFigure.health <= 0) return;

  let fullBodyComplete =
    cardFigure.showBody &&
    cardFigure.showLeftArm &&
    cardFigure.showRightArm &&
    cardFigure.showLeftLeg &&
    cardFigure.showRightLeg;
  if(fullBodyComplete){

    // Options
    if (cardFigure.showGun) {

     option1 = "Press S for Shield";
     option2 = "Press M for Magazine";

    } else {

     option1 = "Press G for Gun";
     option2 = "Press S for Shield";
   }
  }

  // White Box
  ctx.fillStyle = "white";
  ctx.fillRect(250, 280, 300, 220);

  // Border
  ctx.strokeStyle = "black";
  ctx.lineWidth = 3;
  ctx.strokeRect(250, 280, 300, 220);

  // Title
  ctx.fillStyle = "blue";
  ctx.font = "40px Arial";
  ctx.textAlign = "center";

  ctx.fillText(
    "Selected figure: " + cardFigure.number,
    400,
    340
  );

  // Options inside box
  ctx.fillStyle = "black";
  ctx.font = "28px Arial";

  ctx.fillText(option1, 400, 400);
  ctx.fillText(option2, 400, 440);

  ctx.textAlign = "start";
}

//gun 
function shoot(fromFigure, targetX, targetY) {

  // ONLY ONE BULLET
  if(bullets.length >= 2) {
    return;
  }
  // dead figure cannot shoot
  if(fromFigure.health <= 0) {
  return;
  }
  if (fromFigure.magazine <=0){
    return;
  }

  let startX = fromFigure.x;
  let startY = fromFigure.y + 55;

  let dx = targetX - startX;
  let dy = targetY - startY;

  let length = Math.sqrt(dx * dx + dy * dy);

  //reduce ammo
  fromFigure.magazine --;


  bullets.push({
    x: startX,
    y: startY,

    dx: dx / length,
    dy: dy / length,

    speed: 8,
    owner : fromFigure
  });
}


function moveBullet() {

  for(let i = bullets.length - 1; i >= 0; i--) {

    let b = bullets[i];

    // Move bullet
    b.x += b.dx * b.speed;
    b.y += b.dy * b.speed;

    // Enemy team
    let enemies =
      figures_A.includes(b.owner)
      ? figures_B
      : figures_A;

    let bulletRemoved = false;

    // Check enemies
    for(let j = 0; j < enemies.length; j++) {

      let enemy = enemies[j];

      // Skip dead enemy
      if(enemy.health <= 0) continue;

      let targetX = enemy.x;
      let targetY = enemy.y + 50;

      // shield position
      if(enemy.showShield) {
        targetX = enemy.x - 45;
        targetY = enemy.y + 60;
      }

      let dx = b.x - targetX;
      let dy = b.y - targetY;

      let distance = Math.sqrt(dx * dx + dy * dy);

      // Bullet hit
      if(distance < 15) {

        // shield protection 
        if(enemy.showShield) {
           
          enemy.shieldHealth -= 25;

          //remove shield when broken
          if (enemy.shieldHealth <= 0){

             enemy.showShield = false;
             enemy.shieldHealth = 0;
          }
        }else {

          //normal damsge
          enemy.health -= 25;

        }


        // Health minimum = 0
        enemy.health = Math.max(enemy.health, 0);

        // If enemy dies, select next figure automatically
        if(enemy.health === 0) {

          checkGameOver();
          if(!gameOver){
          
          addRandomPart();
          }
        }

        // REMOVE bullet immediately
        bullets.splice(i, 1);

        bulletRemoved = true;

        // STOP attacking other enemies
        break;
      }
    }

    // IMPORTANT
    // If bullet already removed,
    // skip remaining code
    if(bulletRemoved) {
      continue;
    }

    // Remove outside screen
    if (
      b.x < 0 ||
      b.x > canvas.width ||
      b.y < 0 ||
      b.y > canvas.height
    ) {

      bullets.splice(i, 1);
    }
  }
}
function update() {
  
  // CLEAR FIRST
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPageTurnAnimation();

  drawSelectedFigureCard();
  
  
  // player_A
  ctx.font = "35px Arial";
  ctx.fillStyle = "blue";
  ctx.fillText("player_A", 600, 50);

  // player_B
  ctx.font = "30px Arial";
  ctx.fillStyle = "blue";
  ctx.fillText("player_B", 100, 50);
  
  if(!cardFigure && gameStarted) {

  ctx.font = "40px Arial";
  ctx.fillStyle = "purple";

  ctx.fillText("PRESS SPACE FOR NEXT TURN",180,300);
  }
  

  // Draw figures
  figures.forEach(f => {
    drawStickFigure(f);
  });

  // Draw bullets
  bullets.forEach(b => {

    ctx.beginPath();

    ctx.arc(b.x, b.y, 5, 0, Math.PI * 2);

    ctx.fillStyle = "black";

    ctx.fill();
  });
}
function checkGameOver() {

  let aliveA =
    figures_A.filter(f => f.health > 0);

  let aliveB =
    figures_B.filter(f => f.health > 0);

  // Player B wins  
  if(aliveA.length === 0) {

    gameOver = true;

    ctx.font = "50px Arial";
    ctx.fillStyle = "red";

    ctx.fillText("PLAYER_B WINS!",220,450);
  }

  // Player A wins
  if(aliveB.length === 0) {

    gameOver = true;

    ctx.font = "50px Arial";
    ctx.fillStyle = "red";

    ctx.fillText("PLAYER_A WINS!",220,450);
  }
}


// Random body part
function addRandomPart() {

  // DO NOT change figure while choosing option
  if(waitingForChoice) {
    return;
  }

  let team;

  // Decide team
  if(currentTurn === "B") {

    team = figures_B;
    currentTurn = "A";

  } else {

    team = figures_A;
    currentTurn = "B";
  }

  let aliveFigures =
    team.filter(f => f.health > 0);

  if(aliveFigures.length === 0) {
    return;
  }

  let randomFigure =
    aliveFigures[
      Math.floor(Math.random() * aliveFigures.length)
    ];

    let cardFigureNumber = "";
  // SET selected figure ONLY ONCE
  cardFigure = randomFigure;

  cardFigureNumber = randomFigure.number;

  pageTurn = 0;
  flipping = true;

  // Add body parts
  if (!randomFigure.showBody) {

    randomFigure.showBody = true;

  } else if (!randomFigure.showLeftArm) {

    randomFigure.showLeftArm = true;

  } else if (!randomFigure.showRightArm) {

    randomFigure.showRightArm = true;

  } else if (!randomFigure.showLeftLeg) {

    randomFigure.showLeftLeg = true;

  } else if (!randomFigure.showRightLeg) {

    randomFigure.showRightLeg = true;

  }
  // check if full body is comlpete
  let fullBodyComplete =
     randomFigure.showBody &&
     randomFigure.showLeftArm &&
     randomFigure.showRightArm &&
     randomFigure.showLeftLeg &&
     randomFigure.showRightLeg;

     // White box always visible
     cardVisible = true;

     // Options only after full body
    if(fullBodyComplete) {

      waitingForChoice = true;

    } else {

      waitingForChoice = false;

      option1 = "";
      option2 = "";
    }
}




function gameLoop() {

  if(gameStarted && !gameOver) {

    moveBullet();

    update();

    checkGameOver();
  }

  requestAnimationFrame(gameLoop);
}

gameLoop();
// SPACE key
document.addEventListener("keydown", function(e){

  // SPACE -> add random part
  if(e.code === "Space" && gameStarted && !gameOver) {

    //turnFinished = false;
    waitingForChoice = false;
    

    addRandomPart();
  }

  
// G key
if(e.code === "KeyG" && gameStarted && !gameOver) {

  if(cardFigure && waitingForChoice) {

    if(!cardFigure.showGun) {

      cardFigure.showGun = true;

      cardFigure.magazine = 0;

      waitingForChoice = false;

      

      cardVisible = false;
    }
  }
}

// S key
if(e.code === "KeyS" && gameStarted && !gameOver) {

  if(cardFigure && waitingForChoice) {

    cardFigure.showShield = true;

    cardFigure.shieldHealth += 50;

    waitingForChoice = false;

    

    cardVisible = false;
  }
}
// M key
if(e.code === "KeyM" && gameStarted && !gameOver) {

  if(cardFigure && waitingForChoice) {

    if(cardFigure.showGun) {

      // add 2 bullets every time
      cardFigure.magazine += 2;

      waitingForChoice = false;

      cardVisible = false;
    }
  }
}
});