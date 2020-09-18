import { AfterViewInit, Component, ElementRef, HostListener, OnInit, Renderer2, ViewChild } from '@angular/core';

import { DialogData } from '@components/new-drawing/new-drawing-dialog/new-drawing-dialog.component';

import * as CST from '@models/constants';
import { ToolInterface } from '@models/tool.interface';

import { BackupService } from '@app/services/backup/backup.service';
import { ClipboardService } from '@app/services/clipboard/clipboard.service';
import { GalleryService } from '@app/services/gallery/gallery.service';
import { PaintBucketService } from '@app/services/paint-bucket/paint-bucket.service';
import { SavingDialogService } from '@app/services/saving-dialog/saving-dialog.service';
import { SelectionLogicService } from '@app/services/selection/selection-logic/selection-logic.service';
import { AppColorService } from '@services/app-color/app-color.service';
import { AttributeService } from '@services/attribute/attribute.service';
import { DrawingOptionService } from '@services/drawing-option/drawing-option.service';
import { EllipseService } from '@services/ellipse-tool/ellipse.service';
import { EraserService } from '@services/eraser/eraser.service';
import { ExportService } from '@services/export/export.service';
import { HandToolService } from '@services/hand-tool/hand-tool.service';
import { LineService } from '@services/line-tool/line.service';
import { PencilService } from '@services/pencil-tool/pencil.service';
import { PipetteService } from '@services/pipette/pipette.service';
import { PolygonService } from '@services/polygon-tool/polygon.service';
import { RectangleService } from '@services/rectangle-tool/rectangle.service';
import { SelectionMoveService } from '@services/selection/selection-move/selection-move.service';
import { SelectionService } from '@services/selection/selection-tool/selection.service';
import { SketchService } from '@services/sketch/sketch.service';
import { SprayService } from '@services/spray/spray.service';
import { ToolService } from '@services/tool/tool.service';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.scss'],
})
export class WorkspaceComponent implements OnInit, AfterViewInit {

  constructor(
    private renderer: Renderer2,
    public attribute: AttributeService,
    public tool: ToolService,
    public line: LineService,
    public pencil: PencilService,
    public rectangle: RectangleService,
    public polygon: PolygonService,
    public selection: SelectionService,
    public eraser: EraserService,
    public move: SelectionMoveService,
    public hand: HandToolService,
    public newDrawingService: DrawingOptionService,
    public spray: SprayService,
    public pipette: PipetteService,
    public ellipse: EllipseService,
    public appColor: AppColorService,
    public sketch: SketchService,
    public exports: ExportService,
    public clipboard: ClipboardService,
    public backupService: BackupService,
    public bucket: PaintBucketService,
    public logic: SelectionLogicService,
    public galleryService: GalleryService,
    public savingDialogService: SavingDialogService,

  ) {
    this.backgroundColor = 'rgb(255,255,255)';
    this.toolMap = new Map<string, ToolInterface>();
    this.toolMap
      .set(CST.LINE_KEY, this.line)
      .set(CST.PENCIL_KEY, this.pencil)
      .set(CST.BRUSH_KEY, this.pencil)
      .set(CST.RECTANGLE_KEY, this.rectangle)
      .set(CST.POLYGON_KEY, this.polygon)
      .set(CST.SELECTION_KEY, this.selection)
      .set(CST.ERASER_KEY, this.eraser)
      .set(CST.HAND_KEY, this.hand)
      .set(CST.HAND_KEY, this.hand)
      .set(CST.SPRAY_KEY, this.spray)
      .set(CST.PIPETTE_KEY, this.pipette)
      .set(CST.ELLIPSE_KEY, this.ellipse)
      .set(CST.APP_COLOR_KEY, this.appColor)
      .set(CST.BUCKET_KEY, this.bucket);

  }

  @ViewChild('workspace', { static: true })
  workspaceEle: ElementRef<HTMLElement>;
  @ViewChild('wsSVG', { static: true })
  eleSVG: ElementRef<HTMLElement>;
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLElement>;
  @ViewChild('image', { static: true })
  image: ElementRef<HTMLElement>;

  height: number;
  width: number;
  backgroundColor: string;
  data: DialogData;
  newDrawing: boolean;
  toolMap: Map<string, ToolInterface>;

  ngOnInit(): void {
    this.newOption();
    if (this.backupService.wantToContinue) {
      this.continueDrawing();
    }
    if (this.galleryService.loadDrawing) {
      this.loadDrawingFromServer();
      this.height = this.galleryService.drawingToDisplay.height;
      this.width = this.galleryService.drawingToDisplay.width;
      this.backgroundColor = this.galleryService.drawingToDisplay.background;

    }
    this.backupService.wantToContinue = true;
  }

