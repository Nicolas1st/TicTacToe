export class Mediator {

    constructor() {
    }

    notify(caller: any, eventName: string, data: object) {

        // should be a tree of events types,
        // switch that handles each of them

        switch (eventName) {
            case "field-click":
                break;
            case "choose-crosses":
                break;
            case "choose-circles":
                break;
            case "set-board-size":
                break;
            case "set-number-of-symbols-in-a-row-to-win":
                break;
            case "give-up":
                break;
            default:
                // for debugging
                alert("The event dispatched does not exist");
        }

    }

}
