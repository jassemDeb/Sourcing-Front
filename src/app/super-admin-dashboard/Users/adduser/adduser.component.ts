import { Component , ViewEncapsulation, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../api.service';
import { FormGroup, FormControl, FormBuilder, Validators  } from '@angular/forms';
import { ToastService } from '../../../toast.service';


@Component({
  selector: 'app-adduser',
  templateUrl: './adduser.component.html',
  styleUrls: ['./adduser.component.css'],
  encapsulation: ViewEncapsulation.Emulated
})
export class AdduserComponent implements OnInit {
  RegisterForm!: FormGroup;
  emailRegx = /^(([^<>+()\[\]\\.,;:\s@"-#$%&=]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,3}))$/;

  constructor(
    private apiService: ApiService, private formBuilder: FormBuilder ,private router: Router,private toastService: ToastService
  ) { }

  selected= ''; 
  selectedB= false; 
  ngOnInit() {
    this.RegisterForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.pattern(this.emailRegx)]],
      password: [null, Validators.required],
      fullname: [null, Validators.required],
      username: [null, Validators.required],
      roles: [[]],
      isAdmin: [false]
    });
  }

  formGroupToJson(): string {
    const formValues = this.RegisterForm.value;
    return JSON.stringify(formValues);
  }


  submit() {
    const isAdminBoolean = JSON.parse(this.RegisterForm.get('isAdmin')?.value);
    this.RegisterForm.get('isAdmin')?.setValue(isAdminBoolean);
    const rolesArray = this.selected.split(','); 
    this.RegisterForm.get('roles')?.setValue(rolesArray);
    const formDataAsJson = this.formGroupToJson();
    if (!this.RegisterForm.valid) {
      alert('You must complete all the fields')
    } else {
      this.apiService.register(formDataAsJson).subscribe((response:any)=>{
        if(response.message=="Registered successfully"){
          this.apiService.createDashConfig(response.userId).subscribe((response:any)=>{
            this.showSuccessToast()
            console.log(formDataAsJson);
          }, (error :any)=>{
            console.log('Error: ' + error.message);
          })
          
  
        } else {
          alert(response.message);
        }
      },
      (error: any) => {
        alert('Error: ' + error.message);
      }
      );
    }
    
  }


  reloadPage(event: MouseEvent) : void {
    window.location.reload();
  }
  showSuccessToast() {
    this.toastService.showSuccess('success!');
  }

  showErrorToast() {
    this.toastService.showError('This is an error message!');
  }

}
