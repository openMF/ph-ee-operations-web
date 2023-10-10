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
        TranslateModule.forRoot()
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
        TenantSelectorComponent
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
        TenantSelectorComponent
    ]
})
export class SharedModule { }
