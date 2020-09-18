import { HttpClient, HttpHandler } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { SavingDialogComponent } from './saving-dialog.component';

describe('SavingDialogComponent', () => {
  let component: SavingDialogComponent;
  let fixture: ComponentFixture<SavingDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SavingDialogComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [ReactiveFormsModule, MatDialogModule],
      providers: [

        { provide: MatDialogRef, useValue: jasmine.createSpyObj({ close: null }) },
        { provide: Router, useValue: jasmine.createSpyObj({ navigate: null }) },
        HttpClient, HttpHandler
      ]

    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#1 createForm should call this.formBuilder.group to create a form', () => {
    // tslint:disable: no-string-literal
    const spy = spyOn(component['formBuilder'], 'group');
    // tslint:disable-next-line: no-unused-expression
    component.createForm();
    expect(spy).toHaveBeenCalled();
  });

  it('#2 initDrawing should define this.drawing', () => {
    component.initDrawing();
    expect(component.drawing).toBeDefined();
  });

  it('#3 initMatChips should set visible,selectable,removable and addOnBlur at true', () => {
    component.initMatChips();
    expect(component.visible).toBeTruthy();
    expect(component.addOnBlur).toBeTruthy();
    expect(component.selectable).toBeTruthy();
    expect(component.removable).toBeTruthy();

  });

  it('#5 getTagsArray should call savingForm.get', () => {
    const spy = spyOn(component.savingForm, 'get');
    component.getTagsArray();
    expect(spy).toHaveBeenCalledWith('tagsArray');
  });

  // it('#6 getTagsControls should call  getTagsArray', () => {
  //   const spy = spyOn(component, 'getTagsArray');
  //   component.getTagsControls();
  //   expect(spy).toHaveBeenCalled();
  // });

});
