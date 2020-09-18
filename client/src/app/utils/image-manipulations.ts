import { Color } from './color';
import { DOMRenderer } from './dom-renderer';
import { vectorPlus } from './math';

export class ImageManipulations {

    static getPixelData = (imageData: ImageData, x: number, y: number): Color => {
        if (x >= imageData.width || y >= imageData.height) {
            return new Color(0, 0, 0, 0);
        }

        // tslint:disable: no-magic-numbers
        const pixelIndex: number = Math.round((y * imageData.width + x) * 4);
        return new Color(
            imageData.data[pixelIndex + 0],
            imageData.data[pixelIndex + 1],
            imageData.data[pixelIndex + 2],
            imageData.data[pixelIndex + 3]);
        // tslint:disable: semicolon
    };

    static setPixelData = (array: number[], color: Color, positions: number[][], width: number, height: number): void => {
        for (const pos of positions) {
            const pixelIndex: number = Math.round((pos[1] * width + pos[0]) * 4);
            array[pixelIndex + 0] = color.red;
            array[pixelIndex + 1] = color.green;
            array[pixelIndex + 2] = color.blue;
            array[pixelIndex + 3] = 255;
        }
    };

    static generateImageData = (positions: number[][], color: Color, width: number, height: number): string => {
        const array: number[] = ImageManipulations.createArray(width, height);

        ImageManipulations.setPixelData(array, color, positions, width, height);

        const uint8Array = Uint8ClampedArray.from(array);
        const image: ImageData = new ImageData(uint8Array, width, height);

        const canvas = DOMRenderer.createElement('canvas');

        DOMRenderer.setAttribute(canvas, 'width',
            width.toString());
        DOMRenderer.setAttribute(canvas, 'height',
            height.toString());

        const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
        ctx.putImageData(image, 0, 0);
        return canvas.toDataURL();
    };

    static getAverageColor = (imageData: ImageData, center: number[], size: number): Color => {
        const xyRange: number[][] = ImageManipulations.getXYRange(size);

        const averageColor = new Color(0, 0, 0, 0);
        const colorsLen = xyRange.length;

        xyRange.forEach((position: number[]) => {
            const realPosition = vectorPlus(center, position);
            const color = ImageManipulations.getPixelData(imageData, realPosition[0], realPosition[1]);
            averageColor.red += color.red;
            averageColor.green += color.green;
            averageColor.blue += color.blue;
            averageColor.alpha += color.alpha;
        });

        averageColor.red /= colorsLen;
        averageColor.green /= colorsLen;
        averageColor.blue /= colorsLen;
        averageColor.alpha /= colorsLen;

        return averageColor;
    };

    static getXYRange = (size: number): number[][] => {
        const xyRange = [];

        const sizeRange = Math.floor(size / 2.0);
        for (let x = -sizeRange; x <= sizeRange; x++) {
            for (let y = -sizeRange; y <= sizeRange; y++) {
                xyRange.push([x, y]);
            }
        }

        return xyRange;
    };

    static createArray = (width: number, height: number): number[] => {
        const iterableNumberArray: number[] = [];

        const size: number = width * height * 4;
        for (let i = 0; i < size; i++) {
            iterableNumberArray.push(0);
        }
        return iterableNumberArray;
    };
}
