import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';

import { ColorPaletteComponent } from '@components/color-picker/color-palette/color-palette.component';
import { ColorPickerComponent } from '@components/color-picker/color-picker.component';
import { ColorSliderComponent } from '@components/color-picker/color-slider/color-slider.component';

@NgModule({
  imports: [CommonModule, MatSliderModule],
  declarations: [ColorPickerComponent, ColorSliderComponent, ColorPaletteComponent],
  exports: [ColorPickerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class ColorPickerModule { }
