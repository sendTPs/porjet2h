import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorPaletteComponent } from './color-palette.component';

describe('ColorPaletteComponent', () => {
  let component: ColorPaletteComponent;
  let fixture: ComponentFixture<ColorPaletteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ColorPaletteComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorPaletteComponent);
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

  it('#draw should call #fillRect , #createLinearGradient and if selectedPosition is defined should call #ctx.stroke too', () => {
    component.selectedPosition = { x: 100, y: 100 };

    const ctxSpyFillRect = spyOn(component.ctx, 'fillRect');
    const ctxStrokeveSpy = spyOn(component.ctx, 'stroke');

    component.draw();
    expect(ctxSpyFillRect).toHaveBeenCalled();
    expect(ctxStrokeveSpy).toHaveBeenCalled();
  });

  it('#draw should not call #ctx.stroke if selectedPosition isnt defined', () => {
    const ctxStrokeveSpy = spyOn(component.ctx, 'stroke');
    component.draw();
    expect(ctxStrokeveSpy).not.toHaveBeenCalled();
  });

  // it('#ngOnChanges should call #ngAfterViewInit if there is a change on hue', () => {
  //   const fakeChange = {}
  //   expect();
  // });

  it('#onMouseDown should set mouseDown to false', () => {
    const fakeEvent = { offsetX: 20, offsetY: 35 };
    component.onMouseUp(fakeEvent as MouseEvent);

    expect(component.mousedown).toBeFalsy();
  });

  it('#onMouseDown should #draw and emit color', () => {
    const fakeEvent = { offsetX: 20, offsetY: 35 };
    spyOn(component, 'draw');
    spyOn(component.color, 'emit');

    component.onMouseDown(fakeEvent as MouseEvent);

    expect(component.color.emit).toHaveBeenCalled();
    expect(component.mousedown).toBeTruthy();
    expect(component.draw).toHaveBeenCalled();
  });

  it('#onMouseMove should #draw when mouseDown is true', () => {
    component.mousedown = true;
    const fakeEvent = { offsetX: 20, offsetY: 35 };
    spyOn(component, 'draw');
    spyOn(component, 'emitColor');
    component.onMouseMove(fakeEvent as MouseEvent);

    expect(component.draw).toHaveBeenCalled();
    expect(component.emitColor).toHaveBeenCalled();
  });

  it('#onMouseMove should not #draw when mouseDown is false', () => {
    component.mousedown = false;
    const fakeEvent = { offsetX: 20, offsetY: 35 };
    spyOn(component, 'draw');

    component.onMouseMove(fakeEvent as MouseEvent);
    expect(component.draw).not.toHaveBeenCalled();
  });

  it('#emitColor should work properly', () => {
    spyOn(component, 'getColorAtPosition');
    spyOn(component.color, 'emit');
    spyOn(component, 'colorRGBFinder');

    // tslint:disable: no-magic-numbers
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
