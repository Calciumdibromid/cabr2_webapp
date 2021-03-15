import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import Logger from '../../utils/logger';

const logger = new Logger('service.tauri');

const logCall = (name: string) => logger.error('called inaccessible tauri service: [', name, ']');

@Injectable({
  providedIn: 'root',
})
export class TauriService {
  openUrl = window.open;

  open(options?: any): Observable<string | string[]> {
    return new Observable((sub) => {
      const hiddenFileHack = document.getElementById('hiddenFileHack') as any;
      hiddenFileHack?.addEventListener(
        'change',
        (e: any) => {
          sub.next(e.target.files[0]);
          hiddenFileHack.value = '';
        },
        { once: true },
      );
      hiddenFileHack?.click();
    });
  }

  save(options?: any): Observable<string | string[]> {
    return new Observable((sub) => {
      sub.next(options.filter ?? 'be');
    });
  }

  promisified<T>(args: any): Observable<T> {
    logCall('promisified');
    return new Observable();
  }
}
