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
import { TranslateModule } from '@ngx-translate/core';
import { ListItemComponent } from './list-item/list-item.component';
import { TenantSelectorComponent } from './tenant-selector/tenant-selector.component';
import { IdentifierComponent } from './identifier/identifier.component';
import { PipesModule } from 'app/pipes/pipes.module';
import { BreadcrumbModule, BreadcrumbService } from 'xng-breadcrumb';
import { NgxCsvParserModule } from 'ngx-csv-parser';
import { DragDropFileComponent } from './drag-drop-file/drag-drop-file.component';
import { NgxFileDropModule } from 'ngx-file-drop';

/**
 * Shared Module
 *
 * Modules and components that are shared throughout the application should be here.
 */
@NgModule({
    imports: [
        CommonModule,
        IconsModule,
        MaterialModule,
        ReactiveFormsModule,
        PipesModule,
        TranslateModule,
        BreadcrumbModule,
        NgxCsvParserModule,
        NgxFileDropModule
    ],
    declarations: [
        FormfieldComponent,
        FormDialogComponent,
        DeleteDialogComponent,
        FileUploadComponent,
        FooterComponent,
        LanguageSelectorComponent,
        ThemePickerComponent,
        ListItemComponent,
        TenantSelectorComponent,
        IdentifierComponent,
        DragDropFileComponent
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
        ListItemComponent,
        TenantSelectorComponent,
        IdentifierComponent,
        BreadcrumbModule,
        NgxCsvParserModule,
        NgxFileDropModule,
        DragDropFileComponent
    ],
    providers: [
        BreadcrumbService
    ]
})
export class SharedModule { }
