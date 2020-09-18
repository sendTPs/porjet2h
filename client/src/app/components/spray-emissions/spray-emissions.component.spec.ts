import { ElementRef } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SprayEmissionsComponent } from './spray-emissions.component';

describe('SprayEmissionsComponent', () => {
  let component: SprayEmissionsComponent;
  let fixture: ComponentFixture<SprayEmissionsComponent>;
  const N45 = 45;
  const N50 = 50;
  const N20 = 20;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SprayEmissionsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SprayEmissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngInit should define emissionsPerSecond to 20 (defalut value)', () => {
    component.ngOnInit(); // utile ou pas cet appel ?
    expect(component.emissionsPerSecond).toBe(N20);
  });

  it('#updateSlider should update emissionsPerSecond', () => {
    const htmlInput = { value: '45' };
    component.sliderIn = new ElementRef(htmlInput as HTMLInputElement);
    component.updateSilder(); // or simulate an input slider
    expect(component.emissionsPerSecond).toBe(N45);

  });

  it('#updateNumber should update emissionsPerSecond if the value is between 1 and 100', () => {
    const htmlInput = { value: '45' };
    component.numberIn = new ElementRef(htmlInput as HTMLInputElement);
    component.updateNumber();
    expect(component.emissionsPerSecond).toBe(N45);
  });

  it('#updateNumber should define emissionsPerSecond to default value if the userInput is not between 1 and 100', () => {
    const htmlInput = { value: '-24' };
    component.numberIn = new ElementRef(htmlInput as HTMLInputElement);
    component.updateNumber();
    expect(component.emissionsPerSecond).toBe(N20);
  });

  it('#checkValue should not update emissionsPerSecond if the value is NaN ', () => {
    const htmlInput = { value: '' };
    component.numberIn = new ElementRef(htmlInput as HTMLInputElement);
    component.checkValue();
    expect(component.emissionsPerSecond).toBe(N20); // default value
  });

  it('#checkValue should update emissionsPerSecond if the value satisfy the conditions ', () => {
    const htmlInput = { value: '50' };
    component.numberIn = new ElementRef(htmlInput as HTMLInputElement);
    component.checkValue();
    expect(component.emissionsPerSecond).toBe(N50);
  });

  it('#disabledKeyboard should update this.attribute.isActivate to true ', () => {
    component.disabledKeyboard();
    expect(component.attribute.isActivate).toBeTruthy();
  });

});
