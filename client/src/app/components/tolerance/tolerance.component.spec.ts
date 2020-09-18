import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToleranceComponent } from './tolerance.component';

describe('ToleranceComponent', () => {
  let component: ToleranceComponent;
  let fixture: ComponentFixture<ToleranceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToleranceComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToleranceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#1 ngOnInit should call updateWidth and set width', () => {
    spyOn(component.attribute, 'updateTolerance');
    component.ngOnInit();

    expect(component.tolerance).toBe('20');
    expect(component.attribute.updateTolerance).toHaveBeenCalled();
  });

  it('#2 checkValue set width to proper positive value', () => {
    const htmlInput = { value: '60' };
    component.numberIn = new ElementRef(htmlInput as HTMLInputElement);

    component.checkValue();
    expect(component.tolerance).toBe('60');
  });

  it('#3.1 checkValue set width to 10 when value is negative', () => {
    const htmlInput = { value: '-3' };
    component.numberIn = new ElementRef(htmlInput as HTMLInputElement);

    component.checkValue();
    expect(component.tolerance).toBe('0');
  });

  it('#3.2 checkValue set width to 99 when value is too High (>99)', () => {
    const htmlInput = { value: '120' };
    component.numberIn = new ElementRef(htmlInput as HTMLInputElement);

    component.checkValue();
    expect(component.tolerance).toBe('100');
  });

  it('#4 preciseTolerance should set width and call #updateTolerance', () => {
    const htmlInput = { value: '90' };
    component.numberIn = new ElementRef(htmlInput as HTMLInputElement);
    spyOn(component.attribute, 'updateTolerance').and.callThrough();

    component.preciseTolerance();

    expect(component.tolerance).toBe('90');
    expect(component.attribute.updateTolerance).toHaveBeenCalled();
  });

  it('#5 slideTolerance should set width and call #updateTolerance', () => {
    const htmlInput = { value: '90' };
    component.sliderIn = new ElementRef(htmlInput as HTMLInputElement);
    spyOn(component.attribute, 'updateTolerance').and.callThrough();

    component.slideTolerance();

    expect(component.tolerance).toBe('90');
    expect(component.attribute.updateTolerance).toHaveBeenCalled();
  });

  it('#6 disabledKeyboard() should set border and call #updateTolerance', () => {
    component.disabledKeyboard();
    expect(component.attribute.isActivate).toBe(true);
  });

});
