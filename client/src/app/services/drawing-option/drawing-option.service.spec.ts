import { TestBed } from '@angular/core/testing';

import { DialogData } from '@components/new-drawing/new-drawing-dialog/new-drawing-dialog.component';

import { DrawingOptionService } from './drawing-option.service';

export class FakeDialogService implements DialogData {
  width: number;
  height: number;
  backgroundColor: string;
  colorR: number;
  colorG: number;
  colorB: number;
  hexCode: number;
  constructor() {
    // tslint:disable: no-magic-numbers
    this.width = 10;
    this.height = 20;
    this.backgroundColor = 'fakeColor';
  }
}

describe('DrawingOptionService', () => {
  let service: DrawingOptionService;
  beforeEach(() => {
    service = TestBed.get(DrawingOptionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#addToOption should set dialog options', () => {
    const fakeInterface = new FakeDialogService();

    service.addToOption(fakeInterface);
    expect(service.backgroundColor).toBe('fakeColor');
    expect(service.width).toBe(10);
    expect(service.height).toBe(20);
  });

  // it('#sendColorPicker should emit strings', () => {
  //   spyOn(service.sendrColorFromPicker,'emit').and.callThrough();
  //   spyOn(service.sendgColorFromPicker,'emit').and.callThrough();
  //   spyOn(service.sendbColorFromPicker,'emit').and.callThrough();

  //   service.sendColorPicker();
  //   expect(service.sendrColorFromPicker.emit).toHaveBeenCalled();
  //   expect(service.sendgColorFromPicker.emit).toHaveBeenCalled();
  //   expect(service.sendbColorFromPicker.emit).toHaveBeenCalled();

  // });

});
