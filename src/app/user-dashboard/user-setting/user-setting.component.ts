import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { ApiService } from 'src/app/api.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastService } from '../../toast.service';


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
}

@Component({
  selector: 'app-user-setting',
  templateUrl: './user-setting.component.html',
  styleUrls: ['./user-setting.component.css']
})
export class UserSettingComponent implements OnInit {
  username: string | undefined;
  userId: number | null = null; 
  user: User | null = null;
  EditForm: FormGroup;


  constructor(private _fb: FormBuilder, private apiService: ApiService,private toastService: ToastService) {
    this.EditForm = this._fb.group({
      email: "",
      password: "",
      fullname: "",
      username: ""
    });
  }

  ngOnInit(): void {
    const tokenPayload = this.getDecodedAccessToken();   
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
              password: '' // Initialize password as empty string
            };
            console.log('User:',  this.user);
            this.patchForm();
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

    patchForm(): void {
      this.EditForm.patchValue({
        email: this.user?.email,
        fullname: this.user?.fullname,
        username: this.user?.username
      });
    }

    formGroupToJson(): string {
      let formValues = { ...this.EditForm.value };
      formValues = {
        ...formValues, 
        roles: this.user?.roles // Modify existing property
      };
      return JSON.stringify(formValues);
    }

    onFormSubmit(){
      const formDataAsJson = this.formGroupToJson();
      console.log(formDataAsJson);
      if (this.EditForm.valid) {
        this.apiService.updateUser(this.userId! , formDataAsJson).subscribe(
          (response: any) => {
            if (response.status && response.status === true && response.message === 'User updated successfully') {
               
                  this.showSuccessToast()
                }
              else {
                  this.showErrorToast()
                }
              },
              (error: any) => {
                console.error('API Error:', error);
                alert('Error: ' + error.statusText); // Display a generic error message
              })
              
            } 
    }
 
    reloadPage(event: MouseEvent) : void {
      window.location.reload();
    }

    showSuccessToast() {
      this.toastService.showSuccess('success!');
    }
  
    showErrorToast() {
      this.toastService.showError('error!');
    }
}
