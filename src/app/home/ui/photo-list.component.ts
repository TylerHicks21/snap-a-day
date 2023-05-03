import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgModule,
  Output,
} from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { DaysAgoPipeModule } from 'src/app/home/ui/days-ago.pipe';
import { Photo } from '../../shared/interfaces/photo';

@Component({
  selector: 'app-photo-list',
  template: `
    <ion-list lines="none">
      <ion-item-sliding *ngFor="let photo of photos; trackBy: trackByFn">
        <ion-item>
          <img [src]="photo.safeResourceUrl" />
          <ion-badge slot="end" color="light">
            {{ photo.dateTaken | daysAgo }}
          </ion-badge>
        </ion-item>
        <ion-item-options side="end">
          <ion-item-option (click)="delete.emit(photo.name)" color="danger">
            <ion-icon name="trash" slot="icon-only"></ion-icon>
          </ion-item-option>
        </ion-item-options>
      </ion-item-sliding>
    </ion-list>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhotoListComponent {
  @Input() photos!: Photo[];
  @Output() delete = new EventEmitter<string>();

  constructor() {}

  trackByFn(index: number, photo: Photo) {
    return photo.name;
  }
}

@NgModule({
  imports: [CommonModule, IonicModule, DaysAgoPipeModule],
  declarations: [PhotoListComponent],
  exports: [PhotoListComponent],
})
export class PhotoListCompontentModule {}
