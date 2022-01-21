export function createBoardSymbolElement(elementName: string): HTMLElement {

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
