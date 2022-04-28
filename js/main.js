let seconds = document.querySelector(".counter span");
let tries = document.querySelector(".tries span");
let theName = document.querySelector(".name span");
// Select The Start Game Button
document.querySelector(".control-buttons span").onclick = function () {
  // Prompt Window To Ask For Name
  let yourName = prompt("Enter Your Name?");

  if (yourName.length > 20) {
    yourName = yourName.slice(0, 20);
  }

  // If Name Is Empty
  if (yourName == null || yourName == "") {
    // Set Name To Unknown
    document.querySelector(".name span").innerHTML = "Unknown";

    // Name Is Not Empty
  } else {
    // Set Name To Your Name
    document.querySelector(".name span").innerHTML = yourName;
  }

  // Remove Splash Screen
  document.querySelector(".control-buttons").remove();
  document.getElementById("back").play();

  let count = setInterval(() => {
    document.querySelector(".counter span").innerHTML++;
    if (counter == blocks.length) {
      document.querySelector(".counter span").innerHTML--;
      clearInterval(count);
    }
  }, 1000);
};

// Effect Duration
let duration = 1000;

// Select Blocks Container
let blocksContainer = document.querySelector(".memory-game-blocks");

// Create Array From Game Blocks
let blocks = Array.from(blocksContainer.children);

// Create Range Of Keys
// let orderRange = [...Array(blocks.length).keys()];

let orderRange = Array.from(Array(blocks.length).keys());

shuffle(orderRange);

// Add Order Css Property To Game Blocks
blocks.forEach((block, index) => {
  // Add CSS Order Property
  block.style.order = orderRange[index];

  // Add Click Event
  block.addEventListener("click", function () {
    // Trigger The Flip Block Function
    flipBlock(block);
  });
});

// Flip Block Function
function flipBlock(selectedBlock) {
  // Add Class is-flipped
  selectedBlock.classList.add("is-flipped");

  // Collect All Flipped Cards
  let allFlippedBlocks = blocks.filter((flippedBlock) =>
    flippedBlock.classList.contains("is-flipped")
  );

  // If Theres Two Selected Blocks
  if (allFlippedBlocks.length === 2) {
    // console.log('Two Flipped Blocks Selected');

    // Stop Clicking Function
    stopClicking();

    // Check Matched Block Function
    checkMatchedBlocks(allFlippedBlocks[0], allFlippedBlocks[1]);
  }
}

// Stop Clicking Function
function stopClicking() {
  // Add Class No Clicking on Main Container
  blocksContainer.classList.add("no-clicking");

  // Wait Duration
  setTimeout(() => {
    // Remove Class No Clicking After The Duration
    blocksContainer.classList.remove("no-clicking");
  }, duration);
}

let counter = 0;
// Check Matched Block
function checkMatchedBlocks(firstBlock, secondBlock) {
  let triesElement = document.querySelector(".tries span");

  if (firstBlock.dataset.image === secondBlock.dataset.image) {
    firstBlock.classList.remove("is-flipped");
    secondBlock.classList.remove("is-flipped");

    firstBlock.classList.add("has-match");
    secondBlock.classList.add("has-match");

    counter += 2;
    if (counter == blocks.length) {
      addTaskToArray(theName.innerHTML, seconds.innerHTML, tries.innerHTML);
      addDataToLocalStorage(arrayOfElements);

      document.getElementById("bravo").play();
      setTimeout(() => {
        Win();
      }, 3000);
      restartButton();
    } else {
      document.getElementById("success").play();
    }
  } else {
    triesElement.innerHTML = parseInt(triesElement.innerHTML) + 1;

    setTimeout(() => {
      firstBlock.classList.remove("is-flipped");
      secondBlock.classList.remove("is-flipped");
    }, duration);

    document.getElementById("fail").play();
  }
}

// Shuffle Function
function shuffle(array) {
  // Settings Vars
  let current = array.length,
    temp,
    random;

  while (current > 0) {
    // Get Random Number
    random = Math.floor(Math.random() * current);

    // Decrease Length By One
    current--;

    // [1] Save Current Element in Stash
    temp = array[current];

    // [2] Current Element = Random Element
    array[current] = array[random];

    // [3] Random Element = Get Element From Stash
    array[random] = temp;
  }

  return array;
}

function Win() {
  blocksContainer.remove();
  document.querySelector(".info-container").style.display = "none";

  document.querySelector(".win").style.display = "block";
  document.querySelector(".details-container").style.display = "block";
  document.querySelector(".reset").style.display = "block";

  document.querySelector(".win .time").innerHTML =
  document.querySelector(".counter span").innerHTML;

}

document.querySelector(".reset").onclick = function() {
  window.localStorage.clear();
  console.log(document.querySelector(".details-container").children);
  document.querySelector(".details-container").remove();
  document.querySelector(".reset").style.display = "none";
}

function restartButton() {
  setTimeout(() => {
    let rButton = document.createElement("div");
    rButton.appendChild(document.createTextNode("Restart"));
    rButton.style.cssText = `width: fit-content; padding: 20px 40px; margin: 50px auto; user-select: none;
        background-color: #2196f3; font-size: 30px; font-weight: bold; border-radius: 6px; cursor: pointer;`;
    rButton.style.color = "white";
    document.body.appendChild(rButton);
    rButton.onclick = function () {
      location.reload();
    };
    document.querySelector("#back").remove();
  }, 5000);
}

let arrayOfElements = [];
// Check if Theres Tasks In Local Storage
if (localStorage.getItem("Data")) {
  arrayOfElements = JSON.parse(localStorage.getItem("Data"));
}

function addTaskToArray(theName, seconds, tries) {
  const data = {
    name: theName,
    time: `${seconds}s`,
    tries: tries,
    id: Date.now(),
  };

  arrayOfElements.push(data);
  addElementsToPageFrom(arrayOfElements);
}

function addDataToLocalStorage(array) {
  window.localStorage.setItem("Data", JSON.stringify(array));
}

function getDataFromLocalStorage() {
  let data = window.localStorage.getItem("Data");

  if (data) {
    let tasks = JSON.parse(data);
    addElementsToPageFrom(tasks);
  }
}

let infoDiv = document.querySelector(".info");

function addElementsToPageFrom(arrayOfTasks) {
  infoDiv.innerHTML = "";
  // Looping On Array Of Tasks
  arrayOfTasks.forEach((task) => {
    // Create Main Div
    let div = document.createElement("div");
    div.className = "task";
    div.setAttribute("data-id", task.id);
    let nameSpan = document.createElement("span");
    nameSpan.className = "name";
    nameSpan.appendChild(document.createTextNode(task.name));
    div.appendChild(nameSpan);
    let timeSpan = document.createElement("span");
    timeSpan.className = "name";
    timeSpan.appendChild(document.createTextNode(task.time));
    div.appendChild(timeSpan);
    div.appendChild(document.createTextNode(task.tries));
    // Add Task Div To Tasks Container
    infoDiv.appendChild(div);
  });
}

getDataFromLocalStorage();
