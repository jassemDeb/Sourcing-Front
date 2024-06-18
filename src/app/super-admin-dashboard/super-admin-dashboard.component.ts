import { Component , ViewEncapsulation, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { FormGroup, FormControl, FormBuilder, Validators  } from '@angular/forms';
import { NotifierService } from 'angular-notifier';
import { ToastrService } from 'ngx-toastr';
import { ToastService } from '../toast.service';

interface SideNavToggle {
  screenWidth : number;
  collapsed : boolean;
}

interface User {
  id: number;
  email: string;
  roles: string[];
  fullname: string;
  username: string;
  created_at: string;
  updated_at: string;
}

interface Organization {
  id: number;
  name: string;
  type: string;
  enabled: boolean;
  created_at: string;
  updated_at: string;
}

@Component({
  selector: 'app-super-admin-dashboard',
  templateUrl: './super-admin-dashboard.component.html',
  styleUrls: ['./super-admin-dashboard.component.css'],
  encapsulation: ViewEncapsulation.None 
})
export class SuperAdminDashboardComponent implements OnInit {

  isSideNavCollapsed = false;
  screenWidth = 0;
  organizations: Organization[] = [];
  users: User[] = [];
  displayedColumns: string[] = ['fullname', 'created_at'];

  constructor(private router: Router,private apiService: ApiService,private notifier: NotifierService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.fetchAllUsers();
    this.fetchAllOrganizations();
  }

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed= data.collapsed;
  }

  fetchAllUsers(): void {

    this.apiService.getAllUsers().subscribe((response : any) =>{
      if(response){
        this.users = response;
      } else (error: any) => {
        alert('Error: ' + error.message);
      }
    })
  }

  fetchAllOrganizations(): void {

    this.apiService.getAllOrgs().subscribe((response : any) =>{
      if(response){
        this.organizations = response;
      } else (error: any) => {
        alert('Error: ' + error.message);
      }
    })
  }

  showSuccessToast() {
    this.toastService.showSuccess('This is a success message!');
  }

  showErrorToast() {
    this.toastService.showError('This is an error message!');
  }


  widget(event : MouseEvent): void {
    event.preventDefault();
    this.router.navigate(['/sasp/widgets_config']);
  }

  user(event : MouseEvent): void {
    event.preventDefault();
    this.router.navigate(['/sasp/userlist']);
  }

  org(event : MouseEvent): void {
    event.preventDefault();
    this.router.navigate(['/sasp/orglist']);
  }
}
