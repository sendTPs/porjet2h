import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NewDrawingDialogComponent } from '../new-drawing-dialog/new-drawing-dialog.component';
import { WarningDialogComponent } from './warning-dialog.component';
// import { Router } from '@angular/router';

describe('WarningDialogComponent', () => {
  let component: WarningDialogComponent;
  let fixture: ComponentFixture<WarningDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WarningDialogComponent, NewDrawingDialogComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      imports: [MatDialogModule, BrowserAnimationsModule],
      providers: [
        { provide: MatDialogRef, useValue: jasmine.createSpyObj({ close: null }) },
        { provide: MatDialog, useValue: jasmine.createSpyObj({ open: null }) },
        { provide: MAT_DIALOG_DATA, useValue: jasmine.createSpyObj({ MAT_DIALOG_DATA: null }) }
      ],
    })
      .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#cancel should close the window', () => {
    component.cancel();
    expect(component.dialogRef.close).toHaveBeenCalled();
  });

  it('#openConfig should open a new window', () => {
    component.openConfig();
    expect(component.dialog.open).toHaveBeenCalled();
  });

});
