const gameState = {
  moveCount: 0,
  playerSymbol: "x",
  opponentSymbol: "o",
  offlineGame: true,
  gameIsInProgress: true,
  gameNumber: 0,

  resetGameState: function() {
    this.moveCount = 0;
    this.gameNumber += 1;
    this.gameIsInProgress = true;
  },
};


const victoryState = {
  counters: {
    cross: {},
    circle: {},
  },
  winningSequenceLength: 3,

  restoreInitialVictoryState: function() {
    this.counters.cross = {};
    this.counters.circle = {};
  },

};


const fieldState = {

  field: document.querySelector('#field'),
  freeTileIDs: [ "0, 0", "0, 1", "0, 2",
                "1, 0", "1, 1", "1, 2",
                "2, 0", "2, 1", "2, 2", ],
  gridSize: 3,

  setFreeTilesIDs: function() {
    this.freeTileIDs = [];
    for (let i = 0; i < this.gridSize ** 2; i++) {
      const tileID = `${Math.floor(i / this.gridSize)}, ${i % this.gridSize}`;
      this.freeTileIDs.push(tileID);
    }
  },

  clearField: function() {
    const tiles = this.field.children;
    for (let i = 0; i < tiles.length; i++) {
      if (tiles[i].lastChild) {
        tiles[i].lastChild.remove();
      }
    }
    this.setFreeTilesIDs();
  },

  changeFieldSize: function(size) {

    function createTile(tileID,fieldSideLength, fieldGapLength) {

      const tile = document.createElement("div");
      tile.classList.add("field__tile");
      tile.setAttribute("data-field-tile-id", tileID);

      const tileSideLength = (fieldSideLength - fieldGapLength * (this.gridSize - 1)) / (this.gridSize + 0.15);
      tile.style.height = tileSideLength + "%";
      tile.style.width = tileSideLength + "%";

      return tile;

    }

    this.gridSize = size;
    this.setFreeTilesIDs();

    const fieldSideLength = 100; // in percents
    const gap = (fieldSideLength * 0.064) / size; // this constant makes for good proportions on the field
    this.field.style.gap = gap + "%";

    // remove old-sized tiles
    while (this.field.hasChildNodes()) {
      this.field.removeChild(this.field.lastChild);
    }

    // add newly-sized tiles
    for (let tileID of this.freeTileIDs) {
      // have no idea why it is not equivalent to the line below
      // const el = createTile.bind(this)(tileID, fieldSideLength, gap);
      const el = createTile.bind(this)(tileID, fieldSideLength, gap);
      this.field.appendChild(el);
    }

  }

};


function checkVictory(victoryState, fieldState, symbol, tileID) {

  function initOrIncrementCounter(symbolCounters, counterName, elementsXCoord, elementsYCoord) {

    if (symbolCounters[counterName] === undefined) {
      symbolCounters[counterName] = { len: 1,
                                      tiles: [], };
    } else {
      symbolCounters[counterName].len += 1;
    }

    if (counterName.startsWith("row")) {
      // tiles in any row have unique y coords
      symbolCounters[counterName].tiles.push(elementsYCoord);
    } else {
      //in cols and both diags x coords are unique
      symbolCounters[counterName].tiles.push(elementsXCoord);
    }
  }

  function checkWinningCondition(symbolCounters, counterName) {

    // checking whether the symbols form a consecutive array
    if (symbolCounters[counterName].len >= victoryState.winningSequenceLength) {

      symbolCounters[counterName].tiles.sort();
      let previousTileID = symbolCounters[counterName].tiles[0];

      for (let i = 1; i < victoryState.winningSequenceLength; i++) {

        tileID = symbolCounters[counterName].tiles[i];
        if (tileID - previousTileID !== 1) return false;
        previousTileID = tileID;

      }

      return true;

    }

  }

  const [x, y] = tileID.split(", ").map(Number);

  let symbolCounters;

  if (symbol === "x") {
    symbolCounters = victoryState.counters.cross;
  } else if (symbol === "o") {
    symbolCounters = victoryState.counters.circle;
  }

  const counterNames = [`row${x}`, `col${y}`, `leftToRightDiagID${x - y}`, `rightToLeftDiagID${x + y}`];

  for (let counterName of counterNames) {
    initOrIncrementCounter(symbolCounters, counterName, x, y);
    if (checkWinningCondition(symbolCounters, counterName)) return symbol;
  }

  if (fieldState.freeTileIDs.length === 0) return 'draw';

  return undefined;

}


