/* ============================= [COPYRIGHT ©]============================= */
/* La liste pour les étiquettes a été faite grâce à Material */
/* Lien: https://material.angular.io/components/chips/overview */
/* ======================================================================= */

import { ENTER, TAB } from '@angular/cdk/keycodes';
import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

import * as CST from '@models/constants';
import { Drawing } from '@models/drawing.interface';

import { BackupService } from '@app/services/backup/backup.service';
import { SavingDialogService } from '@services/saving-dialog/saving-dialog.service';

@Component({
  selector: 'app-saving-dialog',
  templateUrl: './saving-dialog.component.html',
  styleUrls: ['./saving-dialog.component.scss']
})
export class SavingDialogComponent implements OnInit {

  savingForm: FormGroup;
  drawing: Drawing;

  visible: boolean;
  selectable: boolean;
  removable: boolean;
  addOnBlur: boolean;
  added: boolean;
  readonly separatorKeysCodes: number[] = [ENTER, TAB];

  @ViewChild('chipList', { static: true })
  chipList: HTMLElement;

  @ViewChild('chip', { static: true })
  chip: HTMLElement;

  constructor(
    private formBuilder: FormBuilder,
    public router: Router,
    public savingDialogService: SavingDialogService,
    public dialog: MatDialog,
    public savingDialogRef: MatDialogRef<SavingDialogComponent>,
    public backupService: BackupService,
  ) {
    this.createForm();
    this.initDrawing();
    this.initMatChips();
  }

  ngOnInit(): void {/**/ }

  createForm(): void {
    this.savingForm = this.formBuilder.group({
      nameInput: ['', [Validators.required, Validators.minLength(CST.NAME_MIN_LENGTH), Validators.maxLength(CST.NAME_TAG_MAX_LENGTH)]],
      tagInput: ['',
        [
          Validators.minLength(CST.TAG_MIN_LENGTH),
          Validators.maxLength(CST.NAME_TAG_MAX_LENGTH),
          Validators.pattern('^[a-zA-Z]*$')
        ]
      ],
      tagsArray: this.formBuilder.array([])
    });
  }

  initDrawing(): void {
    this.drawing = {
      name: '', tags: [],
      image: '', thumbnail: '',
      height: 0, width: 0, background: ''
    };
  }

  initMatChips(): void {
    this.visible = true;
    this.selectable = true;
    this.removable = true;
    this.addOnBlur = true;
  }

  @HostListener('window:keydown', ['$event']) preventSidebarShortcuts(event: KeyboardEvent): void {
    switch (event) {
      case (CST.PENCIL_SHORTCUT_EVENT): event.preventDefault(); break;
      case (CST.LINE_SHORTCUT_EVENT): event.preventDefault(); break;
      case (CST.BRUSH_SHORTCUT_EVENT): event.preventDefault(); break;
      case (CST.SPRAY_SHORTCUT_EVENT): event.preventDefault(); break;
      case (CST.SPRAY_SHORTCUT_EVENT): event.preventDefault(); break;
      case (CST.RECTANGLE_SHORTCUT_EVENT): event.preventDefault(); break;
      case (CST.POLYGON_SHORTCUT_EVENT): event.preventDefault(); break;
      case (CST.SELECT_SHORTCUT_EVENT): event.preventDefault(); break;
      case (CST.PIPETTE_SHORTCUT_EVENT): event.preventDefault(); break;
      case (CST.GRILLE_SHORTCUT_EVENT): event.preventDefault(); break;
    }
  }

  @HostListener('window:keydown', ['$event']) preventDefaultShortcuts(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === CST.O_KEY) {
      event.preventDefault();
    }
    if (event.ctrlKey && event.key === CST.S_KEY) {
      event.preventDefault();
    }
    if (event.ctrlKey && event.key === CST.Z_KEY) {
      event.preventDefault();
    }
    if (event.ctrlKey && event.shiftKey && event.key === CST.Z_CAPS_KEY) {
      event.preventDefault();
    }
  }

  getTagsArray(): FormArray {
    return this.savingForm.get('tagsArray') as FormArray;
  }

  getTagsControls(): AbstractControl[] {
    return this.getTagsArray().controls;
  }

  addTagsToChipList(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Adds our tag
    if ((value || '').trim()) {
      const tags = this.getTagsArray();
      tags.push(this.formBuilder.control(value.trim().toLowerCase()));
    }
    // Resets the input value
    if (input) {
      input.value = '';
    }
  }

  removeTagFromChipList(index: number): void {
    const tags = this.getTagsArray();
    if (index >= 0) {
      tags.removeAt(index);
    }

  }

  private assignInputValuesToDrawing(): void {
    this.drawing.name = (this.savingForm.get('nameInput') as AbstractControl).value;
    this.drawing.image = this.backupService.svgElement.nativeElement.innerHTML;
    this.drawing.height = this.backupService.height;
    this.drawing.width = this.backupService.width;

    for (const i of this.getTagsControls()) {
      this.drawing.tags.push(i.value);
    }
  }

  onCancel(): void {
    this.savingForm.reset();
    this.savingDialogRef.close('Sauvegarde annulée !');

    this.savingDialogRef.afterClosed().subscribe((result) => {
      alert('Sauvegarde annulée !');
    });
  }

  onSave(): void {
    this.assignInputValuesToDrawing();
    this.savingDialogService.saveDrawing(this.drawing)
      .subscribe(
        (data) => { /* */ },
        (error) => {
          console.log('Erreur ! : ' + error);
        }
      );

    this.savingForm.reset();

    this.savingDialogRef.close('La sauvegarde a bien été effectuée !');

    this.savingDialogRef.afterClosed().subscribe((result) => {
      alert('La sauvegarde a bien été effectuée !');
    });

  }

}
