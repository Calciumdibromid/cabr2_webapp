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
    logCall('open');
    return new Observable();
  }

  save(options?: any): Observable<string | string[]> {
    logCall('save');
    return new Observable();
  }

  promisified<T>(args: any): Observable<T> {
    logCall('promisified');
    return new Observable();
  }
}
