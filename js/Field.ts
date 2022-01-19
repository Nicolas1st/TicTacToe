class FieldComponent {

    size: number;
    field: HTMLElement;
    freeTilesIDs: string[];

    constructor(size: number, field: HTMLElement) {

        this.size = size;
        this.freeTilesIDs = this.createTileIDs(size);
        this.field = field;

        this.freeTilesIDs.forEach(tileID => {
            this.field.appendChild(this.createTile(tileID));
        });

    }

    restore(size: number): void {

        // removing all the symbols on the field
        const tiles = Array.from(this.field.children);
        tiles.forEach(t => {
            t.lastChild.remove();
        });

        this.freeTilesIDs = this.createTileIDs(tiles.length)

    }

    changeSize(size: number): void {

        this.freeTilesIDs = this.createTileIDs(size);

        this.freeTilesIDs.forEach(tileID => {
            this.field.appendChild(this.createTile(tileID));
        });

    }

    drawSymbol(clickedElement: HTMLElement, createSymbol: () => HTMLElement): boolean {

        if (!clickedElement.className.includes("field__tile")) {
            return false;
        }

        const tileID: string = clickedElement.getAttribute("data-field-tile-id");
        if (!this.freeTilesIDs.includes(tileID)) {
            return false;
        }

        this.freeTilesIDs.splice(this.freeTilesIDs.indexOf(tileID), 1);
        clickedElement.appendChild(createSymbol());

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
