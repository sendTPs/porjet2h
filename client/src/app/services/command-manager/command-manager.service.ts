import { Injectable } from '@angular/core';

import { CommandService } from '@services/command/command.service';

@Injectable({
  providedIn: 'root'
})
export class CommandManagerService {

  commandDone: CommandService[];
  commandUndone: CommandService[];

  constructor() {
    this.commandDone = new Array<CommandService>();
    this.commandUndone = new Array<CommandService>();
  }

  undo(): void {
    const commandToUndo = this.commandDone.pop();
    if (commandToUndo !== undefined) {
      commandToUndo.remove();
      this.commandUndone.push(commandToUndo);

    }
  }
  redo(): void {
    const commandToRedo = this.commandUndone.pop();
    if (commandToRedo !== undefined) {
      commandToRedo.execute();
      this.commandDone.push(commandToRedo);
    }
  }

  add(command: CommandService): void {
    this.commandDone.push(command);
    this.commandUndone = new Array<CommandService>();
  }
}
