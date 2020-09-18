import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import * as CST from '@models/constants';
import { AttributeService } from '@services/attribute/attribute.service';

@Component({
  selector: 'app-tolerance',
  templateUrl: './tolerance.component.html',
  styleUrls: ['./tolerance.component.scss']
})
export class ToleranceComponent implements OnInit {

  @ViewChild('number', { static: true })
  numberIn: ElementRef<HTMLInputElement>;
  @ViewChild('slider', { static: true })
  sliderIn: ElementRef<HTMLInputElement>;

  tolerance: string;

  constructor(
    public attribute: AttributeService,
  ) { }

  ngOnInit(): void {
    this.tolerance = '20'; // pour changer la valeur par default
    this.attribute.updateTolerance(this.tolerance);
  }

  checkValue(): void {
    const VALUE: number = parseInt(this.numberIn.nativeElement.value, 10);
    this.tolerance = (VALUE < CST.MIN_FILL_OPACITY || VALUE.toString() === 'NaN') ? '0' : this.numberIn.nativeElement.value;
    this.tolerance = (VALUE > CST.MAX_FILL_OPACITY) ? '100' : this.tolerance;
    this.attribute.isActivate = false;
  }

  preciseTolerance(): void {
    this.tolerance = this.numberIn.nativeElement.value;
    this.attribute.updateTolerance(this.tolerance);

  }

  slideTolerance(): void {
    this.tolerance = this.sliderIn.nativeElement.value;
    this.attribute.updateTolerance(this.tolerance);
  }

  disabledKeyboard(): void {
    this.attribute.isActivate = true;
  }
}
