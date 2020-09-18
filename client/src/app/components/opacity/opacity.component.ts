import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import * as CST from '@models/constants';

import { AttributeService } from '@services/attribute/attribute.service';

@Component({
  selector: 'app-opacity',
  templateUrl: './opacity.component.html',
  styleUrls: ['./opacity.component.scss']
})
export class OpacityComponent implements OnInit {

  @ViewChild('number', { static: true })
  numberIn: ElementRef<HTMLInputElement>;
  @ViewChild('slider', { static: true })
  sliderIn: ElementRef<HTMLInputElement>;

  opacity: string;

  constructor(public attribute: AttributeService) { }

  ngOnInit(): void {
    this.opacity = '50'; // pour changer la valeur par default
    this.attribute.updateOpacityGrille(this.opacity);
  }

  checkValue(): void {
    const VALUE: number = parseInt(this.numberIn.nativeElement.value, 10);
    this.opacity = (VALUE < CST.MIN_GRID_OPACITY || VALUE.toString() === 'NaN') ? '10' : this.numberIn.nativeElement.value;
    this.opacity = (VALUE > CST.MAX_GRID_OPACITY) ? '99' : this.opacity;
    this.attribute.isActivate = false;
  }

  preciseWidth(): void {
    this.opacity = this.numberIn.nativeElement.value;
    this.attribute.updateOpacityGrille(this.opacity);

  }

  slideWidth(): void {
    this.opacity = this.sliderIn.nativeElement.value;
    this.attribute.updateOpacityGrille(this.opacity);
  }

  disabledKeyboard(): void {
    this.attribute.isActivate = true;
  }

}