function handleGameResult(result) {

  function updateDashboardCounters(winningSide) {
    const winCount = document.querySelector("#win-counter");
    const lossCount = document.querySelector("#loss-counter");

    if (winningSide === gameState.playerSymbol) {
      winCount.textContent = Number(winCount.textContent) + 1;
    } else if (winningSide === gameState.opponentSymbol) {
      lossCount.textContent = Number(lossCount.textContent) + 1;
    } else {
      winCount.textContent = Number(winCount.textContent) + 0.5;
      lossCount.textContent = Number(lossCount.textContent) + 0.5;
    }
  }

  if (result === undefined) return;

  if (result === 'draw') {
    updateDashboardCounters(result);
    alert("Draw");
  } else if (result === "x") {
    updateDashboardCounters(result, gameState.playerSymbol);
    alert("crosses won");
  } else if (result === "o") {
    updateDashboardCounters(result, gameState.playerSymbol);
    alert("circles won");
  }

  gameState.resetGameState();
  victoryState.restoreInitialVictoryState();

  fieldState.field.removeEventListener("click", handleButtonFieldClick);

}


function makeRandomMove() {

  if (!gameState.gameIsInProgress) return;

  const randomlyChosenIndex = Math.floor(Math.random() * fieldState.freeTileIDs.length);
  const randomFreeTileID = fieldState.freeTileIDs[randomlyChosenIndex];
  fieldState.freeTileIDs.splice(randomlyChosenIndex, 1);

  let tile;
  for (let i = 0; i < fieldState.field.children.length; i++) {
    let el = fieldState.field.children[i];
    if (el.getAttribute("data-field-tile-id") === randomFreeTileID) {
      tile = el;
      break;
    }
  }


  const gameNumber = gameState.gameNumber;
  const randomDelay = Math.random() * 1703;
  setTimeout(() => {
    if (gameState.gameNumber !== gameNumber) {
      return false;
    }

    const elementToBeAdded = createChosenElement(gameState.opponentSymbol);
    tile.appendChild(elementToBeAdded);

    const res = checkVictory(victoryState, fieldState, gameState.opponentSymbol, randomFreeTileID);
    gameState.moveCount++;

    fieldState.field.addEventListener("click", handleButtonFieldClick);
    handleGameResult(res);
  }, randomDelay);
}


function createChosenElement(elementName) {
  if (elementName === "x") {
    const cross = document.createElement("div");
    cross.classList.add("cross");

    const leftStick = document.createElement("div");
    leftStick.classList.add("cross__left-stick");

    const rightStick = document.createElement("div");
    rightStick.classList.add("cross__right-stick");

    cross.appendChild(leftStick);
    cross.appendChild(rightStick);

    return cross;
  } else if (elementName === "o") {
    const circle = document.createElement("div");
    circle.classList.add("circle");

    return circle;
  }
}


function handleButtonFieldClick(e) {
  const clickedElement = e.target;

  if (clickedElement.className === "field__tile") {
    const elID = clickedElement.getAttribute("data-field-tile-id");
    if (!fieldState.freeTileIDs.includes(elID)) {
      return;
    }

    // adding the needed symbol to the DOM
    const elementToBeAdded = createChosenElement(gameState.playerSymbol);
    clickedElement.appendChild(elementToBeAdded);

    // updating app state
    fieldState.freeTileIDs.splice(fieldState.freeTileIDs.indexOf(elID), 1);
    const res = checkVictory(victoryState, fieldState, gameState.playerSymbol, elID);
    gameState.moveCount++;

    // comment this line to make the mutliplayer work
    handleGameResult(res);

    if (gameState.offlineGame && res === undefined) {
      makeRandomMove();
    } else if (!gameState.offlineGame){
      const move = {
        recepient: gameState.opponentSymbol,
        tileID: elID,
      };
      socket.send(JSON.stringify(move));
    }

    // comment out this line to make the mutliplayer work
    // handleGameResult(res);

    fieldState.field.removeEventListener("click", handleButtonFieldClick); // prevent further moves if the opponent has not made his yet

    if (res !== undefined) {
      return; // prevents bot's move if someone has won
    }

  }
}


