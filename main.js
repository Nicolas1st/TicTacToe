const appState = {
    moveCount: 0,
    playerSymbol: "x",
    botSymbol: "o",
    freeTileIDs: ["0, 0", "0, 1", "0, 2",
                  "1, 0", "1, 1", "1, 2",
                  "2, 0", "2, 1", "2, 2"],
    // field: [[0, 0, 0],
    //         [0, 0, 0],
    //         [0, 0, 0], ],
    gridSize: 3,
    gameIsInProgress: true,
    crossesVictoryCounters: {},
    circlesVictoryCounters: {},
};


const fieldTiles = document.querySelectorAll(".field__tile");
const winCount = document.querySelector(".stats__win-count"); 
const lossCount = document.querySelector(".stats__loss-count"); 


function restoreInitialAppState(appState) {

    appState.moveCount = 0;
    appState.playerSymbol = "x";
    appState.botSymbol = "o";
    appState.freeTileIDs = ["0, 0", "0, 1", "0, 2",
                            "1, 0", "1, 1", "1, 2",
                            "2, 0", "2, 1", "2, 2"];
    appState.gridSize = 3;
    appState.crossesVictoryCounters = {};
    appState.circlesVictoryCounters = {};

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
        if (victoryCounters[victoryCounter] === appState.gridSize) {
            return symbol;
        }
    }

    return undefined;

}


function updateDashboardCounters(winningSide, playerSymbol) {

    if (winningSide === playerSymbol) {
        winCount.textContent = Number(winCount.textContent) + 1;
    } else {
        lossCount.textContent = Number(lossCount.textContent) + 1;
    }

}


// cleanup after the game is over
function handleWinConditionCheckResult(appState, result) {
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
}


function makeRandomMove() {

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

    const randomDelay = Math.random() * 1703;
    setTimeout(() => {
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

        const outerCircle = document.createElement("div");
        outerCircle.classList.add("outer-circle");

        const innerCircle = document.createElement("div");
        innerCircle.classList.add("inner-circle");

        outerCircle.appendChild(innerCircle);

        return outerCircle;

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

        makeRandomMove();

    }

}


const field = document.querySelector(".field");
field.addEventListener("click", handleButtonFieldClick);


const playForCrossesButton = document.querySelector(".symbol-chooser__cross");
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


const playForCirclesButton = document.querySelector(".symbol-chooser__outer-circle");
playForCirclesButton.addEventListener("click", (e) => {

    // couting as loss
    if (appState.gameIsInProgress && appState.moveCount !== 0) {
        updateDashboardCounters(appState.botSymbol, appState.playerSymbol);
    }

    restoreInitialAppState(appState);
    appState.playerSymbol = "o";
    appState.botSymbol = "x";

    restoreTheFieldState(field);
    field.addEventListener("click", handleButtonFieldClick);

    makeRandomMove();

});


const giveUpButton = document.querySelector(".controls__give-up-button");
giveUpButton.addEventListener("click", () => {

    if (appState.moveCount === 0) {
        return;
    }

    restoreTheFieldState(field);
    restoreInitialAppState(appState);

    lossCount.textContent = Number(lossCount.textContent) + 1;
});