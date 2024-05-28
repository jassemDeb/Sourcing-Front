import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { ApiService } from 'src/app/api.service';

interface JwtPayload {
  username: string;
  exp: number;
  iat: number;
  // Include other payload properties as per your JWT structure
}

@Component({
  selector: 'app-wideget-paremeter',
  templateUrl: './wideget-paremeter.component.html',
  styleUrls: ['./wideget-paremeter.component.css']
})
export class WidegetParemeterComponent implements OnInit {

  username: string | undefined;
  userId: number | null = null;  
  orgId: number | null = null; 
  widgets: any[] = [];
  widgetconfigs: any[] = [];

  constructor( private apiService: ApiService) {

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


  loadWidgetConfigs(): void {
    this.widgets.forEach(widget => {
      this.apiService.WidgetConfigByID(widget.id).subscribe((response: any)=>{
        this.widgetconfigs.push(response);
        console.log(response)
        console.log("done");
       
      });
  },(error: any) =>{
    alert('Error: '+ error.message)
  })
  }

  ngOnInit(): void {
    this.getDecodedAccessToken();   
    console.log('Username:', this.username);
  
    if (this.username) {
      this.fetchUserDetails(this.username);
    } else {
      console.error('No username available from token');
    }
  }
  
  fetchUserDetails(username: string): void {
    this.apiService.getUserByUsername(username).subscribe((response: any) => {
      if (response.status === true) {
        this.userId = response.data.id; 
        console.log('UserID:', this.userId);
  
        // Ensure userId is not null before fetching organization details
        if (this.userId !== null) {
          this.fetchOrganizationDetails(this.userId);
        } else {
          console.error('Retrieved userId is null, cannot fetch organization details');
        }
      } else {
        console.log('User fetch status:', response.status);
      }
    }, (error: any) => {
      console.error('Error fetching user by username:', error);
      alert("Error: " + error.message);
    });
  }
  
  
  fetchOrganizationDetails(userId: any): void {
    this.apiService.getOrgByUser(userId).subscribe((response: any) => {
      if (response.status === true && response.data.length > 0) {
        this.orgId = response.data[0].id; 
        console.log('OrgID:', this.orgId);
  
        this.loadWidgets(); // Call this only after orgId is set
      } else {
        console.log('No organization data found');
      }
    }, (error: any) => {
      console.error('Error fetching organization:', error);
      alert("Error: " + error.message);
    });
  }
  
  loadWidgets(): void {
    if (this.orgId) {
      this.apiService.getWidgetByOrg(this.orgId).subscribe((response: any) => {
        this.widgets = response.data;
        console.log('Widgets loaded:', this.widgets);
        this.loadWidgetConfigs();
      }, (error: any) => {
        console.error('Error fetching widgets:', error);
        alert('Error: ' + error.message);
      });
    } else {
      console.error('Org ID is not set when trying to load widgets');
    }
  }
  
  

}
