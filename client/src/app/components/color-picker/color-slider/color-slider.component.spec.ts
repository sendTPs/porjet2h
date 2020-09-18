import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorSliderComponent } from './color-slider.component';

describe('ColorSliderComponent', () => {
  let component: ColorSliderComponent;
  let fixture: ComponentFixture<ColorSliderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ColorSliderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngAfterViewInit should call #draw if canvasElmntChild is defined', () => {
    component.canvasElmntChild.nativeElement.setAttribute('canvas', 'value');
    const spy = spyOn(component, 'draw');
    component.ngAfterViewInit();
    expect(spy).toHaveBeenCalled();
  });

  it('#draw should work selectedHeight is true', () => {
    // tslint:disable: no-magic-numbers
    component.selectedHeight = 10;

    const ctxSpyClearRect = spyOn(component.ctx, 'clearRect');
    const ctxBeg = spyOn(component.ctx, 'beginPath');
    const ctxFill = spyOn(component.ctx, 'fill');
    const ctxClose = spyOn(component.ctx, 'closePath');

    component.draw();

    expect(ctxSpyClearRect).toHaveBeenCalled();
    expect(ctxBeg).toHaveBeenCalled();
    expect(ctxFill).toHaveBeenCalled();
    expect(ctxClose).toHaveBeenCalled();
    expect(component.ctx.lineWidth).toBe(3); // meaning that we entered the if
  });

  it('#draw should work selectedHeight is false', () => {
    component.selectedHeight = 0;
    component.ctx.lineWidth = 1;

    component.draw();
    expect(component.ctx.lineWidth).toBe(1); // meaning that we entered the if
  });

  it('#onMouseDown should work selectedHeight is false', () => {
    component.selectedHeight = 0;
    component.ctx.lineWidth = 1;

    component.draw();
    expect(component.ctx.lineWidth).toBe(1); // meaning that we entered the if
  });

  it('#onMouseDown should #draw and emit color', () => {
    const fakeEvent = { offsetX: 20, offsetY: 35 };
    spyOn(component, 'draw');
    spyOn(component, 'emitColor');

    component.onMouseDown(fakeEvent as MouseEvent);
    expect(component.selectedHeight).toBe(35);
    expect(component.emitColor).toHaveBeenCalled();
    expect(component.mousedown).toBeTruthy();
    expect(component.draw).toHaveBeenCalled();
  });

  it('#onMouseMove should #draw and emit color when mousedown is true', () => {
    const fakeEvent = { offsetX: 20, offsetY: 35 };
    component.mousedown = true;
    spyOn(component, 'draw');
    spyOn(component.color, 'emit');

    component.onMouseMove(fakeEvent as MouseEvent);
    expect(component.selectedHeight).toBe(35);
    expect(component.color.emit).toHaveBeenCalled();
    expect(component.draw).toHaveBeenCalled();
  });

  it('#onMouseMove should not #draw and emit color when mousedown is false', () => {
    const fakeEvent = { offsetX: 20, offsetY: 35 };
    component.mousedown = false;
    spyOn(component, 'draw');
    spyOn(component.color, 'emit');

    component.onMouseMove(fakeEvent as MouseEvent);
    expect(component.selectedHeight).not.toBe(35);
    expect(component.color.emit).not.toHaveBeenCalled();
    expect(component.draw).not.toHaveBeenCalled();
  });

  it('#onMouseUp should set mousedown to false', () => {
    const fakeEvent = { offsetX: 20, offsetY: 35 };
    component.mousedown = true;

    component.onMouseUp(fakeEvent as MouseEvent);
    expect(component.mousedown).toBeFalsy();
  });

  it('#emitColor should work properly', () => {
    spyOn(component, 'getColorAtPosition');
    spyOn(component.color, 'emit');
    spyOn(component, 'colorRGBFinder');

    component.emitColor(20, 29);
    expect(component.getColorAtPosition).toHaveBeenCalled();
    expect(component.color.emit).toHaveBeenCalled();
    expect(component.colorRGBFinder).toHaveBeenCalled();
  });

  it('#getColorAtPosition should work properly', () => {
    const fakeX = 20;
    const fakeY = 30;

    expect(component.getColorAtPosition(fakeX, fakeY)).toBe(
      'rgba(' + (component.ctx.getImageData(fakeX, fakeY, 1, 1).data)[0]
      + ',' + (component.ctx.getImageData(fakeX, fakeY, 1, 1).data)[1]
      + ',' + (component.ctx.getImageData(fakeX, fakeY, 1, 1).data)[2] + ',1)'
    );

  });

  it('#colorRGBFinder should work when color is true', () => {
    const fakeColor = 'fake';
    // component.color = new EventEmitter(true);
    spyOn(component.rColor, 'emit');
    spyOn(component.gColor, 'emit');
    spyOn(component.bColor, 'emit');

    component.colorRGBFinder(fakeColor);

    expect(component.rColor.emit).toHaveBeenCalled();
    expect(component.gColor.emit).toHaveBeenCalled();
    expect(component.bColor.emit).toHaveBeenCalled();
  });

  it('#decToHex should work properly', () => {
    const fakeDecColor = 'A';
    expect(component.decToHex(fakeDecColor)).toBe('NaN');
  });

});
