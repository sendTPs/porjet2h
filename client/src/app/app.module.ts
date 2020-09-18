import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

import { AngularMaterialModule } from '@modules/angular-material.module';
import { ColorPickerModule } from '@modules/color-picker.module';

import { AppComponent } from '@components/app/app.component';
import { ColorShowComponent } from '@components/color-show/color-show.component';
import { EntryComponent } from '@components/entry/entry.component';
import { ExportationComponent } from '@components/exportation/exportation.component';
import { GalleryComponent } from '@components/gallery/gallery.component';
import { GrilleComponent } from '@components/grille-width/grille.component';
import { JonctionComponent } from '@components/jonction/jonction.component';
import { NewDrawingDialogComponent } from '@components/new-drawing/new-drawing-dialog/new-drawing-dialog.component';
import { NewDrawingComponent } from '@components/new-drawing/new-drawing.component';
import { WarningDialogComponent } from '@components/new-drawing/warning-dialog/warning-dialog.component';
import { BorderComponent } from '@components/number-border/border.component';
import { OpacityComponent } from '@components/opacity/opacity.component';
import { SavingDialogComponent } from '@components/saving-dialog/saving-dialog.component';
import { SprayEmissionsComponent } from '@components/spray-emissions/spray-emissions.component';
import { ToleranceComponent } from '@components/tolerance/tolerance.component';
import { UserManualComponent } from '@components/user-manual/user-manual.component';
import { ViewComponent } from '@components/view/view.component';
import { WidthComponent } from '@components/width/width.component';
import { FilterComponent } from '@components/workspace/filter/filter.component';
import { WorkspaceComponent } from '@components/workspace/workspace.component';
@NgModule({
    declarations: [
        AppComponent,
        BorderComponent,
        EntryComponent,
        NewDrawingComponent,
        NewDrawingDialogComponent,
        GrilleComponent,
        OpacityComponent,
        ViewComponent,
        WorkspaceComponent,
        UserManualComponent,
        JonctionComponent,
        WidthComponent,
        WarningDialogComponent,
        SavingDialogComponent,
        FilterComponent,
        SprayEmissionsComponent,
        ColorShowComponent,
        ToleranceComponent,
        GalleryComponent,
        ExportationComponent,
    ],
    imports: [
        DragDropModule,
        AngularMaterialModule,
        ColorPickerModule,
        ScrollingModule,
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forRoot([
            { path: '', component: EntryComponent, },
            { path: 'view', component: ViewComponent },
            { path: 'user-manual', component: UserManualComponent },
            { path: 'view/user-manual', component: UserManualComponent },
        ]),
    ],
    exports: [RouterModule],
    bootstrap: [AppComponent],
    providers: [SprayEmissionsComponent],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    entryComponents: [GalleryComponent, NewDrawingDialogComponent, SavingDialogComponent, WarningDialogComponent]
})
export class AppModule { }