function setFieldHeight() {
  const field = document.querySelector("#field");
  const fieldWidth = window.getComputedStyle(field);
  field.style.height = fieldWidth.width;
}


document.querySelector("#play-for-crosses-button").addEventListener("click", (e) => {

  if (gameState.gameIsInProgress && gameState.moveCount !== 0) {
    handleGameResult(gameState.opponentSymbol);
  }

  gameState.offlineGame = true;
  gameState.playerSymbol = "x";
  gameState.opponentSymbol = "o";


  gameState.resetGameState();
  victoryState.restoreInitialVictoryState();

  fieldState.clearField();

  fieldState.field.addEventListener("click", handleButtonFieldClick);

});


document.querySelector("#play-for-circles-button").addEventListener("click", (e) => {

  if (gameState.gameIsInProgress && gameState.moveCount !== 0) {
    handleGameResult(gameState.opponentSymbol);
  }

  gameState.offlineGame = true;
  gameState.playerSymbol = "o";
  gameState.opponentSymbol = "x";

  gameState.resetGameState();
  victoryState.restoreInitialVictoryState();


  fieldState.clearField();
  fieldState.field.removeEventListener("click", handleButtonFieldClick);

  makeRandomMove();

});


document.querySelector("#give-up-button").addEventListener("click", () => {
  if (gameState.moveCount === 0) {
    return;
  }

  fieldState.clearField();
  gameState.resetGameState();
  victoryState.restoreInitialVictoryState();

  const lossCount = document.querySelector("#loss-counter");
  lossCount.textContent = Number(lossCount.textContent) + 1;
});


document.querySelector("#grid-size-slider").addEventListener("input", (e) => {
  const size = Number(e.target.value);
  fieldState.changeFieldSize(size);
  // fieldTiles = document.querySelectorAll(".field__tile");
});


document.querySelector("#winning-sequence-length-slider").addEventListener("input", (e) => {
  victoryState.winningSequenceLength = Number(e.target.value);
});


window.addEventListener("resize", setFieldHeight);
setFieldHeight();
fieldState.changeFieldSize(3);
fieldState.field.addEventListener("click", handleButtonFieldClick);

socket.on('connect', function() {
    socket.emit('my event', {data: 'I\'m connected!'});
});


var socket = io();

socket.on('message', function(msg) {

  console.log(msg);

    if (msg === 'x') {

      gameState.playerSymbol = 'x';
      gameState.opponentSymbol = 'o';
      console.log('x');

    } else if (msg === 'o') {

      gameState.playerSymbol = 'o';
      gameState.opponentSymbol = 'x';
      console.log('o');
      fieldState.field.addEventListener('click', handleButtonFieldClick);      

    } else if (msg === 'start') {
      if (gameState.playerSymbol === 'x') {
        fieldState.field.addEventListener('click', handleButtonFieldClick)
      }
    } else {
      const tiles = document.querySelectorAll(".field__tile");
      const tile = findTileByID(tiles, msg);      
      console.log(msg)
      if (tile === undefined) {
        console.log('error, probably because of the different grid sizes');
      }
      tile.appendChild(createChosenElement(gameState.opponentSymbol));
      fieldState.freeTileIDs.splice(fieldState.freeTileIDs.indexOf(msg), 1);
      const [x, y] = msg.split(', ').map(Number);
      const res = checkVictory(victoryState, gameState.opponentSymbol, x, y);
      handleGameResult( res);
      fieldState.field.addEventListener('click', handleButtonFieldClick);

    }

});


const tiles = document.querySelectorAll(".field__tile");


function findTileByID(tiles, tileID) {
  console.log(`tileID ${tileID}`)
  for (let i = 0; i < tiles.length; i++) {
    const el = tiles[i];
    if (el.getAttribute("data-field-tile-id") == tileID) {
      return el;
    }
  }
  return undefined;
}


document.querySelector('#connect-to-server').addEventListener('click', (e) => {
  if (e.target.value = 'Play Online') {
    e.target.value = 'Play Offline';
  } else {
    e.target.value = 'Play Online';
  }

  gameState.offlineGame = false;
});