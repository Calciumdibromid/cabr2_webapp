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
  constructor(private httpClient: HttpClient) {}

  getProgramVersion(): Observable<string> {
    return this.httpClient.get<string>(environment.baseUrl + 'config/programVersion');
  }

  getConfig(): Observable<ConfigModel> {
    return new Observable((sub) => {
      const cookie = JSON.parse(document.cookie);
      const config = new ConfigModel(cookie ? cookie.global : undefined);
      sub.next(config);
    });
  }

  // TODO cookie notice handling
  saveConfig(config: ConfigModel): Observable<void> {
    return new Observable((sub) => {
      document.cookie = JSON.stringify(config);
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
