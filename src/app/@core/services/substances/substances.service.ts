import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SubstanceData } from './substances.model';

@Injectable({
  providedIn: 'root',
})
export class SubstancesService {
  constructor(private httpClient: HttpClient) {}

  substanceInfo(provider: string, identifier: string): Observable<SubstanceData> {
    return this.httpClient.post<SubstanceData>('http://127.0.0.1:3030/api/v1/search/substances', {
      provider,
      identifier,
    });
  }
}
