import { ConfigModel } from '../../models/config.model';
import { GHSSymbols } from '../../models/global.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(private httpClient: HttpClient) {}

  getProgramVersion(): Observable<string> {
    return this.httpClient.get<string>('http://127.0.0.1:3030/api/v1/config/programVersion');
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
    return this.httpClient.get<GHSSymbols>('http://127.0.0.1:3030/api/v1/config/hazardSymbols');
  }

  getPromptHtml(name: string): Observable<string> {
    return this.httpClient.post<string>('http://127.0.0.1:3030/api/v1/config/promptHtml', {
      name,
    });
  }
}
