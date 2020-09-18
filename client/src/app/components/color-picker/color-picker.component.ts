import { Component, Input, OnInit } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';

import { MAX_COLOR_MEMORY } from '@app/models/constants';
import { ColorService } from '@services/color/color.service';
import { DrawingOptionService } from '@services/drawing-option/drawing-option.service';
import { ViewService } from '@services/view/view.service';

@Component({
  selector: 'app-color-picker',
  templateUrl: './color-picker.component.html',
  styleUrls: ['./color-picker.component.scss']
})
export class ColorPickerComponent implements OnInit {

  @Input()
  colorChooserOnly: boolean;

  hue: string;
  color: string;
  primeColorChoice: string;
  secondColorChoice: string;
  rColor: string;
  gColor: string;
  bColor: string;

  usedColorList: string[] = ['white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white'];
  usedColorIndex: number;

  constructor(
    private colorService: ColorService,
    private viewService: ViewService,
    private drawingOptionService: DrawingOptionService,

  ) {
    this.colorChooserOnly = true;
    this.primeColorChoice = this.colorService.prime;
    this.secondColorChoice = this.colorService.second;
    this.color = 'rgba(255,0,0,1)';
  }

  ngOnInit(): void {
    let index = 0;
    for (; index < this.usedColorList.length && index < this.colorService.tableColor.length; index++) {
      this.usedColorList[index] = this.colorService.tableColor[index];
    }
    this.usedColorIndex = index;
  }

  /* setters and gettersfor tests */
  setPrimeColorChoice(color: string): void {
    this.primeColorChoice = color;
  }

  setUsedColor(color: string, index: number): void {
    if (index >= 0 && index <= MAX_COLOR_MEMORY) {
      this.usedColorList[index] = color;
    }
  }

  setrColor(color: string): void {
    this.rColor = color;
  }

  setgColor(color: string): void {
    this.gColor = color;
  }

  setbColor(color: string): void {
    this.bColor = color;
  }

  setSecondColor(color: string): void {
    this.secondColorChoice = color;
  }

  setColor(color: string): void {
    this.color = color;
  }

  /* function colorRGBWriter: write the R G and B from their inputs of color picker
  @params: none
  @return : none
 */
  confirmColor(switched: boolean | null, key: number | null | undefined): void {

    // defining the used color for drawing
    if (key === undefined) {
      if (switched === null) { // only change if we switch second and prime color
        this.primeColorChoice = this.color;
      }
      this.colorService.prime = this.primeColorChoice;
    }

    // adding to usedColor

    // check if we already used this color(shown in 10 used colors)
    let colorIsUsed = false;

    for (let i = 0; i <= this.usedColorIndex; i++) {
      if (this.usedColorList[i] === this.color) {
        colorIsUsed = true;
      }

    }

    if (!colorIsUsed) { // add color as used only if it doesnt exist in the used colors list
      this.usedColorList[this.usedColorIndex++] = this.color;
      this.colorService.tableColor.unshift(this.color);
    }

    // returning usedColor to 0 if it passes 9
    if (this.usedColorIndex > MAX_COLOR_MEMORY) {
      this.usedColorIndex = 0;
    }

  }

  confirmAndHideView(): boolean {
    // hide component
    this.viewService.hideColor();
    return true; // just to test the function call

  }

  onRightClickForUsedColor(event: MouseEvent, index: number): void {
    event.preventDefault();
    this.secondColorChoice = this.usedColorList[index];
    this.colorService.second = this.secondColorChoice;
  }

  switchPrimeAndSecondColor(): void {
    let tmp: string; // tmp variable used as tool to switch

    tmp = this.primeColorChoice;
    this.primeColorChoice = this.secondColorChoice;
    this.secondColorChoice = tmp;
    this.colorService.prime = this.primeColorChoice;
    this.colorService.second = this.secondColorChoice;

    this.confirmColor(true, null); // used to add the old second color in the used color if doesnt exist yet
  }

  onLeftClickForUsedColor(index: number): void {
    this.primeColorChoice = this.usedColorList[index];
    this.colorService.prime = this.primeColorChoice;
  }

  colorRGBWriter(): void {

    if (this.rColor && this.gColor && this.bColor) { // check all exists

      this.color = 'rgb(' + this.covertHexToStringDec(this.rColor) + ',' +
        this.covertHexToStringDec(this.gColor) + ',' + this.covertHexToStringDec(this.bColor) + ')';
      this.drawingOptionService.rColorFromPicker = this.rColor;
      this.drawingOptionService.gColorFromPicker = this.gColor;
      this.drawingOptionService.bColorFromPicker = this.bColor;
      // this.drawingOptionService.sendColorPicker();
    } else {
      this.color = 'rgb(255,255,255)'; // blanking the background as sign of being empty

    }

  }

