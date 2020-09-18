import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import * as CST from '@models/constants';

import { AttributeService } from '@services/attribute/attribute.service';

@Component({
  selector: 'app-border',
  templateUrl: './border.component.html',
  styleUrls: ['./border.component.scss']
})
export class BorderComponent implements OnInit {

  @ViewChild('number', { static: true })
  numberIn: ElementRef<HTMLInputElement>;
  @ViewChild('slider', { static: true })
  sliderIn: ElementRef<HTMLInputElement>;

  border: string;
  // start:boolean = false;

  constructor(
    public attribute: AttributeService,
  ) { }

  ngOnInit(): void {
    this.border = '3'; // pour changer la valeur par default
    this.attribute.updateBorder(this.border);
  }

  checkValue(): void {
    const VALUE: number = parseInt(this.numberIn.nativeElement.value, 10);
    this.border = (VALUE < CST.VALUE_MIN_BORDER || VALUE.toString() === 'NaN') ? '3' : this.numberIn.nativeElement.value;
    this.border = (VALUE > CST.VALUE_MAX_BORDER) ? '12' : this.border;
    this.attribute.isActivate = false;
  }

  preciseWidth(): void {
    this.border = this.numberIn.nativeElement.value;
    this.attribute.updateBorder(this.border);

  }

  slideWidth(): void {
    this.border = this.sliderIn.nativeElement.value;
    this.attribute.updateBorder(this.border);
  }

  disabledKeyboard(): void {
    this.attribute.isActivate = true;
  }
}
