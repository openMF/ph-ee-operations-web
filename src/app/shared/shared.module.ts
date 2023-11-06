/** Angular Imports */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

/** Custom Components */
import { FormfieldComponent } from './form-dialog/formfield/formfield.component';
import { FormDialogComponent } from './form-dialog/form-dialog.component';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FooterComponent } from './footer/footer.component';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { ThemePickerComponent } from './theme-picker/theme-picker.component';

/** Custom Modules */
import { IconsModule } from './icons.module';
import { MaterialModule } from './material.module';
import { NgxMatDateFormats, NgxMatDateAdapter, NGX_MAT_DATE_FORMATS } from '@angular-material-components/datetime-picker';
import { NgxMatMomentModule, NgxMatMomentAdapter, NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS } from '@angular-material-components/moment-adapter';
import { MAT_DATE_LOCALE} from '@angular/material/core';
import { AutoFormatDateTimeDirective } from './auto-format-date-time/auto-format-date-time.directive';

const SIMPLE_DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const CUSTOM_DATE_FORMATS: NgxMatDateFormats = {
  parse: {
    dateInput: SIMPLE_DATE_FORMAT
  },
  display: {
    dateInput: SIMPLE_DATE_FORMAT,
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  }
};

/**
 * Shared Module
 *
 * Modules and components that are shared throughout the application should be here.
 */
@NgModule({
  imports: [
    NgxMatMomentModule,
    CommonModule,
    IconsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  declarations: [
    FormfieldComponent,
    FormDialogComponent,
    DeleteDialogComponent,
    FileUploadComponent,
    FooterComponent,
    LanguageSelectorComponent,
    ThemePickerComponent,
    AutoFormatDateTimeDirective
  ],
  exports: [
    FileUploadComponent,
    FooterComponent,
    LanguageSelectorComponent,
    ThemePickerComponent,
    CommonModule,
    IconsModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    AutoFormatDateTimeDirective
  ],
  entryComponents: [
    FormDialogComponent,
    DeleteDialogComponent
  ],
  providers: [
    {provide: NgxMatDateAdapter, useClass: NgxMatMomentAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: NGX_MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true }},
    {provide: NGX_MAT_DATE_FORMATS, useValue: CUSTOM_DATE_FORMATS},
  ]
})
export class SharedModule { }
