const appState = {
    moveCount: 0,
    playerSymbol: "x",
    botSymbol: "o",
    freeTileIDs: ["0, 0", "0, 1", "0, 2",
                  "1, 0", "1, 1", "1, 2",
                  "2, 0", "2, 1", "2, 2"],
    gridSize: 3,
    gameIsInProgress: true,
    crossesVictoryCounters: {},
    circlesVictoryCounters: {},
    gameNumber: 0,
    victoryLengthCondition: 3,

    setFreeTilesIDs: function() {
        this.freeTileIDs = [];
        for (let i = 0; i < appState.gridSize**2; i++) {
            const tileID = `${Math.floor(i / this.gridSize)}, ${i % this.gridSize}`; 
            this.freeTileIDs.push(tileID);
        }
    }

};


function restoreInitialAppState(appState) {

    appState.moveCount = 0;
    appState.playerSymbol = "x";
    appState.botSymbol = "o";
    appState.setFreeTilesIDs();
    appState.gameIsInProgress = true;
    appState.gridSize = 3;
    appState.crossesVictoryCounters = {};
    appState.circlesVictoryCounters = {};
    appState.gameNumber += 1;
    appState.victoryLengthCondition = 3;

}


function changeFieldSize(appState, field, size) {

    restoreInitialAppState(appState);
    appState.gridSize = size;

    function createTile(gridSize, fieldSideLength, fieldGapLength, fieldPaddingLength, tileID) {

        const tileSideLength = (fieldSideLength - fieldGapLength * (gridSize - 1)) / (gridSize + 0.15);

        const tile = document.createElement('div');
        tile.classList.add('field__tile');
        tile.setAttribute("data-field-tile-id", tileID);
        tile.style.height = tileSideLength + '%';
        tile.style.width = tileSideLength + '%';

        return tile;

    }
    
    appState.freeTileIDs = [];

    const fieldSideLength = 100; // in percents
    const gap = fieldSideLength * 0.064 / size; // this constant makes for good proportions on the field 
    const padding = fieldSideLength * 0.0482 / size; // this constant makes for good proportions on the field 

    field.style.gap = gap + '%';
    // field.style.padding = padding + '%';

    while (field.hasChildNodes()) {
        field.removeChild(field.lastChild);
    }

    for (let i = 0; i < appState.gridSize**2; i++) {
        const tileID = `${Math.floor(i / appState.gridSize)}, ${i % appState.gridSize}`; 
        appState.freeTileIDs.push(tileID);
        const el = createTile(appState.gridSize, fieldSideLength, gap, padding, tileID);
        field.appendChild(el);
    }

    field.addEventListener('click', handleButtonFieldClick);

}



function restoreTheFieldState(field) {

    const tiles = field.children;
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].lastChild) {
            tiles[i].lastChild.remove(); 
        }
    }

}


function incrementVictoryCounters(appState, symbol, elementsXCoord, elementsYCoord) {

    function initOrIncrementCounter(symbolCounters, counterName) {
        if (symbolCounters[counterName] === undefined) {
            symbolCounters[counterName] = 1; 
        } else {
            symbolCounters[counterName] += 1; 
        }
    }

    let symbolCounters;
    if (symbol === "x") {
        symbolCounters = appState.crossesVictoryCounters;
    } else if (symbol === "o") {
        symbolCounters = appState.circlesVictoryCounters;
    }

    const nthRowCounter = `row${elementsXCoord}`;
    initOrIncrementCounter(symbolCounters, nthRowCounter);

    const nthColCounter = `col${elementsYCoord}`;
    initOrIncrementCounter(symbolCounters, nthColCounter);

    if (elementsXCoord === elementsYCoord) {
        // if the coordinates are equal it means the element is on the first
        // diagonal
        initOrIncrementCounter(symbolCounters, "firstDiagonal");
    } 

    if (Number(elementsXCoord) + Number(elementsYCoord) === (appState.gridSize - 1)) {
        // check second diagonal, if coordinates sum is equal to grid size - 1
        // the element is on the second diagonal
        initOrIncrementCounter(symbolCounters, "secondDiagonal");
    } 

}


function checkVictoryCounters(appState, symbol) {

    let victoryCounters;
    if (symbol === "x") {
        victoryCounters = appState.crossesVictoryCounters;
    } else if (symbol === "o") {
        victoryCounters = appState.circlesVictoryCounters;
    }
    
    for (let victoryCounter in victoryCounters) {
        if (victoryCounters[victoryCounter] === appState.victoryLengthCondition) {
            return symbol;
        }
    }

    return undefined;

}


function updateDashboardCounters(winningSide, playerSymbol) {

    const winCount = document.querySelector("#win-counter"); 
    const lossCount = document.querySelector("#loss-counter"); 

    if (winningSide === playerSymbol) {
        winCount.textContent = Number(winCount.textContent) + 1;
    } else {
        lossCount.textContent = Number(lossCount.textContent) + 1;
    }

}


