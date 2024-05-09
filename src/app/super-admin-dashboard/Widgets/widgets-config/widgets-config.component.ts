import { Component, OnInit, ViewChild  } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { FormGroup, FormControl, FormBuilder, Validators  } from '@angular/forms';
@Component({
  selector: 'app-widgets-config',
  templateUrl: './widgets-config.component.html',
  styleUrls: ['./widgets-config.component.css']
})
export class WidgetsConfigComponent implements OnInit {

  ConfigForm!: FormGroup;
  widgets: any[] = []; 
  selected: any; 
  color: string = '';

  constructor( private apiService: ApiService, private fb: FormBuilder) {

  }

 

  panelOpenState = false;

  ngOnInit(): void {

    this.apiService.WidgetType('Fournisseur').subscribe((response: any) =>{
      this.widgets = response;
    }, (error :any) =>{
      alert('Error: ' + error.message);
    })

    this.ConfigForm = this.fb.group({
      name_fr: "",
      name_eng: ""
    });

  }
}
