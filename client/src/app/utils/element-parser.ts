import { ElementRef } from '@angular/core';
// import { DrawAreaHolder } from 'src/services/draw-area/draw-area-holder';
// import { SVGAbstract } from 'src/services/svg/element/svg.abstract';
// import { SVGService } from 'src/services/svg/svg.service';
import { DOMRenderer } from '../utils/dom-renderer';
// import { MatrixSVG } from './matrix';
// import { Prototypes } from './prototypes';

export const svgToImage = (entry: ElementRef, fn: (
    svgImage: HTMLImageElement,
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement) => void): void => {

    const canvas: HTMLCanvasElement = DOMRenderer.createElement('canvas');

    DOMRenderer.setAttribute(canvas, 'width',
        entry.nativeElement.attributes.width.nodeValue);
    DOMRenderer.setAttribute(canvas, 'height',
        entry.nativeElement.attributes.height.nodeValue);

    const ctx: CanvasRenderingContext2D | null = canvas.getContext('2d');

    if (!ctx) {
        return;
    }

    // wait for html to get updated
    setTimeout(() => {
        const svgOuterHTML = entry.nativeElement.outerHTML;
        const svgImage: HTMLImageElement = new Image();

        svgImage.onload = () => fn(svgImage, ctx, canvas);
        svgImage.src = 'data:image/svg+xml;base64,' + window.btoa(svgOuterHTML);
    }, 0);
};
/*
export const serializeDrawArea = (svgService: SVGService): DrawAreaHolder => {
    const holder = new DrawAreaHolder();

    holder.entry = svgService.entry.nativeElement.outerHTML;

    holder.elements = [];
    for (const obj of svgService.objects) {
        holder.elements.push(serializeSVG(obj));
    }

    return holder;
};

export const populateDrawArea = (svgService: SVGService, holder: DrawAreaHolder): void => {
    svgService.clearObjects();
    for (const e of holder.elements) {
        svgService.addObject(deserializeSVG(e));
    }
};

const serializeSVG = (element: SVGAbstract): string => {
    const holder = new ElementHolder();

    holder.type = element.constructor.name;
    holder.elementData = element;
    holder.svgData = element.element.outerHTML;

    return JSON.stringify(holder);
};

const deserializeSVG = (json: string): SVGAbstract => {
    const element: any = JSON.parse(json);

    const svgElement: SVGAbstract = element.elementData;
    Object.setPrototypeOf(svgElement, Prototypes.get(element.type));

    const fakeElement = new DOMParser().parseFromString(element.svgData, 'image/svg+xml').children[0];

    svgElement.element = recreateElement(fakeElement);
    Object.setPrototypeOf(svgElement.matrix, MatrixSVG.prototype);

    return svgElement;
};

export const copySVG = (svg: SVGAbstract): SVGAbstract => {
    return deserializeSVG(serializeSVG(svg));
};

/**
 * The parsed elements dont keep their namespace, we need to recreate their attributes and children.
 */

/*
export const recreateElement = (realElement: any): any => {
   const fakeElement = DOMRenderer.createElement(realElement.nodeName, 'svg');

   for (const attribute of realElement.attributes) {
       DOMRenderer.setAttribute(fakeElement, attribute.nodeName, attribute.nodeValue);
   }

   if (realElement.children.length !== 0) {
       for (const child of realElement.children) {
           DOMRenderer.appendChild(fakeElement, recreateElement(child));
       }
   } else {
       fakeElement.innerHTML = realElement.innerHTML;
   }

   return fakeElement;
};

// tslint:disable-next-line: max-classes-per-file
class ElementHolder {
   type: string;
   elementData: SVGAbstract;
   svgData: string;
}*/
