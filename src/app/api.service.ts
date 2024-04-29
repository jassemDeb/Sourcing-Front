// api.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:8000/api'; 

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

  

}
