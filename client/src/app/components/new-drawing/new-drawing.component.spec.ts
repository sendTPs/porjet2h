import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';

import { NewDrawingDialogComponent } from './new-drawing-dialog/new-drawing-dialog.component';
import { NewDrawingComponent } from './new-drawing.component';

describe('NewDrawingComponent', () => {
  let component: NewDrawingComponent;
  let fixture: ComponentFixture<NewDrawingComponent>;
  let fake: HTMLElement;

  beforeEach(async(() => {
    TestBed
      .overrideModule(BrowserDynamicTestingModule, { set: { entryComponents: [NewDrawingDialogComponent] } })
      .configureTestingModule({
        declarations: [NewDrawingComponent, NewDrawingDialogComponent],
        imports: [MatDialogModule, BrowserAnimationsModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
        providers: [
          { provide: Router, useValue: jasmine.createSpyObj({ navigate: null }) },
          { provide: KeyboardEvent, useValue: jasmine.createSpyObj({ preventDefault: null }) }
        ]
      })
      .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewDrawingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fake = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#onButton should change the color in grey', () => {
    component.onButton(fake);
    expect(fake.style.backgroundColor).toEqual('grey');
  });

  it('#outButton should change the color in white', () => {
    component.outButton(fake);
    expect(fake.style.backgroundColor).toEqual('white');
  });

  it('#keyEvent should call openDialog', () => {
    const spy = spyOn(component, 'openDialog');
    const FAKE_SHORTCUT_EVENT = { key: 'o', ctrlKey: true, altKey: false, shiftKey: false, preventDefault(): void { return; } };

    component.keyEvent(FAKE_SHORTCUT_EVENT as KeyboardEvent);

    expect(spy).toHaveBeenCalled();
  });

  // it('#openDialog should do nothing if there is an active Dialog', () => {
  //   component.activeDialog = true;
  //   const spy = spyOn(component, 'openDialog');
  //   component.openDialog();
  //   expect(spy).not.toHaveBeenCalled();
  // });

  // it('#openDialog should define activeDialog to false afterClosed  ', () => {
  //   // component.openDialog();
  //   // expect(component.activeDialog).toBeFalsy(); // the modal is not closing in the test so afterClosed is never call
  // });

});
