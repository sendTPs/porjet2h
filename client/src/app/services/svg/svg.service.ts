import { ElementRef, Injectable } from '@angular/core';
import { SVGAbstract } from '@services/svg/element/svg.abstract';
import { DOMRenderer } from '@utils/dom-renderer';
import { Rect } from '@utils/geo-primitives';
import { vectorPlus } from '@utils/math';

@Injectable({
    providedIn: 'root',
})
export class SVGService {
    entry: ElementRef;
    private mCursor: string;

    objects: SVGAbstract[] = [];

    constructor() {/*  */ }

    set cursor(cursor: string) {
        this.mCursor = cursor;
    }

    get cursor(): string {
        return this.mCursor;
    }

    resetCursor(): void {
        this.cursor = 'crosshair';
    }

    findAt(x: number, y: number): SVGAbstract | null {
        for (let i = this.objects.length - 1; i >= 0; --i) {
            if (this.objects[i].isAt(x, y)) {
                return this.objects[i];
            }
        }
        return null;
    }

    findIn(x: number, y: number, r: number): (SVGAbstract | null)[] {
        const elements: (SVGAbstract | null)[] = [];

        const DISTANCE = 2.0;

        // tslint:disable: no-magic-numbers
        const angle = Math.acos(((DISTANCE * DISTANCE) - (2 * r * r)) / (- 2 * r * r));
        const circleCenter = [x, y];

        for (let currentAngle = 0; currentAngle < 2 * Math.PI; currentAngle += angle) {
            const pointOffset = [r * Math.sin(currentAngle), r * Math.cos(currentAngle)];
            const findAtPosition = vectorPlus(circleCenter, pointOffset);
            const elementFound = this.findAt(findAtPosition[0], findAtPosition[1]);

            if (!elements.find((element: SVGAbstract | null) => element === elementFound)) {
                elements.push(elementFound);
            }
        }
        return elements;
    }

    inRectangle(rect: Rect): SVGAbstract | null {
        const MIN_WIDTH = 5.0;

        for (let i = this.objects.length - 1; i >= 0; i--) {
            // tslint:disable: no-any
            const box: any = this.getElementRect(this.objects[i].element);

            if (box.width === 0 || box.height === 0) {
                box.x -= MIN_WIDTH / 2;
                box.y -= MIN_WIDTH / 2;
                box.width = MIN_WIDTH;
                box.height = MIN_WIDTH;
            }

            if (rect.intersect(new Rect(box.x, box.y, box.x + box.width, box.y + box.height))) {
                return this.objects[i];
            }
        }

        return null;
    }

    addObject(obj: SVGAbstract | null): void {
        if (obj === null) {
            return;
        }
        if (obj.element === null) {
            return;
        }

        this.objects.push(obj);
        DOMRenderer.appendChild(this.entry.nativeElement, obj.element);

    }

    addObjectToPosition(obj: SVGAbstract, index: number): void {
        const deleted: SVGAbstract[] = this.objects.slice(index, this.objects.length);

        deleted.forEach((element) => {
            this.removeObject(element);
        });

        this.addObject(obj);

        deleted.forEach((element) => {
            this.addObject(element);
        });
    }

    removeObject(obj: SVGAbstract | null): void {
        if (obj === null || obj.element === null) {
            return;
        }

        DOMRenderer.removeChild(this.entry.nativeElement, obj.element);

        let index = 0;
        for (const o of this.objects) {
            if (o === obj) {
                break;
            }

            index++;
        }

        this.objects.splice(index, 1);
    }

    addElement(element: any): void {
        if (this.entry) {
            DOMRenderer.appendChild(this.entry.nativeElement, element);
        }
    }

    removeElement(element: any): void {
        if (this.entry) {
            DOMRenderer.removeChild(this.entry.nativeElement, element);
        }
    }

    getElementRect(element: any): DOMRect {
        const entryPositions = this.entry.nativeElement.getBoundingClientRect();
        const rect: DOMRect = element.getBoundingClientRect();

        rect.x -= entryPositions.left;
        rect.y -= entryPositions.top;

        return rect;
    }

    clearObjects(): void {
        const ref = this.entry.nativeElement;
        while (ref.hasChildNodes()) {
            ref.removeChild(ref.firstChild);
        }

        this.objects = [];

        DOMRenderer.appendChild(this.entry.nativeElement, this.createBlurFilter());
        DOMRenderer.appendChild(this.entry.nativeElement, this.createOpacityFilter());
        DOMRenderer.appendChild(this.entry.nativeElement, this.createTurbulenceFilter());
        DOMRenderer.appendChild(this.entry.nativeElement, this.createEraseFilter());
    }

