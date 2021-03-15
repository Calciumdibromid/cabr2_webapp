import { first } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { CaBr2Document, DocumentTypes } from './loadSave.model';
import Logger from '../../utils/logger';

const logger = new Logger('service.loadSave');

@Injectable({
  providedIn: 'root',
})
export class LoadSaveService {
  constructor(private httpClient: HttpClient) {}

  saveDocument(fileType: string, filename: string, doc: CaBr2Document): Observable<string> {
    switch (fileType) {
      case 'cb2':
        return new Observable((sub) => {
          const blob = new Blob([JSON.stringify(doc)], { type: 'text/plain' });
          const anchor = document.createElement('a');
          anchor.download = 'Unbenannt.cb2';
          anchor.href = (window.webkitURL || window.URL).createObjectURL(blob);
          anchor.dataset.downloadurl = ['text/plain', anchor.download, anchor.href].join(':');
          anchor.click();
          sub.next();
        });

      case 'pdf':
        return this.httpClient.post<string>('http://127.0.0.1:3030/api/v1/loadSave/saveDocument', {
          fileType,
          doc,
        });

      default:
        throw new Error(`unknown file type: ${fileType}`);
    }
  }

  loadDocument(file: any): Observable<CaBr2Document> {
    const fileType = getFileType(file);

    const reader = new FileReader();

    switch (fileType) {
      case 'cb2':
        return new Observable((sub) => {
          reader.onload = () => sub.next(JSON.parse(reader.result as string));
          reader.readAsText(file);
        });

      case 'be':
        return new Observable((sub) => {
          reader.onload = () => {
            this.httpClient
              .post<CaBr2Document>('http://127.0.0.1:3030/api/v1/loadSave/loadDocument', {
                fileType,
                document: reader.result,
              })
              .pipe(first())
              .subscribe(
                (doc) => sub.next(doc),
                (err) => logger.error(err),
              );
          };
          reader.readAsText(file);
        });

      default:
        throw new Error(`unknown file type: ${fileType}`);
    }
  }

  getAvailableDocumentTypes(): Observable<DocumentTypes> {
    // return this.httpClient.get<DocumentTypes>('http://127.0.0.1:3030/api/v1/loadSave/availableDocumentTypes');
    return new Observable((sub) => sub.next({ load: ['cb2', 'be'], save: ['cb2', 'pdf'] }));
  }
}

const getFileType = (file: File): string => {
  const fileTypeSplit = file.name.split('.');
  return fileTypeSplit[fileTypeSplit.length - 1];
};
