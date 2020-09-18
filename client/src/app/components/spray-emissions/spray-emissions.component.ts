import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { DEFAULT_EMISSIONS, MAX_EMISSIONS, MINIMUM_EMISSIONS } from '@models/constants';

import { AttributeService } from '@services/attribute/attribute.service';
import { SprayService } from '@services/spray/spray.service';

@Component({
  selector: 'app-spray-emissions',
  templateUrl: './spray-emissions.component.html',
  styleUrls: ['./spray-emissions.component.scss']
})
export class SprayEmissionsComponent implements OnInit {

  @ViewChild('number', { static: true })
  numberIn: ElementRef<HTMLInputElement>;
  @ViewChild('slider', { static: true })
  sliderIn: ElementRef<HTMLInputElement>;

  emissionsPerSecond: number;

  constructor(public sprayService: SprayService, public attribute: AttributeService) { }

  updateSilder(): void {
    this.emissionsPerSecond = parseInt(this.sliderIn.nativeElement.value, 10);
    this.sprayService.emissionsPerSecond = this.emissionsPerSecond;
  }

  updateNumber(): void {

    if (parseInt(this.numberIn.nativeElement.value, 10) < 1 || parseInt(this.numberIn.nativeElement.value, 10) > MAX_EMISSIONS) {
      this.emissionsPerSecond = DEFAULT_EMISSIONS; // verifier si c'est good mais ca devrait l'etre
      this.sprayService.emissionsPerSecond = this.emissionsPerSecond;
      this.numberIn.nativeElement.value = (DEFAULT_EMISSIONS).toString();
    } else {
      this.emissionsPerSecond = parseInt(this.numberIn.nativeElement.value, 10);
      this.sprayService.emissionsPerSecond = this.emissionsPerSecond;
    }

  }

  checkValue(): void {
    const VALUE: number = parseInt(this.numberIn.nativeElement.value, 10);
    this.emissionsPerSecond = (VALUE < MINIMUM_EMISSIONS || VALUE.toString() === 'NaN') ?
      this.emissionsPerSecond : parseInt(this.numberIn.nativeElement.value, 10);
    this.sprayService.emissionsPerSecond = this.emissionsPerSecond;

  }

  ngOnInit(): void {
    this.emissionsPerSecond = DEFAULT_EMISSIONS;
  }

  disabledKeyboard(): void {
    this.attribute.isActivate = true;
  }

}
