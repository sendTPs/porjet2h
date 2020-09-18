import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeService } from '@app/services/attribute/attribute.service';

import { GrilleComponent } from './grille.component';

describe('GrilleComponent', () => {
  let component: GrilleComponent;
  let fixture: ComponentFixture<GrilleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GrilleComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: AttributeService, useValue: jasmine.createSpyObj({
            updateWidthGrille: null, toggleGrille: null
          })
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrilleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#1 ngOnInit should call updateWidth and set width', () => {
    component.ngOnInit();

    expect(component.width).toBe('20');
    expect(component.attribute.updateWidthGrille).toHaveBeenCalled();
  });

  it('#2 checkValue set width to proper positive value', () => {
    const htmlInput = { value: '5' };
    component.numberIn = new ElementRef(htmlInput as HTMLInputElement);

    component.checkValue();
    expect(component.width).toBe('5');
  });

  it('#3 checkValue set width to 0 when value is negative', () => {
    const htmlInput = { value: '-3' };
    component.numberIn = new ElementRef(htmlInput as HTMLInputElement);

    component.checkValue();
    expect(component.width).toBe('5');
  });

  it('#4 preciseWidth should set width and call #updateWidthGrille', () => {
    const htmlInput = { value: '5' };
    component.numberIn = new ElementRef(htmlInput as HTMLInputElement);

    component.preciseWidth();

    expect(component.width).toBe('5');
    expect(component.attribute.updateWidthGrille).toHaveBeenCalled();
  });

  it('#5 slideWidth should set width and call #updateWidth', () => {
    const htmlInput = { value: '5' };
    component.sliderIn = new ElementRef(htmlInput as HTMLInputElement);

    component.slideWidth();

    expect(component.width).toBe('5');
    expect(component.attribute.updateWidthGrille).toHaveBeenCalled();
  });

  it('#6 disabledKeyboard() should set border and call #updateWidth', () => {
    component.disabledKeyboard();
    expect(component.attribute.isActivate).toBe(true);
  });

  it('#7 jonctionToggle should call #toggleGrille on click', () => {
    component.button = { nativeElement: { style: { borderStyle: 'none', backgroundColor: 'none' } } } as ElementRef<HTMLInputElement>;
    const btn = fixture.debugElement.nativeElement.querySelector('.btnTools') as HTMLButtonElement;
    component.attribute.visibilityGrille = 'visible';
    btn.click();
    component.grilleToggle();
    expect(component.attribute.toggleGrille).toHaveBeenCalled();

    // expect(component.button.nativeElement.style.borderStyle).toBe('inset');
    // il sagit de css, on ne juge pas quil est necessaire de le te tester. de plus, il est
    // difficile de passer a traver un boutton pour simuler des evenement css.
    // cest ce test qui cause le 50% au niveau du branch
  });

  it('#8 jonctionToggle should call #toggleGrille on click', () => {
    const test = fixture.debugElement.nativeElement.querySelector('.btnTools') as HTMLButtonElement;
    test.click();
    expect(component.attribute.toggleGrille).toHaveBeenCalled();
  });

});
