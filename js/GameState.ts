import { VictoryState } from "./VictoryState";

export class GameState {

    playerSymbol: string;
    opponentSymbol: string;

    gameIsInProgress: boolean;
    offlineGame: boolean;


    gameNumber: number;
    moveCount: number;

    constructor(playerSymbol: string, opponentSymbol: string) {

        this.playerSymbol = playerSymbol;
        this.opponentSymbol = opponentSymbol;

        // game configuration
        this.gameIsInProgress = false;
        this.offlineGame = true;

        // unique for each game
        this.gameNumber = 0;
        this.moveCount = 0;

    }

    playFor(symbol: string): boolean {

        if (symbol == "x") {

            this.playerSymbol = "x";
            this.opponentSymbol = "o";

            return true;

        } else if (symbol == "o") {

            this.opponentSymbol = "x";
            this.playerSymbol  = "o";

            return true;

        } else {

            alert(`Can not play for ${symbol}`);
            return false;

        }

    }

    playForCrosses() {
        this.playerSymbol = "x"
        this.opponentSymbol = "o";
    }

    reset() {

        this.gameIsInProgress = false;
        this.offlineGame = true;

        this.gameNumber += 1;
        this.moveCount = 0;

    }

}
