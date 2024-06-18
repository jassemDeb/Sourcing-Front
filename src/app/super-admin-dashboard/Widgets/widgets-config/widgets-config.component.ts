import { Component, OnInit , ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import * as Highcharts from 'highcharts';
import { MatExpansionPanel } from '@angular/material/expansion';
import { WidgetDetails } from 'src/app/models/widget-details.model';  // Ensure the path is correct
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { NotifierService } from 'angular-notifier';
import { ToastService } from '../../../toast.service';

@Component({
  selector: 'app-widgets-config',
  templateUrl: './widgets-config.component.html',
  styleUrls: ['./widgets-config.component.css']
})
export class WidgetsConfigComponent implements OnInit {
  ConfigForm!: FormGroup;
  private readonly notifier: NotifierService;
  widgets: { [key: string]: any[] } = {
    Fournisseur: [],
    Acheteur: [],
    Prestaire: []
  };
  selected: any;
  selectedWidgetType: string = '';
  widgetWidth: string = '300px';  // Default width
  widgetHeight: string = '200px';  // Default height
  backgroundColor: string = '';
  textColor: string = '';
  showBackgroundColorPanel: boolean = false;
  showTextColorPanel: boolean = false;

  tableData = new MatTableDataSource([
    { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
    { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
    { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
    // Add more data as needed
  ]);
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  @ViewChild(MatSort) sort!: MatSort;

  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor: string = 'chart';
  chartOptions: Highcharts.Options = {
    title: { text: 'My Chart' },
    series: [{ type: 'line', data: [1, 2, 3] }]
  };
  chartCallback: Highcharts.ChartCallbackFunction = function (chart) { };
  updateFlag: boolean = false;
  oneToOneFlag: boolean = true;
  runOutsideAngular: boolean = false;

  listItems: string[] = ['Item 1', 'Item 2', 'Item 3'];

  

  constructor(private cd: ChangeDetectorRef,notifierService: NotifierService,private apiService: ApiService, private fb: FormBuilder,private toastService: ToastService) {
    this.notifier = notifierService;
   }

  ngOnInit(): void {
    this.loadWidgets();
    this.ConfigForm = this.fb.group({
      name_fr: '',
      name_eng: '',
      backgroundColor: '',
      textColor: '',
      textFont: '',
      textSize: '',
      wid_width: '',
      wid_height: '',
      wid_rank: ''
    });
    this.tableData.sort = this.sort;
  }

  updateChartOptions(): void {
    this.chartOptions = {
      ...this.chartOptions,
      title: {
        ...this.chartOptions.title,
        style: {
          color: this.ConfigForm.get('textColor')?.value || '#333',
          fontSize: this.ConfigForm.get('textSize')?.value || '12px',
          fontFamily: this.ConfigForm.get('textFont')?.value || 'Arial'
        }
      },
      xAxis: {
        labels: {
          style: this.getTextStyles()
        }
      },
      yAxis: {
        labels: {
          style: this.getTextStyles()
        }
      }
    };
  
    // If your chart component uses a change detection method or input, ensure you trigger it here
    this.updateFlag = true; // Example flag to re-render the chart
  }
  

  loadWidgets(): void {
    this.loadWidgetType('Fournisseur', (response: any) => this.widgets['Fournisseur'] = response);
    this.loadWidgetType('Acheteur', (response: any) => this.widgets['Acheteur'] = response);
    this.loadWidgetType('Prestataire', (response: any) => this.widgets['Prestataire'] = response);
  }

  loadWidgetType(type: string, callback: (response: any) => void): void {
    this.apiService.WidgetType(type).subscribe(
      response => callback(response),
      error => console.error(`Error loading ${type} widgets:`, error)
    );
  }

  getWidgets(type: string): any[] {
    return this.widgets[type] || [];
  }

  toggleBackgroundColorPanel(): void {
    this.showBackgroundColorPanel = !this.showBackgroundColorPanel;
  }

  onBackgroundColorChange(event: any): void {
    this.backgroundColor = event;
    this.ConfigForm.get('backgroundColor')?.setValue(event);
  }

  toggleTextColorPanel(): void {
    this.showTextColorPanel = !this.showTextColorPanel;
  }

  onTextColorChange(event: any): void {
    this.textColor = event;
    this.ConfigForm.get('textColor')?.setValue(event);
  }

  updateWidgetStyle(): void {
    const backgroundColor = this.ConfigForm.get('backgroundColor')?.value || "";
    const textColor = this.ConfigForm.get('textColor')?.value || "";
    const textFont = this.ConfigForm.get('textFont')?.value || "";
    const textSize = this.ConfigForm.get('textSize')?.value || "";
  
    const widStyle = [{ backgroundColor }, { textColor }, { textFont }, { textSize }];
    this.ConfigForm.patchValue({ wid_style: widStyle });
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

getTextStyles(): any {
  return {
    'color': this.ConfigForm.get('textColor')?.value || '#000',  // Default to black if undefined
    'font-family': this.ConfigForm.get('textFont')?.value || 'Arial',  // Default font
    'font-size': this.ConfigForm.get('textSize')?.value || 'medium'  // Default size
  };
}


  

onWidgetSelectionChange(widgets: any[]): void {
  const selectedWidget = widgets.find(widget => widget.id === this.selected);
  if (selectedWidget) {
    this.selectedWidgetType = selectedWidget.widget_type;
    this.apiService.WidgetConfigByID(this.selected!).subscribe(
      (response: any) => {
        console.log(response)
        const backgroundColor = response.wid_style?.find((style: any) => style.backgroundColor)?.backgroundColor || '';
        const textColor = response.wid_style?.find((style: any) => style.textColor)?.textColor || '';
        const textFont = response.wid_style?.find((style: any) => style.textFont)?.textFont || '';
        const textSize = response.wid_style?.find((style: any) => style.textSize)?.textSize || '';

        // Set the form values directly
        this.ConfigForm.patchValue({
          name_fr: response.name_fr,
          name_eng: response.name_eng,
          backgroundColor: backgroundColor,
          textColor: textColor,
          textFont: textFont,
          textSize: textSize,
          wid_width: response.wid_width.replace('px', ''), // remove 'px' for consistency
          wid_height: response.wid_height.replace('px', ''),
          wid_rank: response.wid_rank
        });

        // Manually update the color values in the color picker inputs
        this.backgroundColor = backgroundColor;
        this.textColor = textColor;
        this.widgetWidth = response.wid_width || '300px';  // maintaining the full value for internal use
        this.widgetHeight = response.wid_height || '200px';  // maintaining the full value for internal use
        this.updateChartOptions();
      },
      error => console.error('Error fetching widget details:', error)
    );
  }
}




  


  formGroupToJson(): string {
    const formValues = this.ConfigForm.value;
    return JSON.stringify(formValues);
  }

  submit() {
    const formDataAsJson = JSON.parse(this.formGroupToJson());
    console.log('formDataAsJson:', formDataAsJson);
    
    if (typeof formDataAsJson === 'object') {
      const widStyleArray = [
        { backgroundColor: this.backgroundColor || '' },
        { textColor: this.textColor || '' },
        { textFont: formDataAsJson.textFont || '' },
        { textSize: formDataAsJson.textSize || '' }
      ];

      // Ensure 'px' is appended only if not already there
      const formattedWidth = formDataAsJson.wid_width && !formDataAsJson.wid_width.endsWith('px') ? `${formDataAsJson.wid_width}px` : formDataAsJson.wid_width || '';
      const formattedHeight = formDataAsJson.wid_height && !formDataAsJson.wid_height.endsWith('px') ? `${formDataAsJson.wid_height}px` : formDataAsJson.wid_height || '';

      const formDataWithWidStyle = {
        ...formDataAsJson,
        wid_style: widStyleArray,
        wid_width: formattedWidth, // update width
        wid_height: formattedHeight // update height
      };
  
      console.log('formDataWithWidStyle:', formDataWithWidStyle);
  
      if (!this.ConfigForm.valid) {
        alert('You must complete all the fields');
      } else {
        this.apiService.updateWidgetConfig(this.selected, formDataWithWidStyle).subscribe((response: any) => {
          if (response.message) {
            this.showSuccessToast()

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


  
  
  showSuccessToast() {
    this.toastService.showSuccess('success!');
  }

  showErrorToast() {
    this.toastService.showError('error!');
  }
  
  
  
  
  
  
  reloadData(): void {
    if (this.selected !== null) {
      this.apiService.WidgetConfigByID(this.selected).subscribe(
        (response: any) => {  // Assuming response structure is correctly mapped to any
          // Extract and set style attributes
          const backgroundColor = response.wid_style?.find((style: any) => style.backgroundColor)?.backgroundColor || '';
          const textColor = response.wid_style?.find((style: any) => style.textColor)?.textColor || '';
          const textFont = response.wid_style?.find((style: any) => style.textFont)?.textFont || '';
          const textSize = response.wid_style?.find((style: any) => style.textSize)?.textSize || '';
  
          // Set the form values directly
          this.ConfigForm.patchValue({
            name_fr: response.name_fr,
            name_eng: response.name_eng,
            backgroundColor: backgroundColor,
            textColor: textColor,
            textFont: textFont,
            textSize: textSize,
            wid_width: response.wid_width.replace('px', ''),  // Ensure 'px' is removed for form consistency
            wid_height: response.wid_height.replace('px', ''),
            wid_rank: response.wid_rank
          });
  
          // Update UI elements directly
          this.backgroundColor = backgroundColor;
          this.textColor = textColor;
  
          // Update size display with 'px' suffix for UI consistency
          this.widgetWidth = response.wid_width || '300px';
          this.widgetHeight = response.wid_height || '200px';
          this.updateChartOptions();
        },
        error => {
          console.error('Error fetching widget details:', error);
          alert('Error: ' + error.message);
        }
      );
    }
  }
  

  closePanelAndResetSelect(panel: MatExpansionPanel): void {
    console.log("Attempting to close panel and reset selection");
    panel.close();
    this.selected = null;
    this.ConfigForm.reset();
    console.log("Panel closed, selection cleared, form reset");
  }
  
  
  reloadPage(event: MouseEvent) : void {
    window.location.reload();
  }
  
}
