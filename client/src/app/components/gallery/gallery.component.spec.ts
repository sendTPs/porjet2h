import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Drawing } from '@app/models/drawing.interface';

import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { Tag } from '@app/models/tag.interface';
import { Observable } from 'rxjs';
import { GalleryComponent } from './gallery.component';

describe('GalleryComponent', () => {
    let component: GalleryComponent;
    let fixture: ComponentFixture<GalleryComponent>;
    const N3 = 3;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [GalleryComponent],
            schemas: [NO_ERRORS_SCHEMA],
            imports: [DragDropModule],
            providers: [
                { provide: Router, useValue: jasmine.createSpyObj({ navigate: null }) },
                { provide: MatDialogRef, useValue: jasmine.createSpyObj({ close: null }) },
                HttpClient, HttpHandler,
                // { provide: DragDropModule, useValue: jasmine.createSpy('transferArrayItem') }
            ]

        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(GalleryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        const spy1 = spyOn(component, 'fetchAllDrawings');
        component.ngOnInit();
        expect(spy1).toHaveBeenCalled();
        expect(component).toBeTruthy();
    });

    it('#1 resetFilters should call fetchAllDrawings and reset the tagsSelected array', () => {
        component.tags = [];
        const spy = spyOn(component, 'fetchAllDrawings');
        component.resetFilters();
        expect(spy).toHaveBeenCalled();
        expect(component.tagsSelected).toEqual([]);
    });

    it('#3 addFilters should define the index and add tags(/filters) in tagsSelected and call fetchDrawings', () => {
        component.tags = [{ name: 'nature', drawingsAttachedToTag: ['dessin1'] }];
        const spy = spyOn(component, 'fetchDrawings');
        component.addFilters(0);
        expect(spy).toHaveBeenCalled();
        expect(component.index).toBe(0);
        expect(component.tagsSelected[0]).toEqual({ name: 'nature', drawingsAttachedToTag: ['dessin1'] });
    });
    it('#3bis addFilters should call tagsSelected.push() and tags.splice() ', () => {
        const spy1 = spyOn(component, 'fetchDrawings');
        const spy2 = spyOn(component.tagsSelected, 'push');
        component.tags = [];
        const spy3 = spyOn(component.tags, 'splice');

        component.addFilters(0);
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();

    });

    it('#4 loadDrawing should call loadDrawingOnWorkspace if drawingToUse is defined ', () => {
        component.dropForLoad = true;
        component.drawingToUse = {
            name: 'dessin1', tags: ['nature'], image: 'image1', thumbnail: 'vignette1',
            height: 0, width: 0, background: ''
        };
        const spy1 = spyOn(component.galleryService, 'loadDrawingOnWorkspace').and.returnValue(component.drawingToUse);

        component.loadDrawing();
        expect(spy1).toHaveBeenCalled();
        expect(component.router.navigate).toHaveBeenCalled();

    });

    it('#5 loadDrawing should do nothing if drawingToUse is undefined ', () => {
        component.loadDrawing();
        expect(component.galleryService.drawingToDisplay).toBeUndefined();

    });

    it('#6 fetchDrawings should call fetchAllDrawings if tagsSelected is empty ', () => {
        const spy = spyOn(component, 'fetchAllDrawings');
        component.fetchDrawings();
        expect(spy).toHaveBeenCalled();
    });

    it('#7 fetchDrawings should call fetchDrawingsByTag if tagsSelected has just 1 element ', () => {
        component.tagsSelected.push({ name: 'nature', drawingsAttachedToTag: ['dessin1'] });

        const spy = spyOn(component, 'fetchDrawingsByTag');
        component.fetchDrawings();
        expect(spy).toHaveBeenCalled();
    });

    it('#8 fetchDrawings should call fetchDrawingsByManyTags if tagsSelected has more than 1 element ', () => {
        component.tagsSelected.length = N3;
        const spy = spyOn(component, 'fetchDrawingsByManyTags');
        component.fetchDrawings();
        expect(spy).toHaveBeenCalled();
    });

    it('#9 fetchAllDrawings should call getAllDrawingsFromDB ', () => {
        const data = new Observable<Drawing[]>();
        const spy = spyOn(component.galleryService, 'getAllDrawingsFromDB').and.returnValue(data);
        component.fetchAllDrawings();
        expect(spy).toHaveBeenCalled();
    });

    it('#10 fetchDrawingsByTag should call getAllDrawingsbyTagFromDB ', () => {
        const data = new Observable<Drawing[]>();
        const spy = spyOn(component.galleryService, 'getDrawingsByTagFromDB').and.returnValue(data);
        component.fetchDrawingsByTag('tag1');
        expect(spy).toHaveBeenCalled();
    });

    it('#11 fetchDrawingsByManyTags should call getAllDrawingsbyTagFromDB ', () => {
        const data = new Observable<Drawing[]>();
        const spy = spyOn(component.galleryService, 'getDrawingsByTagFromDB').and.returnValue(data);
        component.fetchDrawingsByManyTags([
            { name: 'ville', drawingsAttachedToTag: ['dessin2'] },
            { name: 'nature', drawingsAttachedToTag: ['dessin1'] }
        ]);
        expect(spy).toHaveBeenCalled();
    });

    it('#12.1 fetchTags should call removeDuplicateValues ', () => {
        component.displayedDrawings =
            [
                {
                    name: 'dessin1', tags: ['nature'], image: 'image1', thumbnail: 'vignette1',
                    height: 0, width: 0, background: ''
                },
                {
                    name: 'dessin2', tags: ['nature, arbres'], image: 'image2', thumbnail: 'vignette2',
                    height: 0, width: 0, background: '',
                }
            ];
        const spy = spyOn(component, 'removeDuplicateValues');
        component.fetchTags();
        expect(spy).toHaveBeenCalled();
    });
    it('#12.2 fetchTags should call removeDuplicateValues ', () => {
        component.displayedDrawings =
            [
                {
                    name: 'dessin1', tags: ['ville', 'nature', 'fusee'], image: 'image1', thumbnail: 'vignette1',
                    height: 0, width: 0, background: ''
                },
                {
                    name: 'dessin2', tags: ['ville', 'arbres', 'ville'], image: 'image2', thumbnail: 'vignette2',
                    height: 0, width: 0, background: '',
                }
            ];
        const spy = spyOn(component, 'removeDuplicateValues');
        component.fetchTags();
        expect(spy).toHaveBeenCalled();
    });

    it('#13 deleteDrawing should do nothing if dropForDelete is false', () => {
        component.dropForDelete = false;
        const spy = spyOn(component.galleryService, 'deleteDrawing');
        component.deleteDrawing();
        expect(spy).not.toHaveBeenCalled();
    });

    it('#14 removeDuplicateValues  should remove duplicate value  ', () => {
        let array: Tag[];
        array = [
            { name: 'ville' },
            { name: 'nature' },
            { name: 'nature' },
            { name: 'plage' },
        ];
        component.removeDuplicateValues(array);
        expect(array).toEqual([
            { name: 'ville' },
            { name: 'nature' },
            { name: 'plage' },
        ]);

    });

});
