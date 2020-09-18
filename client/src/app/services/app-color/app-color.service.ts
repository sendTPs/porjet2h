import { Injectable } from '@angular/core';

import * as CST from '@models/constants';
import { ToolInterface } from '@models/tool.interface';

import { ColorService } from '@services/color/color.service';
import { PipetteService } from '@services/pipette/pipette.service';

@Injectable({
  providedIn: 'root'
})
export class AppColorService implements ToolInterface {

  constructor(
    public pipette: PipetteService,
    public color: ColorService,
  ) { }

  start(event: MouseEvent): void {
    const element = event.target as HTMLElement;
    if ((element.tagName).toLocaleLowerCase() === 'svg') { return; }
    if (event.buttons === CST.MOUSE_PRIMARY_BUTTON) {
      this.setPrimeColor(element);
    }
    if (event.buttons === CST.MOUSE_SECONDARY_BUTTON) {
      this.setSecondColor(element);
    }
  }

  setPrimeColor(element: HTMLElement): void {
    const color = element.getAttribute('fill') as string;
    const isFillTransparent = (color.charAt(CST.INDEX_OPACITY) === 'a' && color.replace('\)', '').split(',')[CST.INDEX_OPACITY] === '0');
    if (isFillTransparent || (color === 'none')) {
      element.setAttribute('stroke', this.color.prime);
    } else {
      element.setAttribute('fill', this.color.prime);
    }
  }

  setSecondColor(element: HTMLElement): void {
    const color = element.getAttribute('fill') as string;
    const isFillTransparent = (color.charAt(CST.INDEX_OPACITY) === 'a' && color.replace('\)', '').split(',')[CST.INDEX_OPACITY] === '0');
    if (!isFillTransparent && !(color === 'none')) {
      element.setAttribute('stroke', this.color.second);
    }
  }

  end(): void { return; }
  draw(event: MouseEvent): void { return; }
  shortcut(event: KeyboardEvent, isMouseUp: boolean): void { return; }
}
