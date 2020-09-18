import { Injectable, Renderer2 } from '@angular/core';

import { ToolInterface } from '@models/tool.interface';

import { SELECTION_KEY } from '@app/models/constants';
import { AttributeService } from '@services/attribute/attribute.service';
import { ToolService } from '../tool/tool.service';

@Injectable({
  providedIn: 'root'
})
export class HandToolService implements ToolInterface {

  renderer: Renderer2;

  constructor(public attribute: AttributeService, public tool: ToolService) { }

  start(event: MouseEvent): void {
    this.tool.tool = SELECTION_KEY;
  }
  end(): void {
    // throw new Error("Method not implemented.");
  }
  draw(event: MouseEvent): void {
    // throw new Error("Method not implemented.");
  }
  shortcut(event: KeyboardEvent, isMouseUp: boolean): void {
    if (event.key === '+' && !isMouseUp) {
      this.attribute.upWidthGrille();
    }
    if (event.key === '-' && !isMouseUp) {
      this.attribute.downWidthGrille();
    }

  }

}
