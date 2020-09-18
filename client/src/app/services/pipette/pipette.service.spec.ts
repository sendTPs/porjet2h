import { ElementRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { WorkspaceComponent } from '@components/workspace/workspace.component';

import { ColorService } from '@services/color/color.service';
import { PipetteService } from './pipette.service';

// Reference: https://gist.github.com/allenhwkim/a281649182702cc20d2b8b1c56d1d06e, pour le MockElementRef
class MockElementRef extends ElementRef {
  constructor() { super(undefined); }
}

describe('PipetteService', () => {
  let service: PipetteService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WorkspaceComponent],
      providers: [ColorService]
    }),
      service = TestBed.get(PipetteService);
  });

  it('should be created', () => {
    service.end();
    service.draw();
    service.shortcut();
    expect(service).toBeTruthy();
  });

  it('#start should call this.pickColor()', () => {
    const event: MouseEvent = new MouseEvent('mousedown');
    const spy = spyOn(service, 'svgToCanvas');
    service.start(event);
    expect(spy).toHaveBeenCalled();
  });

  it('#2 setCanvasTag should defined this.canvasTag', () => {
    const canvas = new MockElementRef();
    service.setCanvasTag(canvas);
    expect(service.canvasTag).toEqual(canvas);

  });

  it('#3 setImageTag should defined this.imageTag', () => {
    const img = new MockElementRef();
    service.setImageTag(img);
    expect(service.imageTag).toEqual(img);

  });

  it('#4 setSvgTag should defined this.svgTag', () => {
    const svg = new MockElementRef();
    service.setSvgTag(svg);
    expect(service.svgTag).toEqual(svg);

  });

  it('#5 svgToCanvas should define and return a canvas context', () => {
    const canvasElement = document.createElement('canvas');
    const svgElement = document.createElement('svg');
    const imageElement = document.createElement('img');
    service.canvasTag = new ElementRef(canvasElement);
    service.svgTag = new ElementRef(svgElement);
    service.imageTag = new ElementRef(imageElement);

    service.svgToCanvas();

    expect(service.context).toBeDefined();
  });

  it('#6 pickColor should call this.changeColor() ', () => {
    const event: MouseEvent = new MouseEvent('mousedown');
    spyOn(service, 'getColorData');
    spyOn(service, 'svgToCanvas');
    const spy = spyOn(service, 'changeColor');

    service.pickColor(event);
    expect(spy).toHaveBeenCalled();
  });

  it('#7.1 changeColor should change the primary color if it is right click', () => {
    const event: MouseEvent = new MouseEvent('mousedown');
    const color = 'rgb(100,120,150)';

    service.changeColor(color, event);
    expect(service.color.prime).toEqual(color);
  });

  it('#7.2 changeColor should change the secondary color if it is left click', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {
      button: 2,
    });
    const color = 'rgb(100,120,150)';
    service.changeColor(color, event);
    expect(service.color.second).toEqual(color);
  });

  it('#8 changeColor should do nothing when another button is click', () => {
    const event: MouseEvent = new MouseEvent('mousedown', {
      button: 3
    });
    const color = 'rgb(100,120,150)';
    service.changeColor(color, event);
    expect(service.color.prime).not.toEqual(color);
    expect(service.color.second).not.toEqual(color);
  });

  it('#9 getColorData should get the right color if the click is on a element', () => {
    const element = document.createElement('rect');
    const event = { offsetX: 0, offsetY: 0, target: element } as unknown as MouseEvent;

    service.context = {
      getImageData: (sx, sy, sw, sh) => {
        return {
          // tslint:disable: no-magic-numbers
          data: [100, 120, 150, 550]
        } as unknown as ImageData;
      }
    } as CanvasRenderingContext2D;

    service.getColorData(service.context, event);
    expect(service.pickedColor).toBe('rgb(100,120,150)');
  });

  it('#10 getColorData should get the right color if the click is on the background', () => {
    const elementSVG = document.createElement('svg');
    const elementDiv = document.createElement('div');
    elementDiv.appendChild(elementSVG);
    elementDiv.setAttribute('style', 'background-color: rgb(99,188,77); height: 10px;');
    const event = { offsetX: 0, offsetY: 0, target: elementSVG } as unknown as MouseEvent;

    service.context = {
      getImageData: (sx, sy, sw, sh) => {
        return {
          data: [100, 120, 150, 550]
        } as unknown as ImageData;
      }
    } as CanvasRenderingContext2D;

    service.getColorData(service.context, event);
    expect(service.pickedColor).toBe('rgb(100,120,150)');
  });

  it('#11 end() should do nothing if pipetteInProgress is false', () => {
    service.pipetteInProgress = false;
    const spy = spyOn(service, 'pickColor');
    service.end();
    expect(spy).not.toHaveBeenCalled();
  });

  it('#11 end() should call pickColor if pipetteInProgress is true', () => {
    service.pipetteInProgress = true;
    const spy = spyOn(service, 'pickColor').and.returnValue();
    service.end();
    expect(spy).toHaveBeenCalled();
  });

});
