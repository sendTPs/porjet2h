import { Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import * as CST from '@models/constants';
import { CommandManagerService } from '../command-manager/command-manager.service';
import { CommandDuplicateService } from '../command/commands/duplicate-command.service';
import { CommandEraseService } from '../command/commands/erase-command.service';
import { SelectionLogicService } from '../selection/selection-logic/selection-logic.service';
import { SelectionService } from '../selection/selection-tool/selection.service';
import { ToolService } from '../tool/tool.service';

@Injectable({
  providedIn: 'root'
})
export class ClipboardService {

  elementSVG: HTMLElement;
  private offset: number;
  private renderer: Renderer2;

  constructor(
    public commandManager: CommandManagerService,
    public tool: ToolService,
    public selectionElement: SelectionLogicService,
    public selection: SelectionService,
    protected renderFactory: RendererFactory2,
  ) {
    this.offset = 0;
    this.renderer = renderFactory.createRenderer(null, null);
  }

  copy(): void {
    if (this.selectionElement.elementSelected.length > 1) {
      this.offset = 0;
      let elemString = '';
      for (let index = 0; index < this.selectionElement.elementSelected.length - 1; index++) {
        const element = this.selectionElement.elementSelected[index];
        elemString += element.outerHTML;
      }
      navigator.clipboard.writeText(elemString).then(() => {
        this.elementSVG.removeChild(this.selection.elementActionG);
      });
    }
  }

  async paste(): Promise<void> {
    this.offset++;
    this.selectionElement.elementSelected = [];
    console.log('paste');

    return await navigator.clipboard.readText().then((text) => {
      this.tool.tool = CST.HAND_KEY;
      this.selection.erase();
      this.tool.tool = CST.SELECTION_KEY;
      const wrapper: HTMLElement = this.renderer.createElement('div', 'svg');
      wrapper.innerHTML = text;
      const duplicatedGElement = new Array<HTMLElement>();
      const newElementG = this.renderer.createElement('g', 'svg');
      wrapper.childNodes.forEach((elementNode) => {
        const element = elementNode as HTMLElement;
        newElementG.appendChild(element);
        this.elementSVG.appendChild(newElementG);
        this.selection.sketch.add(element);
        this.selectionElement.elementSelected.push(element);
      });
      duplicatedGElement.push(newElementG);
      const command = new CommandDuplicateService(this.selection.sketch, duplicatedGElement, this.elementSVG);
      this.commandManager.add(command);
      this.selection.logic.selectedByRectangle();
      this.selection.createRectangleAction();
      this.shiftElement();
    });

  }

  duplicate(): void {
    this.offset++;
    const duplicatedElement = new Array<HTMLElement>();
    const duplicatedGElement = new Array<HTMLElement>();
    this.selectionElement.elementSelected.forEach((element) => {
      if (element !== this.selection.elementActionG) {
        const elementClone = element.cloneNode() as HTMLElement;
        duplicatedElement.push(elementClone);
        const newElementG = this.renderer.createElement('g', 'svg');
        newElementG.appendChild(elementClone);
        this.elementSVG.appendChild(newElementG);
        this.selection.sketch.add(elementClone);
      }
    });
    this.elementSVG.removeChild(this.selection.elementActionG);
    const command = new CommandDuplicateService(this.selection.sketch, duplicatedGElement, this.elementSVG);
    this.commandManager.add(command);
    this.selectionElement.elementSelected = duplicatedElement;
    this.selection.logic.selectedByRectangle();
    this.selection.createRectangleAction();
    this.shiftElement();
    this.offset = 0;
  }

  delete(): void {
    if (this.selectionElement.elementSelected.length > 1) {
      const command = new CommandEraseService(this.selection.sketch, this.selectionElement.elementSelected, this.elementSVG);
      this.commandManager.add(command);

      this.selectionElement.elementSelected.forEach((element) => {
        if (element !== this.selection.elementActionG) {
          this.elementSVG.removeChild(element.parentElement as HTMLElement);
        }
      });
      this.elementSVG.removeChild(this.selection.elementActionG);
    }
  }

  cut(): void {
    this.copy();
    this.delete();
  }

  shiftElement(): void {
    const svgRight = this.elementSVG.getBoundingClientRect().right;
    const elementRight = this.selection.elementActionG.getBoundingClientRect().right;
    const svgBottom = this.elementSVG.getBoundingClientRect().bottom;
    const elementBottom = this.selection.elementActionG.getBoundingClientRect().bottom;

    if (elementRight + (this.offset * CST.OFFSET_EVENT.x) > svgRight) {
      this.offset = 0;
    }
    if (elementBottom + (this.offset * CST.OFFSET_EVENT.y) > svgBottom) {
      this.offset = 0;
    }
    for (let index = 0; index < this.offset; index++) {
      this.selection.move.isMoving = true;
      this.selection.move.mouseMove(CST.OFFSET_EVENT, true);
      this.selection.move.isMoving = false;
    }
  }
}
