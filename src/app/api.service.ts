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

  login_check(credentials: any){
    return this.http.post(`${this.apiUrl}/login_check`, credentials);
  }
}
