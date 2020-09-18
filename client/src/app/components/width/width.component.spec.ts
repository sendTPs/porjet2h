import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WidthComponent } from './width.component';

describe('WidthComponent', () => {
  let component: WidthComponent;
  let fixture: ComponentFixture<WidthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WidthComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WidthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnInit should call updateWidth and set width', () => {
    spyOn(component.attribute, 'updateWidth');
    component.ngOnInit();

    expect(component.width).toBe('8');
    expect(component.attribute.updateWidth).toHaveBeenCalled();
  });

  it('#checkValue set width to proper positive value', () => {
    const htmlInput = { value: '5' };
    component.numberIn = new ElementRef(htmlInput as HTMLInputElement);

    component.checkValue();
    expect(component.width).toBe('5');
  });

  it('#checkValue set width to 0 when value is negative', () => {
    const htmlInput = { value: '-3' };
    component.numberIn = new ElementRef(htmlInput as HTMLInputElement);

    component.checkValue();
    expect(component.width).toBe('0');
  });

  it('#preciseWidth should set width and call #updateWidth', () => {
    const htmlInput = { value: '5' };
    component.numberIn = new ElementRef(htmlInput as HTMLInputElement);
    spyOn(component.attribute, 'updateWidth').and.callThrough();

    component.preciseWidth();

    expect(component.width).toBe('5');
    expect(component.attribute.updateWidth).toHaveBeenCalled();
  });

  it('#slideWidth should set width and call #updateWidth', () => {
    const htmlInput = { value: '5' };
    component.sliderIn = new ElementRef(htmlInput as HTMLInputElement);
    spyOn(component.attribute, 'updateWidth').and.callThrough();

    component.slideWidth();

    expect(component.width).toBe('5');
    expect(component.attribute.updateWidth).toHaveBeenCalled();
  });

  it('#disabledKeyboard() should set border and call #updateWidth', () => {
    component.disabledKeyboard();
    expect(component.attribute.isActivate).toBe(true);
  });

});
