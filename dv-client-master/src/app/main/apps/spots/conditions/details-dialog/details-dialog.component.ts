import { Component, Inject, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'details-dialog',
  templateUrl: './details-dialog.component.html',
  styleUrls: ['./details-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class DetailsDialogComponent implements OnInit, OnDestroy {
  condition: any;

  /**
   * Constructor
   *
   * @param {MatDialogRef} matDialogRef
   * @param data
   */
  constructor(
    public matDialogRef: MatDialogRef<DetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {
    this.condition = this.data?.condition || this.data
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Lifecycle hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On Init
   */
  ngOnInit(): void { }

  /**
   * On Destroy
   */
  ngOnDestroy(): void { }

}
