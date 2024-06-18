import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
interface User {
  id: number;
  email: number;
  roles : string[];
  fullname : string;
  username: string;
  password : string;
  created_at :string;
  updated_at : string;
}

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})


export class UserDashboardComponent implements OnInit {
  username: string | undefined;
  userId: number | null = null; 
  user: User | null = null;
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

  async fetchUserDetails(username: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getUserByUsername(username).subscribe((response: any) => {
        if (response.status === true) {
          this.userId = response.data.id; 
          console.log('UserID:', this.userId);
          resolve();
        } else {
          console.log('User fetch status:', response.status);
          reject();
        }
      }, (error: any) => {
        console.error('Error fetching user by username:', error);
        alert("Error: " + error.message);
        reject();
      });
    });
  }

  getUserDetailsById(id: number): void {
  
    this.apiService.getUserById(id).subscribe(
      (response: any) => {
        if (response) {
          this.user = {
            id: response.id,
            email: response.email,
            roles: response.roles,
            fullname: response.fullname,
            username: response.username,
            password: '', // Initialize password as empty string
            created_at: response.created_at,
            updated_at: response.updated_at
          };
          console.log('User:',  this.user);
        } else {
          console.log('User fetch status:', response.status);
        }
      },
      (error: any) => {
        console.error('Error fetching user by id:', error);
        alert('Error: ' + error.message);
      }
    );
  }

  ngOnInit(): void {
    this.getDecodedAccessToken(); 
    if (this.username) {
      this.fetchUserDetails(this.username).then(() => {
        if (this.userId) {
          this.getUserDetailsById(this.userId);

        }
      });
    } else {
      console.error('No username available from token');
    }
    
  }

  constructor(private router: Router,private apiService: ApiService) {
   
  }

  setting(event : MouseEvent): void {
    event.preventDefault();
    this.router.navigate(['/user/settings']);
  }

  dashboard(event : MouseEvent): void {
    event.preventDefault();
    this.router.navigate(['/user/dashborad']);
  }

  widget(event : MouseEvent): void {
    event.preventDefault();
    this.router.navigate(['/user/widget_paremeter']);
  }
}
