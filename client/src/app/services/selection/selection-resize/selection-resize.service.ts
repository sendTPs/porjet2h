import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SelectionResizeService {

  constructor() { /*  */ }

  resizableLeft(): void {
    console.log('Left is working');
  }

  resizableRight(): void {
    console.log('Right is working');
  }

  resizableUp(): void {
    console.log('Up is working');
  }

  resizableDown(): void {
    console.log('Down is working');
  }
}
