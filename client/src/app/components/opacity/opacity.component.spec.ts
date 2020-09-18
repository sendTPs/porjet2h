import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpacityComponent } from './opacity.component';

describe('OpacityComponent', () => {
  let component: OpacityComponent;
  let fixture: ComponentFixture<OpacityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OpacityComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#1 ngOnInit should call updateWidth and set width', () => {
    spyOn(component.attribute, 'updateOpacityGrille');
    component.ngOnInit();

    expect(component.opacity).toBe('50');
    expect(component.attribute.updateOpacityGrille).toHaveBeenCalled();
  });

  it('#2 checkValue set width to proper positive value', () => {
    const htmlInput = { value: '60' };
    component.numberIn = new ElementRef(htmlInput as HTMLInputElement);

    component.checkValue();
    expect(component.opacity).toBe('60');
  });

  it('#3.1 checkValue set width to 10 when value is negative', () => {
    const htmlInput = { value: '-3' };
    component.numberIn = new ElementRef(htmlInput as HTMLInputElement);

    component.checkValue();
    expect(component.opacity).toBe('10');
  });

  it('#3.2 checkValue set width to 99 when value is too High (>99)', () => {
    const htmlInput = { value: '100' };
    component.numberIn = new ElementRef(htmlInput as HTMLInputElement);

    component.checkValue();
    expect(component.opacity).toBe('99');
  });

  it('#4 preciseWidth should set width and call #updateOpacityGrille', () => {
    const htmlInput = { value: '90' };
    component.numberIn = new ElementRef(htmlInput as HTMLInputElement);
    spyOn(component.attribute, 'updateOpacityGrille').and.callThrough();

    component.preciseWidth();

    expect(component.opacity).toBe('90');
    expect(component.attribute.updateOpacityGrille).toHaveBeenCalled();
  });

  it('#5 slideWidth should set width and call #updateOpacityGrille', () => {
    const htmlInput = { value: '90' };
    component.sliderIn = new ElementRef(htmlInput as HTMLInputElement);
    spyOn(component.attribute, 'updateOpacityGrille').and.callThrough();

    component.slideWidth();

    expect(component.opacity).toBe('90');
    expect(component.attribute.updateOpacityGrille).toHaveBeenCalled();
  });

  it('#6 disabledKeyboard() should set border and call #updateOpacityGrille', () => {
    component.disabledKeyboard();
    expect(component.attribute.isActivate).toBe(true);
  });

});
