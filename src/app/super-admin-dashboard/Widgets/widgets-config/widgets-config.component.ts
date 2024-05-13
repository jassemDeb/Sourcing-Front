import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { FormGroup, FormBuilder, FormControl, AbstractControl } from '@angular/forms';
import { MatExpansionPanel } from '@angular/material/expansion';
import { MatSelect } from '@angular/material/select';



@Component({
  selector: 'app-widgets-config',
  templateUrl: './widgets-config.component.html',
  styleUrls: ['./widgets-config.component.css']
})
export class WidgetsConfigComponent implements OnInit {

  ConfigForm!: FormGroup;
  widgets: any[] = [];
  selected: any;
  color1: string ='';
  widgetWidth: string = '300px'; // Default width
  widgetHeight: string = '200px'; // Default height

  showColorPanel: boolean = true;

  cardBackgroundColor: string = 'lightblue';

 

  constructor(private apiService: ApiService, private fb: FormBuilder) { }

  toggleColorPanel(): void {
    this.showColorPanel = !this.showColorPanel;
  }

  onColorChange(event: any): void {
    console.log('Color changed:', event);
    this.color1 = event.target.value; 
  }

  resetColor() {
    this.color1 = ''; 
  }
  
  changeWidth(newWidth: string) {
    this.widgetWidth = newWidth;
    if (newWidth && newWidth.trim() !== '') {
      this.widgetWidth = newWidth.trim() + 'px';
    } else {
      this.widgetWidth = '200px'; 
    }
  }
  
  changeHeight(newHeight: string) {
    if (newHeight && newHeight.trim() !== '') {
      this.widgetHeight = newHeight.trim() + 'px';
    } else {
      this.widgetHeight = '200px'; 
    }
  }
  
  
  
  

  ngOnInit(): void {
    this.apiService.WidgetType('Fournisseur').subscribe(
      (response: any) => {
        this.widgets = response;
      },
      (error: any) => {
        alert('Error: ' + error.message);
      }
    );
    

    this.ConfigForm = this.fb.group({
      name_fr: '',
      name_eng: '',
      wid_style: '',
      wid_width: '',
      wid_height: '',
      wid_rank: ''
    });

  }

  formGroupToJson(): string {
    const formValues = this.ConfigForm.value;
    return JSON.stringify(formValues);
  }

  onWidgetSelectionChange() {
    if (this.selected) {
        console.log(this.selected);
        this.ConfigForm.reset();
       
        this.apiService.WidgetConfigByID(this.selected).subscribe(
            (response: any) => {
                console.log(response); 
                this.ConfigForm.patchValue({
                    name_fr: response.name_fr,
                    name_eng: response.name_eng,
                    wid_style: this.colorStringToHex(response.wid_style),
                    wid_width: response.wid_width,
                    wid_height: response.wid_height,
                    wid_rank: response.wid_rank
                });
                this.color1 = this.colorStringToHex(response.wid_style);
                this.changeHeight(response.wid_height);
                this.changeWidth(response.wid_width);
            },
            (error: any) => {
                alert('Error: ' + error.message);
            }
        );
    }
}


  colorStringToHex(colorString: string): string {
    colorString = colorString.trim().toLowerCase();
    
    if (colorString.startsWith("#")) {
        return colorString;
    }
    
    if (colorString.startsWith("rgb")) {
        const rgbValues = colorString.match(/\d+/g)?.map(Number) || [0, 0, 0];
        
        const hexValue = ((1 << 24) + (rgbValues[0] << 16) + (rgbValues[1] << 8) + rgbValues[2]).toString(16).slice(1);
        
        return `#${hexValue}`;
    }
    return "#000000";
}



submit() {
  const formDataAsJson = JSON.parse(this.formGroupToJson());
  
  if (typeof formDataAsJson === 'object' && 'wid_style' in formDataAsJson) {
    formDataAsJson.wid_style = this.color1;
    
    console.log(this.selected);
    console.log(formDataAsJson);
    
    if (!this.ConfigForm.valid) {
      alert('You must complete all the fields');
    } else {
      this.apiService.updateWidgetConfig(this.selected, formDataAsJson).subscribe((response: any) => {
        if (response.message == "Widget updated") {
          alert("Widget updated successfully");
          
        } else {
          alert(response.message);
        }
        this.reloadData();
      },
      (error: any) => {
        alert('Error: ' + error.message);
      });
    }
  } else {
    console.error('Invalid form data');
  }
}
reloadData() {
  this.apiService.WidgetConfigByID(this.selected).subscribe(
    (response: any) => {
      console.log(response); 
      this.ConfigForm.patchValue({
        name_fr: response.name_fr,
        name_eng: response.name_eng,
        wid_style: this.colorStringToHex(response.wid_style),
        wid_width: response.wid_width,
        wid_height: response.wid_height,
        wid_rank: response.wid_rank
      });
      this.color1 = this.colorStringToHex(response.wid_style);
      this.changeHeight(response.wid_height);
      this.changeWidth(response.wid_width);
    },
    (error: any) => {
      alert('Error: ' + error.message);
    }
  );
}

closePanelAndResetSelect(panel: MatExpansionPanel) {
  panel.close();  
  this.selected = null;
}


  
}
