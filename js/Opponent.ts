export class Opponent {

    isBot: boolean;
    
    constructor() {

    }
    
    makeMove() {

        if (this.isBot) {
            this.makeBotMove();
        } else {
            this.waitRealOpponentsMove();
        }

    }

    waitRealOpponentsMove() {
        throw new Error("Method not implemented.");
    }

    makeBotMove() {
        throw new Error("Method not implemented.");
    }

}