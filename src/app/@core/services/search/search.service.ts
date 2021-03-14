import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { GlobalModel } from '../../models/global.model';

import { SearchArguments, SearchResult, SearchType, SearchTypeMapping, searchTypes } from './search.model';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  searchTypeMappingsSubject = new BehaviorSubject<SearchTypeMapping[]>([]);
  searchTypeMappingsObservable = this.searchTypeMappingsSubject.asObservable();

  constructor(private httpClient: HttpClient, private globals: GlobalModel) {
    this.globals.localizedStringsObservable.subscribe((strings) =>
      this.searchTypeMappingsSubject.next(searchTypes.map((t) => ({ viewValue: strings.search.types[t], value: t }))),
    );
  }

  /**
   * Returns a string[] with names to use in an search query.
   *
   * For example:
   *
   * ```ts
   * [
   *   "wasser",
   *   "wasserstoff",
   *   "wasserstoffperoxid"
   * ]
   * ```
   */
  searchSuggestions(provider: string, searchType: SearchType, query: string): Observable<string[]> {
    return this.httpClient.post<string[]>('http://127.0.0.1:3030/api/v1/search/suggestions', {
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
   *   {name: "Wasser", casNumber: "7732-18-5", zvgNumber: "001140"},
   *   {name: "Wasserstoff", casNumber: "1333-74-0", zvgNumber: "007010"},
   *   {name: "wasserstoffperoxid", casNumber: "7722-84-1", zvgNumber: "536373"}
   * ]
   * ```
   */
  search(provider: string, args: SearchArguments): Observable<SearchResult[]> {
    return this.httpClient.post<SearchResult[]>('http://127.0.0.1:3030/api/v1/search/results', {
      provider,
      searchArguments: args,
    });
  }
}
