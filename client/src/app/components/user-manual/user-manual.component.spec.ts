import { Location } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatExpansionPanel } from '@angular/material';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { Items } from './sections';
import { UserManualComponent } from './user-manual.component';

describe('UserManualComponent', () => {
  let component: UserManualComponent;
  let fixture: ComponentFixture<UserManualComponent>;
  const negativeConstant = -1;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserManualComponent],
      imports: [MatButtonToggleModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
      providers: [
        { provide: Location, useValue: jasmine.createSpyObj({ navigate: null, back: null }) },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#1 change should define navigateButton to false', () => {
    component.change();
    expect(component.navigateButton).toBeFalsy();
  });

  it('#2 change should define navigateButton to false', () => {
    component.change();
    expect(component.navigateButton).toBeFalsy();
  });

  it('#3 findIndex should define sectionSelected to true if category is sections', () => {
    component.findIndex(1, 'sections');
    expect(component.toogleButtonSelected).toBeTruthy();
    expect(component.sectionsSelected).toBeTruthy();
  });

  it('#4 findIndex should define toolsSelected to true if category is tools', () => {
    component.findIndex(1, 'tools');
    expect(component.toolsSelected).toBeTruthy();
  });

  it('#5 findIndex should define shapeSelected to true if category is shapes', () => {
    component.findIndex(1, 'shapes');
    expect(component.shapesSelected).toBeTruthy();
  });

  it('#6 previous should decrement the index of the subjects array', () => {
    component.index = 2;
    component.panel1 = { close: () => { return; } } as MatExpansionPanel;
    component.panel2 = { close: () => { return; } } as MatExpansionPanel;
    component.panel3 = { close: () => { return; } } as MatExpansionPanel;
    component.previous();
    expect(component.toogleButtonSelected).toBeFalsy();
    expect(component.navigateButton).toBeTruthy();
    expect(component.index).toBe(1);
  });

  it('#7 previous should define the index to 0 if index < 0', () => {
    component.index = 0;
    // tslint:disable-next-line: new-parens
    const fake = {} as Items;
    component.tools.push(fake);
    component.panel1 = { close: () => { return; } } as MatExpansionPanel;
    component.panel2 = { close: () => { return; } } as MatExpansionPanel;
    component.panel3 = { close: () => { return; } } as MatExpansionPanel;
    component.previous();
    expect(component.index).toBe(0);
  });

  it('#8 next should increment the index of the subjects array', () => {
    const N3 = 3;
    component.index = 2;
    component.panel1 = { close: () => { return; } } as MatExpansionPanel;
    component.panel2 = { close: () => { return; } } as MatExpansionPanel;
    component.panel3 = { close: () => { return; } } as MatExpansionPanel;
    component.next();
    expect(component.toogleButtonSelected).toBeFalsy();
    expect(component.navigateButton).toBeTruthy();
    expect(component.index).toBe(N3);
  });

  it('#9 next should switch to the shapes array if the index is the last of the tools arrray', () => {
    component.welcomeSelected = false;
    component.toolsSelected = true;
    const N6 = 6;
    component.index = N6;

    component.panel1 = { close: () => { return; } } as MatExpansionPanel;
    component.panel2 = { close: () => { return; } } as MatExpansionPanel;
    component.panel3 = { close: () => { return; } } as MatExpansionPanel;
    component.next();
    expect(component.shapesSelected).toBeFalsy();
    // tslint:disable: no-magic-numbers
    expect(component.index).toBe(7);
  });

  it('#10 next should set last to true if if the index is on the last element', () => {
    component.welcomeSelected = false;
    component.shapesSelected = true;
    const N4 = 4;
    component.index = N4;

    component.panel1 = { close: () => { return; } } as MatExpansionPanel;
    component.panel2 = { close: () => { return; } } as MatExpansionPanel;
    component.panel3 = { close: () => { return; } } as MatExpansionPanel;
    component.next();
    expect(component.last).toBeTruthy();
    expect(component.index).toBe(component.shapes.length - 1);
  });

  it('#11 next should switch to the tools array if the index is the last of the sections arrray', () => {
    component.welcomeSelected = false;
    component.sectionsSelected = true;
    const N13 = 13;
    component.index = N13;

    component.panel1 = { close: () => { return; } } as MatExpansionPanel;
    component.panel2 = { close: () => { return; } } as MatExpansionPanel;
    component.panel3 = { close: () => { return; } } as MatExpansionPanel;
    component.next();
    expect(component.toolsSelected).toBeTruthy();
    expect(component.index).toBe(0);
  });

  it('#12 next should switch to the sections array if it was called on the welcome message', () => {
    component.welcomeSelected = true;
    component.index = 1;

    component.panel1 = { close: () => { return; } } as MatExpansionPanel;
    component.panel2 = { close: () => { return; } } as MatExpansionPanel;
    component.panel3 = { close: () => { return; } } as MatExpansionPanel;
    component.next();
    expect(component.sectionsSelected).toBeTruthy();
    expect(component.index).toBe(0);
  });

  it('#13 onClick should call location.back', () => {
    component.onClick();
    expect(component.location.back).toHaveBeenCalled();
  });

  it('#14 previous should switch to the tools array if the index is the fist of the shapes array', () => {
    component.shapesSelected = true;
    component.index = negativeConstant;
    component.panel1 = { close: () => { return; } } as MatExpansionPanel;
    component.panel2 = { close: () => { return; } } as MatExpansionPanel;
    component.panel3 = { close: () => { return; } } as MatExpansionPanel;
    component.previous();
    expect(component.shapesSelected).toBeFalsy();
    expect(component.toolsSelected).toBeTruthy();
    expect(component.index).toBe(component.tools.length - 1);
  });

  it('#15 previous should switch to the sections array if the index is the fist of the tools array', () => {
    component.toolsSelected = true;
    component.index = negativeConstant;
    component.panel1 = { close: () => { return; } } as MatExpansionPanel;
    component.panel2 = { close: () => { return; } } as MatExpansionPanel;
    component.panel3 = { close: () => { return; } } as MatExpansionPanel;
    component.previous();
    expect(component.toolsSelected).toBeFalsy();
    expect(component.sectionsSelected).toBeTruthy();
    expect(component.index).toBe(component.sections.length - 1);
  });

  it('#16 previous should switch to the sections array if the index is the fist of the tools array', () => {
    component.toolsSelected = true;
    component.index = negativeConstant;
    component.panel1 = { close: () => { return; } } as MatExpansionPanel;
    component.panel2 = { close: () => { return; } } as MatExpansionPanel;
    component.panel3 = { close: () => { return; } } as MatExpansionPanel;
    component.previous();
    expect(component.toolsSelected).toBeFalsy();
    expect(component.sectionsSelected).toBeTruthy();
    expect(component.index).toBe(component.sections.length - 1);
  });

  it('#17 previous should switch to the sections array if the index is the fist of the tools array', () => {
    component.sectionsSelected = true;
    component.index = negativeConstant;
    component.panel1 = { close: () => { return; } } as MatExpansionPanel;
    component.panel2 = { close: () => { return; } } as MatExpansionPanel;
    component.panel3 = { close: () => { return; } } as MatExpansionPanel;
    component.previous();
    expect(component.sectionsSelected).toBeFalsy();
    expect(component.welcomeSelected).toBeTruthy();
    expect(component.index).toBe(0);
  });

  it('#18 previous should set fist to true if if the index is on the fist element (welcome message) ', () => {
    component.welcomeSelected = true;
    component.index = 0;
    component.panel1 = { close: () => { return; } } as MatExpansionPanel;
    component.panel2 = { close: () => { return; } } as MatExpansionPanel;
    component.panel3 = { close: () => { return; } } as MatExpansionPanel;
    component.previous();
    expect(component.first).toBeTruthy();
    expect(component.index).toBe(0);
  });

  it('#19 showWelcomeMsg should set welcomeSelected to true and this others (sections, shapes, tools) to false ', () => {

    component.showWelcomeMsg();

    expect(component.welcomeSelected).toBeTruthy();
    expect(component.sectionsSelected).toBeFalsy();
    expect(component.toolsSelected).toBeFalsy();
    expect(component.shapesSelected).toBeFalsy();
  });

});
