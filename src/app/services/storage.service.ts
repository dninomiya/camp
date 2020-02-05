import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: AngularFireStorage
  ) { }

  async upload(path: string, file: string): Promise<string> {
    const ref = this.storage.ref(path);
    const result = await ref.putString(file, 'data_url');
    return result.ref.getDownloadURL();
  }
}
