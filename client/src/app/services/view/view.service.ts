import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  hideNow: boolean;

  constructor() {
    this.hideNow = false;
  }

  @Output() change: EventEmitter<boolean> = new EventEmitter();

  hideColor(): void {
    this.hideNow = !this.hideNow;
    this.change.emit(this.hideNow);
  }
}
