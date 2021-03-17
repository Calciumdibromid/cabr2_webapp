import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Observable, Subscriber } from 'rxjs';

import { GlobalModel } from '../@core/models/global.model';
import { LocalizedStrings } from '../@core/services/i18n/i18n.service';
import { TauriService } from '../@core/services/tauri/tauri.service';

interface SaveDocumentResponse {
  downloadUrl: string;
}

export interface ProgressDialogData {
  download: Observable<SaveDocumentResponse>;
  subscriber: Subscriber<string>;
}

@Component({
  selector: 'app-progress-dialog',
  templateUrl: './progress-dialog.component.html',
  styleUrls: ['./progress-dialog.component.scss'],
})
export class ProgressDialogComponent implements OnInit {
  strings!: LocalizedStrings;

  pdfUrl: string | undefined;

  finished = false;

  closeEnabled = false;

  constructor(
    public dialogRef: MatDialogRef<ProgressDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProgressDialogData,

    private globals: GlobalModel,
    private tauriService: TauriService,
  ) {
    this.globals.localizedStringsObservable.subscribe((strings) => (this.strings = strings));

    data.download.subscribe(
      (res) => {
        this.setPdfUrl(res.downloadUrl);
        this.closeEnabled = true;
        data.subscriber.next('');
      },
      (err) => data.subscriber.error(err),
    );
  }

  ngOnInit(): void {
    this.finished = false;
    this.closeEnabled = false;
    setTimeout(() => (this.closeEnabled = true), 5000);
  }

  downloadPdf() {
    if (this.pdfUrl) {
      this.tauriService.openUrl(this.pdfUrl);
    }
  }

  setPdfUrl(url: string) {
    this.pdfUrl = url;
    this.finished = true;
  }
}
