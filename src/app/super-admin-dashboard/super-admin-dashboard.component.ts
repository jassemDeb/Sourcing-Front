import { Component , ViewEncapsulation, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { FormGroup, FormControl, FormBuilder, Validators  } from '@angular/forms';

interface SideNavToggle {
  screenWidth : number;
  collapsed : boolean;
}

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.css'],
  encapsulation: ViewEncapsulation.None 
})
export class SuperAdminDashboardComponent {

  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed= data.collapsed;
  }


}
