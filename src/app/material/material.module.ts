import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule } from '@angular/material/input';
import { MatCardModule} from '@angular/material/card';
import { MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatMenuModule} from '@angular/material/menu';
import {MatBadgeModule} from '@angular/material/badge';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatListModule} from '@angular/material/list';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatSlideToggleModule} from '@angular/material/slide-toggle'

const MaterialComponents = [
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatSelectModule,
  MatIconModule,
  MatFormFieldModule,
  MatCheckboxModule,
  MatToolbarModule,
  MatMenuModule,
  MatBadgeModule,
  MatSidenavModule,
  MatListModule,
  MatDialogModule,
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatSlideToggleModule
];



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MaterialComponents
  ],
  exports: [MaterialComponents]
})
export class MaterialModule { }
