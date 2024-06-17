import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators ,FormControl } from '@angular/forms';
import { ApiService } from 'src/app/api.service';

interface DataPoint {
  x: number | null;
  y: number | null;
}

@Component({
  selector: 'app-edit-widget',
  templateUrl: './edit-widget.component.html',
  styleUrls: ['./edit-widget.component.css']
})
export class EditWidgetComponent implements OnInit {
  widgetId: any;
  ConfigForm: FormGroup;
  selectedWidgetType: string = '';
  showBackgroundColorPanel: boolean = false;
  backgroundColor: string = '';
  textColor: string = '';
  showTextColorPanel: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router
  ) {
    this.ConfigForm = this.fb.group({
      name_fr: [''],
      name_eng: [''],
      wid_width: [''],
      wid_height: [''],
      wid_rank: [''],
      wid_style: this.fb.group({
        backgroundColor: [''],
        textColor: [''],
        textFont: ['Arial'],
        textSize: ['medium'],
        indicatorPercentage: [''],
        tableData: this.fb.array([]),
        listItems: this.fb.array([]),
        chartOptions: this.fb.group({
          chartType: ['line', Validators.required],
          title: [''],
          xAxisTitle: [''],
          yAxisTitle: [''],
          dataPoints: this.fb.array([])
        })
       
      })
    });
  }
  get tableData(): FormArray {
    return this.ConfigForm.get('wid_style.tableData') as FormArray;
  }

  getColumnData(columnIndex: number): FormArray {
    const column = this.tableData.at(columnIndex) as FormGroup;
    return column.get('data') as FormArray;
  }

  addColumn(event: Event): void {
    event.preventDefault();
    const columnGroup = this.fb.group({
      name: ['', Validators.required],
      data: this.fb.array([], Validators.required)
    });
    this.tableData.push(columnGroup);
    console.log('Column added:', this.ConfigForm.value);
  }
  
  addData(columnIndex: number, event: Event): void {
    event.preventDefault();
    const data = this.getColumnData(columnIndex);
    data.push(this.fb.control('', Validators.required));
    console.log('Data added to column', columnIndex, ':', this.ConfigForm.value);
  }
  
  

  removeData(columnIndex: number, dataItemIndex: number): void {
    const data = this.getColumnData(columnIndex);
    data.removeAt(dataItemIndex);
  }

  removeColumn(columnIndex: number): void {
    this.tableData.removeAt(columnIndex);
  }
 
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.widgetId = params.get('id');
      if (this.widgetId) {
        this.loadWidgetData(this.widgetId);
        this.loadWidgetDash(this.widgetId);
      }
    });
  }

  loadWidgetDash(id: any): void {
    this.apiService.getDashWidgetByDashConfig(id).subscribe((response: any) => {
      console.log('API Response:', response);
      if (response && response.length > 0) {
        this.selectedWidgetType = response[0].typewid;
        console.log('Selected type:', this.selectedWidgetType);
      } else {
        console.error('No widgets found in the response or response is empty');
      }
    }, error => {
      console.error('Error fetching widget details:', error);
    });
  }

  loadWidgetData(id: any): void {
    this.apiService.WidgetConfigByID(id).subscribe((data: any) => {
      console.log("API data received:", data);
      if (data) {
        const style = data.wid_style.reduce((acc: any, curr: any) => ({ ...acc, ...curr }), {});
        this.ConfigForm.patchValue({
          name_fr: data.name_fr,
          name_eng: data.name_eng,
          wid_width: data.wid_width,
          wid_height: data.wid_height,
          wid_rank: data.wid_rank,
          wid_style: {
            backgroundColor: style.backgroundColor || '',
            textColor: style.textColor || '',
            textFont: style.textFont || 'Arial',
            textSize: style.textSize || 'medium',
            indicatorPercentage: style.indicatorPercentage || ''
          }
        });
  
        // Populate listItems
        if (style.listItems) {
          const listItems = style.listItems.map((item: any) => this.fb.group({
            name: [item.name, Validators.required]
          }));
          const listItemsFormArray = this.fb.array(listItems);
          this.ConfigForm.setControl('wid_style.listItems', listItemsFormArray);
        }
  
        // Populate tableData
        if (style.tableData) {
          const tableData = style.tableData.map((column: any) => this.fb.group({
            name: [column.name, Validators.required],
            data: this.fb.array(column.data.map((d: any) => this.fb.control(d, Validators.required)))
          }));
          const tableDataFormArray = this.fb.array(tableData);
          this.ConfigForm.setControl('wid_style.tableData', tableDataFormArray);
        }
  
        // Populate data points
        if (style.chartOptions && style.chartOptions.dataPoints) {
          const dataPoints = style.chartOptions.dataPoints.map((dp: any) => this.fb.group({
            x: [dp.x, Validators.required],
            y: [dp.y, Validators.required]
          }));
          const dataPointsFormArray = this.fb.array(dataPoints);
          this.ConfigForm.setControl('wid_style.chartOptions.dataPoints', dataPointsFormArray);
        }
      } else {
        console.error('Widget data is missing in the response');
      }
    }, error => {
      console.error('Error loading widget data:', error);
    });
  }
  
  

  get listItems(): FormArray {
    return this.ConfigForm.get('wid_style.listItems') as FormArray;
  }

  get dataPoints(): FormArray {
    return this.ConfigForm.get('wid_style.chartOptions.dataPoints') as FormArray;
  }

  addListItem(name: string = ''): void {
    this.listItems.push(this.fb.group({ name: [name, Validators.required] }));
  }

  addDataPoint(event: Event): void {
    event.preventDefault();
    const chartType = this.ConfigForm.get('wid_style.chartOptions.chartType')?.value || 'line';

    // Determine default values for x based on chart type
    let defaultXValue: number | string | null;
    if (chartType === 'line' || chartType === 'area') {
        defaultXValue = null;  // Assuming numeric x-axis (could set to 0 or another starter value)
    } else {
        defaultXValue = '';  // Assuming string x-axis for categories
    }

    this.dataPoints.push(this.fb.group({
        x: [defaultXValue, chartType === 'column' || chartType === 'bar' ? Validators.required : Validators.nullValidator],
        y: [null, Validators.required]
    }));
}



  

  removeDataPoint(index: number): void {
    this.dataPoints.removeAt(index);
  }

  
  saveWidgetConfig(): void {
    console.log(this.ConfigForm);
    if (!this.ConfigForm.valid) {
        alert('You must complete all the fields');
        return;
    }

    const formData = this.ConfigForm.value;
    
    // Handle chartOptions data
    const wid_style = formData.wid_style.chartOptions;
    const chartType = formData.wid_style.chartOptions.chartType;
    const dataPointsTransformed = formData.wid_style.chartOptions.dataPoints.map((dp: DataPoint) => {
        const xValue = chartType === 'column' || chartType === 'bar' ? dp.x?.toString() : Number(dp.x ?? 0);
        return [xValue, Number(dp.y)];
    });

    // Transform tableData for saving
    const tableDataTransformed = formData.wid_style.tableData.map((column: any) => ({
        name: column.name,
        data: column.data
    }));

    const widStyleArray = [
        { backgroundColor: formData.wid_style.backgroundColor || '' },
        { textColor: formData.wid_style.textColor || '' },
        { textFont: formData.wid_style.textFont || '' },
        { textSize: formData.wid_style.textSize || '' },
        { indicatorPercentage: parseFloat(formData.wid_style.indicatorPercentage) },
        ...formData.wid_style.listItems.map((item: { name: string }) => ({ listItemName: item.name })),
        {
            chartType: wid_style.chartType,
            seriesName: 'Data Points',
            seriesData: dataPointsTransformed,
            chartTitle: wid_style.title,
            xAxisTitle: wid_style.xAxisTitle,
            yAxisTitle: wid_style.yAxisTitle,
            legendEnabled: true
        },
        { tableData: tableDataTransformed }
    ];

    const formattedWidth = formData.wid_width && !formData.wid_width.endsWith('px') ? `${formData.wid_width}px` : formData.wid_width || '';
    const formattedHeight = formData.wid_height && !formData.wid_height.endsWith('px') ? `${formData.wid_height}px` : formData.wid_height || '';

    const formDataWithUpdatedStyle = {
        ...formData,
        wid_style: widStyleArray,
        wid_width: formattedWidth,
        wid_height: formattedHeight
    };

    console.log('formDataWithUpdatedStyle:', formDataWithUpdatedStyle);

    // First, get all widget configurations
    this.apiService.getAllWidgetsConfig().subscribe({
        next: (allWidgetsResponse: any) => {
            // Filter to find all widgets with the same 'name_fr'
            const matchingWidgets = allWidgetsResponse.filter((widget: any) => widget.name_fr === formDataWithUpdatedStyle.name_fr);
            
            // Select the second match if it exists
            const same_widget = matchingWidgets.length > 1 ? matchingWidgets[1] : null;
            console.log('Same widget:', same_widget);

            if (same_widget) {
                // Extract position from same_widget's wid_style
                const position = same_widget.wid_style.find((style: any) => 'position' in style)?.position;
                
                // Create a copy of formDataWithUpdatedStyle and add the position
                let updatedWidStyle = [...formDataWithUpdatedStyle.wid_style];
                if (position) {
                    updatedWidStyle.push({ position });
                }

                // Use this updated wid_style to update the same_widget's wid_style
                same_widget.wid_style = updatedWidStyle;

                console.log('Updated same_widget with new wid_style:', same_widget);

                // Proceed with the first update using formDataWithUpdatedStyle
                this.apiService.updateWidgetConfig(this.widgetId, formDataWithUpdatedStyle).subscribe({
                    next: (response: any) => {
                        if (response.message === "Widget configuration updated") {

                            // Proceed with the second update using same_widget
                            this.apiService.updateWidgetConfig(same_widget.id, same_widget).subscribe({
                                next: (response: any) => {
                                    if (response.message === "Widget configuration updated") {
                                      alert("Widget updated successfully");
                                    } else {
                                        alert(response.message);
                                    }
                                },
                                error: (error: any) => {
                                    console.error('Error updating same widget:', error);
                                    alert('Error: ' + error.message);
                                }
                            });
                        } else {
                            alert(response.message);
                        }
                    },
                    error: (error: any) => {
                        console.error('Error updating widget:', error);
                        alert('Error: ' + error.message);
                    }
                });
            } else {
                console.error('No second matching widget found with the same name_fr.');
                alert('No second matching widget found.');
            }
        },
        error: (error: any) => {
            console.error('Error fetching all widgets configurations:', error);
            alert('Error fetching all widgets configurations: ' + error.message);
        }
    });
}






  goBack(): void {
    this.router.navigate(['/user/widget_paremeter']);
  }

  onChartTypeChange(chartType: string): void {
    const newDataPoints = this.dataPoints.controls.map(control => {
        const xValue = control.get('x')?.value;
        const yValue = control.get('y')?.value;
        // Handle conversion of x value based on new chart type
        const newXValue = (chartType === 'column' || chartType === 'bar') ? (xValue?.toString() || '') : Number(xValue || 0);
        return this.fb.group({
            x: [newXValue, Validators.required],
            y: [yValue, Validators.required]
        });
    });

    // Reset the form array with converted data points
    this.ConfigForm.setControl('wid_style.chartOptions.dataPoints', this.fb.array(newDataPoints));
    this.ConfigForm.get('wid_style.chartOptions.chartType')?.setValue(chartType);
}

toggleBackgroundColorPanel(): void {
  this.showBackgroundColorPanel = !this.showBackgroundColorPanel;
}
toggleTextColorPanel(): void {
  this.showTextColorPanel = !this.showTextColorPanel;
}

onBackgroundColorChange(value: string): void {
  this.backgroundColor = value;
  // Update the form control directly
  this.ConfigForm.get('wid_style.backgroundColor')!.setValue(value);
}

onTextColorChange(value: string): void {
  this.textColor = value;
  // Update the form control directly
  this.ConfigForm.get('wid_style.textColor')!.setValue(value);
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


}
