import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PENCIL_SHORTCUT_EVENT } from '@models/constants';

import { LineService } from '@services/line-tool/line.service';
import { PencilService } from '@services/pencil-tool/pencil.service';
import { RectangleService } from '@services/rectangle-tool/rectangle.service';

import { WorkspaceComponent } from './workspace.component';

import SpyObj = jasmine.SpyObj;
import { HttpClient } from '@angular/common/http';

describe('WorkspaceComponent', () => {
  const FOUR = 4;
  const prevent = () => { return; };
  let component: WorkspaceComponent;
  let fixture: ComponentFixture<WorkspaceComponent>;

  let spyPensObj: SpyObj<PencilService>;
  let spyLineObj: SpyObj<LineService>;
  let spyRectObj: SpyObj<RectangleService>;

  let pensSpy: jasmine.SpyObj<PencilService>;
  let lineSpy: jasmine.SpyObj<LineService>;
  let rectSpy: jasmine.SpyObj<RectangleService>;

  beforeEach(() => {
    spyPensObj = jasmine.createSpyObj('PencilService', ['shortcut', 'start', 'draw', 'end', 'updateCurrentPath']);
    spyLineObj = jasmine.createSpyObj('LineService', ['shortcut', 'start', 'draw', 'end', 'updateCurrentPath']);
    spyRectObj = jasmine.createSpyObj('RectangleService', ['shortcut', 'start', 'draw', 'end', 'updateCurrentPath']);
  });

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [WorkspaceComponent],
      providers: [
        { provide: PencilService, useValue: spyPensObj },
        { provide: LineService, useValue: spyLineObj },
        { provide: RectangleService, useValue: spyRectObj },
        { provide: HttpClient, useValue: jasmine.createSpyObj({ null: null }) }
      ]
    }).compileComponents();

    pensSpy = TestBed.get(PencilService);
    lineSpy = TestBed.get(LineService);
    rectSpy = TestBed.get(RectangleService);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkspaceComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('#0 should create', () => {
    expect(component).toBeTruthy();
  });

  it('#1 chooseTool() should change the Tool', () => {
    const kEvent1 = { preventDefault: prevent, key: 'l', ctrlKey: false, altKey: false, shiftKey: false };
    component.keyDown(kEvent1 as KeyboardEvent);
    expect(component.tool.chooseTool).toBeTruthy();
  });

  it('#2 chooseTool() shouldn\'t change the Tool x2', () => {
    const res1 = component.tool.chooseTool(PENCIL_SHORTCUT_EVENT);
    expect(res1).toBeFalsy();

    const kEvent = { preventDefault: prevent, key: '0', ctrlKey: false, altKey: false, shiftKey: false };
    component.keyDown(kEvent as KeyboardEvent);
    const res2 = component.tool.chooseTool(PENCIL_SHORTCUT_EVENT);
    expect(res2).toBeFalsy();
  });

  it('#3.1 shortcut() for Pencil should be call', () => {
    const kEvent1 = { preventDefault: prevent, key: '1', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent2 = { preventDefault: prevent, key: 'Shift', ctrlKey: false, altKey: false, shiftKey: true };
    const mEvent = { offsetX: 50, offsetY: 50 };

    component.keyDown(kEvent1 as KeyboardEvent);
    component.mouseDown(mEvent as MouseEvent);
    component.keyDown(kEvent2 as KeyboardEvent);
    expect(rectSpy.shortcut).toHaveBeenCalled();
    component.attribute.isActivate = true;
    component.keyDown(kEvent2 as KeyboardEvent);
    expect(rectSpy.shortcut).toHaveBeenCalled();
  });

  it('#3.2 shortcut() for Pencil shouldn\'t be call', () => {
    const kEvent1 = { preventDefault: prevent, key: 'w', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent2 = { preventDefault: prevent, key: 'Shift', ctrlKey: false, altKey: false, shiftKey: true };
    const mEvent = { offsetX: 50, offsetY: 50 };

    component.keyDown(kEvent1 as KeyboardEvent);
    component.mouseDown(mEvent as MouseEvent);
    component.keyDown(kEvent2 as KeyboardEvent);
    expect(rectSpy.start).not.toHaveBeenCalled();
  });

  it('#4.1 shortcut() for Line should be call', () => {
    const kEvent1 = { preventDefault: prevent, key: 'l', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent2 = { preventDefault: prevent, key: 'Shift', ctrlKey: false, altKey: false, shiftKey: true };
    const kEvent3 = { preventDefault: prevent, key: 'Backspace', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent4 = { preventDefault: prevent, key: 'Escape', ctrlKey: false, altKey: false, shiftKey: false };
    const mEvent = { offsetX: 50, offsetY: 50 };

    component.keyDown(kEvent1 as KeyboardEvent);
    component.mouseDown(mEvent as MouseEvent);
    component.keyDown(kEvent2 as KeyboardEvent);
    component.keyDown(kEvent3 as KeyboardEvent);
    component.keyDown(kEvent4 as KeyboardEvent);
    expect(lineSpy.shortcut).toHaveBeenCalledTimes(FOUR);
  });

  it('#4.2 shortcut() for Line shouldn\'t be call', () => {
    const kEvent1 = { preventDefault: prevent, key: 'w', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent2 = { preventDefault: prevent, key: 'Shift', ctrlKey: false, altKey: false, shiftKey: true };
    const kEvent3 = { preventDefault: prevent, key: 'Backspace' };
    const kEvent4 = { preventDefault: prevent, key: 'Escape' };
    const mEvent = { offsetX: 50, offsetY: 50 };

    component.keyDown(kEvent1 as KeyboardEvent);
    component.mouseDown(mEvent as MouseEvent);
    component.keyDown(kEvent2 as KeyboardEvent);
    component.keyDown(kEvent3 as KeyboardEvent);
    component.keyDown(kEvent4 as KeyboardEvent);
    expect(lineSpy.shortcut).not.toHaveBeenCalled();
  });

  it('#5.1 shortcut() for Brush should be call', () => {
    const kEvent1 = { preventDefault: prevent, key: '1', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent2 = { preventDefault: prevent, key: 'Shift', ctrlKey: false, altKey: false, shiftKey: true };
    const mEvent = { offsetX: 50, offsetY: 50 };

    component.keyDown(kEvent1 as KeyboardEvent);
    component.mouseDown(mEvent as MouseEvent);
    component.keyDown(kEvent2 as KeyboardEvent);
    expect(rectSpy.shortcut).toHaveBeenCalled();
  });

  it('#5.2 shortcut() for Brush shouldn\'t be call', () => {
    const kEvent1 = { preventDefault: prevent, key: 'w', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent2 = { preventDefault: prevent, key: 'Shift', ctrlKey: false, altKey: false, shiftKey: true };
    const mEvent = { offsetX: 50, offsetY: 50 };

    component.keyDown(kEvent1 as KeyboardEvent);
    component.mouseDown(mEvent as MouseEvent);
    component.keyDown(kEvent2 as KeyboardEvent);
    expect(rectSpy.start).not.toHaveBeenCalled();
  });

  it('#6.1 shortcut() for Rectangle should be call', () => {
    const kEvent1 = { preventDefault: prevent, key: '1', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent2 = { preventDefault: prevent, key: 'Shift', ctrlKey: false, altKey: false, shiftKey: true };
    const mEvent = { offsetX: 50, offsetY: 50 };

    component.keyDown(kEvent1 as KeyboardEvent);
    component.mouseDown(mEvent as MouseEvent);
    component.keyDown(kEvent2 as KeyboardEvent);
    expect(rectSpy.shortcut).toHaveBeenCalled();
  });

  it('#6.2 shortcut() for Rectangle shouldn\'t be call', () => {
    const kEvent1 = { preventDefault: prevent, key: 'w', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent2 = { preventDefault: prevent, key: 'Shift', ctrlKey: false, altKey: false, shiftKey: true };
    const mEvent = { offsetX: 50, offsetY: 50 };

    component.keyDown(kEvent1 as KeyboardEvent);
    component.mouseDown(mEvent as MouseEvent);
    component.keyDown(kEvent2 as KeyboardEvent);
    expect(rectSpy.start).not.toHaveBeenCalled();
  });

  it('#7 keyUp should call shortcut() function x4', () => {
    const kEvent1 = { preventDefault: prevent, key: 'c', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent2 = { preventDefault: prevent, key: 'l', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent3 = { preventDefault: prevent, key: 'w', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent4 = { preventDefault: prevent, key: '1', ctrlKey: false, altKey: false, shiftKey: false };
    const kEventShift = { preventDefault: prevent, key: 'Shift', ctrlKey: false, altKey: false, shiftKey: true };

    component.keyDown(kEvent1 as KeyboardEvent);
    component.keyUp(kEventShift as KeyboardEvent);
    expect(pensSpy.shortcut).toHaveBeenCalledTimes(2);

    component.keyDown(kEvent2 as KeyboardEvent);
    component.keyUp(kEventShift as KeyboardEvent);
    expect(lineSpy.shortcut).toHaveBeenCalledTimes(2);

    component.keyDown(kEvent3 as KeyboardEvent);
    component.keyUp(kEventShift as KeyboardEvent);
    expect(pensSpy.shortcut).toHaveBeenCalledTimes(FOUR);

    component.keyDown(kEvent4 as KeyboardEvent);
    component.keyUp(kEventShift as KeyboardEvent);
    expect(rectSpy.shortcut).toHaveBeenCalledTimes(2);

    component.attribute.isActivate = true;
    component.keyUp(kEventShift as KeyboardEvent);
    expect(rectSpy.shortcut).toHaveBeenCalled();
  });

  it('#8 mouseMove() should call draw() function x4', () => {
    const kEvent1 = { preventDefault: prevent, key: 'c', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent2 = { preventDefault: prevent, key: 'l', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent3 = { preventDefault: prevent, key: 'w', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent4 = { preventDefault: prevent, key: '1', ctrlKey: false, altKey: false, shiftKey: false };
    const mEvent = { offsetX: 50, offsetY: 50 };

    component.keyDown(kEvent1 as KeyboardEvent);
    component.mouseMove(mEvent as MouseEvent);
    expect(pensSpy.draw).toHaveBeenCalled();

    component.keyDown(kEvent2 as KeyboardEvent);
    component.mouseMove(mEvent as MouseEvent);
    expect(lineSpy.draw).toHaveBeenCalled();

    component.keyDown(kEvent3 as KeyboardEvent);
    component.mouseMove(mEvent as MouseEvent);
    expect(pensSpy.draw).toHaveBeenCalled();

    component.keyDown(kEvent4 as KeyboardEvent);
    component.mouseMove(mEvent as MouseEvent);
    expect(rectSpy.draw).toHaveBeenCalled();
  });

  it('#9 mouseLeave() should call end() function x4', () => {
    const kEvent1 = { preventDefault: prevent, key: 'c', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent2 = { preventDefault: prevent, key: 'l', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent3 = { preventDefault: prevent, key: 'w', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent4 = { preventDefault: prevent, key: '1', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent5 = { preventDefault: prevent, key: 's', ctrlKey: false, altKey: false, shiftKey: false };
    const mEvent = { offsetX: 50, offsetY: 50 };

    component.keyDown(kEvent1 as KeyboardEvent);
    component.mouseLeave(mEvent as MouseEvent);
    expect(pensSpy.end).toHaveBeenCalled();

    component.keyDown(kEvent2 as KeyboardEvent);
    component.mouseLeave(mEvent as MouseEvent);
    expect(lineSpy.end).toHaveBeenCalled();

    component.keyDown(kEvent3 as KeyboardEvent);
    component.mouseLeave(mEvent as MouseEvent);
    expect(pensSpy.end).toHaveBeenCalled();

    component.keyDown(kEvent4 as KeyboardEvent);
    component.mouseLeave(mEvent as MouseEvent);
    expect(rectSpy.end).toHaveBeenCalled();

    const fctSpy = spyOn(component.selection, 'end');
    component.keyDown(kEvent5 as KeyboardEvent);
    component.mouseLeave(mEvent as MouseEvent);
    expect(fctSpy).not.toHaveBeenCalled();
  });

  it('#10 mouseUp() should call end() function x4 and call backupService.save', () => {
    const kEvent1 = { preventDefault: prevent, key: 'c', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent2 = { preventDefault: prevent, key: 'l', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent3 = { preventDefault: prevent, key: 'w', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent4 = { preventDefault: prevent, key: '1', ctrlKey: false, altKey: false, shiftKey: false };
    const mEvent = { offsetX: 50, offsetY: 50 };
    const backupSpy = spyOn(component.backupService, 'save');

    component.keyDown(kEvent1 as KeyboardEvent);
    component.mouseUp(mEvent as MouseEvent);
    expect(pensSpy.end).toHaveBeenCalled();

    component.keyDown(kEvent2 as KeyboardEvent);
    component.mouseUp(mEvent as MouseEvent);
    expect(lineSpy.end).not.toHaveBeenCalled();

    component.keyDown(kEvent3 as KeyboardEvent);
    component.mouseUp(mEvent as MouseEvent);
    expect(pensSpy.end).toHaveBeenCalled();

    component.keyDown(kEvent4 as KeyboardEvent);
    component.mouseUp(mEvent as MouseEvent);
    expect(rectSpy.end).toHaveBeenCalled();

    expect(backupSpy).toHaveBeenCalled();

  });

  it('#11 dblClick() should call end() function x4 and call backupService.save', () => {
    const kEvent1 = { preventDefault: prevent, key: 'c', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent2 = { preventDefault: prevent, key: 'l', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent3 = { preventDefault: prevent, key: 'w', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent4 = { preventDefault: prevent, key: '1', ctrlKey: false, altKey: false, shiftKey: false };
    const mEvent = { offsetX: 50, offsetY: 50 };
    const backupSpy = spyOn(component.backupService, 'save');

    component.keyDown(kEvent1 as KeyboardEvent);
    component.dblClick(mEvent as MouseEvent);
    expect(pensSpy.end).not.toHaveBeenCalled();

    component.keyDown(kEvent2 as KeyboardEvent);
    component.dblClick(mEvent as MouseEvent);
    expect(lineSpy.end).toHaveBeenCalled();

    component.keyDown(kEvent3 as KeyboardEvent);
    component.dblClick(mEvent as MouseEvent);
    expect(pensSpy.end).not.toHaveBeenCalled();

    component.keyDown(kEvent4 as KeyboardEvent);
    component.dblClick(mEvent as MouseEvent);
    expect(rectSpy.end).not.toHaveBeenCalled();

    expect(backupSpy).toHaveBeenCalled();
  });

  it('#12 mouseDown() should call start() function x4', () => {
    const kEvent1 = { preventDefault: prevent, key: 'c', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent2 = { preventDefault: prevent, key: 'l', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent3 = { preventDefault: prevent, key: 'w', ctrlKey: false, altKey: false, shiftKey: false };
    const kEvent4 = { preventDefault: prevent, key: '1', ctrlKey: false, altKey: false, shiftKey: false };
    const mEvent = { offsetX: 50, offsetY: 50 };

    component.keyDown(kEvent1 as KeyboardEvent);
    component.mouseDown(mEvent as MouseEvent);
    expect(pensSpy.start).toHaveBeenCalled();

    component.keyDown(kEvent2 as KeyboardEvent);
    component.mouseDown(mEvent as MouseEvent);
    expect(lineSpy.start).toHaveBeenCalled();

    component.keyDown(kEvent3 as KeyboardEvent);
    component.mouseDown(mEvent as MouseEvent);
    expect(pensSpy.start).toHaveBeenCalled();

    component.keyDown(kEvent4 as KeyboardEvent);
    component.mouseDown(mEvent as MouseEvent);
    expect(rectSpy.start).toHaveBeenCalled();
  });

  it('#13 newOption should modify height, width, backgroundColor', () => {
    component.newDrawingService.height = 2;
    component.newDrawingService.width = 2;
    component.newDrawingService.backgroundColor = 'FFFFFF';
    component.newOption();
    expect(component.height).toEqual(2);
    expect(component.width).toEqual(2);
    expect(component.backgroundColor).toEqual('FFFFFF');
  });

  it('#14 newOption should not call #erase if newDrawingService.newDrawing is true', () => {
    component.newDrawingService.newDrawing = true;
    spyOn(component, 'erase');
    component.newOption();
    expect(component.erase).toHaveBeenCalled();
  });

  it('#15 newOption should not call #erase if newDrawingService.newDrawing is false', () => {
    component.newDrawingService.newDrawing = false;
    spyOn(component, 'erase');
    component.newOption();
    expect(component.erase).not.toHaveBeenCalled();
  });

  it('#16 erase should remove all SVG element except 1 (filter)', () => {
    const svgElement = document.createElement('svg');
    component.eleSVG.nativeElement = svgElement;
    const elePath = document.createElement('path');
    const eleRect = document.createElement('rect');
    svgElement.appendChild(elePath);
    svgElement.appendChild(eleRect);
    component.erase();
    expect(svgElement.childNodes.length).toBe(1);
  });

  it('#17.1 ngOnInit should call newOption', () => {
    spyOn(component, 'newOption');
    component.ngOnInit();
    expect(component.newOption).toHaveBeenCalled();
  });

  it('#17.2 ngOnInit should call continueDrawing if wantToContinue is true', () => {
    component.backupService.wantToContinue = true;
    const spy = spyOn(component, 'continueDrawing');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });

  it('#17.3 ngOnInit should call loadDrawingFromServer if galleryService.loadDrawing is true', () => {
    component.galleryService.loadDrawing = true;
    component.galleryService.drawingToDisplay = {
      name: 'dessin1', tags: ['nature'], image: 'image1', thumbnail: 'vignette1',
      height: 0, width: 0, background: 'color'
    };
    const spy = spyOn(component, 'loadDrawingFromServer');
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
    expect(component.height).toBe(0);
    expect(component.width).toBe(0);
    expect(component.backgroundColor).toBe('color');
  });

  it('#18.1 mouseEnter should call end', () => {
    const mEvent = { offsetX: 50, offsetY: 50, buttons: 0 } as MouseEvent;
    pensSpy.end.and.returnValue();
    component.mouseEnter(mEvent);
    expect(pensSpy.end).toHaveBeenCalled();
  });

  it('#18.2 mouseEnter should NOT call end', () => {
    const mEvent = { offsetX: 50, offsetY: 50, buttons: 1 } as MouseEvent;
    pensSpy.end.and.returnValue();
    component.mouseEnter(mEvent);
    expect(pensSpy.end).not.toHaveBeenCalled();
  });

  it('#19 onContextMenu should call preventDefault', () => {
    const mEvent = new MouseEvent('mousedown');
    const fctSpy = spyOn(mEvent, 'preventDefault').and.returnValue();
    component.onContextMenu(mEvent);
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#19 newOption should call preventDefault', () => {
    component.newOption();
    expect(component.backgroundColor).toBeNull();
  });

  it('#20 mouseLeave should call eraseMarker', () => {
    const mEvent = { offsetX: 50, offsetY: 50 } as MouseEvent;
    component.tool.tool = 'e000';
    const fctSpy = spyOn(component.eraser, 'eraseMarker').and.returnValue();
    component.mouseLeave(mEvent);
    expect(fctSpy).toHaveBeenCalled();
  });

  it('#21 loadSVGElementFromOldOne should  assign the backup to eleSVG', () => {
    const sketchSpy = spyOn(component.sketch, 'add');
    component.loadSVGElementFromOldOne('<svg><g app-filter></g></svg>');
    expect(sketchSpy).toHaveBeenCalled();
    expect(component.eleSVG.nativeElement.innerHTML).toEqual('<svg><g app-filter=""></g></svg>');

  });
  it('#22 continueDrawing should call restoreBackUp and loadSVGElementFromOldOne', () => {
    const backupSpy = spyOn(component.backupService, 'restoreBackup')
      .and.returnValue('<svg><g app-filter></g></svg>');
    const spyLoadSVG = spyOn(component, 'loadSVGElementFromOldOne');

    component.continueDrawing();

    expect(backupSpy).toHaveBeenCalled();
    expect(spyLoadSVG).toHaveBeenCalled();
    expect(component.backupService.wantToContinue).toBeFalsy();

  });

  it('#23 loadDrawingFromServer should loadSVGElementFromOldOne', () => {
    component.galleryService.drawingToDisplay = {
      name: 'dessin1', tags: ['nature'], image: 'image1', thumbnail: 'vignette1',
      height: 0, width: 0, background: ''
    };
    const spyLoadSVG = spyOn(component, 'loadSVGElementFromOldOne');
    component.loadDrawingFromServer();
    expect(spyLoadSVG).toHaveBeenCalled();
    expect(component.galleryService.loadDrawing).toBeFalsy();

  });

  // tslint:disable-next-line: max-file-line-count
});
