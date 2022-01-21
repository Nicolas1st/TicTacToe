export class VictoryState {

    symbolsInARowToWin: number;
    boardSize: number;
    movesLeft: number;

    // this property is a bit complex
    // when a move is made
    // up to 3 new properties will be created
    // unique row / column / diag identfiers
    // why do it this way?
    // to be able to check for victory right after the move has been made
    // since the conditions were not satisfied for previous moves
    // only the updated row / column / diags should be checked
    counters: object;

    constructor(symbolsInARowToWin: number, boardSize: number) {

        this.boardSize = boardSize;

        this.symbolsInARowToWin = symbolsInARowToWin;
        this.movesLeft = boardSize * boardSize;

        this.counters = {};

    }


    reset() {

        this.counters = {};
        this.movesLeft = this.boardSize * this.boardSize;

    }

    setSymbolsInARowToWin(symbolsInARowToWin: number) {

        this.symbolsInARowToWin = symbolsInARowToWin;

    }

    setBoardSize(boardSize: number) {

        this.boardSize = boardSize;

    }

    // return the winning side symbol, or draw result, or unconcluded result
    checkIfMoveWins(symbol: string, moveX: number, moveY: number): string {

        // this method could've been simpler, but since I check victory
        // for games that:
        //  - may have boards bigger than 3 tiles
        //  - may have a different number of tiles in a row to win
        // the following things must be checked:
        //  - all diagonals, not only main ones
        //  - whether the tiles in the same row / columnd / diag have not gaps between

        function checkSybmolsHaveNoGapsBetween(symbolCounters: object, counterName: string) {

            // checking whether the symbols form a consecutive array
            if (symbolCounters[counterName].len >= this.setSymbolsInARowToWin) {

                symbolCounters[counterName].tiles.sort();

                let previousCoord = symbolCounters[counterName].tiles[0];
                for (let i = 1; i < this.setSymbolsInARowToWin; i++) {

                    const uniqueCoord = symbolCounters[counterName].tiles[i];

                    if (uniqueCoord - previousCoord !== 1) {
                        return false;
                    }

                    previousCoord = uniqueCoord;

                }

                return true;

            }

        }

        function createOrUpdateCounters(counters: object, moveX: number, moveY: number): string[]{

            // the identifiers for different row / column / diag
            // are created this way:
            // each row has a unique X cooridate
            // each column has a unique Y cooridate
            // for \ diagonals the difference between the coordiates for each element in them is constant
            // for / diagonals the sum between the coordiates for each element in them is constant

            const lineIdentifiers: string[] = [
                `row${moveX}`, `col${moveY}`,
                `leftToRightDiagID${moveX - moveY}`,
                `rightToLeftDiagID${moveX + moveY}`
            ];

            lineIdentifiers.forEach(lineID => {

                // create a counter for row / column / diag
                if (this.counters[lineID] === undefined) {
                    this.counters[lineID] = { 
                        len: 0,
                        tiles: [],
                    };
                }

                this.counters[lineID].len += 1;
                if (lineID.startsWith("row")) {
                    // tiles in any row have unique y coords
                    this.counters[lineID].tiles.push(moveY);
                } else {
                    //in cols and both diags x coords are unique
                    this.counters[lineID].tiles.push(moveX);
                }

            });

            return lineIdentifiers;

        }

        this.movesLeft -= 1;

        if ( !(symbol in this.counters) ) {
            this.counters[symbol] = {};
        }

        const lineIdentifiers = createOrUpdateCounters(this.counters, moveX, moveY);

        lineIdentifiers.forEach( lineID => {
            if (checkSybmolsHaveNoGapsBetween(this.counters[symbol], lineID)) {
                return symbol;
            }
        });


        if (this.movesLeft === 0) {
            return "draw";
        }

        return "unconcluded";

    }

}
