import { createBoardSymbolElement } from "./createBoardSymbolElement";
import { FieldComponent } from "./Field";
import { GameState } from "./GameState";
import { Opponent } from "./Opponent";
import { ResultsTable } from "./ResultsTable";
import { VictoryState } from "./VictoryState";

function createEventHandler(
    fieldComponent: FieldComponent,
    victoryState: VictoryState,
    gameState: GameState,
    resultsTable: ResultsTable,
    opponent: Opponent
    )
{

    return function handleEvent(eventName: string, data: object) {

        switch (eventName) {

            case "field-click":

                // the clicks might be not allowed if waiting for opponents move
                if (fieldComponent.areClicksAllowed()) {

                    const playerSymbol: HTMLElement = createBoardSymbolElement(gameState.playerSymbol);
                    const wasDrawn: boolean = fieldComponent.drawSymbol(data["clickedElement"], playerSymbol);

                    if (wasDrawn) {

                        const [moveX, moveY] = fieldComponent.getTileCoordinates(data["clickedElement"]);
                        const result: string = victoryState.checkIfMoveWins(gameState.playerSymbol, moveX, moveY);

                        if (result == gameState.playerSymbol) {
                            handleEvent("win", {});
                        } else if (result == gameState.opponentSymbol) {
                            handleEvent("loss", {})
                        } else if (result == "draw") {
                            handleEvent("draw", {});
                        }

                    }


                }
                break;

            case "opponents-move":
                break;

            case "choose-crosses":

                if (gameState.gameIsInProgress) {
                    alert("Need to finish the game first");
                } else {
                    gameState.playFor("x");
                    opponent.makeMove();
                }

                break;

            case "choose-circles":

                if (gameState.gameIsInProgress) {
                    alert("Need to finish the game first");
                } else {
                    gameState.playFor("o");
                    opponent.makeMove();
                }
                break;

            case "set-board-size":
                break;

            case "set-number-of-symbols-in-a-row-to-win":
                break;

            case "give-up":
                handleEvent("loss", {});
                break;

            case "after-game-clean-up":
                fieldComponent.restore();
                victoryState.reset();
                gameState.reset();
                break;

            case "win":
                resultsTable.addVictory();
                alert("Victory!")
                handleEvent("after-game-clean-up", {});
                break;

            case "loss":
                resultsTable.addLoss();
                alert("It's a loss...")
                handleEvent("after-game-clean-up", {});
                break;

            case "draw":
                resultsTable.addDraw();
                alert("It's a draw...");
                handleEvent("after-game-clean-up", {});
                break;

            case "opponent-left":
                break;

            default:
                // for debugging
                alert(`The event ${eventName} dispatched does not exist`);

        }

    }

}
