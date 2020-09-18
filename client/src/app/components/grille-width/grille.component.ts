import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { AttributeService } from '@services/attribute/attribute.service';

@Component({
  selector: 'app-grille',
  templateUrl: './grille.component.html',
  styleUrls: ['./grille.component.scss']
})
export class GrilleComponent implements OnInit {

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
    this.width = '20'; // pour changer la valeur par default
    this.attribute.updateWidthGrille(this.width);
  }

  grilleToggle(): void {
    this.attribute.toggleGrille();
    this.button.nativeElement.style.borderStyle = (this.attribute.visibilityGrille === 'visible') ? 'inset' : 'outset';
    this.button.nativeElement.style.backgroundColor = (this.attribute.visibilityGrille === 'visible') ? 'black' : 'darkgrey';
  }

  checkValue(): void {
    const VALUE: number = parseInt(this.numberIn.nativeElement.value, 10);
    this.width = (VALUE < 0 || VALUE.toString() === 'NaN') ? '5' : this.numberIn.nativeElement.value;
    this.attribute.isActivate = false;
  }

  preciseWidth(): void {
    this.width = this.numberIn.nativeElement.value;
    this.attribute.updateWidthGrille(this.width);

  }

  slideWidth(): void {
    this.width = this.sliderIn.nativeElement.value;
    this.attribute.updateWidthGrille(this.width);
  }

  disabledKeyboard(): void {
    this.attribute.isActivate = true;
  }
}
