const appState = {
    moveCount: 0,
    playerSymbol: "x",
    botSymbol: "o",
    freeTileIDs: ["0, 0", "0, 1", "0, 2", "1, 0", "1, 1", "1, 2", "2, 0", "2, 1", "2, 2"],
    field: [[0, 0, 0],
            [0, 0, 0],
            [0, 0, 0], ],
    gridSize: 3,
    gameIsInProgress: true,
};


function restoreInitialAppState() {
    appState.moveCount = 0;
    appState.playerSymbol = "x";
    appState.botSymbol = "o";
    appState.freeTileIDs = ["0, 0", "0, 1", "0, 2",
                            "1, 0", "1, 1", "1, 2",
                            "2, 0", "2, 1", "2, 2"];
    appState.field = [[0, 0, 0],
                      [0, 0, 0],
                      [0, 0, 0], ];
    appState.gridSize = 3;
}


function restoreTheFieldState(field) {
    const tiles = field.children;
    for (let i = 0; i < tiles.length; i++) {
        if (tiles[i].lastChild) {
            tiles[i].lastChild.remove(); 
        }
    }    
}


// refactor it later
function checkVictoryConditions() {

    let symbol;
    let countCrosses = 0;
    let countCircles = 0;

    for (let row = 0; row < appState.gridSize; row++) {

        for (let col = 0; col < appState.gridSize; col++) {
            symbol = appState.field[row][col];
            if (symbol === 'x') {
                countCrosses++;
            } else if (symbol === 'o') {
                countCircles++;
            }
        }

        if (countCrosses === appState.gridSize) {
            return 'x';
        } else if (countCircles === appState.gridSize) {
            return 'o';
        }

        countCrosses = 0;
        countCircles = 0;

    }

    // cols
    for (let col = 0; col < appState.gridSize; col++) {

        for (let row = 0; row < appState.gridSize; row++) {
            symbol = appState.field[row][col];
            if (symbol === 'x') {
                countCrosses++;
            } else if (symbol === 'o') {
                countCircles++;
            }
        }

        if (countCrosses === appState.gridSize) {
            return 'x';
        } else if (countCircles === appState.gridSize) {
            return 'o';
        }

        countCrosses = 0;
        countCircles = 0;

    }


    // diags
    // on one diagonal the coordinates for both row and col always match
    for (let i = 0; i < appState.gridSize; i++) {
        symbol = appState.field[i][i];
        if (symbol === 'x') {
            countCrosses++;
        } else if (symbol === 'o') {
            countCircles++;
        }
    }

    if (countCrosses === appState.gridSize) {
        return 'x';
    } else if (countCircles === appState.gridSize) {
        return 'o';
    }

    countCrosses = 0;
    countCircles = 0;

    // on the other diagonal the sum of coordinates is always gridSize - 1
    const coordSum = appState.gridSize - 1;
    for (let i = 0; i < appState.gridSize; i++) {
        symbol = appState.field[i][coordSum - i];
        if (symbol === 'x') {
            countCrosses++;
        } else if (symbol === 'o') {
            countCircles++;
        }
    }

    if (countCrosses === appState.gridSize) {
        return 'x';
    } else if (countCircles === appState.gridSize) {
        return 'o';
    }

}


const fieldTiles = document.querySelectorAll(".field__tile");
const winCount = document.querySelector(".stats__win-count"); 
const lossCount = document.querySelector(".stats__loss-count"); 


function incrementWinLossCounters(winningSide, playerSymbol) {
    if (winningSide === playerSymbol) {
        winCount.textContent = Number(winCount.textContent) + 1;
    } else {
        lossCount.textContent = Number(lossCount.textContent) + 1;
    }
}


