import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { HighContrastModeEnum, HighContrastService } from '@app/services/high-contrast.service';
import { ConfirmDialogComponent } from '@app/shared/confirm-dialog/confirm-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class ConfirmDialogService {

  currenContrastMode: HighContrastModeEnum;

  constructor(private dialog: MatDialog, private highContrastService: HighContrastService) { }

  dialogRef: MatDialogRef<ConfirmDialogComponent>;
  public open(options) {
    this.highContrastService.getCurrentContrastMode().subscribe(mode => this.currenContrastMode = mode);
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: options.title,
        message: options.message,
        cancelText: options.cancelText,
        confirmText: options.confirmText
      },
      panelClass: ['confirm-dialog', `${this.currenContrastMode}`],
    });
  }

  public confirmed(): Observable<any> {
    return this.dialogRef.afterClosed().pipe(take(1), map(res => res));
  }
}
