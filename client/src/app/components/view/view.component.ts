import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import * as CST from '@models/constants';

import { WarningDialogComponent } from '@components/new-drawing/warning-dialog/warning-dialog.component';
import { SavingDialogComponent } from '@components/saving-dialog/saving-dialog.component';

import { BackupService } from '@app/services/backup/backup.service';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { AttributeService } from '@services/attribute/attribute.service';
import { CommandManagerService } from '@services/command-manager/command-manager.service';
import { EraserService } from '@services/eraser/eraser.service';
import { PipetteService } from '@services/pipette/pipette.service';
import { SelectionService } from '@services/selection/selection-tool/selection.service';
import { ToolService } from '@services/tool/tool.service';
import { TypeToolService } from '@services/type-tool/type-tool.service';
import { ViewService } from '@services/view/view.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.scss']
})
export class ViewComponent implements OnInit, AfterViewInit {

  PENCIL_SHORTCUT_EVENT: KeyboardEvent = CST.PENCIL_SHORTCUT_EVENT;
  LINE_SHORTCUT_EVENT: KeyboardEvent = CST.LINE_SHORTCUT_EVENT;
  BRUSH_SHORTCUT_EVENT: KeyboardEvent = CST.BRUSH_SHORTCUT_EVENT;
  SPRAY_SHORTCUT_EVENT: KeyboardEvent = CST.SPRAY_SHORTCUT_EVENT;
  RECTANGLE_SHORTCUT_EVENT: KeyboardEvent = CST.RECTANGLE_SHORTCUT_EVENT;
  ELLIPSE_SHORTCUT_EVENT: KeyboardEvent = CST.ELLIPSE_SHORTCUT_EVENT;
  POLYGON_SHORTCUT_EVENT: KeyboardEvent = CST.POLYGON_SHORTCUT_EVENT;
  SELECT_SHORTCUT_EVENT: KeyboardEvent = CST.SELECT_SHORTCUT_EVENT;
  PIPETTE_SHORTCUT_EVENT: KeyboardEvent = CST.PIPETTE_SHORTCUT_EVENT;
  ERASER_SHORTCUT_EVENT: KeyboardEvent = CST.ERASER_SHORTCUT_EVENT;
  GRILLE_SHORTCUT_EVENT: KeyboardEvent = CST.GRILLE_SHORTCUT_EVENT;

  RECTANGLE: string = CST.RECTANGLE_KEY;
  ELLIPSE: string = CST.ELLIPSE_KEY;
  POLYGON: string = CST.POLYGON_KEY;
  PIPETTE: string = CST.PIPETTE_KEY;
  APPLICATOR: string = CST.APP_COLOR_KEY;
  BUCKET: string = CST.BUCKET_KEY;

  @ViewChild('sidebarPencil', { static: true })
  pencilBar: ElementRef<HTMLElement>;
  @ViewChild('sidebarBrush', { static: true })
  brushBar: ElementRef<HTMLElement>;
  @ViewChild('sidebarLine', { static: true })
  lineBar: ElementRef<HTMLElement>;
  @ViewChild('sidebarSpray', { static: true })
  sprayBar: ElementRef<HTMLElement>;
  @ViewChild('sidebarRectangle', { static: true })
  rectangleBar: ElementRef<HTMLElement>;
  @ViewChild('sidebarEllipse', { static: true })
  ellipseBar: ElementRef<HTMLElement>;
  @ViewChild('sidebarSelection', { static: true })
  selectionBar: ElementRef<HTMLElement>;
  @ViewChild('sidebarCouleur', { static: true })
  colorBar: ElementRef<HTMLElement>;
  @ViewChild('sidebarEraser', { static: true })
  eraserBar: ElementRef<HTMLElement>;
  @ViewChild('sidebarPipette', { static: true })
  pipetteBar: ElementRef<HTMLElement>;
  @ViewChild('sidebarGrille', { static: true })
  grilleBar: ElementRef<HTMLElement>;
  @ViewChild('sidebarExport', { static: true })
  exportBar: ElementRef<HTMLElement>;

  toggledBars: Map<string, boolean>;
  toggledActivate: string;
  show: boolean;
  text: string;
  showVar: boolean; // enable show/hide function for color picker
  hideNow: boolean; // used to switch hide/show for the color component

  constructor(
    public backupService: BackupService,
    public selection: SelectionService,
    public eraser: EraserService,
    public viewService: ViewService,
    public tool: ToolService,
    public commandManager: CommandManagerService,
    public type: TypeToolService,
    public attribute: AttributeService,
    public dialog: MatDialog,
    public clipboard: ClipboardService,

    private router: Router,
    public pipette: PipetteService,
  ) {
    this.toggledBars = new Map<string, boolean>();
    this.show = false;
    this.showVar = false;
    this.hideNow = true;
    this.toggledBars
      .set('pencilBar', false)
      .set('brushBar', false)
      .set('lineBar', false)
      .set('sprayBar', false)
      .set('rectangleBar', false)
      .set('ellipseBar', false)
      .set('selectionBar', false)
      .set('colorBar', false)
      .set('eraserBar', false)
      .set('pipetteBar', false)
      .set('exportBar', false)
      .set('grilleBar', false);
  }

