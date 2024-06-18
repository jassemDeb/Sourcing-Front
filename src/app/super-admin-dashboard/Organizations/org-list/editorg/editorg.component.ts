import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/api.service';
import { ToastService } from '../../../../toast.service';

@Component({
  selector: 'app-editorg',
  templateUrl: './editorg.component.html',
  styleUrls: ['./editorg.component.css']
})
export class EditorgComponent implements OnInit{

  EditForm: FormGroup;

  constructor(private toastService: ToastService,
    private _fb: FormBuilder, 
    private apiService: ApiService, 
    private _dialogRef: MatDialogRef<EditorgComponent>, 
    @Inject(MAT_DIALOG_DATA) private data: any){
    this.EditForm = this._fb.group({
      name: "",
      type: "",
      enabled: [false],
      createdAt: ""
    });
  }

  ngOnInit(): void {
    const EnabledDisplayValue = this.data.enabled ? 'true' : 'false';
    this.EditForm.patchValue({
      name: this.data.name,
      type: this.data.type,
      enabled: EnabledDisplayValue,
      createdAt: this.data.created_at
    });
    console.log(this.data)
  }

  formGroupToJson(): string {
    const formValues = this.EditForm.value;
    return JSON.stringify(formValues);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Ensure 2-digit month
    const day = date.getDate().toString().padStart(2, '0'); // Ensure 2-digit day
    return `${year}-${month}-${day}`;
  }

  onFormSubmit() {
    const EnabledBoolean = JSON.parse(this.EditForm.get('enabled')?.value);
    this.EditForm.get('enabled')?.setValue(EnabledBoolean);

    const createdAtValue = this.EditForm.get('createdAt')?.value;
    const createdAtDate = new Date(createdAtValue);

    if (!isNaN(createdAtDate.getTime())) {
      const createdAtString = this.formatDate(createdAtDate);
      this.EditForm.get('createdAt')?.setValue(createdAtString);

      const formDataAsJson = JSON.stringify(this.EditForm.value);
      if (this.EditForm.valid) {
        if (this.data && this.data.id) {
          const payload = { ...JSON.parse(formDataAsJson), created_at: createdAtString };

          this.apiService.updateOrg(this.data.id, JSON.stringify(payload))
            .subscribe(
              (response: any) => {
                if (response.status && response.status === true && response.message === 'Organization and associated entity updated successfully') {
                  this.showSuccessToast();
                } else {
                  this.showErrorToast();
                }
              },
              (error: any) => {
                console.error('API Error:', error);
                alert('Error: ' + error.statusText);
              }
            );
        } else {
          alert('Error: Organization data or ID is missing');
        }
      } else {
        alert('Error: Form is invalid');
      }
    } else {
      alert('Error: Invalid date format for createdAt');
    }
  }

  showSuccessToast() {
    this.toastService.showSuccess('This is a success message!');
  }

  showErrorToast() {
    this.toastService.showError('This is an error message!');
  }

}
