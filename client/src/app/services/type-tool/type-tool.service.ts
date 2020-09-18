import { Injectable } from '@angular/core';

import * as CST from '@models/constants';

import { ToolService } from '@services/tool/tool.service';

@Injectable({ providedIn: 'root' })
export class TypeToolService {

  typeManipulation: Map<number, string>;
  activatedManipulation: string;

  typeBrush: Map<number, string>;
  activatedTypeBrush: string;

  typePolygon: Map<number, string>;
  activatedTypePolygon: string;
  typePolygonToActivate: Map<string, KeyboardEvent>;

  typeColorTool: Map<number, string>;
  activatedTypeColorTool: string;
  typeColorToolToActivate: Map<string, KeyboardEvent>;

  constructor(public tool: ToolService) {
    // this.typeManipulation = new Map<number, string>();
    // this.typeManipulation
    //   .set(CST.INDEX_CUT, 'cut')
    //   .set(CST.INDEX_COPY, 'copy')
    //   .set(CST.INDEX_PASTE, 'paste')
    //   .set(CST.INDEX_DUPLICATE, 'duplicate')
    //   .set(CST.INDEX_DELETE, 'delete');

    this.typeBrush = new Map<number, string>();
    this.typeBrush
      .set(CST.INDEX_NORMAL, 'normal')
      .set(CST.INDEX_BLUR, 'blur')
      .set(CST.INDEX_TROUBLE, 'trouble')
      .set(CST.INDEX_OUTSET, 'outset')
      .set(CST.INDEX_SHADOW, 'shadow')
      .set(CST.INDEX_ROUND, 'round');
    this.activatedTypeBrush = 'normal';

    this.typePolygon = new Map<number, string>();
    this.typePolygon
      .set(CST.INDEX_RECT, 'rectangle')
      .set(CST.INDEX_ELLIPSE, 'ellipse')
      .set(CST.INDEX_POLY, 'polygon');
    this.typePolygonToActivate = new Map<string, KeyboardEvent>();
    this.typePolygonToActivate
      .set('rectangle', CST.RECTANGLE_SHORTCUT_EVENT)
      .set('ellipse', CST.ELLIPSE_SHORTCUT_EVENT)
      .set('polygon', CST.POLYGON_SHORTCUT_EVENT);
    this.activatedTypePolygon = 'rectangle';

    this.typeColorTool = new Map<number, string>();
    this.typeColorTool
      .set(CST.INDEX_PIPETTE, 'pipette')
      .set(CST.INDEX_APPLICATOR, 'applicator')
      .set(CST.INDEX_BUCKET, 'bucket');
    this.typeColorToolToActivate = new Map<string, KeyboardEvent>();
    this.typeColorToolToActivate
      .set('pipette', CST.PIPETTE_SHORTCUT_EVENT)
      .set('applicator', CST.APPLICATOR_SHORTCUT_EVENT)
      .set('bucket', CST.BUCKET_SHORTCUT_EVENT);
    this.activatedTypeColorTool = 'pipette';
  }

  toggledOptionBrush(key: number): void {
    if (this.typeBrush.has(key)) {
      this.activatedTypeBrush = this.typeBrush.get(key) as string;
    }
  }

  toggledOptionPolygon(key: number): void {
    if (this.typePolygon.has(key)) {
      this.activatedTypePolygon = this.typePolygon.get(key) as string;
      this.tool.chooseTool(this.typePolygonToActivate.get(this.activatedTypePolygon) as KeyboardEvent);
    }
  }

  toggledOptionColor(key: number): void {
    if (this.typeColorTool.has(key)) {
      this.activatedTypeColorTool = this.typeColorTool.get(key) as string;
      this.tool.chooseTool(this.typeColorToolToActivate.get(this.activatedTypeColorTool) as KeyboardEvent);
    }
  }

}
