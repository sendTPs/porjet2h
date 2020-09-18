import { Injectable } from '@angular/core';

import { CommandService } from '@services/command/command.service';

@Injectable({
  providedIn: 'root'
})
export class CommandRotateService extends CommandService {

  constructor(
    public selectedElement: HTMLElement[],
    public oldValue: string[],
    public newValue: string[]) {
    super();
  }

  execute(): void {
    this.selectedElement.forEach((element, index) => {
      element.setAttribute('transform', this.newValue[index]);
    });
  }

  remove(): void {
    this.selectedElement.forEach((element, index) => {
      element.setAttribute('transform', this.oldValue[index]);
    });
  }
}
