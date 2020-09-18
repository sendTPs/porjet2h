import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import {
    MatButtonModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSidenavModule
} from '@angular/material';

@NgModule({
    imports: [
        MatButtonModule,
        MatButtonToggleModule,
        MatChipsModule,
        MatDialogModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatSidenavModule
    ],
    exports: [
        MatButtonModule,
        MatButtonToggleModule,
        MatChipsModule,
        MatDialogModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatSidenavModule
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class AngularMaterialModule { }
