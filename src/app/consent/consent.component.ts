import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ConfigService } from '../@core/services/config/config.service';
import { GlobalModel } from '../@core/models/global.model';
import { LocalizedStrings } from '../@core/services/i18n/i18n.service';
import { ManualComponent } from '../manual/manual.component';

@Component({
  selector: 'app-consent',
  templateUrl: './consent.component.html',
  styleUrls: ['./consent.component.scss'],
})
export class ConsentComponent implements OnInit {
  strings!: LocalizedStrings;
  timer = this.data.duration;

  constructor(
    public dialogRef: MatDialogRef<ConsentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { duration: number },
    private globals: GlobalModel,
    private configService: ConfigService,
    private dialog: MatDialog,
  ) {
    this.globals.localizedStringsObservable.subscribe((strings) => (this.strings = strings));
  }

  ngOnInit(): void {
    setInterval(() => {
      if (this.timer > 0) {
        this.timer -= 1;
      }
    }, 1000);
  }

  closeConsent() {
    this.dialogRef.close();
    this.openManualDialog();
  }

  openManualDialog(): void {
    this.configService.getPromptHtml('gettingStarted').subscribe((html) => {
      this.dialog.open(ManualComponent, {
        data: {
          content: html,
        },
      });
    });
  }
}