  ngAfterViewInit(): void {
    this.exports.renderer = this.renderer;
    this.pencil.renderer = this.renderer;
    this.line.renderer = this.renderer;
    this.rectangle.renderer = this.renderer;
    this.spray.renderer = this.renderer;
    this.polygon.renderer = this.renderer;
    this.selection.renderer = this.renderer;
    this.move.renderer = this.renderer;
    this.hand.renderer = this.renderer;
    this.ellipse.renderer = this.renderer;
    this.eraser.renderer = this.renderer;

    this.clipboard.elementSVG = this.eleSVG.nativeElement;
    this.sketch.elementSVG = this.eleSVG.nativeElement;
    this.sketch.basicElemSVG = this.eleSVG;
    this.pencil.elementSVG = this.eleSVG.nativeElement;
    this.line.elementSVG = this.eleSVG.nativeElement;
    this.polygon.elementSVG = this.eleSVG.nativeElement;
    this.rectangle.elementSVG = this.eleSVG.nativeElement;
    this.selection.elementSVG = this.eleSVG.nativeElement;
    this.spray.elementSVG = this.eleSVG.nativeElement;
    this.ellipse.elementSVG = this.eleSVG.nativeElement;
    this.logic.elementSVG = this.eleSVG.nativeElement;
    this.pipette.setSvgTag(this.eleSVG);
    this.pipette.setCanvasTag(this.canvas);
    this.pipette.setImageTag(this.image);
    this.eraser.elementSVG = this.eleSVG.nativeElement;
    this.bucket.elementSVG = this.eleSVG.nativeElement;
    this.bucket.refIMG = this.image;
    this.bucket.refCANVAS = this.canvas;
  }

  erase(): void {
    while (this.eleSVG.nativeElement.childNodes.length !== 1) {
      this.eleSVG.nativeElement.childNodes.forEach((element, index) => {
        if (index !== 0) {
          element.remove();
        }
      });
    }
  }

  newOption(): string {
    if (this.newDrawingService.newDrawing) {
      this.erase();
      this.newDrawingService.newDrawing = false;
    }
    this.height = this.newDrawingService.height;
    this.width = this.newDrawingService.width;
    this.backgroundColor = this.newDrawingService.backgroundColor;

    return this.backgroundColor; // return value for HTML
  }

  /*****  MAJOR EVENT  *****/

  @HostListener('window:keyup', ['$event'])
  keyUp(keyEvent: KeyboardEvent): void {
    if (!this.attribute.isActivate) {
      (this.toolMap.get(this.tool.tool) as ToolInterface).shortcut(keyEvent, true);
      this.selection.erase();
      this.eraser.setCursor();
    }
  }

  @HostListener('window:keydown', ['$event'])
  keyDown(keyEvent: KeyboardEvent): void {
    // keyEvent.preventDefault();
    if (!this.attribute.isActivate) {
      this.tool.chooseTool(keyEvent);
      (this.toolMap.get(this.tool.tool) as ToolInterface).shortcut(keyEvent, false);
      console.log(keyEvent.key);
    }
  }
  mouseDown(event: MouseEvent): void {
    (this.toolMap.get(this.tool.tool) as ToolInterface).start(event);
  }

  mouseLeave(event: MouseEvent): void {
    this.eraser.eraseMarker();
    if (this.tool.tool !== CST.SELECTION_KEY && this.tool.tool !== CST.ERASER_KEY) {
      (this.toolMap.get(this.tool.tool) as ToolInterface).end();
    }
  }

  mouseEnter(event: MouseEvent): void {
    if (event.buttons === CST.MOUSE_UNUSED) {
      (this.toolMap.get(this.tool.tool) as ToolInterface).end();
    }
  }

  mouseUp(event: MouseEvent): void {
    console.log(`${event.offsetX}:${event.offsetY}`);
    if (this.tool.tool !== CST.LINE_KEY) {
      (this.toolMap.get(this.tool.tool) as ToolInterface).end();
    }
    this.backupService.save(this.eleSVG, this.height, this.width);
  }

  dblClick(event: MouseEvent): void {
    if (this.tool.tool === CST.LINE_KEY) {
      (this.toolMap.get(this.tool.tool) as ToolInterface).end();
    }
    this.backupService.save(this.eleSVG, this.height, this.width);
    this.savingDialogService.getBackground(this.backgroundColor);
  }

  mouseMove(event: MouseEvent): void {
    (this.toolMap.get(this.tool.tool) as ToolInterface).draw(event);
    this.eraser.setCursor();
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
  }

  loadSVGElementFromOldOne(svgHTML: string): void {
    this.eleSVG.nativeElement.innerHTML = svgHTML;
    this.eleSVG.nativeElement.childNodes.forEach((child) => {
      if ((child as HTMLElement).getAttribute('class') !== 'selectorBox') {
        child.childNodes.forEach((element) => {
          this.sketch.add(element as HTMLElement);
        });
      } else {
        child.remove();
      }
    });
  }

  continueDrawing(): void {
    const elementSVG = this.backupService.restoreBackup();
    this.loadSVGElementFromOldOne(elementSVG);
    this.backupService.wantToContinue = false;
  }

  loadDrawingFromServer(): void {
    this.loadSVGElementFromOldOne(this.galleryService.drawingToDisplay.image);
    this.galleryService.loadDrawing = false;
  }

}
