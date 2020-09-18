import { Color } from './color';
import { ImageManipulations } from './image-manipulations';
import { vectorPlus } from './math';

export class BreadthFirst {

    positions: number[][];

    private isPixelCovered: boolean[][];
    private startingColor: Color;
    private startingColorSum: number;

    constructor(position: number[], private image: ImageData, private tolerance: number) {
        this.initEmptyCovered();
        this.positions = [];

        position[0] = Math.round(position[0]);
        position[1] = Math.round(position[1]);

        this.isPixelCovered[position[0]][position[1]] = true;
        this.positions.push(position);

        this.startingColor = ImageManipulations.getPixelData(image, position[0], position[1]);
        this.startingColorSum = this.startingColor.red + this.startingColor.green + this.startingColor.blue + this.startingColor.alpha;

        this.fillPixels(position);
    }

    private initEmptyCovered(): void {
        this.isPixelCovered = [];
        for (let x = 0; x < this.image.width; x++) {
            this.isPixelCovered.push([]);
            for (let y = 0; y < this.image.height; y++) {
                this.isPixelCovered[x].push(false);
            }
        }
    }

    private fillPixels(startingPosition: number[]): void {
        const toFill: number[][] = [];

        toFill.push(startingPosition);

        // tslint:disable-next-line: prefer-for-of
        for (let i = 0; i < toFill.length; i++) {
            const positionToFill: number[] = toFill[i];
            this.populatePixel(toFill, positionToFill);
        }
    }

    private populatePixel(toFillQueue: number[][], position: number[]): void {
        for (let x = -1; x <= 1; x++) {
            for (let y = -1; y <= 1; y++) {
                if (x !== 0 || y !== 0) {
                    const childPosition = vectorPlus(position, [x, y]);

                    if (this.isPositionAcceptable(childPosition)) {
                        this.isPixelCovered[childPosition[0]][childPosition[1]] = true;
                        this.positions.push(childPosition);

                        if (x !== 0 && y !== 0) {
                            toFillQueue.push(childPosition);
                        }
                    }
                }
            }
        }
    }

    private isPositionAcceptable(position: number[]): boolean {
        return this.isPositionInRange(position) && !this.isPositionCovered(position) && this.isRightColor(position);
    }

    private isRightColor(position: number[]): boolean {
        const positionColor: Color = ImageManipulations.getPixelData(this.image, position[0], position[1]);

        const delta =
            Math.abs(positionColor.red - this.startingColor.red) +
            Math.abs(positionColor.green - this.startingColor.green) +
            Math.abs(positionColor.blue - this.startingColor.blue) +
            Math.abs(positionColor.alpha - this.startingColor.alpha);

        return this.startingColorSum * this.tolerance >= delta;
    }

    private isPositionInRange(position: number[]): boolean {
        return position[0] >= 0 && position[0] < this.image.width &&
            position[1] >= 0 && position[1] < this.image.height;
    }

    private isPositionCovered(position: number[]): boolean {
        return this.isPixelCovered[position[0]][position[1]];
    }
}