  onSliderChange(event: MatSliderChange, sliderNum: number): void {

    // getting the R component of the color
    // tslint:disable: no-magic-numbers
    let splittedPrimeColor = this.primeColorChoice.split(',', 3);
    splittedPrimeColor[0] = splittedPrimeColor[0].split('(', 2)[1];
    splittedPrimeColor[2] = splittedPrimeColor[2].split(')', 2)[0];

    if (event != null) {     // check all exist!
      if (event.value != null) {

        switch (sliderNum) {
          case 1:
            // var splittedPrimeColor = this.primeColorChoice.split(',',3);
            splittedPrimeColor = this.primeColorChoice.split(',', 3);
            splittedPrimeColor[0] = splittedPrimeColor[0].split('(', 2)[1];
            splittedPrimeColor[2] = splittedPrimeColor[2].split(')', 2)[0];

            this.primeColorChoice = 'rgba(' + splittedPrimeColor[0] + ',' + splittedPrimeColor[1] + ','
              + splittedPrimeColor[2] + ',' + event.value.toString() + ')';
            this.colorService.prime = this.primeColorChoice;
            break;
          case 2:
            const splittedSecondColor = this.secondColorChoice.split(',', 3);
            splittedSecondColor[0] = splittedSecondColor[0].split('(', 2)[1];
            splittedSecondColor[2] = splittedSecondColor[2].split(')', 2)[0];
            this.secondColorChoice = 'rgba(' + splittedSecondColor[0] + ',' + splittedSecondColor[1]
              + ',' + splittedSecondColor[2] + ',' + event.value.toString() + ')';
            break;
        }
      }
    }

  }

  covertHexToStringDec(color: string): string {

    return Number('0x' + color).toString();
  }

  isHex(value: string): boolean {
    // regular function
    return typeof value === 'string' && !isNaN(Number('0x' + value));
  }

  colorInRange(x: string, colorComponent: string): boolean {

    const minColorRGB = 0;
    const valueAsNumber = Number('0x' + x);
    const maxColorRGB = 255;
    let testResult = false;

    if (!this.isHex(x)) {
      testResult = false; // could be - so negative number !

      switch (colorComponent) {
        case 'r': this.rColor = ''; break;
        case 'g': this.gColor = ''; break;
        case 'b': this.bColor = ''; break;
        default: break;
      }

    } else {
      testResult = (valueAsNumber >= minColorRGB && valueAsNumber <= maxColorRGB);
    }
    return testResult;
  }

  filtreChars(key: string): boolean {
    let testResult: boolean;
    testResult = false;

    if (!isNaN(+key)) {
      testResult = true;
    } else {

      switch (key.toUpperCase()) {
        case 'A': testResult = true; break;
        case 'B': testResult = true; break;
        case 'C': testResult = true; break;
        case 'D': testResult = true; break;
        case 'E': testResult = true; break;
        case 'F': testResult = true; break;
      }
    }

    return testResult;
  }

  // tslint:disable-next-line: no-any
  rReadColor(event: any): void | boolean {

    if (event.key && !this.filtreChars(event.key)) {
      event.preventDefault();
      this.rColor = '';
      this.colorRGBWriter();
      return false;
    }

    if (this.colorInRange(event.target.value, 'r')) { // check the value is correct
      this.rColor = event.target.value;
      this.colorRGBWriter();
    } else {
      this.rColor = ''; // here error should do something
    }
  }

  // tslint:disable-next-line: no-any
  gReadColor(event: any): void | boolean {

    if (event.key && !this.filtreChars(event.key)) {
      event.preventDefault();
      this.gColor = '';
      this.colorRGBWriter();
      return false;
    }

    if (this.colorInRange(event.target.value, 'g')) { // check the value is correct
      this.gColor = event.target.value;
      this.colorRGBWriter();
    } else {
      this.gColor = ''; // here error should do something
    }

  }
  // tslint:disable-next-line: no-any
  bReadColor(event: any): void | boolean {

    if (event.key && !this.filtreChars(event.key)) {
      event.preventDefault();
      this.bColor = '';
      this.colorRGBWriter();
      return false;
    }

    if (this.colorInRange(event.target.value, 'b')) { // check the value is correct
      this.bColor = event.target.value;
      this.colorRGBWriter();
    } else {
      this.bColor = ''; // here error should do something
    }
  }

  secondColor(): void {
    this.secondColorChoice = this.color;
    this.colorService.second = this.secondColorChoice;
    this.confirmColor(true, 1);
  }

  primeColor(): void {
    this.primeColorChoice = this.color;
    this.colorService.prime = this.primeColorChoice;
    this.confirmColor(true, 1);
  }

}