function handleWinConditionCheckResult(appState, result) {

    if (result === undefined) return

    if (result === 'x') {
        updateDashboardCounters(result, appState.playerSymbol);
        alert("crosses won");
        appState.gameIsInProgress = false;
    } else if (result === 'o') {
        updateDashboardCounters(result, appState.playerSymbol);
        alert("circles won");
        appState.gameIsInProgress = false;
    } else if (appState.freeTileIDs.length === 0) {
        alert("Draw")
        appState.gameIsInProgress = false;
    } 

    field.removeEventListener("click", handleButtonFieldClick);
}


function makeRandomMove(appState) {

    const randomlyChosenIndex = Math.floor(Math.random() * appState.freeTileIDs.length);
    const randomFreeTileID = appState.freeTileIDs[randomlyChosenIndex];
    appState.freeTileIDs.splice(randomlyChosenIndex, 1);

    let tile;
    for (let i = 0; i < fieldTiles.length; i++) {
        let el = fieldTiles[i];
        if (el.getAttribute("data-field-tile-id") === randomFreeTileID) {
            tile = el;
            break;
        }
    }

    const gameNumber = appState.gameNumber;
    const randomDelay = Math.random() * 1703;
    setTimeout(() => {

        if (appState.gameNumber !== gameNumber) {
            return false;
        }

        const elementToBeAdded = createChosenElement(appState.botSymbol);
        tile.appendChild(elementToBeAdded);
        let [x, y] = randomFreeTileID.split(', ');
        incrementVictoryCounters(appState, appState.botSymbol, x, y);
        appState.moveCount++;

        const res = checkVictoryCounters(appState, appState.botSymbol);
        field.addEventListener('click', handleButtonFieldClick);
        handleWinConditionCheckResult(appState, res);

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

    } else if (elementName === "o"){

        const circle = document.createElement("div");
        circle.classList.add("circle");

        return circle;

    }
}


function handleButtonFieldClick(e) {

    const clickedElement = e.target;

    if (clickedElement.className === "field__tile") {

        const elID = clickedElement.getAttribute("data-field-tile-id")
        if (!appState.freeTileIDs.includes(elID)) {
            return;
        }

        // adding the needed symbol to the DOM
        const elementToBeAdded = createChosenElement(appState.playerSymbol);
        clickedElement.appendChild(elementToBeAdded);

        // updating app state
        let [x, y] = elID.split(', ');
        incrementVictoryCounters(appState, appState.playerSymbol, x, y);
        appState.freeTileIDs.splice(appState.freeTileIDs.indexOf(elID), 1);
        appState.moveCount++;

        const res = checkVictoryCounters(appState, appState.playerSymbol);
        handleWinConditionCheckResult(appState, res);

        field.removeEventListener("click", handleButtonFieldClick); // prevent further moves if the opponent has not made his yet

        if (res !== undefined) {
            return; // prevents bot's move if someone has won 
        }

        makeRandomMove(appState);

    }

}


const field = document.querySelector("#field");
field.addEventListener("click", handleButtonFieldClick);


const playForCrossesButton = document.querySelector("#play-for-crosses-button");
playForCrossesButton.addEventListener("click", (e) => {

    // counting as loss
    if (appState.gameIsInProgress && appState.moveCount !== 0) {
        updateDashboardCounters(appState.botSymbol, appState.playerSymbol);
    }

    restoreInitialAppState(appState);

    appState.playerSymbol = "x";
    appState.botSymbol = "o";

    restoreTheFieldState(field);

    field.addEventListener("click", handleButtonFieldClick);

});


const playForCirclesButton = document.querySelector("#play-for-circles-button");
playForCirclesButton.addEventListener("click", (e) => {

    // counting as loss
    if (appState.gameIsInProgress && appState.moveCount !== 0) {
        updateDashboardCounters(appState.botSymbol, appState.playerSymbol);
    }

    restoreInitialAppState(appState);

    appState.playerSymbol = "o";
    appState.botSymbol = "x";

    restoreTheFieldState(field);
    field.removeEventListener("click", handleButtonFieldClick);

    makeRandomMove(appState);

});


const giveUpButton = document.querySelector("#give-up-button");
giveUpButton.addEventListener("click", () => {

    if (appState.moveCount === 0) {
        return;
    }

    restoreTheFieldState(field);
    restoreInitialAppState(appState);

    const lossCount = document.querySelector("#loss-counter"); 
    lossCount.textContent = Number(lossCount.textContent) + 1;

});


changeFieldSize(appState, field, 3);
let fieldTiles = document.querySelectorAll(".field__tile");
field.addEventListener('click', handleButtonFieldClick);


const changeSizeInput = document.querySelector("#grid-size-slider");
changeSizeInput.addEventListener("input", (e) => {
    const size = Number(e.target.value);
    changeFieldSize(appState, field, size);
    fieldTiles = document.querySelectorAll(".field__tile");
});


const victoryConditionLenghtSlider = document.querySelector("#winning-sequence-length-slider");
victoryConditionLenghtSlider.addEventListener("input", (e) => {
   appState.victoryLengthCondition = Number(e.target.value); 
});


function setFieldHeight() {
    const field = document.querySelector("#field");
    const fieldWidth = window.getComputedStyle(field);
    console.log(fieldWidth)
    field.style.height = fieldWidth.width;
}


window.addEventListener('resize', setFieldHeight);
setFieldHeight();