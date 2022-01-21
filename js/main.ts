import { FieldComponent } from "./Field"
import { GameState } from "./GameState"
import { Mediator } from "./Mediator"
import { ResultsTable } from "./ResultsTable"
import { VictoryState } from "./VictoryState"


function init(boardSize: number, symbolsInARowToWin: number) {

    const mediator: Mediator = new Mediator();

    const fieldElement: HTMLElement = document.querySelector("#field");
    const fieldComponent: FieldComponent = new FieldComponent(mediator, fieldElement, boardSize, true)

    const victoryCount: HTMLElement = document.querySelector("#win-counter");
    const lossCount: HTMLElement = document.querySelector("#loss-counter");
    const resultsTable: ResultsTable = new ResultsTable(victoryCount, lossCount);

    const victoryState: VictoryState = new VictoryState(symbolsInARowToWin, boardSize);

    document.querySelector("#play-for-crosses-button").addEventListener("click", (e) => {
        mediator.notify(e.target, "choose-crosses", {});
    });

    document.querySelector("#play-for-circles-button").addEventListener("click", (e) => {
        mediator.notify(e.target, "choose-circles", {});
    });

    document.querySelector("#grid-size-slider").addEventListener("input", (e) => {
        mediator.notify(e.target, "set-board-size", {});
    });

    document.querySelector("#winning-sequence-length-slider").addEventListener("input", (e) => {
        mediator.notify(e.target, "set-number-of-symbols-in-a-row-to-win", {});
    });

    document.querySelector("#give-up-button").addEventListener("click", (e) => {
        mediator.notify(e.target, "give-up", {});
    });
    

    const playForCirclesButton: HTMLElement = document.querySelector("#play-for-crosses-button");

}

init(3, 3);