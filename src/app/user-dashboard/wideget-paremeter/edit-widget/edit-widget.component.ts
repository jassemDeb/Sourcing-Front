import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
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
          wid_style: style
        });
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
    this.dataPoints.push(this.fb.group({
      x: [null, Validators.required],
      y: [null, Validators.required]
    }));
  }

  removeDataPoint(index: number): void {
    this.dataPoints.removeAt(index);
  }

  saveWidgetConfig(): void {
    if (!this.ConfigForm.valid) {
      alert('You must complete all the fields');
      return;
    }

    const formData = this.ConfigForm.value;
    const wid_style = formData.wid_style.chartOptions;

    const dataPointsTransformed = wid_style.dataPoints.map((dp: DataPoint) => {
      return [Number(dp.x), Number(dp.y)];
    });

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
      }
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

    this.apiService.updateWidgetConfig(this.widgetId, formDataWithUpdatedStyle).subscribe({
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
  }

  goBack(): void {
    this.router.navigate(['user/widget_parameter']);
  }
}
