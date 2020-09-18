import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSliderChange } from '@angular/material/slider';

import { ColorPickerComponent } from './color-picker.component';

describe('ColorPickerComponent', () => {
  let component: ColorPickerComponent;
  let fixture: ComponentFixture<ColorPickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ColorPickerComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPickerComponent);
    component = fixture.componentInstance;
    component.hue = '0';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* testing onLeftClickForUsedColor*/

  it('onLeftClickForUsedColor : should set primeColor Choice to  primeColorChoice s value', () => {

    const primeColorChoice = 'black';

    component.setUsedColor(primeColorChoice, 0);
    component.onLeftClickForUsedColor(0);

    expect(component.primeColorChoice).toEqual(primeColorChoice);

  });

  /*  onRightClickForUsedColor*/

  it('onRightClickForUsedColor: should set secondColorChoice  to  secondColorChoice s value', () => {
    const fakeClick = { offsetX: 10, offsetY: 20, preventDefault: () => { return; } } as MouseEvent;
    const secondColorChoice = 'black';

    component.setUsedColor(secondColorChoice, 0);
    component.onRightClickForUsedColor(fakeClick, 0);

    expect(component.secondColorChoice).toEqual(secondColorChoice);

  });

  /* switchPrimeAndSecondColor  test */

  it('switchPrimeAndSecondColor: should switch prime and second  choice', () => {

    const secondColorChoice = 'black'; component.secondColorChoice = secondColorChoice;
    const primeColorChoice = 'white'; component.primeColorChoice = primeColorChoice;

    component.switchPrimeAndSecondColor();

    expect(component.secondColorChoice).toEqual(primeColorChoice);
    expect(component.primeColorChoice).toEqual(secondColorChoice);

  });

  /* colorRGBWriter  test */

  it('colorRGBWriter: should create color from rColor, gColor and bColor', () => {

    const colorInHex = 'rgb(256,80,37)'; // converted to hex so: rgb(100,50,25) in dec

    component.setrColor('100'); component.setgColor('50'); component.setbColor('25');

    component.colorRGBWriter();

    expect(component.color).toEqual(colorInHex);

    // now r g b components should not be set and color should be the default value : rgb(255,255,255)

    component.setrColor(''); component.setgColor(''); component.setbColor('');
    component.colorRGBWriter();

    const colorDefault = 'rgb(255,255,255)';
    expect(component.color).toEqual(colorDefault);
  });

  /*   onSliderChange test */

  it('onSliderChange should change the opacity for prime and second color', () => {
    const colorAfter = 'rgba(200,200,200,0.68)';

    // defining the event
    const eventElmnt = new MatSliderChange();
    // tslint:disable: no-magic-numbers
    eventElmnt.value = 0.68;
    // changing primeColorChoice& secondColorChoice
    component.primeColorChoice = 'rgba(200,200,200,1)';
    component.secondColorChoice = 'rgba(200,200,200,1)';

    // call the function on slider 1 : changing the opacity for prime&second ColorChoice
    component.onSliderChange(eventElmnt, 1);
    component.onSliderChange(eventElmnt, 2);

    expect(component.primeColorChoice).toEqual(colorAfter);
    expect(component.secondColorChoice).toEqual(colorAfter);

  });

  /*  covertHexToStringDec: shoudl replace hex number ex:ff to dec: 255 (all in string) */
  it('covertHexToStringDec ', () => {
    const hex = 'ff';
    const dec = '255';

    expect(component.covertHexToStringDec(hex)).toEqual(dec);

  });

  /* covertHexToStringDec test */
  it('isHex() should return true for ff as input', () => {

    expect(component.isHex('ff')).toEqual(true);
    expect(component.isHex('1455qwtus')).toEqual(false);

  });

  // colorInRange  TEST
  it('colorInRange indicate if an input color is valid hex. Clear the colorComponent in cas of invalid color', () => {
    const validColor = 'ff';
    const falseColor = 'jsdhfff';

    // excute the function for valid color red component
    expect(component.colorInRange(validColor, 'r')).toEqual(true);

    // excute the function for false color and verify rColor is empty
    expect(component.colorInRange(falseColor, 'r')).toEqual(false);
    expect(component.rColor).toEqual('');

    // excute the function for valid color green component
    expect(component.colorInRange(validColor, 'g')).toEqual(true);

    // excute the function for valid color blue component
    expect(component.colorInRange(validColor, 'b')).toEqual(true);

    // excute the function for unvalid color blue component
    expect(component.colorInRange(falseColor, 'g')).toEqual(false);

    // excute the function for unvalid color  component, just to coverage line
    expect(component.colorInRange(falseColor, 'p')).toEqual(false);

  });

  // filtreChars test
  it('filtreChars accepts only numbers (as string) or A B C D E F (lower case are valid too)', () => {
    const numberTmp = '4';
    let validInput = 'a';
    const unvalidInput = 'p';

    // excute the function for valid input
    expect(component.filtreChars(numberTmp)).toEqual(true);
    expect(component.filtreChars(validInput)).toEqual(true);

    validInput = 'b';
    expect(component.filtreChars(validInput)).toEqual(true);

    validInput = 'c';
    expect(component.filtreChars(validInput)).toEqual(true);

    validInput = 'd';
    expect(component.filtreChars(validInput)).toEqual(true);

    validInput = 'e';
    expect(component.filtreChars(validInput)).toEqual(true);

    validInput = 'f';
    expect(component.filtreChars(validInput)).toEqual(true);

    validInput = 'g';
    expect(component.filtreChars(validInput)).toEqual(false);

    // excute the function for unvalid input
    expect(component.filtreChars(unvalidInput)).toEqual(false);

  });

  /*
   rReadColor(event: any): void | boolean{

    if(event.key && !this.filtreChars(event.key)) {
      event.preventDefault();
      this.rColor = "";
      this.colorRGBWriter()
      return false;
    }

    if(this.colorInRange(event.target.value,'r')){ // check the value is correct
      this.rColor = event.target.value;
      this.colorRGBWriter()
    }else{
      this.rColor = ""; // here error should do something
    }
  }*/

  /* rReadColor test*/

  it('rReadColor should accept valid inputs only as described in colorInRange and filterChars functions', () => {
    // event creation
    // tslint:disable: no-empty
    const eventElmnt = { key: 'p', target: { value: 'a' }, preventDefault(): void { } };

    // test unvalid key
    expect(component.rReadColor(eventElmnt)).toEqual(false);

    // testing valid key and valid value
    eventElmnt.key = 'f'; eventElmnt.target.value = 'ff';
    component.rReadColor(eventElmnt);
    expect(component.rColor).toEqual(eventElmnt.target.value);
    // testing valid key and unvalid value
    eventElmnt.target.value = 'fpomm';
    component.rReadColor(eventElmnt);
    expect(component.rColor).toEqual('');

  });

  /* gReadColor test */

  it('gReadColor should accept valid inputs only as described in colorInRange and filterChars functions', () => {
    // event creation
    const eventElmnt = { key: 'p', target: { value: 'a' }, preventDefault(): void { } };

    // test unvalid key
    expect(component.gReadColor(eventElmnt)).toEqual(false);

    // testing valid key and valid value
    eventElmnt.key = 'f'; eventElmnt.target.value = 'ff';
    component.gReadColor(eventElmnt);
    expect(component.gColor).toEqual(eventElmnt.target.value);
    // testing valid key and unvalid value
    eventElmnt.target.value = 'fpomm';
    component.gReadColor(eventElmnt);
    expect(component.gColor).toEqual('');

  });

  /* bReadColor test */

  it('bReadColor should accept valid inputs only as described in colorInRange and filterChars functions', () => {
    // event creation
    const eventElmnt = { key: 'p', target: { value: 'a' }, preventDefault(): void { } };

    // test unvalid key
    expect(component.bReadColor(eventElmnt)).toEqual(false);

    // testing valid key and valid value
    eventElmnt.key = 'f'; eventElmnt.target.value = 'ff';
    component.bReadColor(eventElmnt);
    expect(component.bColor).toEqual(eventElmnt.target.value);
    // testing valid key and unvalid value
    eventElmnt.target.value = 'fpomm';
    component.bReadColor(eventElmnt);
    expect(component.bColor).toEqual('');

  });

  /*  secondColor */
  it('secondColor ', () => {
    // event creation
    const black = 'black';
    const white = 'white';

    component.setSecondColor(white);
    component.setColor(black);

    component.secondColor();

    expect(component.secondColorChoice).toEqual(black);

  });

  /*  confirmColor */
  it('confirmColor should set the primeColor from color variable and add it to usedcolor list', () => {

    component.usedColorList = ['white']; component.usedColorIndex = 1; // initializing
    component.setColor('yellow');
    component.setPrimeColorChoice('null');

    component.confirmColor(null, undefined);

    expect(component.primeColorChoice).toEqual('yellow');
    expect(component.usedColorList[1]).toEqual('yellow'); // check if yellow has been added to usedColorList

    component.setPrimeColorChoice('null');
    component.confirmColor(true, undefined); // should not modify the prime color!!
    expect(component.primeColorChoice).toEqual('null');

    component.usedColorIndex = 9;
    component.usedColorList = ['white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white', 'white'];
    component.setColor('yellow'); component.confirmColor(null, undefined);
    expect(component.usedColorIndex).toEqual(0);

  });

  it('confirmAndHideView() shoudl return true', () => {
    expect(component.confirmAndHideView()).toBeTruthy();
  });

  /* TESTING THE SETTERS */

  it('testing the setters', () => {
    component.setPrimeColorChoice('ff');
    expect(component.primeColorChoice).toEqual('ff');

    component.setUsedColor('yellow', 0);
    expect(component.usedColorList[0]).toEqual('yellow');

    component.setrColor('yellow');
    expect(component.rColor).toEqual('yellow');

    component.setgColor('yellow');
    expect(component.gColor).toEqual('yellow');

    component.setbColor('yellow');
    expect(component.bColor).toEqual('yellow');

    component.setSecondColor('yellow');
    expect(component.secondColorChoice).toEqual('yellow');

    component.setColor('yellow');
    expect(component.color).toEqual('yellow');

  });

});
