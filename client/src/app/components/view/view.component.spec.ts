import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { ViewService } from '@services/view/view.service';

import { WarningDialogComponent } from '@components/new-drawing/warning-dialog/warning-dialog.component';
import { SavingDialogComponent } from '@components/saving-dialog/saving-dialog.component';
import { ViewComponent } from './view.component';

import SpyObj = jasmine.SpyObj;
import { Observable } from 'rxjs';

describe('ViewComponent', () => {

  const INDEX_FAKE = 10;

  let component: ViewComponent;
  let fixture: ComponentFixture<ViewComponent>;

  let spyViewObj: SpyObj<ViewService>;
  let spyDialog: SpyObj<MatDialog>;

  const router = {
    navigate: jasmine.createSpy('navigate')
  };
  beforeEach(() => {
    spyViewObj = jasmine.createSpyObj('ViewService', ['change']);
    const spyChangeObj = jasmine.createSpyObj('change', ['subscribe']);
    spyChangeObj.subscribe.and.returnValue({ subscribe: () => { /*true*/ } });
    spyViewObj.change = spyChangeObj;
  });

  beforeEach(async(() => {
    spyDialog = jasmine.createSpyObj({ open: null });
    TestBed.configureTestingModule({
      declarations: [ViewComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: ViewService, useValue: spyViewObj },
        { provide: Router, useValue: router },
        { provide: MatDialog, useValue: spyDialog }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#1 ngOnInit should should show/hide color', () => {
    component.ngOnInit();

    expect(spyViewObj.change.subscribe).toHaveBeenCalled();
  });

  it('#2 quit should navigate to /', () => {
    component.quit();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('#4 openUserManual should navigate to view/user-manual', () => {
    component.openUserManual();
    expect(router.navigate).toHaveBeenCalledWith(['/view/user-manual']);
  });

  it('#openWarningDialog should call dialog.open(WarningDialogComponent)', () => {
    const fctSpy = spyOn(component, 'openWarningDialog').and.returnValue();
    component.openWarningDialog();
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#5.1 onKeyDown should open with Ctrl+O ', () => {
    spyOn(component, 'areDialogsOpened').and.returnValue(false);
    const fctSpy = spyOn(component, 'openWarningDialog').and.returnValue();
    const kEvent = { ctrlKey: true, key: 'o', preventDefault: () => { return; } };

    component.onKeyDown(kEvent as KeyboardEvent);
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#5.2 onKeyDown should open with Ctrl+S ', () => {
    spyOn(component, 'areDialogsOpened').and.returnValue(false);
    const fctSpy = spyOn(component, 'openSavingDialog').and.returnValue();
    const kEvent = { ctrlKey: true, key: 's', preventDefault: () => { return; } };

    component.onKeyDown(kEvent as KeyboardEvent);
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#5.3 onKeyDown should call the clipboard functions', () => {
    const copySpy = spyOn(component.clipboard, 'copy').and.returnValue();
    const copyKey = { ctrlKey: true, key: 'c', preventDefault: () => { return; } };
    component.onKeyDown(copyKey as KeyboardEvent);
    expect(copySpy).toHaveBeenCalled();

    const pasteSpy = spyOn(component.clipboard, 'paste').and.callFake(async () => {
      return await new Promise((res, req) => {
        res();
      });
    });
    const pasteKey = { ctrlKey: true, key: 'v', preventDefault: () => { return; } };
    component.onKeyDown(pasteKey as KeyboardEvent);
    expect(copySpy).toHaveBeenCalled();
    expect(pasteSpy).toHaveBeenCalled();

    const duplicateSpy = spyOn(component.clipboard, 'duplicate').and.returnValue();
    const dupKey = { ctrlKey: true, key: 'd', preventDefault: () => { return; } };
    component.onKeyDown(dupKey as KeyboardEvent);
    expect(duplicateSpy).toHaveBeenCalled();

    const deleteSpy = spyOn(component.clipboard, 'delete').and.returnValue();
    const deleteKey = { key: 'Delete', preventDefault: () => { return; } };
    component.onKeyDown(deleteKey as KeyboardEvent);
    expect(deleteSpy).toHaveBeenCalled();

    const cutSpy = spyOn(component.clipboard, 'cut').and.returnValue();
    const cutKey = { ctrlKey: true, key: 'x', preventDefault: () => { return; } };
    component.onKeyDown(cutKey as KeyboardEvent);
    expect(cutSpy).toHaveBeenCalled();

  });

  // it('#5.4 onKeyDown should do undo-redo ', () => {
  //   const undoSpy = spyOn(component, 'undoCommand').and.returnValue();
  //   const undoKey = { ctrlKey: true, key: 'z', preventDefault: () => { return; } };
  //   component.onKeyDown(undoKey as KeyboardEvent);
  //   expect(undoSpy).toHaveBeenCalled();

  //   const redoSpy = spyOn(component, 'redoCommand').and.returnValue();
  //   const redoKey = { ctrlKey: true, shiftKey: true, key: 'Z', preventDefault: () => { return; } };
  //   component.onKeyDown(redoKey as KeyboardEvent);
  //   expect(redoSpy).toHaveBeenCalled();
  // });

  // it('#6 activateTool should call #chooseTool', () => {
  //   component.tool.toolMapString.set(FAKE_KEY, 'fakeTool');
  //   component.tool.toolMap.set(FAKE_KEY, FAKE_KEY);
  //   spyOn(component.tool, 'chooseTool').and.callThrough();
  //   spyOn(component.selection, 'erase').and.returnValue();
  //   spyOn(component.eraser, 'setCursor').and.returnValue();

  //   component.activateTool(FAKE_SHORTCUT_EVENT);

  //   expect(component.tool.chooseTool).toHaveBeenCalled();
  // });

  it('#7 toggle should toggle work bool', () => {
    component.toggledBars.set('pencilBar', false);
    component.toggledActivate = 'pencilBar';

    component.toggle('pencilBar');
    expect(component.show).toBe(true);
    component.toggle('pencilBar');
    expect(component.show).toBe(false);
  });

  it('#8 toggle should enter else if', () => {
    component.toggledBars.set('pencilBar', false);
    component.toggledActivate = 'lineBar';
    component.show = true;

    component.toggle('pencilBar');
    expect(component.toggledActivate).toEqual('pencilBar');
    expect(component.show).toBe(true);
  });

  it('#9 toggle should enter else', () => {
    component.toggledBars.set('pencilBar', false);
    component.toggledActivate = 'lineBar';
    component.show = false;

    component.toggle('pencilBar');

    expect(component.show).toBe(true);
    expect(component.toggledActivate).toEqual('pencilBar');
  });

  it('#10 toggle should do nothing when doesnt have the element', () => {
    spyOn(component.toggledBars, 'set').and.callThrough();
    component.toggle('xxxxx');
    expect(component.toggledBars.set).not.toHaveBeenCalled();
    expect(component.toggledBars.has('xxxxx')).toBeFalsy();
  });

  it('#11 optionBrush should call #toggleOption', () => {
    component.type.typeBrush.set(INDEX_FAKE, 'fakeType');
    spyOn(component.type, 'toggledOptionBrush').and.callThrough();
    component.optionBrush(INDEX_FAKE);

    expect(component.type.toggledOptionBrush).toHaveBeenCalled();
  });

  it('#12 toggleChild should set showVar to its opposite (true)', () => {
    component.toggleChild();
    expect(component.showVar).toBeTruthy();
  });

  it('#13 toggleColor should set showVar and show to true when false', () => {
    component.toggleColor();

    expect(component.showVar).toBeTruthy();
    expect(component.show).toBeTruthy();
    expect(component.text).toBe('Choisir la couleur');
  });

  it('#14 toggleColor should set showVar and show to false when true', () => {
    component.show = true;
    component.showVar = true;
    component.toggleColor();

    expect(component.showVar).toBeFalsy();
    expect(component.show).toBeFalsy();
    expect(component.text).toBe('Choisir la couleur');
  });

  it('#14 optionPolygon should call toggledOptionPolygon', () => {
    const fctSpy = spyOn(component.type, 'toggledOptionPolygon').and.returnValue();
    component.optionPolygon(2);
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#15 optionColor should call toggledOptionColor', () => {
    const fctSpy = spyOn(component.type, 'toggledOptionColor').and.returnValue();
    component.optionColor(2);
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#16 optionPolygon should call redo()', () => {
    const fctSpy = spyOn(component.commandManager, 'redo').and.returnValue();
    const backupSpy = spyOn(component.backupService, 'save');
    component.redoCommand();
    expect(fctSpy).toHaveBeenCalled();
    expect(backupSpy).toHaveBeenCalled();

  });

  it('#17 undoCommand should call undo and backup.save', () => {
    const fctSpy = spyOn(component.commandManager, 'undo').and.returnValue();
    const backupSpy = spyOn(component.backupService, 'save');
    component.undoCommand();
    expect(fctSpy).toHaveBeenCalled();
    expect(backupSpy).toHaveBeenCalled();

  });

  it('#18 onKeyDown should call redoCommad', () => {
    spyOn(component, 'areDialogsOpened').and.returnValue(false);
    const event = { key: 'Z', ctrlKey: true, shiftKey: true, altKey: false } as KeyboardEvent;
    const fctSpy = spyOn(component, 'redoCommand').and.returnValue();
    component.onKeyDown(event);
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#19 onKeyDown should call undoCommad', () => {
    spyOn(component, 'areDialogsOpened').and.returnValue(false);
    const event = { key: 'z', ctrlKey: true, shiftKey: false, altKey: false } as KeyboardEvent;
    const fctSpy = spyOn(component, 'undoCommand').and.returnValue();
    component.onKeyDown(event);
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#20 onKeyDown should call toggledGrille', () => {
    const event = { key: 'g', ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
    spyOn(component.tool, 'chooseTool').and.returnValue(true);
    const fctSpy = spyOn(component.attribute, 'toggleGrille').and.returnValue();
    component.onKeyDown(event);
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#21 onKeyDown should call toggledGrille', () => {
    const event = { key: 'G', ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
    spyOn(component.tool, 'chooseTool').and.returnValue(true);
    const fctSpy = spyOn(component.attribute, 'toggleGrille').and.returnValue();
    component.onKeyDown(event);
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#22 onKeyDown should call nothing', () => {
    const event = { key: 'rrrrr', ctrlKey: false, shiftKey: false, altKey: false } as KeyboardEvent;
    spyOn(component.tool, 'chooseTool').and.returnValue(true);
    const fctSpy1 = spyOn(component.attribute, 'toggleGrille').and.returnValue();
    const fctSpy2 = spyOn(component, 'undoCommand').and.returnValue();
    const fctSpy3 = spyOn(component, 'redoCommand').and.returnValue();
    component.onKeyDown(event);
    expect(fctSpy1).not.toHaveBeenCalled();
    expect(fctSpy2).not.toHaveBeenCalled();
    expect(fctSpy3).not.toHaveBeenCalled();
  });

  it('#23 openSavingDialog should call nothing', () => {
    const rep = {
      afterClosed: () => {
        return {
          subscribe: () => {
            return;
          }
          // tslint:disable: no-any
        } as Observable<any>;
      }
    } as MatDialogRef<SavingDialogComponent, any>;
    spyDialog.open.and.returnValue(rep);
    component.openSavingDialog();
    expect(spyDialog.open).toHaveBeenCalled();
  });

  it('#23 openWarningDialog should call nothing', () => {
    const rep = {} as MatDialogRef<WarningDialogComponent, any>;
    spyDialog.open.and.returnValue(rep);
    component.openWarningDialog();
    expect(spyDialog.open).toHaveBeenCalled();
  });

  it('#24 clipboard manipulation should be called', () => {
    const copySpy = spyOn(component.clipboard, 'copy').and.returnValue();
    component.copySelection();
    expect(copySpy).toHaveBeenCalled();

    const pasteSpy = spyOn(component.clipboard, 'paste').and.callFake(async () => {
      return await new Promise((res, req) => {
        res();
      });
    });
    component.pasteSelection();
    expect(pasteSpy).toHaveBeenCalled();

    const duplicateSpy = spyOn(component.clipboard, 'duplicate').and.returnValue();
    component.duplicateSelection();
    expect(duplicateSpy).toHaveBeenCalled();

    const deleteSpy = spyOn(component.clipboard, 'delete').and.returnValue();
    component.deleteSelection();
    expect(deleteSpy).toHaveBeenCalled();

    const cutSpy = spyOn(component.clipboard, 'cut').and.returnValue();
    component.cutSelection();
    expect(cutSpy).toHaveBeenCalled();
  });
  // tslint:disable: max-file-line-count
});