  ngOnInit(): void {

    // used to receive signal from View service to show/hide the color component
    // excute the function that hides the element
    this.viewService.change.subscribe((hideNow: boolean) => { this.hideNow = hideNow; this.toggle('colorBar'); });
  }

  ngAfterViewInit(): void { this.show = false; }

  quit(): void {
    this.router.navigate(['/']);
  }

  openWarningDialog(): void {
    this.dialog.open(WarningDialogComponent, { width: '400px', height: '400px', });
  }

  openSavingDialog(): void {
    this.dialog.open(SavingDialogComponent, {
      width: '600px',
      height: '600px',
    });
  }

  openUserManual(): void {
    this.router.navigate(['/view/user-manual']);
  }

  activateTool(event: KeyboardEvent): void {
    if (!this.areDialogsOpened()) {
      this.tool.chooseTool(event);
      this.selection.erase();
      this.eraser.setCursor();
    } else {
      event.preventDefault();
    }
  }

  areDialogsOpened(): boolean {
    return (this.dialog.openDialogs.length === 0) ? false : true;
  }

  // tslint:disable-next-line: cyclomatic-complexity
  @HostListener('window:keydown', ['$event']) onKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === CST.O_KEY) {
      if (!this.areDialogsOpened()) {
        this.openWarningDialog();
        event.preventDefault();
      } else {
        event.preventDefault();
      }
    }
    if (event.ctrlKey && event.key === CST.S_KEY) {
      if (!this.areDialogsOpened()) {
        this.openSavingDialog();
        event.preventDefault();
      } else {
        event.preventDefault();
      }
    }
    if (event.ctrlKey && event.key === CST.C_KEY) {
      this.copySelection();
    }
    if (event.ctrlKey && event.key === CST.V_KEY) {
      this.pasteSelection();
    }
    if (event.ctrlKey && event.key === CST.D_KEY) {
      event.preventDefault();
      this.duplicateSelection();
    }
    if (event.ctrlKey && event.key === CST.X_KEY) {
      this.cutSelection();
    }
    if (event.key === CST.DELETE_KEY) {
      this.deleteSelection();
    }
    if (event.ctrlKey && event.key === CST.Z_KEY) {
      if (!this.areDialogsOpened()) {
        this.undoCommand();
      }
    }
    if (event.ctrlKey && event.shiftKey && event.key === CST.Z_CAPS_KEY) {
      if (!this.areDialogsOpened()) {
        this.redoCommand();
        this.selection.logic.clearSelectedElement();
      }
    }
    if (event.key === 'g' || event.key === 'G') {
      this.tool.chooseTool(event);
      this.attribute.toggleGrille();
    }
  }

  // Show attribute pannels
  toggle(element: string): void {
    if (this.toggledBars.has(element)) {
      this.toggledBars.set(element, !this.toggledBars.get(element));
      if (this.toggledActivate === element) { // pas de changement
        this.show = !this.show;
      } else if (this.show) { // changement tool + ouvert
        this.toggledBars.set(this.toggledActivate, !this.toggledBars.get(this.toggledActivate));
        this.toggledActivate = element;
      } else { // changement + fermer
        this.show = true;
        this.toggledActivate = element;
      }
    }
  }

  optionBrush(key: number): void {
    this.type.toggledOptionBrush(key);
  }

  optionPolygon(key: number): void {
    this.type.toggledOptionPolygon(key);
  }

  optionColor(key: number): void {
    this.type.toggledOptionColor(key);
  }

  /****************
  function toggleChild : toggle the color picker
  @params none
  @return none
  ****************/
  toggleChild(): void {
    this.showVar = !this.showVar;
  }

  /****************
  function toggleColor() : toggle the color picker
  @params none
  @return none
  *****************/
  toggleColor(): void {
    this.showVar = !this.showVar;
    this.show = !this.show;
    this.text = 'Choisir la couleur';
  }

  undoCommand(): void {
    this.commandManager.undo();
    this.backupService.save();
    this.tool.tool = CST.HAND_KEY;
    this.selection.erase();
    this.tool.tool = CST.SELECTION_KEY;
  }
  redoCommand(): void {
    this.commandManager.redo();
    this.backupService.save();
    this.tool.tool = CST.HAND_KEY;
    this.selection.erase();
    this.tool.tool = CST.SELECTION_KEY;
  }

  copySelection(): void {
    this.clipboard.copy();
  }
  pasteSelection(): void {
    this.clipboard.paste();
  }
  duplicateSelection(): void {
    this.clipboard.duplicate();
  }
  deleteSelection(): void {
    this.clipboard.delete();
  }
  cutSelection(): void {
    this.clipboard.cut();
  }
}
