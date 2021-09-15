function getInitialAppState() {

    const appState = {
        moveCount: 0,
        chosenSymbol: "cross",
        freeTileIDs: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
    };

    return appState;

}


const appState = getInitialAppState();
const fieldTiles = document.querySelectorAll(".field__tile");


function makeRandomMove() {

    const randomlyChosenIndex = Math.floor( Math.random() * appState.freeTileIDs.length );
    const randomFreeTileID = appState.freeTileIDs[randomlyChosenIndex];

    let tile;
    for (let i = 0; i < fieldTiles.length; i++) {
        let el = fieldTiles[i]; 
        if ( el.getAttribute("data-field-tile-id") === randomFreeTileID ) {
            tile = el;
            break;
        }
    }

    if ( tile === undefined ) {
        return;
    }

    const randomDelay = Math.random() * 1703;
    setTimeout(() => {
        const elementToBeAdded = createChosenElement(appState.chosenSymbol, createTheOpposite=true);
        tile.appendChild(elementToBeAdded);
    }, randomDelay);

    console.log("Bot");
    console.log(randomFreeTileID);
    const removed = appState.freeTileIDs.splice(randomlyChosenIndex, 1);
    console.log(removed);
    appState.moveCount++;

}



function createChosenElement(choice, createTheOpposite=false) {

    if ( (choice === "cross" && !createTheOpposite) || (choice === "circle" && createTheOpposite) ) {

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


const field = document.querySelector(".field");
field.addEventListener("click", (e) => {

    const clickedElement = e.target;

    if (clickedElement.className === "field__tile") {

        const elID = clickedElement.getAttribute("data-field-tile-id")
        if ( !appState.freeTileIDs.includes(elID) ) {
            console.log("This tile is occupied, choose another")
            return;
        }

        // adding the needed symbol to the DOM
        const elementToBeAdded = createChosenElement(appState.chosenSymbol);
        clickedElement.appendChild(elementToBeAdded);

        // updating app state
        const IDIndex = appState.freeTileIDs.indexOf(elID);
        console.log("Player");
        console.log(elID);
        const removed = appState.freeTileIDs.splice(IDIndex, 1);
        console.log(removed);
        appState.moveCount++;

        console.log(`The tile is now occupied by the ${appState.chosenSymbol}`)
        console.log(`Player move: field id is${elID}`)

        makeRandomMove();

    }
});


const playForCrossesButton = document.querySelector(".symbol-chooser__cross");
playForCrossesButton.addEventListener("click", (e) => {
    appState.chosenSymbol = "cross";
    console.log("Playing for crosses");
});


const playForCirclesButton = document.querySelector(".symbol-chooser__outer-circle");
playForCirclesButton.addEventListener("click", (e) => {
    appState.chosenSymbol = "circle";
    console.log("Playing for circles");
    makeRandomMove();
});