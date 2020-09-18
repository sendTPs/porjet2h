import { Renderer2, RendererFactory2, RendererStyleFlags2 } from '@angular/core';

export class DOMRenderer {
    static renderer: Renderer2;

    static init(rendererFactory: RendererFactory2): void {
        if (this.renderer === undefined) {
            DOMRenderer.renderer = rendererFactory.createRenderer(null, null);
        }
    }

    // tslint:disable: no-any
    static createElement(name: string, namespace?: string | undefined, attrs?: { [id: string]: string; }): any {
        const ret: any = DOMRenderer.renderer.createElement(name, namespace);
        if (attrs) {
            DOMRenderer.setAttributes(ret, attrs);
        }
        return ret;
    }

    static setAttribute(el: any, name: string, value: string, namespace?: string | null | undefined): void {
        return DOMRenderer.renderer.setAttribute(el, name, value, namespace);
    }

    static setAttributes(el: any, attrs: { [id: string]: string; }, namespace?: string | null | undefined): void {
        for (const key of Object.keys(attrs)) {
            DOMRenderer.setAttribute(el, key, attrs[key], namespace);
        }
    }

    static appendChild(parent: any, newChild: any): void {
        return DOMRenderer.renderer.appendChild(parent, newChild);
    }

    static removeChild(parent: any, oldChild: any, isHostElement?: boolean | undefined): void {
        return DOMRenderer.renderer.removeChild(parent, oldChild, isHostElement);
    }

    static setStyle(el: any, style: string, value: any, flags?: RendererStyleFlags2 | undefined): void {
        return DOMRenderer.renderer.setStyle(el, style, value, flags);
    }
}
