import { Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Items, sections } from './sections';
import { shapes } from './shapes';
import { tools } from './tools';
import { welcome } from './welcome';

@Component({
  selector: 'app-user-manual',
  templateUrl: './user-manual.component.html',
  styleUrls: ['./user-manual.component.scss']
})

export class UserManualComponent implements OnInit {

  @ViewChild('panel1', { static: true })
  panel1: MatExpansionPanel;
  @ViewChild('panel2', { static: true })
  panel2: MatExpansionPanel;
  @ViewChild('panel3', { static: true })
  panel3: MatExpansionPanel;

  index: number;
  navigateButton: boolean;
  sectionsSelected: boolean;
  toolsSelected: boolean;
  shapesSelected: boolean;
  toogleButtonSelected: boolean;
  welcomeSelected: boolean;
  first: boolean;
  last: boolean;
  welcome: string;
  sections: Items[];
  tools: Items[];
  shapes: Items[];

  constructor(public location: Location) {
    this.index = 0;
    this.navigateButton = false;
    this.sectionsSelected = false;
    this.toolsSelected = false;
    this.shapesSelected = false;
    this.toogleButtonSelected = false;
    this.welcomeSelected = false;
    this.first = false;
    this.last = false;
    this.welcome = welcome;
    this.sections = sections;
    this.tools = tools;
    this.shapes = shapes;
  }

  change(): void {
    this.navigateButton = false;
  }

  showWelcomeMsg(): void {
    this.welcomeSelected = true;
    this.sectionsSelected = false;
    this.shapesSelected = false;
    this.toolsSelected = false;
  }

  findIndex(i: number, category: string): void {
    this.index = i;
    this.toogleButtonSelected = true;
    this.welcomeSelected = false;

    if (category === 'sections') {
      this.sectionsSelected = true;
      this.shapesSelected = false;
      this.toolsSelected = false;
      this.navigateButton = false;
    } else if (category === 'tools') {
      this.toolsSelected = true;
      this.sectionsSelected = false;
      this.shapesSelected = false;
      this.navigateButton = false;
    } else {
      this.shapesSelected = true;
      this.sectionsSelected = false;
      this.toolsSelected = false;
      this.navigateButton = false;
    }
  }

  previous(): void {
    this.toogleButtonSelected = false;
    this.navigateButton = true;
    this.index--;
    this.last = false;
    if (this.welcomeSelected) {
      this.index = 0;
      this.first = true;
    } else if (this.index < 0 && this.sectionsSelected) {
      this.welcomeSelected = true;
      this.sectionsSelected = false;
      this.index = 0;
    } else if (this.index < 0 && this.toolsSelected) {
      this.index = this.sections.length - 1;
      this.toolsSelected = false;
      this.sectionsSelected = true;
    } else if (this.index < 0 && this.shapesSelected) {
      this.index = this.tools.length - 1;
      this.shapesSelected = false;
      this.toolsSelected = true;
    } else if (this.index < 0) {
      this.index = 0;
    }
    this.panel1.close();
    this.panel2.close();
    this.panel3.close();
  }

  next(): void {
    this.toogleButtonSelected = false;
    this.navigateButton = true;
    this.index++;
    this.first = false;
    if (this.welcomeSelected) {
      this.welcomeSelected = false;
      this.sectionsSelected = true;
      this.index = 0;
    } else if (this.index >= this.sections.length && this.sectionsSelected) {
      this.index = 0;
      this.sectionsSelected = false;
      this.toolsSelected = true;
    } else if (this.index >= tools.length && this.toolsSelected) {
      this.index = 0;
      this.toolsSelected = false;
      this.shapesSelected = true;
    } else if (this.index >= shapes.length - 1 && this.shapesSelected) {
      this.index = shapes.length - 1;
      this.last = true;
    }
    this.panel1.close();
    this.panel2.close();
    this.panel3.close();
  }

  onClick(): void {
    this.location.back();
  }

  ngOnInit(): void { /* */ }

}
