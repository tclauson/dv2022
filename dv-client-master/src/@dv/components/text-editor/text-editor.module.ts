import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { TextEditorComponent } from './text-editor.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CKEditorModule
  ],
  declarations: [
    TextEditorComponent
  ],
  exports: [
    TextEditorComponent
  ]
})
export class TextEditorModule { }
