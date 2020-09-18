import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { DrawingOptionService } from '@services/drawing-option/drawing-option.service';

import { NewDrawingDialogComponent } from './new-drawing-dialog.component';

describe('NewDrawingDialogComponent', () => {
  let component: NewDrawingDialogComponent;
  let fixture: ComponentFixture<NewDrawingDialogComponent>;
  const N30 = 30;
  const N100 = 100;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewDrawingDialogComponent],
      imports: [MatDialogModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: component, useValue: jasmine.createSpyObj({ onResize: null }) },
        { provide: MatDialogRef, useValue: jasmine.createSpyObj({ close: null }) },
        { provide: DrawingOptionService, useValue: jasmine.createSpyObj({ addToOption: null, ngInit: null }) },
        { provide: Router, useValue: jasmine.createSpyObj({ navigate: null }) },
        { provide: MAT_DIALOG_DATA, useValue: jasmine.createSpyObj({ MAT_DIALOG_DATA: null }) },

      ]
    })
      .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDrawingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {

    expect(component).toBeTruthy();
  });

  it('#update should modify data.background ', () => {
    spyOn(component, 'setDataInStorage');
    component.update();
    expect(component.data.backgroundColor).toBeDefined();
  });

  it('if colorPicker choice is checked, #update should modify data.background with colorFromPicker ', () => {

    component.newDrawingService.rColorFromPicker = '10';
    component.newDrawingService.gColorFromPicker = '10';
    component.newDrawingService.bColorFromPicker = '10';

    spyOn(component, 'setDataInStorage');
    component.update();
    expect(component.data.backgroundColor).toEqual('#' + component.rColorFromPicker
      + component.gColorFromPicker + component.bColorFromPicker);
  });

  it('#onClick should call #update and therefore define data.background ', () => {
    spyOn(component, 'setDataInStorage');
    component.onClick();
    expect(component.data.backgroundColor).toBeDefined();
  });

  it('#onClick should call navigate', () => {
    spyOn(component, 'setDataInStorage');
    component.onClick();
    expect(component.router.navigate).toHaveBeenCalled();

  });

  it('#onClick should call addToOption', () => {
    spyOn(component, 'setDataInStorage');
    component.onClick();
    expect(component.newDrawingService.addToOption).toHaveBeenCalled();
  });

  it('#onResize should be called if the window is resize', () => {
    const spyOnResize = spyOn(component, 'onResize');
    window.dispatchEvent(new Event('resize'));
    expect(spyOnResize).toHaveBeenCalled();
  });

  it('#onResize should modify the width and the height', () => {

    window.dispatchEvent(new Event('resize'));
    expect(component.data.height).toEqual(document.body.clientHeight - N30);
    expect(component.data.width).toEqual(document.body.clientWidth - N100);
  });

  it('#onNoClick should close the window ', () => {
    component.onNoClick();
    expect(component.newDrawingDialogRef.close).toHaveBeenCalled();
  });

  it('#setDataInStorage should call localStorage.setItem()', () => {
    component.data.height = N100;
    component.data.width = N100;
    const spy = spyOn(window.localStorage, 'setItem');

    component.setDataInStorage();
    expect(spy).toHaveBeenCalled();
  });

});
