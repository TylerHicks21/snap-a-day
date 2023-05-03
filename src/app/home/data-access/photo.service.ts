import { Injectable } from '@angular/core';
import { BehaviorSubject, take, tap, map } from 'rxjs';
import { Platform } from '@ionic/angular';
import { Capacitor } from '@capacitor/core';
import {
  Camera,
  CameraResultType,
  CameraSource,
  ImageOptions,
} from '@capacitor/camera';
import { Directory, Filesystem } from '@capacitor/filesystem';

import { Photo } from '../../shared/interfaces/photo';
import { StorageService } from '../../shared/data-access/storage.service';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  #photos$ = new BehaviorSubject<Photo[]>([]);
  photos$ = this.#photos$.pipe(
    tap((photos) => this.storageService.save(photos))
  );
  hasTakenPhotoToday$ = this.#photos$.pipe(
    map((photos) =>
      photos.find(
        (photo) =>
          new Date().setHours(0, 0, 0, 0) ===
          new Date(photo.dateTaken).setHours(0, 0, 0, 0)
      )
        ? true
        : false
    )
  );

  constructor(
    private plaform: Platform,
    private storageService: StorageService
  ) {}

  load() {
    this.storageService.load$.pipe(take(1)).subscribe((photos) => {
      this.#photos$.next(photos);
    });
  }

  async takePhoto() {
    const options: ImageOptions = {
      quality: 50,
      source: CameraSource.Camera,
      width: 600,
      allowEditing: false,
      resultType: this.plaform.is('capacitor')
        ? CameraResultType.Uri
        : CameraResultType.DataUrl,
    };

    try {
      const photo = await Camera.getPhoto(options);
      const uniqueName = Date.now().toString();

      if (this.plaform.is('capacitor') && photo.path) {
        const photoOnFileSystem = await Filesystem.readFile({
          path: photo.path,
        });

        const fileName = uniqueName + '.jpeg';
        const permanentFile = await Filesystem.writeFile({
          data: photoOnFileSystem.data,
          //path: fileName
          //directory: Directory.Data
          path: 'snap-a-day/' + fileName,
          directory: Directory.Documents,
          recursive: true,
        });

        this.addPhoto(fileName, Capacitor.convertFileSrc(permanentFile.uri));
      } else if (photo.dataUrl) {
        this.addPhoto(uniqueName, photo.dataUrl);
      }
    } catch (err) {
      console.log(err);
      throw new Error('Could not save photo');
    }
  }

  async deletePhoto(name: string) {
    const newPhotos = this.#photos$.value.filter(
      (photos) => photos.name !== name
    );

    this.#photos$.next(newPhotos);

    if (this.plaform.is('capacitor')) {
      await Filesystem.deleteFile({
        //path: name,
        //directory: Directory.Documents,
        path: 'snap-a-day/' + name,
        directory: Directory.Documents,
      });
    }
  }

  private addPhoto(fileName: string, filePath: string) {
    const newPhotos = [
      {
        name: fileName,
        path: filePath,
        dateTaken: new Date().toISOString(),
      },
      ...this.#photos$.value,
    ];
    this.#photos$.next(newPhotos);
  }
}
