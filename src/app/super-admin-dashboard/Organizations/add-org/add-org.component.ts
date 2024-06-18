import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../../api.service';
import { FormGroup, FormControl, FormBuilder, Validators  } from '@angular/forms';
import { ToastService } from '../../../toast.service';

@Component({
  selector: 'app-add-org',
  templateUrl: './add-org.component.html',
  styleUrls: ['./add-org.component.css']
})
export class AddOrgComponent implements OnInit {

  RegisterForm!: FormGroup;


  constructor(
    private apiService: ApiService, private formBuilder: FormBuilder ,private router: Router,private toastService: ToastService
  ) { }

  ngOnInit() {
    this.RegisterForm = this.formBuilder.group({
      name: [null, Validators.required],
      type: [null, Validators.required],
      created_at: [null, Validators.required],
      enabled: [false]
    });
    
  }

  formGroupToJson(): string {
    const formValues = this.RegisterForm.value;
    return JSON.stringify(formValues);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensure 2-digit month
    const day = date.getDate().toString().padStart(2, '0'); // Ensure 2-digit day
    return `${year}-${month}-${day}`;
  }



  submit() {
    debugger;
    console.log(this.RegisterForm);
    const isAdminBoolean = JSON.parse(this.RegisterForm.get('enabled')?.value);
    this.RegisterForm.get('enabled')?.setValue(isAdminBoolean);
    const createdAtDate = this.RegisterForm.get('created_at')?.value;
    const createdAtString = this.formatDate(createdAtDate);

    this.RegisterForm.get('created_at')?.setValue(createdAtString);
    const formDataAsJson = this.formGroupToJson();
    if (!this.RegisterForm.valid) {
      alert('You must complete all the fields')
    } else {
      this.apiService.addorg(formDataAsJson).subscribe((response:any)=>{
        if(response.message=="Organization added"){
          this.showSuccessToast();
          console.log(formDataAsJson);
  
        } else {
          alert(response.message);
          this.showErrorToast();
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
    this.toastService.showSuccess('Success!');
  }

  showErrorToast() {
    this.toastService.showError('Error!');
  }
}
