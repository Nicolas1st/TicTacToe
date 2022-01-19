class ResultsTable {

    victoryCountElement: HTMLElement;
    lossCountElement: HTMLElement;

    victoryCount: number;
    lossCount: number;

    constructor(victoryCountElement: HTMLElement, lossCountElement: HTMLElement) {

        this.victoryCount = 0;
        this.lossCount = 0;
        this.victoryCountElement = victoryCountElement;
        this.lossCountElement = lossCountElement;

    }

    addVictory() {

        this.victoryCount += 1;
        this.victoryCountElement.innerText = String(this.victoryCount);

    }

    addLoss() {

        this.lossCount += 1;
        this.lossCountElement.innerText = String(this.lossCount);

    }

    addDraw() {

        this.victoryCountElement.innerText = String(this.victoryCount);
        this.victoryCount += 0.5;

        this.lossCount += 0.5;
        this.lossCountElement.innerText = String(this.lossCount);

    }

}
