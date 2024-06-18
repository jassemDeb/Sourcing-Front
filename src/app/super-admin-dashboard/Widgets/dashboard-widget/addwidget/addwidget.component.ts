import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/api.service';
import { ToastService } from '../../../../toast.service';

@Component({
  selector: 'app-addwidget',
  templateUrl: './addwidget.component.html',
  styleUrls: ['./addwidget.component.css']
})
export class AddwidgetComponent {

  WidgetForm: FormGroup;

  constructor(private toastService: ToastService,
    private _fb: FormBuilder, 
    private apiService: ApiService, 
    private _dialogRef: MatDialogRef<AddwidgetComponent>
  ){
    this.WidgetForm = this._fb.group({
      typeorg: "",
      typetrans: "",
      typewid: "",
      wid_visi: "",
      name_fr: "",
      name_eng: "",
      desc_fr: "",
      desc_eng: "",
      wid_url: ""
    });
  }

  formGroupToJson(): string {
    const formValues = this.WidgetForm.value;
    return JSON.stringify(formValues);
  }

  submit(){
    const formDataAsJson = this.formGroupToJson();
    if (!this.WidgetForm.valid) {
      alert('You must complete all the fields')
    } else {
      this.apiService.addwidget(formDataAsJson).subscribe((response:any)=>{
        if(response.message=="Widget added"){
          this.showSuccessToast()
  
        } else {
          this.showErrorToast()
        }
      },
      (error: any) => {
        alert('Error: ' + error.message);
      }
      );
    }

  }
  
  showSuccessToast() {
    this.toastService.showSuccess('success!');
  }

  showErrorToast() {
    this.toastService.showError('error!');
  }
}
