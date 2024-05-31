import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-edit-widget',
  templateUrl: './edit-widget.component.html',
  styleUrls: ['./edit-widget.component.css']
})
export class EditWidgetComponent implements OnInit {
  widgetId: any;
  ConfigForm: FormGroup;
  selectedWidgetType: string = '';

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
        textSize: ['12px'],
        indicatorPercentage: [''],
        listItems: this.fb.array([]),
        chartOptions: this.fb.group({
          chartType: ['line'],
          title: [''],
          xAxisTitle: [''],
          yAxisTitle: [''],
          legendEnabled: [false],
          series: this.fb.array([])
        })
      })
    });
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

  loadWidgetDash(id : any): void {
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
        const style = data.wid_style.reduce((acc: any, curr: any) => ({...acc, ...curr}), {});
        this.ConfigForm.patchValue({
          name_fr: data.name_fr,
          name_eng: data.name_eng,
          wid_width: data.wid_width,
          wid_height: data.wid_height,
          wid_rank: data.wid_rank,
          wid_style: style
        });
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

  get series(): FormArray {
    return this.ConfigForm.get('wid_style.chartOptions.series') as FormArray;
  }

  addListItem(name: string = ''): void {
    this.listItems.push(this.fb.group({ name: [name, Validators.required] }));
  }

  addSeries(name: string = '', data: any[] = []): void {
    this.series.push(this.fb.group({
      name: [name, Validators.required],
      data: [data]
    }));
  }

  saveWidgetConfig(): void {
    if (!this.ConfigForm.valid) {
      alert('You must complete all the fields');
      return;
    }
    const formData = this.ConfigForm.value;
    const widStyle = formData.wid_style;

    const widStyleArray = [
      { backgroundColor: widStyle.backgroundColor || '' },
      { textColor: widStyle.textColor || '' },
      { textFont: widStyle.textFont || '' },
      { textSize: widStyle.textSize || '' },
      { indicatorPercentage: widStyle.indicatorPercentage || '' },
      ...widStyle.listItems.map((item: { name: string }) => ({ listItemName: item.name })),
      ...widStyle.chartOptions.series.map((serie: { name: string, data: any[] }) => ({
        chartType: widStyle.chartOptions.chartType,
        seriesName: serie.name,
        seriesData: serie.data,
        chartTitle: widStyle.chartOptions.title,
        xAxisTitle: widStyle.chartOptions.xAxisTitle,
        yAxisTitle: widStyle.chartOptions.yAxisTitle,
        legendEnabled: widStyle.chartOptions.legendEnabled
      }))
    ];

    const formattedWidth = formData.wid_width && !formData.wid_width.endsWith('px') ? `${formData.wid_width}px` : formData.wid_width || '';
    const formattedHeight = formData.wid_height && !formData.wid_height.endsWith('px') ? `${formData.wid_height}px` : formData.wid_height || '';

    const formDataWithWidStyle = {
      ...formData,
      wid_style: widStyleArray,
      wid_width: formattedWidth,
      wid_height: formattedHeight
    };
    console.log('formDataWithWidStyle:', formDataWithWidStyle);
    this.apiService.updateWidgetConfig(this.widgetId, formDataWithWidStyle).subscribe({
      next: (response: any) => {
        if (response.message === "Widget configuration updated") {
          alert("Widget updated successfully");
        } else {
          alert(response.message);
        }
      },
      error: (error: any) => {
        console.error('Error updating widget:', error);
        alert('Error: ' + error.message);
      }
    });
    // Uncomment the following line to enable API integration
    // this.apiService.updateWidgetData(formData).subscribe(
    //   response => console.log('Widget updated successfully:', response),
    //   error => console.error('Error updating widget:', error)
    // );
  }

  goBack(): void {
    this.router.navigate(['user/widget_paremeter']); // Adjust the route as necessary
  }
}
