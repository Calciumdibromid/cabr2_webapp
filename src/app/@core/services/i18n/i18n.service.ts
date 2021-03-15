import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { strings as DEFAULT_STRINGS } from '../../../../assets/defaultStrings.json';
import { environment } from '../../../../environments/environment';
import Logger from '../../utils/logger';

const logger = new Logger('i18n-service');

export type LocalizedStrings = typeof DEFAULT_STRINGS;

@Injectable({
  providedIn: 'root',
})
export class I18nService {
  constructor(private httpClient: HttpClient) { }

  static getDefaultStrings(): LocalizedStrings {
    return DEFAULT_STRINGS;
  }

  getAvailableLanguages(): Observable<LocalizedStringsHeader[]> {
    return this.httpClient.get<LocalizedStringsHeader[]>(environment.baseUrl + 'config/availableLanguages');
  }

  getLocalizedStrings(language: string): Observable<LocalizedStrings> {
    return new Observable((sub) => {
      this.httpClient
        .post<LocalizedStrings>(environment.baseUrl + 'config/localizedStrings', {
          language,
        })
        .subscribe(
          (strings) => {
            logger.trace('loading localized strings successful:', strings);
            sub.next(strings);
          },
          (err) => {
            logger.error('loading localized strings failed:', err);
            sub.next(I18nService.getDefaultStrings());
          },
        );
    });
  }
}

export interface LocalizedStringsHeader {
  name: string;
  locale: string;
}