function handleWinConditionCheckResult(result) {
    if (result === 'x') {
        incrementWinLossCounters(result, appState.playerSymbol);
        alert("crosses won");
        field.removeEventListener('click', handleButtonFieldClick);
        appState.gameIsInProgress = false;
    } else if (result === 'o') {
        incrementWinLossCounters(result, appState.playerSymbol);
        alert("circles won");
        field.removeEventListener('click', handleButtonFieldClick);
        appState.gameIsInProgress = false;
    }
}


function makeRandomMove() {

    const randomlyChosenIndex = Math.floor(Math.random() * appState.freeTileIDs.length);
    const randomFreeTileID = appState.freeTileIDs[randomlyChosenIndex];

    let tile;
    for (let i = 0; i < fieldTiles.length; i++) {
        let el = fieldTiles[i];
        if (el.getAttribute("data-field-tile-id") === randomFreeTileID) {
            tile = el;
            break;
        }
    }

    // if every cell is filled
    if (tile === undefined) {
        return;
    }

    const randomDelay = Math.random() * 1703;
    setTimeout(() => {
        const elementToBeAdded = createChosenElement(appState.botSymbol);
        tile.appendChild(elementToBeAdded);
        let [x, y] = randomFreeTileID.split(', ');
        appState.field[x][y] = appState.botSymbol;
        appState.freeTileIDs.splice(randomlyChosenIndex, 1);
        appState.moveCount++;

        const res = checkVictoryConditions();
        field.addEventListener('click', handleButtonFieldClick);
        handleWinConditionCheckResult(res);
    }, randomDelay);

}


function createChosenElement(choice) {

    if (choice === "x") {

        const cross = document.createElement("div");
        cross.classList.add("cross");

        const leftStick = document.createElement("div");
        leftStick.classList.add("cross__left-stick");

        const rightStick = document.createElement("div");
        rightStick.classList.add("cross__right-stick");

        cross.appendChild(leftStick);
        cross.appendChild(rightStick);

        return cross;

    } else {

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
            console.log("This tile is occupied, choose another")
            return;
        }

        // adding the needed symbol to the DOM
        const elementToBeAdded = createChosenElement(appState.playerSymbol);
        clickedElement.appendChild(elementToBeAdded);

        // updating app state
        let [x, y] = elID.split(', ');
        appState.field[x][y] = appState.playerSymbol;
        appState.freeTileIDs.splice(appState.freeTileIDs.indexOf(elID), 1);
        appState.moveCount++;

        const res = checkVictoryConditions();
        handleWinConditionCheckResult(res);

        // in case some one has won, there should not be any further moves made
        if (res !== undefined) {
            return;
        }
        field.removeEventListener("click", handleButtonFieldClick);

        makeRandomMove();

    }

}


const field = document.querySelector(".field");
field.addEventListener("click", handleButtonFieldClick);


const playForCrossesButton = document.querySelector(".symbol-chooser__cross");
playForCrossesButton.addEventListener("click", (e) => {
    appState.playerSymbol = "x";
    appState.botSymbol = "o";
    if (!appState.gameIsInProgress) {
        appState.gameIsInProgress = true;
        restoreTheFieldState(field);
        restoreInitialAppState();
        field.addEventListener("click", handleButtonFieldClick);
    }
});


const playForCirclesButton = document.querySelector(".symbol-chooser__outer-circle");
playForCirclesButton.addEventListener("click", (e) => {
    appState.playerSymbol = "o";
    appState.botSymbol = "x";
    if (!appState.gameIsInProgress) {
        appState.gameIsInProgress = true;
        restoreTheFieldState(field);
        restoreInitialAppState();
        field.addEventListener("click", handleButtonFieldClick);
    }
    makeRandomMove();
});


// the give up button logic has to be fixed
// bot player's move appear after it has been pressed
const giveUpButton = document.querySelector(".controls__give-up-button");
giveUpButton.addEventListener("click", () => {
    // to not allow to add losses to the counter when there are not characters on the field
    if (appState.moveCount == 0) {
        return;
    }
    lossCount.textContent = Number(lossCount.textContent) + 1;
    restoreTheFieldState(field);
});