import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BorderComponent } from './border.component';

describe('BorderComponent', () => {
  let component: BorderComponent;
  let fixture: ComponentFixture<BorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BorderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#1 ngOnInit should call updateBorder and set border', () => {
    spyOn(component.attribute, 'updateBorder');
    component.ngOnInit();

    expect(component.border).toBe('3');
    expect(component.attribute.updateBorder).toHaveBeenCalled();
  });

  it('#2 checkValue set border to proper positive value', () => {
    const htmlInput = { value: '5' };
    component.numberIn = new ElementRef(htmlInput as HTMLInputElement);

    component.checkValue();
    expect(component.border).toBe('5');
  });

  it('#3 checkValue set border to 3 when value is negative', () => {
    const htmlInput1 = { value: '-3' };
    component.numberIn = new ElementRef(htmlInput1 as HTMLInputElement);
    component.checkValue();
    expect(component.border).toBe('3');
    const htmlInput2 = { value: '15' };
    component.numberIn = new ElementRef(htmlInput2 as HTMLInputElement);
    component.checkValue();
    expect(component.border).toBe('12');
  });

  it('#4 preciseWidth should set border and call #updateBorder', () => {
    const htmlInput = { value: '5' };
    component.numberIn = new ElementRef(htmlInput as HTMLInputElement);
    spyOn(component.attribute, 'updateBorder').and.callThrough();

    component.preciseWidth();

    expect(component.border).toBe('5');
    expect(component.attribute.updateBorder).toHaveBeenCalled();
  });

  it('#5 slideWidth should set border and call #updateBorder', () => {
    const htmlInput = { value: '5' };
    component.sliderIn = new ElementRef(htmlInput as HTMLInputElement);
    spyOn(component.attribute, 'updateBorder').and.returnValue();

    component.slideWidth();

    expect(component.border).toBe('5');
    expect(component.attribute.updateBorder).toHaveBeenCalled();
  });

  it('#6 disabledKeyboard() should set border and call #updateBorder', () => {
    component.disabledKeyboard();
    expect(component.attribute.isActivate).toBe(true);
  });

});
