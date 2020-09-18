import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterComponent } from './filter.component';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      declarations: [FilterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#1 updateWidthGrille should change the width', () => {
    component.attribute.updateWidthGrille('100');
    expect(component.width).toBe('100');
    expect(component.path).toBe('M 100 0 L 0 0 0 100');
  });

  it('#2 updateOpacityGrille should change the opacity', () => {
    component.attribute.updateOpacityGrille('99');
    expect(component.opacity).toBe('rgba(0,0,0,0.99)');
  });

  it('#3 toggleGrille should change the visibility', () => {
    component.attribute.toggleGrille();
    expect(component.visibility).toBe('visible');
  });
});
