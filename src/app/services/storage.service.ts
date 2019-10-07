import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: AngularFireStorage
  ) { }

  async upload(path: string, file: string): Promise<string> {
    const ref = this.storage.ref(path);
    await ref.putString(file, 'data_url');
    return ref.getDownloadURL().pipe(first()).toPromise();
  }
}
