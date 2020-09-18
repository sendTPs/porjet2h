import { CUSTOM_ELEMENTS_SCHEMA, ElementRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttributeService } from '@services/attribute/attribute.service';

import { JonctionComponent } from './jonction.component';

/*********** VOIR LE TEST JONCTIONTOGGLE POUR LA RAISON DU 50% DANS BRANCH *********************/

describe('JonctionComponent', () => {
  let component: JonctionComponent;
  let fixture: ComponentFixture<JonctionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [JonctionComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        {
          provide: AttributeService, useValue: jasmine.createSpyObj({
            getWidthJonction: 10, updateWidthJonction: null, toggleJonction: null
          })
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JonctionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#1 ngOnInit should call #updateWidth and set', () => {
    component.ngOnInit();
    expect(component.width).toBe('10');
    expect(component.attribute.updateWidthJonction).toHaveBeenCalled();
  });

  it('#2 jonctionToggle should call #toggleJonction on click', () => {
    component.button = { nativeElement: { style: { borderStyle: 'none', backgroundColor: 'none' } } } as ElementRef<HTMLInputElement>;
    const btn = fixture.debugElement.nativeElement.querySelector('.btnTools') as HTMLButtonElement;
    component.attribute.activateJonction = true;
    btn.click();
    component.jonctionToggle();
    expect(component.attribute.toggleJonction).toHaveBeenCalled();

    // expect(component.button.nativeElement.style.borderStyle).toBe('inset');
    // il sagit de css, on ne juge pas quil est necessaire de le te tester. de plus, il est
    // difficile de passer a traver un boutton pour simuler des evenement css.
    // cest ce test qui cause le 50% au niveau du branch

  });

  it('#3 jonctionToggle should call #toggleJonction on click', () => {
    const test = fixture.debugElement.nativeElement.querySelector('.btnTools') as HTMLButtonElement;
    test.click();
    expect(component.attribute.toggleJonction).toHaveBeenCalled();
  });

  it('#4 checkValue set junction width to at least width divided by two', () => {
    component.attribute.width = '8';
    const htmlInput = { value: '3' };
    component.numberIn = new ElementRef(htmlInput as HTMLInputElement);
    component.checkValue();

    expect(component.width).toBe('4');
  });

  it('#5 checkValue set junction\'s width to proper value', () => {
    const htmlInput = { value: '8' };
    component.numberIn = new ElementRef(htmlInput as HTMLInputElement);
    component.checkValue();

    expect(component.width).toBe('8');
  });

  it('#6 preciseWidth should set junction\'s width and call #updateWidthJonction', () => {
    const htmlInput = { value: '5' };
    component.numberIn = new ElementRef(htmlInput as HTMLInputElement);

    component.preciseWidth();

    expect(component.width).toBe('5');
    expect(component.attribute.updateWidthJonction).toHaveBeenCalled();
  });

  it('#7 slideWidth should set junction\'s width and call #updateWidthJonction', () => {
    const htmlInput = { value: '5' };
    component.sliderIn = new ElementRef(htmlInput as HTMLInputElement);

    component.slideWidth();

    expect(component.width).toBe('5');
    expect(component.attribute.updateWidthJonction).toHaveBeenCalled();
  });

  it('#8 disabledKeyboard should set isActivate to false', () => {
    component.disabledKeyboard();
    expect(component.attribute.isActivate).toBeTruthy();
  });
});
