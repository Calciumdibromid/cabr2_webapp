import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { SubstanceData } from './substances.model';

@Injectable({
  providedIn: 'root',
})
export class SubstancesService {
  constructor(private httpClient: HttpClient) { }

  substanceInfo(provider: string, identifier: string): Observable<SubstanceData> {
    return this.httpClient.post<SubstanceData>(environment.baseUrl + 'search/substances', {
      provider,
      identifier,
    });
  }
}
