import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { SuperAdminDashboardComponent } from './super-admin-dashboard/super-admin-dashboard.component';
import { AdduserComponent } from './super-admin-dashboard/Users/adduser/adduser.component';
import { UserlistComponent } from './super-admin-dashboard/Users/userlist/userlist.component';

const routes: Routes = [
  {
    path: "login",
    component: LoginPageComponent
  },
  {
    path: "",
    component: LoginPageComponent
  },
  {
    path: "sasp",
    component: SuperAdminDashboardComponent,
  },
  {
    path: "sasp/adduser",
    component: AdduserComponent
  },
  {
    path: "sasp/userlist",
    component: UserlistComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
