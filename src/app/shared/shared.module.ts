/** Angular Imports */
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/** Translation Imports */
import { TranslateModule } from '@ngx-translate/core';

/** Custom Components */
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { FooterComponent } from './footer/footer.component';
import { FormDialogComponent } from './form-dialog/form-dialog.component';
import { FormfieldComponent } from './form-dialog/formfield/formfield.component';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { ThemePickerComponent } from './theme-picker/theme-picker.component';

/** Custom Directives */
import {
    MatomoClickDirective,
    MatomoDownloadDirective,
    MatomoFormDirective,
    MatomoOutboundDirective,
} from '../core/analytics/matomo.directives';

/** Custom Modules */
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { IconsModule } from './icons.module';
import { MaterialModule } from './material.module';

/**
 * Shared Module
 *
 * Modules and components that are shared throughout the application should be here.
 */
@NgModule({
    imports: [CommonModule, IconsModule, MaterialModule, ReactiveFormsModule, TranslateModule],
    declarations: [
        FormfieldComponent,
        FormDialogComponent,
        ConfirmDialogComponent,
        DeleteDialogComponent,
        FileUploadComponent,
        FooterComponent,
        LanguageSelectorComponent,
        ThemePickerComponent,
        MatomoClickDirective,
        MatomoFormDirective,
        MatomoDownloadDirective,
        MatomoOutboundDirective,
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
        TranslateModule,
        MatomoClickDirective,
        MatomoFormDirective,
        MatomoDownloadDirective,
        MatomoOutboundDirective,
    ]
})
export class SharedModule { }
