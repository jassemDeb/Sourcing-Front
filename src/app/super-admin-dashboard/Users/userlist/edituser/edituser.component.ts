import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/api.service';
import { ToastService } from '../../../../toast.service';

@Component({
  selector: 'app-edituser',
  templateUrl: './edituser.component.html',
  styleUrls: ['./edituser.component.css']
})
export class EdituserComponent implements OnInit {

  EditForm: FormGroup;
  organizations: any[] = [];
  organizationsSelected: any[] = [];
  selectedOrgId: number | null = null;
  selectedOrgTypeId: number | null = null;

  constructor(private toastService: ToastService,
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
      updatedAt: "",
      organization: ""
    });
  }

  selected= '';

  onOrgSelect(event: any): void {
    this.selectedOrgId = event.value;
    const selectedOrg = this.organizations.find(org => org.id === this.selectedOrgId);
  
    // Store the first organization type ID if available
    if (selectedOrg && selectedOrg.types && selectedOrg.types.length > 0) {
      this.selectedOrgTypeId = selectedOrg.types[0].typeId;
      console.log(this.selectedOrgId)
      console.log(this.selectedOrgTypeId)
    } else {
      this.selectedOrgTypeId = null;  
    }
  }

  loadOrganizations(): void {
    // Fetch all organizations
    this.apiService.getAllOrgsByName().subscribe(
      (response: any) => {
        this.organizations = response;
        // After loading all organizations, set the organization if one is selected
        if (this.selectedOrgId) {
          this.EditForm.patchValue({
            organization: this.selectedOrgId
          });
        }
      },
      error => console.error('Error fetching all organizations:', error)
    );

    // Fetch the specific organization assigned to the user
    this.apiService.getOrgForUser(this.data.id).subscribe(
      (response: any) => {
        if (response.status && response.data.length) {
          this.selectedOrgId = response.data[0].id; // Assume the first one is the primary one
          this.EditForm.patchValue({
            organization: this.selectedOrgId
          });
        }
      },
      error => console.error('Error fetching user organization:', error)
    );
  }

  patchForm(): void {
    this.EditForm.patchValue({
      email: this.data.email,
      fullname: this.data.fullname,
      username: this.data.username,
      roles: this.data.roles && this.data.roles.length ? this.data.roles[0] : '',
      isAdmin: this.data.isAdmin ? 'true' : 'false',
      createdAt: this.data.created_at,
      updatedAt: this.data.updated_at
    });
  }

  ngOnInit(): void {
    this.loadOrganizations();
    this.patchForm();
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
               this.apiService.assignUserToOrganization(this.data.id, this.selectedOrgId).subscribe((response: any) =>{
                this.apiService.getDashConfigByUser(this.data.id).subscribe((response:any)=>{
                  this.apiService.updateDashConfig(this.data.id, this.selectedOrgId, this.selectedOrgTypeId).subscribe((response: any)=>{
                    this.showSuccessToast();
                    
                  })
                })
                })
                
              } else {
                alert(response);
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

  showSuccessToast() {
    this.toastService.showSuccess('This is a success message!');
  }

  showErrorToast() {
    this.toastService.showError('This is an error message!');
  }
  
}
