import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export abstract class CommandService {

  constructor() { return; }

  execute(): void { return; }

  remove(): void { return; }

}
