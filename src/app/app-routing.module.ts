import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { SuperAdminDashboardComponent } from './super-admin-dashboard/super-admin-dashboard.component';
import { AdduserComponent } from './super-admin-dashboard/Users/adduser/adduser.component';
import { UserlistComponent } from './super-admin-dashboard/Users/userlist/userlist.component';
import { AddOrgComponent } from './super-admin-dashboard/Organizations/add-org/add-org.component';
import { OrgListComponent } from './super-admin-dashboard/Organizations/org-list/org-list.component';
import { DashboardWidgetComponent } from './super-admin-dashboard/Widgets/dashboard-widget/dashboard-widget.component';
import { WidgetsConfigComponent } from './super-admin-dashboard/Widgets/widgets-config/widgets-config.component';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';

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
  },

  {
    path: "sasp/addorg",
    component: AddOrgComponent
  },

  {
    path: "sasp/orglist",
    component: OrgListComponent
  },
  {
    path: "sasp/widgets",
    component: DashboardWidgetComponent
  },
  {
    path: "sasp/widgets_config",
    component: WidgetsConfigComponent
  },
  {
    path: "user",
    component: UserDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
