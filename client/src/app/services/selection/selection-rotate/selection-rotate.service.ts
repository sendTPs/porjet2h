import { Injectable } from '@angular/core';
import { CommandManagerService } from '@app/services/command-manager/command-manager.service';
import { CommandRotateService } from '@app/services/command/commands/rotate-command.service';
import * as CST from '@models/constants';
import { SelectionLogicService } from '../selection-logic/selection-logic.service';

@Injectable({
  providedIn: 'root'
})
export class SelectionRotateService {

  altPressed: boolean;
  shiftPressed: boolean;

  constructor(
    public logic: SelectionLogicService,
    public commandManager: CommandManagerService,
  ) {
    this.altPressed = false;
    this.shiftPressed = false;
  }

  wheelUse(event: WheelEvent): void {
    event.preventDefault();
    // console.log(event.deltaY);
    let angle = 0;
    if (event.deltaY > 0) {
      angle += (this.altPressed) ? 1 : CST.DEFAULT_DEG15;
    } else {
      angle -= (this.altPressed) ? 1 : CST.DEFAULT_DEG15;
    }
    const transformOldSave: string[] = [];
    const transformNewSave: string[] = [];
    this.logic.elementSelected.forEach((element: HTMLElement) => {
      if (!element.getAttribute('transform')) {
        element.setAttribute('transform', 'translate(0,0) rotate(0,0,0)');
      }
      if (!element.getAttribute('centerElement')) {
        element.setAttribute('centerElement', this.getCenterCoordonnates(element));
      }
      if (!element.getAttribute('angle')) {
        element.setAttribute('angle', '0');
      }
      transformOldSave.push(element.getAttribute('transform') as string);
      const transform = (element.getAttribute('transform') as string).replace(/translate\(|rotate\(|\)/gi, '').split(' ');
      const rotate = transform[0].split(',');
      // element.setAttribute('angle', rotate[0].toString());

      const transform2 = (element.getAttribute('transform') as string).split(' ');
      let restTransform = '';
      for (let i = 1; i < transform2.length; i++) {
        restTransform += ' ' + transform2[i];
      }
      let centerActionG: string;
      if (this.shiftPressed) {
        centerActionG = this.getCenterCoordonnates(element);
      } else {
        centerActionG = this.getCenterCoordonnates(this.logic.elementActionG);
      }
      const center = centerActionG.split(':');
      if (`${rotate[1]}:${rotate[2]}` === centerActionG && transform2[0].charAt(0) === 'r') {
        rotate[0] = (parseInt(rotate[0], 10) + angle).toString();
        element.setAttribute('transform',
          'rotate(' + rotate[0] + ',' + center[CST.X] + ',' + center[CST.Y] + ')' +
          restTransform);
        transformNewSave.push(element.getAttribute('transform') as string);
      } else {
        rotate[0] = (angle).toString();
        element.setAttribute('transform',
          'rotate(' + rotate[0] + ',' + center[CST.X] + ',' + center[CST.Y] + ') ' + element.getAttribute('transform'));
        transformNewSave.push(element.getAttribute('transform') as string);
      }
    });
    const command = new CommandRotateService(this.logic.elementSelected, transformOldSave, transformNewSave);
    this.commandManager.add(command);
  }

  private getCenterCoordonnates(element: HTMLElement): string {
    const left = element.getBoundingClientRect().left;
    const top = element.getBoundingClientRect().top;
    const bottom = element.getBoundingClientRect().bottom;
    const right = element.getBoundingClientRect().right;
    const leftSVG = this.logic.elementSVG.getBoundingClientRect().left;
    const topSVG = this.logic.elementSVG.getBoundingClientRect().top;
    const offsetCenterX = Math.round(((right + left) / 2) - leftSVG);
    const offsetCenterY = Math.round(((bottom + top) / 2) - topSVG);
    return `${offsetCenterX}:${offsetCenterY}`;

  }

  shortcutALT(myEvent: KeyboardEvent, isMouseUp: boolean): void {
    if (this.logic.isEquivalent(myEvent, CST.ALTDOWN_SHORTCUT_EVENT) && !isMouseUp && !this.altPressed) {
      this.altPressed = true;
    }
    if (this.logic.isEquivalent(myEvent, CST.ALTUP_SHORTCUT_EVENT) && isMouseUp && this.altPressed) {
      this.altPressed = false;
    }
  }

  shortcutSHIFT(myEvent: KeyboardEvent, isMouseUp: boolean): void {
    if (this.logic.isEquivalent(myEvent, CST.SHIFTDOWN_SHORTCUT_EVENT) && !isMouseUp && !this.shiftPressed) {
      this.shiftPressed = true;
    }
    if (this.logic.isEquivalent(myEvent, CST.SHIFTUP_SHORTCUT_EVENT) && isMouseUp && this.shiftPressed) {
      this.shiftPressed = false;
    }
  }
}
