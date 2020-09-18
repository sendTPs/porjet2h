import { ElementRef } from '@angular/core';
import { svgToImage } from './element-parser';

// tslint:disable: no-any
export const saveFile = (fileName: string, fileContent: string, extension?: string): any => {

    const dataBlob: any = new Blob([fileContent], { type: 'image/png' });
    const url = window.URL.createObjectURL(dataBlob);

    downloadUrl(fileName, url, extension);
};

const downloadUrl = (fileName: string, url: string, extension?: string): void => {
    let ext = 'rebase';
    if (extension) {
        ext = extension;
    }

    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.${ext}`;
    a.click();
};

export const exportImage = (fileName: string, entry: ElementRef, type: string): void => {

    const convert = (img: HTMLImageElement, ctx: CanvasRenderingContext2D, canvas: any): void => {
        ctx.drawImage(img, 0, 0);
        const url = canvas.toDataURL(`image/${type}`).replace(`image/${type}`, 'image/octet-stream');
        downloadUrl(fileName, url, type);
    };

    svgToImage(entry, convert);
};
