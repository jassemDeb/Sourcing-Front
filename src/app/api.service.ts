// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WidgetDetails } from './models/widget-details.model';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000/api'; 

  constructor(private http: HttpClient) {}

  login(credentials: any) {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  register(credentials: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
   return this.http.post(`${this.apiUrl}/register`, credentials, { headers });
  }

  addorg(credentials: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
   return this.http.post(`${this.apiUrl}/addorg`, credentials, { headers });
  }



  login_check(credentials: any){
    return this.http.post(`${this.apiUrl}/login_check`, credentials);
  }

  getAllUsers(){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/users`,  { headers });
  }

  getUserById(id: number){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/users/${id}`, { headers });
  }

  deleteUserById(id: number){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/deleteUser/${id}`, { headers });
  }

  updateUser(id: number, credentials: any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/update/${id}`, credentials, { headers })
  }

  getAllOrgs(){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/orgs`,  { headers });
  }

  getAllOrgsByName(){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/orgsByName`,  { headers });
  }

  deleteOrgById(id: number){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/deleteOrg/${id}`, { headers });
  }

  updateOrg(id: number, credentials: any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/updateOrg/${id}`, credentials, { headers })
  }

  addwidget(credentials: any) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
   return this.http.post(`${this.apiUrl}/addwidget`, credentials, { headers });
  }

  getAllWidgets(){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/widgets`,  { headers });
  }

  deleteWidgetById(id: number){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.delete(`${this.apiUrl}/deleteWidget/${id}`, { headers });
  }

  WidgetConfig(id: number){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/widgetconfig/${id}`, { headers });
  }

  WidgetConfigByDashConfig(id: any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/widgetconfigbydashconfig/${id}`, { headers });
  }

  updateWidget(id: number, credentials: any){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/updatewidget/${id}`, credentials, { headers })
  }

  WidgetById(id: number){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/widgetsById/${id}`, { headers });
  }

  WidgetType(type: string){
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get(`${this.apiUrl}/widgetbyType/${type}`, { headers });
  }


  // Method to fetch widget configuration by ID
  WidgetConfigByID(id: number): Observable<WidgetDetails> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.get<WidgetDetails>(`${this.apiUrl}/widgetconfigByID/${id}`, { headers });
  }

  // Method to update widget configuration
  updateWidgetConfig(id: number, widget: WidgetDetails): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
    return this.http.put(`${this.apiUrl}/updatewidgetConfig/${id}`, widget, { headers });
  }
  
    // Method to assign user to organization
    assignUserToOrganization( id_user: number, id_org: any){
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',  // Assuming you need to send JSON
        'Authorization': `Bearer ${token}`
      });
    
      // The second parameter is the request body. If you don't have a body to send, you can send an empty object.
      return this.http.put(`${this.apiUrl}/assignUserToOrg/${id_user}/${id_org}`, {}, { headers: headers });
    }

    getOrgForUser(id: number){
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.apiUrl}/usersOrg/${id}`, { headers });
    }

    getDashConfigByUser(id: any){
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',  // Assuming you need to send JSON
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.apiUrl}/get_dashByUser/${id}`, { headers: headers });
    }

    createDashConfig(id: number){
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',  // Assuming you need to send JSON
        'Authorization': `Bearer ${token}`
      });
      return this.http.post(`${this.apiUrl}/create_dash/${id}`, {}, { headers: headers });
    }

    updateDashConfig(id_dash: number, id_org: any, id_org_type: any){
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',  // Assuming you need to send JSON
        'Authorization': `Bearer ${token}`
      });
      return this.http.put(`${this.apiUrl}/update_dash/${id_dash}/${id_org}/${id_org_type}`, {}, { headers: headers });
    }

    getUserByUsername(username: any){
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',  // Assuming you need to send JSON
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.apiUrl}/userByUsername/${username}`, { headers: headers });
    }

    getOrgByUser(id: any){
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',  // Assuming you need to send JSON
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.apiUrl}/getOrgForUser/${id}`, { headers: headers });
    }

    getWidgetByOrg(id: any){
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',  // Assuming you need to send JSON
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.apiUrl}/widgetconfigByOrgID/${id}`, { headers: headers });
    }

    getDefaultWidgetByOrg(id: any){
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',  // Assuming you need to send JSON
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.apiUrl}/widgetconfigDefault/${id}`, { headers: headers });
    }

    getDashWidgetByDashConfig(id: any){
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',  // Assuming you need to send JSON
        'Authorization': `Bearer ${token}`
      });
      return this.http.get(`${this.apiUrl}/dashwidget/${id}`, { headers: headers });
    }

    createWidget(credentials: any){
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',  // Assuming you need to send JSON
        'Authorization': `Bearer ${token}`
      });
      return this.http.post(`${this.apiUrl}/addwidgetbyconfig`,credentials, { headers: headers });
    }
  

}
