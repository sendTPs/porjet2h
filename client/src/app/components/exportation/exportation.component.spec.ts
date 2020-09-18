import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportationComponent } from './exportation.component';

describe('ExportationComponent', () => {
  let component: ExportationComponent;
  let fixture: ComponentFixture<ExportationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExportationComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
