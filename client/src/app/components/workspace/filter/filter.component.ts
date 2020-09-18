import { Component } from '@angular/core';

import { AttributeService } from '@services/attribute/attribute.service';

@Component({
  selector: '[app-filter]',
  templateUrl: './filter.component.html',
})
export class FilterComponent {

  opacity: string;
  visibility: string;
  path: string;
  width: string;

  constructor(public attribute: AttributeService) {
    this.visibility = 'hidden'; // visible
    this.path = 'M20 0 L 0 0 0 20';
    this.width = '20';
    this.opacity = 'rgba(0,0,0,0.5)';
    this.attribute.obsGrilleOpacity.subscribe((value: string) => this.opacity = `rgba(0,0,0,0.${value})`);
    this.attribute.obsGrilleVisibility.subscribe((value: string) => this.visibility = value);
    this.attribute.obsGrilleWidth.subscribe((value: string) => this.path = `M ${value} 0 L 0 0 0 ${value}`);
    this.attribute.obsGrilleWidth.subscribe((value: string) => this.width = value);
  }

}
