import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { AttributeService } from '@services/attribute/attribute.service';

@Component({
  selector: 'app-width',
  templateUrl: './width.component.html',
  styleUrls: ['./width.component.scss']
})
export class WidthComponent implements OnInit {

  @ViewChild('number', { static: true })
  numberIn: ElementRef<HTMLInputElement>;
  @ViewChild('slider', { static: true })
  sliderIn: ElementRef<HTMLInputElement>;

  width: string;

  constructor(
    public attribute: AttributeService,
  ) { }

  ngOnInit(): void {
    this.width = '8'; // pour changer la valeur par default
    this.attribute.updateWidth(this.width);
  }

  checkValue(): void {
    const VALUE: number = parseInt(this.numberIn.nativeElement.value, 10);
    this.width = (VALUE < 0 || VALUE.toString() === 'NaN') ? '0' : this.numberIn.nativeElement.value;
    this.attribute.isActivate = false;
  }

  preciseWidth(): void {
    this.width = this.numberIn.nativeElement.value;
    this.attribute.updateWidth(this.width);

  }

  slideWidth(): void {
    this.width = this.sliderIn.nativeElement.value;
    this.attribute.updateWidth(this.width);
  }

  disabledKeyboard(): void {
    this.attribute.isActivate = true;
  }
}
