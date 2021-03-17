import { BehaviorSubject, Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { GlobalModel } from '../../models/global.model';

import {
  Provider,
  ProviderMapping,
  SearchArguments,
  SearchResult,
  SearchType,
  SearchTypeMapping,
  searchTypes,
} from './provider.model';
import { environment } from 'src/environments/environment';
import { SubstanceData } from '../../models/substances.model';

@Injectable({
  providedIn: 'root',
})
export class ProviderService {
  searchTypeMappingsSubject = new BehaviorSubject<SearchTypeMapping[]>([]);
  searchTypeMappingsObservable = this.searchTypeMappingsSubject.asObservable();

  providerMappingsSubject = new BehaviorSubject<ProviderMapping>(new Map());
  providerMappingsObservable = this.providerMappingsSubject.asObservable();

  constructor(private httpClient: HttpClient, private globals: GlobalModel) {
    this.globals.localizedStringsObservable.subscribe((strings) =>
      this.searchTypeMappingsSubject.next(searchTypes.map((t) => ({ viewValue: strings.search.types[t], value: t }))),
    );

    this.getAvailableProviders()
      .pipe(first())
      .subscribe((providers) => this.providerMappingsSubject.next(new Map(providers.map((p) => [p.identifier, p]))));
  }

  /**
   * Returns a Provider[] with the names and identifiers of the available Providers.
   *
   * For example:
   *
   * ```ts
   * [
   *   {
   *     name: 'Gestis',
   *     identifier: 'gestis',
   *   }
   * ]
   * ```
   */
  getAvailableProviders(): Observable<Provider[]> {
    return this.httpClient.get<Provider[]>(environment.baseUrl + 'search/availableProviders');
  }

  /**
   * Returns a string[] with names to use in an search query.
   *
   * For example:
   *
   * ```ts
   * [
   *   'wasser',
   *   'wasserstoff',
   *   'wasserstoffperoxid'
   * ]
   * ```
   */
  searchSuggestions(provider: string, searchType: SearchType, query: string): Observable<string[]> {
    return this.httpClient.post<string[]>(environment.baseUrl + 'search/suggestions', {
      provider,
      searchArgument: { searchType, pattern: query },
    });
  }

  /**
   * Returns a SearchResult[] with objects!.
   *
   * For example:
   *
   * ```ts
   * // TODO
   * ```
   *
   * returns:
   *
   * ```ts
   * [
   *   {name: 'Wasser', casNumber: '7732-18-5', zvgNumber: '001140'},
   *   {name: 'Wasserstoff', casNumber: '1333-74-0', zvgNumber: '007010'},
   *   {name: 'wasserstoffperoxid', casNumber: '7722-84-1', zvgNumber: '536373'}
   * ]
   * ```
   */
  search(provider: string, args: SearchArguments): Observable<SearchResult[]> {
    return this.httpClient.post<SearchResult[]>(environment.baseUrl + 'search/results', {
      provider,
      searchArguments: args,
    });
  }

  /**
   * Returns the parsed data of a substance from the given provider or an error
   * stating the cause of the failure when parsing the data.
   */
  substanceData(provider: string, identifier: string): Observable<SubstanceData> {
    return this.httpClient.post<SubstanceData>(environment.baseUrl + 'search/substances', {
      provider,
      identifier,
    });
  }
}
