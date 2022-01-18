class FieldComponent {

    size: number;
    field: HTMLElement;
    freeTilesIDs: string[];

    constructor(size: number) {

        this.size = size;
        this.freeTilesIDs = this.createTileIDs(size);
        this.field = this.createField(size);

    }

    createField(size: number): HTMLElement {

        const field: HTMLElement = document.createElement("div");
        field.classList.add("field");

        this.freeTilesIDs.map(
            ID => this.createTile(ID)
        ).forEach(
            tile => field.appendChild(tile)
        );

        return field

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

    restore(size: number): void {

        // removing all the symbols on the field
        const tiles = Array.from(this.field.children);
        tiles.forEach(t => {
            t.lastChild.remove();
        });

        this.freeTilesIDs = this.createTileIDs(tiles.length)

    }

    changeSize(size: number): void {

        this.freeTilesIDs = this.createTileIDs(size)
        this.field = this.createField(size)

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

    init(mountPoint: HTMLElement) {
        mountPoint.appendChild(this.field);
    }

}
