import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ConfigModel } from '../../models/config.model';
import { environment } from '../../../../environments/environment';
import { GHSSymbols } from '../../models/global.model';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(private httpClient: HttpClient) {
    // TODO remove again
    document.cookie = '';
  }

  getProgramVersion(): Observable<string> {
    return this.httpClient.get<string>(environment.baseUrl + 'config/programVersion');
  }

  getConfig(): Observable<ConfigModel> {
    return new Observable((sub) => {
      const config = localStorage.getItem('config');
      if (config) {
        sub.next(new ConfigModel(JSON.parse(config).global));
      } else {
        sub.next(new ConfigModel());
      }
    });
  }

  saveConfig(config: ConfigModel): Observable<void> {
    return new Observable((sub) => {
      localStorage.setItem('config', JSON.stringify(config));
      sub.next();
    });
  }

  getHazardSymbols(): Observable<GHSSymbols> {
    return this.httpClient.get<GHSSymbols>(environment.baseUrl + 'config/hazardSymbols');
  }

  getPromptHtml(name: string): Observable<string> {
    return this.httpClient.post<string>(environment.baseUrl + 'config/promptHtml', {
      name,
    });
  }
}
