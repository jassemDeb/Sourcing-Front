import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'src/app/api.service';
import { ToastService } from '../../../../toast.service';

@Component({
  selector: 'app-editwidget',
  templateUrl: './editwidget.component.html',
  styleUrls: ['./editwidget.component.css']
})
export class EditwidgetComponent implements OnInit {
  WidgetForm: FormGroup;

  constructor(private toastService: ToastService,
    private _fb: FormBuilder, 
    private apiService: ApiService, 
    private _dialogRef: MatDialogRef<EditwidgetComponent>,
    @Inject(MAT_DIALOG_DATA) private data: any
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
  widgetconfig: any;
  getWidgetsconfig(){
    this.apiService.WidgetConfig(this.data.id).subscribe((response : any) =>{
      if(response){
        this.widgetconfig = response;
        console.log(this.widgetconfig );

        this.WidgetForm.patchValue({
          typeorg: this.data.typeorg,
          typetrans: this.data.typetrans,
          typewid: this.data.typewid,
          wid_visi: this.data.wid_visi,
          name_fr: this.widgetconfig.name_fr,
          name_eng: this.widgetconfig.name_eng,
          desc_fr: this.data.desc_fr,
          desc_eng: this.data.desc_eng,
          wid_url: this.data.wid_url
        });

      } else (error: any) => {
        alert('Error: ' + error.message);
      }
    })
  }

  ngOnInit(): void {
    this.getWidgetsconfig();
    
   
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
      this.apiService.updateWidget(this.data.id,formDataAsJson ).subscribe((response:any)=>{
        if(response.message=="Widget updated"){
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
