import { Component } from '@angular/core';
import { ColorService } from '@services/color/color.service';

@Component({
  selector: 'app-color-show',
  templateUrl: './color-show.component.html',
  styleUrls: ['./color-show.component.scss']
})
export class ColorShowComponent {

  prime: string;
  second: string;

  constructor(public color: ColorService) {
    this.second = color.second;
    this.prime = color.prime;
  }

}
