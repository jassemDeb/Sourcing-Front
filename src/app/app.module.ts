import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginPageComponent } from './login-page/login-page.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './api.service';
import { SuperAdminDashboardComponent } from './super-admin-dashboard/super-admin-dashboard.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { AdduserComponent } from './super-admin-dashboard/Users/adduser/adduser.component';
import { NavbarComponent } from './navbar/navbar.component';
import { BodyComponent } from './body/body.component';
import { SublevelMenuComponent } from './navbar/sublevel-menu.component';
import { UserlistComponent } from './super-admin-dashboard/Users/userlist/userlist.component';
import { EdituserComponent } from './super-admin-dashboard/Users/userlist/edituser/edituser.component';
import { AddOrgComponent } from './super-admin-dashboard/Organizations/add-org/add-org.component';
import { OrgListComponent } from './super-admin-dashboard/Organizations/org-list/org-list.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    SuperAdminDashboardComponent,
    AdduserComponent,
    NavbarComponent,
    BodyComponent,
    SublevelMenuComponent,
    UserlistComponent,
    EdituserComponent,
    AddOrgComponent,
    OrgListComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    ReactiveFormsModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
