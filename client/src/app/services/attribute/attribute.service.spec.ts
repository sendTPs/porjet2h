import { TestBed } from '@angular/core/testing';

import { AttributeService } from './attribute.service';

describe('AttributeService', () => {
  let service: AttributeService;
  beforeEach(() => {
    service = TestBed.get(AttributeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#1 updateWidth should work', () => {
    const fakeWidth = 'width';
    service.updateWidth(fakeWidth);
    expect(service.width).toBe('width');
  });

  it('#2 toggledJonction and #getWidth should work', () => {
    const fakeBorder = '7';
    service.updateBorder(fakeBorder);
    expect(service.border).toBe('7');
  });

  it('#3 updateWidthJonction should work', () => {
    const fakeWidth = 'widthJonctionString';
    service.updateWidthJonction(fakeWidth);
    expect(service.widthJonction).toBe('widthJonctionString');
  });

  it('#4 toggledJonction hould work', () => {
    service.activateJonction = true;
    service.toggleJonction();
    expect(service.activateJonction).toBe(false);
  });

  it('#5 toggledGrille should toggle hidden <=> visible', () => {
    spyOn(service.obsGrilleVisibility, 'emit').and.returnValue();
    service.toggleGrille();
    expect(service.visibilityGrille).toBe('visible');
    service.toggleGrille();
    expect(service.visibilityGrille).toBe('hidden');
  });

  it('#6 upWidthGrille should increase by 5', () => {
    spyOn(service.obsGrilleWidth, 'emit').and.returnValue();
    service.upWidthGrille();
    expect(service.grille).toBe('25');
  });

  it('#7 downWidthGrille should decrease by 5', () => {
    spyOn(service.obsGrilleWidth, 'emit').and.returnValue();
    service.downWidthGrille();
    expect(service.grille).toBe('15');
  });

  it('#8 downWidthGrille should NOT decrease by 5', () => {
    service.grille = '5';
    spyOn(service.obsGrilleWidth, 'emit').and.returnValue();
    service.downWidthGrille();
    expect(service.grille).toBe('5');
  });

  it('#9 opacityGrille should set the good number', () => {
    spyOn(service.obsGrilleOpacity, 'emit').and.returnValue();
    service.updateOpacityGrille('60');
    expect(service.opacityGrille).toBe('60');
  });

  it('#10 updateWidthGrille should set the good number', () => {
    spyOn(service.obsGrilleWidth, 'emit').and.returnValue();
    service.updateWidthGrille('80');
    expect(service.grille).toBe('80');
  });
});
