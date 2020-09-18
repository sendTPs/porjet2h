import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { AttributeService } from '@services/attribute/attribute.service';

@Component({
  selector: 'app-jonction',
  templateUrl: './jonction.component.html',
  styleUrls: ['./jonction.component.scss']
})
export class JonctionComponent implements OnInit {

  @ViewChild('number', { static: true })
  numberIn: ElementRef<HTMLInputElement>;
  @ViewChild('slider', { static: true })
  sliderIn: ElementRef<HTMLInputElement>;
  @ViewChild('button', { static: true })
  button: ElementRef<HTMLInputElement>;

  width: string;

  constructor(
    public attribute: AttributeService,
  ) { }

  ngOnInit(): void {
    this.width = '10'; // pour changer la valeur par default
    this.attribute.updateWidthJonction(this.width);
  }

  checkValue(): void { // changer l'expression validate pour une fonction booleen
    const VALUE: number = parseInt(this.numberIn.nativeElement.value, 10);
    this.width = (VALUE < parseInt(this.attribute.width, 10) / 2 || VALUE.toString() === 'NaN') ?
      (parseInt(this.attribute.width, 10) / 2).toString() : this.numberIn.nativeElement.value;
    this.attribute.isActivate = false;
  }

  jonctionToggle(): void {
    this.attribute.toggleJonction();
    this.button.nativeElement.style.borderStyle = (this.attribute.activateJonction) ? 'inset' : 'outset';
    this.button.nativeElement.style.backgroundColor = (this.attribute.activateJonction) ? 'black' : 'darkgrey';
  }

  preciseWidth(): void {
    this.width = this.numberIn.nativeElement.value;
    this.attribute.updateWidthJonction(this.width);
  }

  slideWidth(): void {
    this.width = this.sliderIn.nativeElement.value;
    this.attribute.updateWidthJonction(this.width);
  }

  disabledKeyboard(): void {
    this.attribute.isActivate = true;
  }
}
