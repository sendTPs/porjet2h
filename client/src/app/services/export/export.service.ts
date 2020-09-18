import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

import { AttributeService } from '@services/attribute/attribute.service';
import { DrawingOptionService } from '@services/drawing-option/drawing-option.service';
@Injectable({
  providedIn: 'root'
})
export class ExportService {

  renderer: Renderer2;
  mode: string;
  elementCanvas: HTMLCanvasElement;
  elementIMG: HTMLElement;
  elementLINK: HTMLElement;
  elementSVG: HTMLElement;
  filename: string;
  name: string;
  // tslint:disable-next-line: no-any
  filter: any;
  // tslint:disable-next-line: no-any
  object: any;

  constructor(
    public rendererFactory: RendererFactory2,
    private attribute: AttributeService,
    public drawOption: DrawingOptionService,
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }

  saveSVG(): void {

    const parent = this.elementSVG.parentElement;
    this.object = this.elementSVG.cloneNode(true);
    let grid = false;

    if (this.attribute.visibilityGrille === 'visible') {
      this.attribute.toggleGrille();
      grid = true;
    }

    const div = this.renderer.createElement('div');

    this.object.setAttribute('style',
      `background-color: ${this.drawOption.backgroundColor};
         height: ${this.drawOption.height};
         width: ${this.drawOption.width};`);
    this.object.setAttribute('filter', this.filter);

    this.renderer.appendChild(div, this.object);
    const xml = new XMLSerializer().serializeToString(div);
    const img = new Image();
    img.src = 'data:image/svg+xml;base64,' + btoa(xml);

    // this.renderer.removeAttribute(this.elementSVG, 'filter');
    this.renderer.appendChild(parent, this.object);
    this.elementLINK.setAttribute('href', img.src);
    this.elementLINK.setAttribute('download', this.name + '.' + 'svg');
    this.elementLINK.click();

    if (grid) {
      this.attribute.toggleGrille();
    }
  }

}
