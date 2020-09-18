import { EventEmitter, Injectable, Output } from '@angular/core';

import * as CST from '@models/constants';
import { } from 'events';

@Injectable({ providedIn: 'root' })
export class AttributeService {

  width: string;
  border: string;
  tolerance: string;
  grille: string;
  isActivate: boolean;
  widthJonction: string;
  activateJonction: boolean;
  visibilityGrille: string;
  opacityGrille: string;

  @Output() obsGrilleOpacity: EventEmitter<string> = new EventEmitter();

  @Output() obsGrilleWidth: EventEmitter<string> = new EventEmitter();

  @Output() obsGrilleVisibility: EventEmitter<string> = new EventEmitter();

  constructor() {
    this.activateJonction = false;
    this.widthJonction = '10';
    this.width = '8';
    this.border = '3';
    this.grille = '20';
    this.isActivate = false;
    this.visibilityGrille = 'hidden';
    this.opacityGrille = '50';
    this.tolerance = '0';
  }

  toggleJonction(): void {
    this.activateJonction = !this.activateJonction;
  }

  toggleGrille(): void {
    this.visibilityGrille = (this.visibilityGrille === 'hidden') ? 'visible' : 'hidden';
    this.obsGrilleVisibility.emit(this.visibilityGrille);
  }

  updateWidthJonction(w: string): void {
    this.widthJonction = w;
  }

  updateWidth(w: string): void {
    this.width = w;
  }

  updateBorder(b: string): void {
    this.border = b;
  }

  updateOpacityGrille(g: string): void {
    this.opacityGrille = g;
    this.obsGrilleOpacity.emit(this.opacityGrille);
  }

  updateWidthGrille(g: string): void {
    this.grille = g;
    this.obsGrilleWidth.emit(this.grille);
  }

  upWidthGrille(): void {
    this.grille = (parseInt(this.grille, 10) + CST.GRID_P).toString();
    this.obsGrilleWidth.emit(this.grille);
  }

  downWidthGrille(): void {
    this.grille = (parseInt(this.grille, 10) - CST.GRID_M).toString();
    if (parseInt(this.grille, 10) < CST.GRID_M) {
      this.grille = '5';
    }
    this.obsGrilleWidth.emit(this.grille);
  }

  updateTolerance(t: string): void {
    this.tolerance = t;
  }
}
