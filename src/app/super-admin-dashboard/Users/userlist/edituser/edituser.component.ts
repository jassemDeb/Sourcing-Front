import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.css']
})
export class EdituserComponent implements OnInit {

  EditForm: FormGroup;

  constructor(
    private _fb: FormBuilder, 
    private apiService: ApiService, 
    private _dialogRef: MatDialogRef<EdituserComponent>, 
    @Inject(MAT_DIALOG_DATA) private data: any){
    this.EditForm = this._fb.group({
      email: "",
      password: "",
      fullname: "",
      username: "",
      roles: "",
      isAdmin: [false],
      createdAt: "",
      updatedAt: ""
    });
  }

  selected= '';

  ngOnInit(): void {
    const firstRole = this.data.roles && this.data.roles.length > 0 ? this.data.roles[0] : null;
    const isAdminDisplayValue = this.data.isAdmin ? 'true' : 'false';
    this.EditForm.patchValue({
      email: this.data.email,
      fullname: this.data.fullname,
      username: this.data.username,
      roles: firstRole,
      isAdmin: isAdminDisplayValue,
      createdAt: this.data.created_at,
      updatedAt: this.data.updated_at
    });
    console.log(this.data)
  }

  formGroupToJson(): string {
    const formValues = this.EditForm.value;
    return JSON.stringify(formValues);
  }
  onFormSubmit() {
    const isAdminBoolean = JSON.parse(this.EditForm.get('isAdmin')?.value);
    this.EditForm.get('isAdmin')?.setValue(isAdminBoolean);
    if(this.selected==""){
      this.selected = this.data.roles[0];
    }
    const rolesArray = this.selected.split(','); 
    this.EditForm.get('roles')?.setValue(rolesArray);
    const formDataAsJson = this.formGroupToJson();
    console.log(formDataAsJson);
    if (this.EditForm.valid) {
      if (this.data && this.data.id) { // Ensure data and ID are available
        this.apiService.updateUser(this.data.id, formDataAsJson)
          .subscribe(
            (response: any) => {
              if (response.status && response.status === true && response.message === 'User updated successfully') {
                alert('User updated successfully');
              } else {
                alert('Error: User update failed');
              }
            },
            (error: any) => {
              console.error('API Error:', error);
              alert('Error: ' + error.statusText); // Display a generic error message
            }
          );
      } else {
        alert('Error: User data or ID is missing');
      }
    } else {
      alert('Error: Form is invalid');
    }
  }
  
}
