import { Injectable, Renderer2 } from '@angular/core';

import * as CST from '@models/constants';

@Injectable({
  providedIn: 'root'
})

export class ToolService {

  renderer: Renderer2;
  toolMapString: Map<string, string>;
  toolMap: Map<string, string>;
  tool: string;
  toolActivateToString: string;

  constructor() {
    this.toolMap = new Map<string, string>();
    this.toolMapString = new Map<string, string>();
    this.tool = CST.PENCIL_KEY;
    this.toolActivateToString = 'pencil';
    this.toolMapString
      .set(CST.PENCIL_KEY, 'pencil')
      .set(CST.BRUSH_KEY, 'pencil')
      .set(CST.LINE_KEY, 'line')
      .set(CST.SPRAY_KEY, 'spray')
      .set(CST.RECTANGLE_KEY, 'rectangle')
      .set(CST.ELLIPSE_KEY, 'rectangle')
      .set(CST.POLYGON_KEY, 'rectangle')
      .set(CST.SELECTION_KEY, 'selection')
      .set(CST.HAND_KEY, 'selection')
      .set(CST.PIPETTE_KEY, 'pipette')
      .set(CST.APP_COLOR_KEY, 'pipette')
      .set(CST.BUCKET_KEY, 'pipette')
      .set(CST.GRILLE_KEY, 'grille')
      .set(CST.ERASER_KEY, 'eraser');
    this.toolMap
      .set(CST.PENCIL_KEY, CST.PENCIL_KEY)
      .set(CST.BRUSH_KEY, CST.BRUSH_KEY)
      .set(CST.LINE_KEY, CST.LINE_KEY)
      .set(CST.SPRAY_KEY, CST.SPRAY_KEY)
      .set(CST.RECTANGLE_KEY, CST.RECTANGLE_KEY)
      .set(CST.ELLIPSE_KEY, CST.ELLIPSE_KEY)
      .set(CST.POLYGON_KEY, CST.POLYGON_KEY)
      .set(CST.SELECTION_KEY, CST.SELECTION_KEY)
      .set(CST.HAND_KEY, CST.HAND_KEY)
      .set(CST.GRILLE_KEY, CST.HAND_KEY)
      .set(CST.PIPETTE_KEY, CST.PIPETTE_KEY)
      .set(CST.ERASER_KEY, CST.ERASER_KEY)
      .set(CST.APP_COLOR_KEY, CST.APP_COLOR_KEY)
      .set(CST.BUCKET_KEY, CST.BUCKET_KEY);
  }

  getToolActivateToString(): string {
    return this.toolActivateToString;
  }

  chooseTool(event: KeyboardEvent): boolean {
    let key = event.key;
    key += (event.ctrlKey ? '1' : '0') + (event.altKey ? '1' : '0') + (event.shiftKey ? '1' : '0');
    if (this.toolMap.has(key)) {
      if (this.tool === this.toolMap.get(key)) {
        this.toolActivateToString = this.toolMapString.get(key) as string;
      } else {
        this.tool = this.toolMap.get(key) as string;
        this.toolActivateToString = this.toolMapString.get(key) as string;
        // console.log(this.tool);
        return true;
      }
    }
    // console.log(this.tool);
    return false;
  }

}
