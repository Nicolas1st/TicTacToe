import { Mediator } from "./Mediator";

export class FieldComponent {

    size: number;
    field: HTMLElement;
    freeTilesIDs: string[];
    mediator: Mediator;
    clicksAreAllowed: boolean;

    constructor(mediator: Mediator, field: HTMLElement, size: number, clicksAreAllowed: boolean) {

        this.mediator = mediator;
        this.field = field;
        this.size = size;
        this.clicksAreAllowed = clicksAreAllowed;

        this.freeTilesIDs = this.createTileIDs(size);
        this.freeTilesIDs.forEach(tileID => {
            this.field.appendChild(this.createTile(tileID));
        });

    }

    areClicksAllowed() {

        return this.clicksAreAllowed;

    }

    restore(): void {

        // removing all the symbols on the field
        const tiles = Array.from(this.field.children);
        tiles.forEach(t => {
            t.lastChild.remove();
        });

        this.freeTilesIDs = this.createTileIDs(this.size);

    }

    toggleAllowClicks() {
        this.clicksAreAllowed = !this.clicksAreAllowed;
    }


    changeSize(size: number): void {

        this.freeTilesIDs = this.createTileIDs(size);

        this.freeTilesIDs.forEach(tileID => {
            this.field.appendChild(this.createTile(tileID));
        });

    }

    getTileCoordinates(clickedElement: HTMLElement): [number, number] {

        const tileID: string = clickedElement.getAttribute("data-field-tile-id");
        const [x, y] = tileID.split(", ").map(Number);

        return [x, y];

    }

    drawSymbol(clickedElement: HTMLElement, symbolElement: HTMLElement): boolean {

        if (!clickedElement.className.includes("field__tile")) {
            return false;
        }

        const tileID: string = clickedElement.getAttribute("data-field-tile-id");
        if (!this.freeTilesIDs.includes(tileID)) {
            return false;
        }

        this.freeTilesIDs.splice(this.freeTilesIDs.indexOf(tileID), 1);
        clickedElement.appendChild(symbolElement);

        this.toggleAllowClicks();

        return true;

    }

    createTile(tileID: string): HTMLElement {

        const tile: HTMLElement = document.createElement("div")
        tile.classList.add("field__tile");
        tile.setAttribute("data-field-tile-id", tileID);

        return tile;

    }

    createTileIDs(size: number): string[] {

        return Array.from(
            {length: size},
            (_, i) => `${Math.floor(i / size)}, ${i % size}`
        )

    }

}