    private createBlurFilter(): any {
        const renderer = DOMRenderer;
        const filterBlur = renderer.createElement('filter', 'svg');
        renderer.setAttribute(filterBlur, 'id', 'blur');
        renderer.setAttribute(filterBlur, 'x', '-20');
        renderer.setAttribute(filterBlur, 'width', '200');
        renderer.setAttribute(filterBlur, 'y', '-20');
        renderer.setAttribute(filterBlur, 'height', '200');
        const filterBlurContent = renderer.createElement('feGaussianBlur', 'svg');
        renderer.setAttribute(filterBlurContent, 'stdDeviation', '4');
        renderer.appendChild(filterBlur, filterBlurContent);

        return filterBlur;
    }

    private createOpacityFilter(): any {
        const renderer = DOMRenderer;
        const filterOpacity = renderer.createElement('filter', 'svg');
        renderer.setAttribute(filterOpacity, 'id', 'opacity');
        renderer.setAttribute(filterOpacity, 'x', '-20');
        renderer.setAttribute(filterOpacity, 'width', '200');
        renderer.setAttribute(filterOpacity, 'y', '-20');
        renderer.setAttribute(filterOpacity, 'height', '200');
        const filterContent = renderer.createElement('feComponentTransfer', 'svg');

        const filterSubContent = renderer.createElement('feFuncA', 'svg');
        renderer.setAttribute(filterSubContent, 'type', 'table');
        renderer.setAttribute(filterSubContent, 'tableValues', '0 0.5');
        renderer.appendChild(filterContent, filterSubContent);

        renderer.appendChild(filterOpacity, filterContent);

        return filterOpacity;
    }

    private createTurbulenceFilter(): any {
        const renderer = DOMRenderer;
        const filterTurbulence = renderer.createElement('filter', 'svg');
        renderer.setAttribute(filterTurbulence, 'id', 'turbulence');

        const filterContent = renderer.createElement('feTurbulence', 'svg');
        renderer.setAttribute(filterContent, 'type', 'turbulence');
        renderer.setAttribute(filterContent, 'baseFrequency', '0.05');
        renderer.setAttribute(filterContent, 'numOctaves', '2');
        renderer.setAttribute(filterContent, 'result', 'turbulence');

        const filterSubContent = renderer.createElement('feDisplacementMap', 'svg');
        renderer.setAttribute(filterSubContent, 'in2', 'turbulence');
        renderer.setAttribute(filterSubContent, 'in', 'SourceGraphic');
        renderer.setAttribute(filterSubContent, 'scale', '50');
        renderer.setAttribute(filterSubContent, 'xChannelSelector', 'R');
        renderer.setAttribute(filterSubContent, 'yChannelSelector', 'G');

        renderer.appendChild(filterTurbulence, filterContent);
        renderer.appendChild(filterTurbulence, filterSubContent);

        return filterTurbulence;
    }

    private createEraseFilter(): any {
        const renderer = DOMRenderer;
        const filterTurbulence = renderer.createElement('filter', 'svg');
        renderer.setAttribute(filterTurbulence, 'id', 'erase');

        const blur = renderer.createElement('feGaussianBlur', 'svg');
        renderer.setAttribute(blur, 'in', 'SourceAlpha');
        renderer.setAttribute(blur, 'stdDeviation', '1.7');
        renderer.setAttribute(blur, 'result', 'blur');

        const offset = renderer.createElement('feOffset', 'svg');
        renderer.setAttribute(offset, 'in', 'blur');
        renderer.setAttribute(offset, 'dx', '3');
        renderer.setAttribute(offset, 'dy', '3');
        renderer.setAttribute(offset, 'result', 'offsetBlur');

        const flood = renderer.createElement('feFlood', 'svg');
        renderer.setAttribute(flood, 'flood-color', 'red');
        renderer.setAttribute(flood, 'flood-opacity', '0.2');
        renderer.setAttribute(flood, 'result', 'offsetColor');

        const composite = renderer.createElement('feComposite', 'svg');
        renderer.setAttribute(composite, 'in', 'blur');
        renderer.setAttribute(composite, 'dx', '3');
        renderer.setAttribute(composite, 'dy', '3');
        renderer.setAttribute(composite, 'result', 'offsetBlur');

        renderer.appendChild(filterTurbulence, blur);
        renderer.appendChild(filterTurbulence, offset);
        renderer.appendChild(filterTurbulence, flood);
        renderer.appendChild(filterTurbulence, composite);

        return filterTurbulence;
    }

    getInRect(rect: Rect): Set<SVGAbstract> {
        const matches: Set<SVGAbstract> = new Set<SVGAbstract>([]);

        const MIN_WIDTH = 5.0;

        this.objects.forEach((obj) => {
            const box: any = this.getElementRect(obj.element);

            if (box.width === 0 || box.height === 0) {
                box.x -= MIN_WIDTH / 2;
                box.y -= MIN_WIDTH / 2;
                box.width = MIN_WIDTH;
                box.height = MIN_WIDTH;
            }

            if (rect.intersect(new Rect(box.x, box.y, box.x + box.width, box.y + box.height))) {
                matches.add(obj);
            }
        });
        return matches;
    }

}
