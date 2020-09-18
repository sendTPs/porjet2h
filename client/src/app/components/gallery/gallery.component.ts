import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { Router } from '@angular/router';
import { Drawing } from '@app/models/drawing.interface';
import { Tag } from '@app/models/tag.interface';
import { GalleryService } from '@app/services/gallery/gallery.service';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss'],

})
export class GalleryComponent implements OnInit {

    constructor(
        public galleryService: GalleryService,
        public router: Router,
        public dialogRef: MatDialogRef<GalleryComponent>,
    ) { }

    index: number;
    dropForDelete: boolean;
    dropForLoad: boolean;
    drawingToUse: Drawing;
    allDrawings: Drawing[];
    currentTagDrawings: Drawing[];
    displayedDrawings: Drawing[];
    previousDrop: Drawing;
    tags: Tag[] = [];

    tagsSelected: Tag[] = [];

    ngOnInit(): void {
        this.fetchAllDrawings();
    }

    resetFilters(): void {
        this.tags = this.tags.concat(this.tagsSelected);
        this.tagsSelected = [];
        this.dropForDelete = false;
        this.dropForLoad = false;
        this.drawingToUse = { name: '', tags: [], image: '', thumbnail: '', height: 0, width: 0, background: '' };
        this.fetchAllDrawings();

    }

    addFilters(index: number): void {
        this.index = index;
        this.tagsSelected.push(this.tags[index]);
        this.tags.splice(index, 1);
        this.fetchDrawings();

    }

    loadDrawing(): void {

        if (this.drawingToUse !== undefined && this.dropForLoad) {
            this.galleryService.loadDrawing = true;
            this.galleryService.loadDrawingOnWorkspace(this.drawingToUse);
            this.dialogRef.close();
            this.router.navigate(['/view']);

        }
    }

    fetchTags(): void {
        this.tags = [];
        for (const iterator of this.displayedDrawings) {
            for (let i = 0; i < iterator.tags.length; i++) {
                let sameName = false;
                if (i === 0) {
                    this.tags.push({ name: iterator.tags[i] });
                }
                // tslint:disable: prefer-for-of
                for (let j = 0; j < this.tags.length; j++) {
                    if (this.tags[j].name === iterator.tags[i]) {
                        sameName = true;
                        break;
                    }
                }
                if (!sameName) {
                    this.tags.push({ name: iterator.tags[i] });
                }
            }
        }
        this.removeDuplicateValues(this.tags);
    }

    fetchDrawings(): void {
        if (this.tagsSelected.length === 0) {
            this.fetchAllDrawings();
        } else if (this.tagsSelected.length === 1) {
            this.fetchDrawingsByTag(this.tagsSelected[0].name);
        } else if (this.tagsSelected.length > 1) {
            this.fetchDrawingsByManyTags(this.tagsSelected);
        }
    }

    fetchAllDrawings(): void {
        this.galleryService.getAllDrawingsFromDB()
            .subscribe(
                (data) => {
                    this.displayedDrawings = data;
                    this.allDrawings = data;
                    console.log(this.displayedDrawings);
                    if (this.displayedDrawings) {
                        this.fetchTags();
                    }
                },
                (error) => {
                    console.log('Erreur ! :  ' + error);
                });
    }

    fetchDrawingsByTag(tag: string): void {
        this.galleryService.getDrawingsByTagFromDB(tag)
            .subscribe(
                (data) => {
                    this.currentTagDrawings = data;
                    if (this.currentTagDrawings) {
                        this.displayedDrawings = this.currentTagDrawings;
                    }
                },
                (error) => {
                    console.log('Erreur ! : ' + error);
                }
            );
    }

    fetchDrawingsByManyTags(tags: Tag[]): void {
        let drawingArray: Drawing[] = [];
        let i = 0;
        for (const iterator of tags) {
            i++;
            this.galleryService.getDrawingsByTagFromDB(iterator.name)
                .subscribe(
                    (data) => {
                        drawingArray = drawingArray.concat(data);
                        if (i === tags.length) {
                            this.removeDuplicateValues(drawingArray);
                            this.displayedDrawings = drawingArray;
                        }
                    },
                    (error) => {
                        console.log('Erreur ! : ' + error);
                    }
                );
        }
    }

    deleteDrawing(): void {

        if (this.drawingToUse !== undefined && this.dropForDelete) {
            this.galleryService.deleteDrawing(this.drawingToUse.name)
                .subscribe(
                    (data) => { alert('Le dessin : ' + this.drawingToUse.name + ' a bien été supprimé'); },
                    (error) => {
                        console.log('Erreur ! : ' + error);
                    }
                );
        } else {
            alert('Aucun dessin à supprimer');
        }

    }

    drop(event: CdkDragDrop<string[]>, state: string): void {
        const finalDrawing = new Array();

        if (this.previousDrop) {
            this.displayedDrawings.push(this.previousDrop);
        }
        if (state === 'delete') {
            this.dropForDelete = true;
            this.dropForLoad = false;

        } else {
            if (state === 'load') {
                this.dropForDelete = false;
                this.dropForLoad = true;
            }
        }

        transferArrayItem(event.previousContainer.data,
            finalDrawing,
            event.previousIndex,
            event.currentIndex);

        this.drawingToUse = {
            name: finalDrawing[0].name, tags: finalDrawing[0].tags,
            image: finalDrawing[0].image, thumbnail: finalDrawing[0].thumbnail,
            height: finalDrawing[0].height, width: finalDrawing[0].width,
            background: finalDrawing[0].background
        };
        this.previousDrop = this.drawingToUse;

    }

    removeDuplicateValues(array: Tag[] | Drawing[]): void {
        for (let j = 0; j < array.length; j++) {
            for (let i = array.length - 1; i > 0; i--) {
                if (array[j].name === array[i].name && i !== j) {
                    array[i] = array[array.length - 1];
                    array.pop();
                }
            }
        }
    }

}
