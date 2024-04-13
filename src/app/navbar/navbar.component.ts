import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { navbarData } from './nav-data';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  collapsed = false ; 
  navData = navbarData;

  constructor(private router: Router) {
  }
  

  onLogout(){
    alert("Succees to logout");
    localStorage.removeItem("token");
    this.router.navigateByUrl('/');
  }

}
