
import { Component, ViewEncapsulation, OnDestroy  } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css'],
  encapsulation: ViewEncapsulation.None 
})
export class LoginPageComponent implements OnDestroy {

   

  constructor(private apiService: ApiService, private router: Router) {}
  login_Object: any = {
    "email" : "",
    "password" : "",
  };
  check : any

  onLogin(){
    this.apiService.login(this.login_Object).subscribe((response:any)=>{
      if(response.message=="Success"){
        alert(response.message);
        this.check  = {
          "username" : response.username,
          "password" : this.login_Object.password,
        };

        this.apiService.login_check(this.check).subscribe((response:any)=>{
          if (response.token){
            localStorage.setItem('token', response.token);
          }
        });

        if (response.role.includes('SuperAdmin')) {
            this.router.navigateByUrl('/sasp');
        } else if (response.role.includes('User')) {
            this.router.navigateByUrl('/user');
        } else {
            this.router.navigateByUrl('/dashboard');
        }

        

      } else {
        alert(response.message);
      }
    },
    (error: any) => {
      alert('Error: ' + error.message);
    }
    );
  }
  ngOnDestroy() {
    // Clear the background image (remove CSS class or reset styles)
    document.body.style.backgroundImage = 'none';
  }
  

}
