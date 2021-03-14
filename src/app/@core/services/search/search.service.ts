import { BehaviorSubject, Observable } from 'rxjs';
import { Injectable } from '@angular/core';

import { GlobalModel } from '../../models/global.model';

import { SearchArguments, SearchResult, SearchType, SearchTypeMapping, searchTypes } from './search.model';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  searchTypeMappingsSubject = new BehaviorSubject<SearchTypeMapping[]>([]);
  searchTypeMappingsObservable = this.searchTypeMappingsSubject.asObservable();

  constructor(private globals: GlobalModel) {
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
    return from(fetch('http://127.0.0.1:3030/api/v1/search/suggestions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ provider, searchType, pattern: query })
    }) as unknown as Promise<string[]>);
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
    return from(fetch('http://127.0.0.1:3030/api/v1/search/results', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ provider, searchArguments: args })
    }) as unknown as Promise<SearchResult[]>);
  }
}
