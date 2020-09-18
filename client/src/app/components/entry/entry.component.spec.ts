import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { NewDrawingComponent } from '@components/new-drawing/new-drawing.component';
import { EntryComponent } from './entry.component';

describe('EntryComponent', () => {
  let component: EntryComponent;
  let fixture: ComponentFixture<EntryComponent>;
  let fake: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EntryComponent, NewDrawingComponent],
      imports: [MatDialogModule],
      providers: [
        { provide: Router, useValue: jasmine.createSpyObj({ navigate: null }) },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    fake = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#openUserManual should open the user manual', () => {
    component.openUserManual();
    expect(component.router.navigate).toHaveBeenCalled();
  });

  it('#onButton should change the color in grey', () => {
    component.onButton(fake);
    expect(fake.style.backgroundColor).toEqual('grey');
  });

  it('#outButton should change the color in white', () => {
    component.outButton(fake);
    expect(fake.style.backgroundColor).toEqual('white');
  });

  it('#continueDrawing should call restoreBackup and navigate ', () => {
    const spy = spyOn(component.backupService, 'restoreBackup');
    component.continueDrawing();

    expect(component.backupService.wantToContinue).toBeTruthy();
    expect(spy).toHaveBeenCalled();
    expect(component.router.navigate).toHaveBeenCalledWith(['/view']);

  });

  it('#Ctrl+G should call openGallery ', () => {
    const spy = spyOn(component, 'openGallery').and.returnValue();
    const kEvent = { ctrlKey: true, key: 'g', preventDefault: () => { return; } };

    component.keyEvent(kEvent as KeyboardEvent);
    expect(spy).toHaveBeenCalled();

  });

  it('#openGallery should call dialog.open ', () => {
    const spy = spyOn(component.dialog, 'open');
    component.openGallery();

    expect(spy).toHaveBeenCalled();
  });

  it('#Ctrl+F should not call openGallery and do nothing and ', () => {
    const spy = spyOn(component, 'openGallery').and.returnValue();
    const kEvent = { ctrlKey: true, key: 'f', preventDefault: () => { return; } };

    component.keyEvent(kEvent as KeyboardEvent);
    expect(spy).not.toHaveBeenCalled();

  });

});
