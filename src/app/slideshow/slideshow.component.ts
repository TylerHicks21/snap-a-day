import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  NgModule,
} from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { BehaviorSubject, concatMap, switchMap, of, from, delay } from 'rxjs';

import { Photo } from '../shared/interfaces/photo';
import { SlideShowImageComponentModule } from './ui/slideshow-image.component';

@Component({
  selector: 'app-slideshow',
  template: `
    <ion-header>
      <ion-toolbar color="danger"></ion-toolbar>
      <ion-title>Play</ion-title>
      <ion-buttons slot="end">
        <ion-button (click)="mdlCntrl.dismiss()">
          <ion-icon name="close" slot="icon-only"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-header>
    <ion-content>
      <app-slideshow-image
        *ngIf="currentPhoto$ | async as photo"
        [safeResourceUrl]="photo.safeResourceUrl"
      ></app-slideshow-image>
    </ion-content>
  `,
  styles: [
    `
      :host {
        height: 100%;
      }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SlideshowComponent {
  currentPhotos$ = new BehaviorSubject<Photo[]>([]);
  currentPhoto$ = this.currentPhotos$.pipe(
    //Emit one photo at a time
    switchMap((photos) => from(photos)),
    concatMap((photo) =>
      // Create a new stream for each photo
      of(photo).pipe(
        // Creating a stream for each photo to delay start of stream
        delay(500)
      )
    )
  );

  constructor(protected mdlCntrl: ModalController) {}

  @Input() set photos(value: Photo[]) {
    this.currentPhotos$.next([...value].reverse());
  }
}

@NgModule({
  declarations: [SlideshowComponent],
  imports: [IonicModule, CommonModule, SlideShowImageComponentModule],
  exports: [SlideshowComponent],
})
export class SlideShowComponentModule {}
