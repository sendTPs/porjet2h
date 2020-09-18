import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';

import * as CST from '@models/constants';
import { Point2d } from '@models/point2d.class';

import { CommandManagerService } from '@services/command-manager/command-manager.service';
import { CommandMovingService } from '@services/command/commands/moving-command.service';
import { SelectionLogicService } from '@services/selection/selection-logic/selection-logic.service';
import { ToolService } from '@services/tool/tool.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionMoveService {

  renderer: Renderer2;
  elementSVG: HTMLElement;
  elementMove: HTMLElement;
  elementSVGSelection: HTMLElement;
  elementGSelection: HTMLElement;
  isMoving: boolean;
  position: Point2d;
  deplacement: Point2d;

  oldTransform: string[];

  constructor(
    public logic: SelectionLogicService,
    public commandManager: CommandManagerService,
    public tool: ToolService,
    protected rendererFactory: RendererFactory2,
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
    this.initialize();
  }

  initialize(): void {
    this.isMoving = false;
    this.position = new Point2d();
    this.deplacement = new Point2d();
  }

  createElementMoving(): void {
    this.tool.chooseTool(CST.HAND_SHORTCUT_EVENT);
    this.elementMove = this.renderer.createElement('rect', 'svg');
    this.elementMove.setAttribute('style', 'cursor: move');
    this.renderer.appendChild(this.elementSVG, this.elementMove);
    this.elementMove.addEventListener('mousemove', ($event) => this.mouseMove($event, false));
    this.elementMove.addEventListener('mouseup', ($event) => this.mouseUp($event));
    this.elementMove.setAttribute('x', '0');
    this.elementMove.setAttribute('y', '0');
    this.elementMove.setAttribute('width', '3000');
    this.elementMove.setAttribute('height', '2000');
    this.elementMove.setAttribute('fill', 'rgba(0,0,0,0)');
  }

  /*****  MOVING OBJECT FOR SELECTION TOOL ******/

  mouseDown(event: MouseEvent): void {
    console.log('pass through SelectionResize.MouseDown');
    this.createElementMoving();
    this.isMoving = true;
    this.position.x = event.offsetX;
    this.position.y = event.offsetY;
    this.oldTransform = this.logic.elementSelected.map((e) => e.getAttribute('transform') as string);
  }

  mouseMove(event: MouseEvent, arrow: boolean): void {
    if (this.isMoving) {
      if (arrow) {
        this.deplacement = new Point2d(event.x, event.y);
        this.position.x += this.deplacement.x;
        this.position.y += this.deplacement.y;
      } else {
        this.deplacement = new Point2d(event.offsetX - this.position.x, event.offsetY - this.position.y);
        this.position = new Point2d(event.offsetX, event.offsetY);
      }
      this.logic.elementSelected.forEach((element: HTMLElement) => {
        const transform = (element.getAttribute('transform') as string).replace(/translate\(|rotate\(|scale\(|\)/gi, '').split(' ');
        // tslint:disable-next-line: prefer-const
        let translate = transform[CST.TRANSLATE].split(',').map((x) => parseInt(x, 10));
        const transform2 = (element.getAttribute('transform') as string).split(' ');
        let restTransform = '';
        for (let i = 1; i < transform2.length; i++) {
          restTransform += ' ' + transform2[i];
        }
        if (transform2[0].charAt(0) === 't') {
          translate[CST.X] += this.deplacement.x;
          translate[CST.Y] += this.deplacement.y;
          element.setAttribute('transform',
            'translate(' + translate[CST.X] + ',' + translate[CST.Y] + ')' + restTransform);
        } else {
          translate[CST.X] = this.deplacement.x;
          translate[CST.Y] = this.deplacement.y;
          element.setAttribute('transform',
            'translate(' + translate[CST.X] + ',' + translate[CST.Y] + ') ' + element.getAttribute('transform') as string);
        }

      });
    }

  }

  mouseUp(event: MouseEvent): void {
    this.tool.chooseTool(CST.SELECT_SHORTCUT_EVENT);
    this.elementMove.remove();
    this.isMoving = false;
    const newTransform = this.logic.elementSelected.map((e) => e.getAttribute('transform') as string);
    const command = new CommandMovingService(this.logic.elementSelected, this.oldTransform, newTransform);
    this.commandManager.add(command);
  }
}
