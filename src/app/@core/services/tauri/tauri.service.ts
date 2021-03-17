import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import Logger from '../../utils/logger';

const logger = new Logger('service.tauri');

const logCall = (name: string) => logger.error('called inaccessible tauri service: [', name, ']');

@Injectable({
  providedIn: 'root',
})
export class TauriService {
  openUrl(url: string): void {
    window.open(url, '_blank');
  }

  open(_?: any): Observable<string | string[]> {
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
      sub.next(options.filter ?? 'cb2');
    });
  }

  promisified<T>(_: any): Observable<T> {
    logCall('promisified');
    return new Observable();
  }
}
