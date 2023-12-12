var isMouseDown = false; // Flag to track if the mouse button is pressed
var follow = false;
var holdingFlower = false;
var mouseX, mouseY;
var alignCheckInterval;
var collectedFlowers = 0;
var player = document.getElementById('player');
var totalFlowers = 10;



function createFlowers(numberOfFlowers) {
    var gameArea = document.getElementById('scene');
    for (var i = 0; i < numberOfFlowers; i++) {
        var flower = document.createElement('img');
        flower.src = 'Images/Rose.png';
        flower.classList.add('flower'); // Use this class for common styling
        flower.style.position = 'absolute';
        flower.style.left = Math.random() * gameArea.offsetWidth + 'px';
        flower.style.top = Math.random() * gameArea.offsetHeight + 'px';
        flower.dataset.collected = 'false'; // Data attribute to track if collected
        gameArea.appendChild(flower);
    }
}

createFlowers(totalFlowers); // Create 10 flowers, for example
//check to see if the player has picked up the flower every 100 ms
setInterval(checkOverlapAndPickup, 100); // Check every 100 milliseconds


// Function to move the player
function movePlayer(e) {
    player.style.left = e.clientX + 'px';
    player.style.top = e.clientY + 'px';

    // Get the player's current position
    var playerRect = player.getBoundingClientRect();

    // Check if the player is aligned with the mouse
    if (Math.abs(playerRect.left - e.clientX) < 10 && Math.abs(playerRect.top - e.clientY) < 10) {
        // If aligned, change to the smiling image
        player.src = 'Images/Bip_Yum_Smile.png';
    }

    if(holdingFlower){
        player.src = 'Images/Bip-Yum-Love.png';
    }
}


// Event listener for double-click
document.addEventListener('dblclick', function() {
    follow = !follow; // Toggle the following state

    if (follow) {
        // Start checking for alignment periodically
        alignCheckInterval = setInterval(checkAlignment, 10); // Check every 10ms
    } else {
        // Stop checking for alignment
        clearInterval(alignCheckInterval);
        player.src = 'Images/Bip-Yum.png'; // Set back to normal image
    }
    if(holdingFlower){
        holdingFlower = false;
        flower.style.left = parseInt(player.style.left, 10) + 64 + "px";
        flower.style.top = player.style.top;
    }
});

function checkAlignment() {
    var playerRect = player.getBoundingClientRect();
    var playerX = playerRect.left;
    var playerY = playerRect.top;

    // Assuming mouseX and mouseY are updated with the current mouse position
    if (Math.abs(playerX - mouseX) < 15 && Math.abs(playerY - mouseY) < 15) {
        player.src = 'Images/Bip_Yum_Smile.png';
    } else {
        player.src = 'Images/Bip-Yum.png';
    }
}

//this is used to see if slime can pickup the flower
function checkOverlapAndPickup() {
    var player = document.getElementById('player');
    //retrieve all the flowers that have not yet been collected
    var flowers = document.querySelectorAll('.flower:not([data-collected="true"])'); 

    var playerRect = player.getBoundingClientRect(); // Get the player's current position and size

    flowers.forEach(function(flower) {
        var flowerRect = flower.getBoundingClientRect(); // Get each flower's position and size

        // Check for overlap
        if (playerRect.left < flowerRect.right &&
            playerRect.right > flowerRect.left &&
            playerRect.top < flowerRect.bottom &&
            playerRect.bottom > flowerRect.top) {

            flower.dataset.collected = 'true';
            flower.style.display = 'none';
            collectedFlowers++;
            updateCollectedFlowersDisplay();
        }
    });
}

function updateCollectedFlowersDisplay(){
    //determine all the flowers that have been collected
    var progressbar = document.getElementById('flowerpile');
    var flowerTracker = document.createElement('img');
    flowerTracker.src = 'Images/Rose.png';
    flowerTracker.classList.add('flowerTracker'); 
    flowerTracker.style.width = '15px';
    progressbar.appendChild(flowerTracker);
    if(collectedFlowers == totalFlowers){
        var screen = document.getElementById('scene');
        player.src = 'Images/Bip-Yum-Love.png';
        var congratsMessage = document.createElement('p');
        congratsMessage.innerHTML = "YOU WIN!"
        congratsMessage.classList.add('WinMessage');
        screen.appendChild(congratsMessage)
    }
}



// Event listener for mousemove on the document
document.addEventListener('mousemove', function(e) {
    if (follow) {
        movePlayer(e);
    }
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Listen for mousedown event
document.addEventListener('mousedown', function(e) {
    isMouseDown = true;
    movePlayer(e);
});


// Listen for mousemove event
document.addEventListener('mousemove', function(e) {
    if (isMouseDown) {
        movePlayer(e);
    }
});

// Listen for mouseup event
document.addEventListener('mouseup', function() {
    isMouseDown = false;
});


