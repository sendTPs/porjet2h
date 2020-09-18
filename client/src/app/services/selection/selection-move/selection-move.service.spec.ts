import { TestBed } from '@angular/core/testing';

import * as CST from '@models/constants';

import { PointStorageService } from '@services/point-storage/point-storage.service';
import { SelectionMoveService } from './selection-move.service';

describe('SelectionMoveService', () => {
  let service: SelectionMoveService;
  const N50 = 50;

  beforeEach(() => {
    const spyStorage = jasmine.createSpyObj('PointStorageService', ['clearStorage', 'addToStorage', 'getStorage', 'deleteLastPosition']);
    TestBed.configureTestingModule({
      providers: [
        SelectionMoveService,
        { provide: PointStorageService, useValue: spyStorage },
      ]
    });
    service = TestBed.get(SelectionMoveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#2 createElementMoving() should initialize#', () => {
    service.elementSVG = service.renderer.createElement('svg');
    service.createElementMoving();
    const expect1 = service.elementMove.getAttribute('x');
    const expect2 = service.elementMove.getAttribute('y');
    const expect3 = service.elementMove.getAttribute('width');
    const expect4 = service.elementMove.getAttribute('height');
    const expect5 = service.elementMove.getAttribute('fill');
    service.elementMove.dispatchEvent(new Event('mousemove'));
    service.elementMove.dispatchEvent(new Event('mouseup'));
    expect(expect1).toBe('0');
    expect(expect2).toBe('0');
    expect(expect3).toBe('3000');
    expect(expect4).toBe('2000');
    expect(expect5).toBe('rgba(0,0,0,0)');
  });

  it('#3 mouseUp() should ending the mouvement#', () => {
    service.isMoving = true;
    const click = { offsetX: 50, offsetY: 50 } as MouseEvent;
    service.elementMove = service.renderer.createElement('rect', 'svg');
    service.mouseUp(click);
    expect(service.isMoving).toBe(false);
  });

  it('#4 mouseDown() should initialize the mouvement#', () => {
    spyOn(service, 'createElementMoving').and.returnValue();
    const click = { offsetX: 50, offsetY: 50 } as MouseEvent;
    service.mouseDown(click);
    expect(service.isMoving).toBe(true);
    expect(service.position.x).toBe(N50);
    expect(service.position.y).toBe(N50);
  });

  it('#5 mouseMove() should translate (mouse)#', () => {
    const ele = service.renderer.createElement('rect', 'svg') as HTMLElement;
    ele.setAttribute('transform', 'matrix(1,0,1,0,0,0)');
    ele.setAttribute('vectorTranslate', '0:0');
    service.logic.elementSelected.push(ele);
    spyOn(service, 'createElementMoving').and.returnValue();
    const click1 = { offsetX: 50, offsetY: 50 } as MouseEvent;
    const click2 = { offsetX: 60, offsetY: 60, x: 3, y: -3 } as MouseEvent;
    service.mouseDown(click1);
    service.mouseMove(click2, false);
    const expect1 = service.logic.elementSelected[CST.FIRST].getAttribute('vectorTranslate');
    expect(expect1).toBe('0:0');
  });

  it('#6 mouseMove() should translate (arrow)#', () => {
    const ele = service.renderer.createElement('rect', 'svg') as HTMLElement;
    ele.setAttribute('transform', 'matrix(1,0,1,0,0,0)');
    ele.setAttribute('vectorTranslate', '0:0');
    service.logic.elementSelected.push(ele);
    spyOn(service, 'createElementMoving').and.returnValue();
    const click1 = { offsetX: 50, offsetY: 50 } as MouseEvent;
    const clickArrow = { offsetX: 20, offsetY: 20, x: 3, y: -3 } as MouseEvent;
    service.mouseDown(click1);
    service.mouseMove(clickArrow, true);
    const expect1 = service.logic.elementSelected[CST.FIRST].getAttribute('vectorTranslate');
    expect(expect1).toBe('0:0');
  });

  it('#7 mouseMove() should do nothing#', () => {
    const ele = service.renderer.createElement('rect', 'svg') as HTMLElement;
    ele.setAttribute('transform', 'matrix(1,0,1,0,0,0)');
    ele.setAttribute('vectorTranslate', '0:0');
    service.logic.elementSelected.push(ele);
    spyOn(service, 'createElementMoving').and.returnValue();
    const click1 = { offsetX: 50, offsetY: 50 } as MouseEvent;
    const click2 = { offsetX: 20, offsetY: 20, x: 3, y: -3 } as MouseEvent;
    service.mouseDown(click1);
    service.isMoving = false;
    service.mouseMove(click2, false);
    service.mouseMove(click2, true);
    const expect1 = service.logic.elementSelected[CST.FIRST].getAttribute('vectorTranslate');
    expect(expect1).toBe('0:0');
  });

});
