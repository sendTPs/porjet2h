import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorShowComponent } from './color-show.component';

describe('ColorShowComponent', () => {
  let fixture: ComponentFixture<ColorShowComponent>;
  let component: ColorShowComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ColorShowComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorShowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
