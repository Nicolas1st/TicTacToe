let moveCount = 0;
let chosenSymbol = 'cross';
const fieldTiles = document.querySelectorAll('.field__tile');


function makeRandomMove() {

    let item;
    setTimeout(() => {
        item = fieldTiles[ Math.floor(Math.random() * fieldTiles.length) ];
    });

    let elementToBeAdded;
    if ( chosenSymbol !== 'cross' ) {
        elementToBeAdded = createCircle();
    } else {
        elementToBeAdded = createCross();
    }

    item.appendChild(elementToBeAdded);

}


function createCross() {

    const cross = document.createElement('div');
    cross.classList.add('cross');

    const leftStick = document.createElement('div');
    leftStick.classList.add('cross__left-stick');

    const rightStick = document.createElement('div');
    rightStick.classList.add('cross__right-stick');

    cross.appendChild(leftStick);
    cross.appendChild(rightStick);

    return cross;

}


function createCircle() {

    const outerCircle = document.createElement('div');
    outerCircle.classList.add('outer-circle');

    const innerCircle = document.createElement('div');
    innerCircle.classList.add('inner-circle');

    outerCircle.appendChild(innerCircle);

    return outerCircle;

}


const field = document.querySelector('.field');
field.addEventListener('click', (e) => {

    const clickedElement = e.target;
    let elementToBeAdded;

    if ( clickedElement.className === "field__tile" && clickedElement.children.length === 0) {

        if ( chosenSymbol === 'cross' ) {
            elementToBeAdded = createCross();
        } else {
            elementToBeAdded = createCircle();
        }

        moveCount++;

        clickedElement.appendChild(elementToBeAdded);

    }

});