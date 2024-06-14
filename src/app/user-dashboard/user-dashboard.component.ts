import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { ApiService } from 'src/app/api.service';

interface SideNavToggle {
  screenWidth : number;
  collapsed : boolean;
}

interface JwtPayload {
  username: string;
  exp: number;
  iat: number;
  // Include other payload properties as per your JWT structure
}


@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})


export class UserDashboardComponent implements OnInit {
  username: string | undefined;
  isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SideNavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed= data.collapsed;
  }

  getDecodedAccessToken(): JwtPayload | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);  
      this.username = decoded.username; 
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  ngOnInit(): void {
    this.getDecodedAccessToken(); 
    
  }
}
