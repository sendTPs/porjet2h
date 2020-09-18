import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MailData } from '@models/mail-data.interface';
import { DrawingOptionService } from '@services/drawing-option/drawing-option.service';
import { ExportService } from '@services/export/export.service';
import { SendMailService } from '@services/send-mail/send-mail.service';
import { SketchService } from '@services/sketch/sketch.service';
import { exportImage } from '@utils/filesystem';

/* Regex pris du site : https://emailregex.com */

@Component({
  selector: 'app-exportation',
  templateUrl: './exportation.component.html',
  styleUrls: ['./exportation.component.scss']
})
export class ExportationComponent implements OnInit, AfterViewInit {

  userEmailForm: FormGroup;
  mailData: MailData;
  width: number;
  height: number;
  backgroundColor: string;
  dimension: string;

  @ViewChild('capture', { static: true })
  capture: ElementRef<HTMLElement>;
  @ViewChild('img', { static: true })
  img: ElementRef<HTMLElement>;
  @ViewChild('canvas', { static: true })
  canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('select', { static: true })
  select: ElementRef<HTMLElement>;
  @ViewChild('input', { static: true })
  input: ElementRef<HTMLInputElement>;

  constructor(
    public drawingOptionService: DrawingOptionService,
    public exportService: ExportService,
    public sketchService: SketchService,
    public sendMailService: SendMailService,
  ) {
    this.createForm();
    this.initMailData();
  }

  ngOnInit(): void {
    this.capture.nativeElement.innerHTML = this.sketchService.elementSVG.innerHTML;
    this.backgroundColor = this.drawingOptionService.backgroundColor;
    this.exportService.elementSVG = this.sketchService.elementSVG;
    this.exportService.mode = 'svg';
    this.width = this.drawingOptionService.width;
    this.height = this.drawingOptionService.height;
    if (this.height && this.width) {
      this.dimension = '0 0 ' + this.width + ' ' + this.height;
    } else {
      this.dimension = '0 0 600 600';
    }
  }

  ngAfterViewInit(): void {
    this.exportService.elementIMG = this.img.nativeElement;
    this.exportService.elementCanvas = this.canvas.nativeElement;
    this.exportService.elementLINK = this.select.nativeElement;
  }

  private createForm(): void {
    this.userEmailForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9.-_]{1,}@[a-zA-Z.-]{2,}[.]{1}[a-zA-Z]{2,}')
      ])
    });
  }

  private initMailData(): void {
    this.mailData = {
      emailAddress: '',
      drawingName: '',
      image: new HTMLElement()
    };
  }

  get emailAddress(): AbstractControl | null {
    return this.userEmailForm.get('email');
  }

  toggledMode(m: string): void {
    this.exportService.mode = m;
  }

  toggledFilter(f: string): void {
    this.exportService.filter = f;
  }

  saveDraw(): void {

    // creating image name
    this.exportService.name = this.input.nativeElement.value; // generating name for image

    if (!this.input.nativeElement.value) {// empty image
      this.exportService.name = 'Default'; // when user forget to put a name , image will be saved as 'default'
    }

    // switch selon le type
    switch (this.exportService.mode) {

      case 'svg':
        this.exportService.saveSVG();
        break;
      case 'png':
        exportImage(this.exportService.name, this.sketchService.basicElemSVG, 'png');
        break;
      case 'jpg':
        console.log(this.sketchService.basicElemSVG);
        exportImage(this.exportService.name, this.sketchService.basicElemSVG, 'jpg');
        break;
      default:
    }
  }

  private assignInputValuesToMailData(): void {

    if (this.emailAddress != null) {
      this.mailData.emailAddress = this.emailAddress.value;
    }

    if (this.exportService.name != null) {
      this.mailData.drawingName = this.exportService.name;
    }

    // assign image
    if (this.sketchService.basicElemSVG) {
      this.mailData.image = this.sketchService.basicElemSVG.nativeElement;
    }

  }

  sendEmail(): void {
    this.assignInputValuesToMailData();

    this.sendMailService.sendToServer(this.mailData).subscribe(
      (data) => { /* */ },
      (error) => {
        console.log('Erreur ! : ' + error);
      }
    );

    this.userEmailForm.reset();
  }

}
