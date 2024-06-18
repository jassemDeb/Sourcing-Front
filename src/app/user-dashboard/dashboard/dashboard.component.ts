import { Component, OnInit } from '@angular/core';
import { CdkDragMove, CdkDragEnd   } from '@angular/cdk/drag-drop';
import { jwtDecode } from 'jwt-decode';
import { ApiService } from 'src/app/api.service';
import * as Highcharts from 'highcharts';
import { ToastService } from '../../toast.service';

interface JwtPayload {
  username: string;
  exp: number;
  iat: number;
}

interface Widget {
  id: number;
  nameFr: string;
  nameEng: string;
  widStyle: any[];
  widWidth: string;
  widHeight: string;
  widRank: string;
  widgetDetails?: WidgetDetails;
}

interface WidgetDetails {
  id: number;
  typewid: string;
  typetrans: string;
  wid_visi: string;
  is_default: boolean;
  desc_fr: string;
  desc_eng: string;
  wid_url: string;
  typeorg: string;
}

interface CreateWidgetResponse {
  message: string;
  widgetId: number;
}

interface WidgetDetailsResponse {
  data?: {
      id: number;
      typewid: string;
      typetrans: string;
      wid_visi: string;
      is_default: boolean;
      desc_fr: string;
      desc_eng: string;
      wid_url: string;
      typeorg: string;
  }
}

interface DataPoint {
  x?: number | string;
  y: number;
  name?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isEditMode: boolean = false; 
  checkedWidgets: any[] = [];
  widgets: Widget[] = [];
  defaultWidgets: Widget[] = [];
  username: string | undefined;
  userId: number | null = null;
  dashConfigId: number | null = null;
  widgetType: string | undefined;
  widgetCreated: Widget | null = null;
  Highcharts: typeof Highcharts = Highcharts;
  updateFlag = false;
  newWidgetId: number | null = null;
  widgetPositions: { [key: number]: { x: number, y: number } } = {};
  createdWidgets: Widget[] = [];

  chartCallback: Highcharts.ChartCallbackFunction = (chart) => {
    console.log('Chart rendered!', chart);
  };

  getTableDataSource(styles: any[]): any[] {
    const tableData = this.getStyleValue(styles, 'tableData');
    let parsedTableData: any[] = [];
  
    if (typeof tableData === 'string') {
      try {
        parsedTableData = JSON.parse(tableData);
      } catch (e) {
        console.error('Error parsing tableData:', e);
        return [];
      }
    } else if (Array.isArray(tableData)) {
      parsedTableData = tableData;
    } else {
      console.error('Unexpected tableData type:', typeof tableData);
      return [];
    }
  
    return this.transformTableData(parsedTableData);
  }
  

  transformTableData(tableData: any[]): any[] {
    const dataSource: any[] = [];
    if (Array.isArray(tableData) && tableData.length > 0) {
      const rowCount = Array.isArray(tableData[0].data) ? tableData[0].data.length : 0;
      for (let i = 0; i < rowCount; i++) {
        const row: any = {};
        for (const column of tableData) {
          if (column.data && Array.isArray(column.data)) {
            row[column.name] = column.data[i];
          }
        }
        dataSource.push(row);
      }
    }
    return dataSource;
  }
  

  getTableColumns(styles: any[]): { name: string }[] {
    const tableData = this.getStyleValue(styles, 'tableData');
    let parsedTableData: any[] = [];
  
    if (typeof tableData === 'string') {
      try {
        parsedTableData = JSON.parse(tableData);
      } catch (e) {
        console.error('Error parsing tableData:', e);
      }
    } else if (Array.isArray(tableData)) {
      parsedTableData = tableData;
    }
  
    const columns: { name: string }[] = [];
    for (const column of parsedTableData) {
      columns.push({ name: column.name });
    }
    return columns;
  }
  

  getTableColumnNames(styles: any[]): string[] {
    const tableData = this.getStyleValue(styles, 'tableData');
    let parsedTableData: any[] = [];
  
    if (typeof tableData === 'string') {
      try {
        parsedTableData = JSON.parse(tableData);
      } catch (e) {
        console.error('Error parsing tableData:', e);
      }
    } else if (Array.isArray(tableData)) {
      parsedTableData = tableData;
    }
  
    const columnNames: string[] = [];
    for (const column of parsedTableData) {
      columnNames.push(column.name);
    }
    return columnNames;
  }
  

  getChartOptions(widget: Widget): Highcharts.Options {
    const chartType = this.getStyleValue(widget.widStyle, 'chartType');
    const chartOptions: Highcharts.Options = {
      chart: {
        type: chartType as any
      },
      title: {
        text: this.getStyleValue(widget.widStyle, 'chartTitle')
      },
      xAxis: {
        categories: this.getAxisCategories(widget.widStyle),
        title: {
          text: this.getStyleValue(widget.widStyle, 'xAxisTitle')
        },
        tickInterval: 1
      },
      yAxis: {
        title: {
          text: this.getStyleValue(widget.widStyle, 'yAxisTitle')
        },
        tickInterval: 1
      },
      series: this.getSeriesData(widget.widStyle, chartType),
      legend: {
        enabled: true,
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'top',
        borderWidth: 1,
        backgroundColor: '#FFFFFF',
        shadow: true
      },
      credits: {
        enabled: false
      }
    };

    return chartOptions;
  }

  getSeriesData(styles: any[], chartType: string): Highcharts.SeriesOptionsType[] {
    const seriesName = this.getStyleValue(styles, 'seriesName');
    const seriesDataRaw = this.getStyleValue(styles, 'seriesData');

    const seriesData: [string | number, number][] = typeof seriesDataRaw === 'string' ? JSON.parse(seriesDataRaw) : seriesDataRaw;

    if (chartType === 'pie') {
      return [{
        type: 'pie',
        name: seriesName,
        data: seriesData.map(dp => ({ name: dp[0].toString(), y: dp[1] }))
      }];
    }

    return [{
      type: chartType as any,
      name: seriesName,
      data: seriesData.map(dp => ({
        x: typeof dp[0] === 'string' ? dp[0] : Number(dp[0]),
        y: dp[1]
      }))
    }];
  }





  
  
  
  

  getStyleValue(styles: any[], key: string): string {
    const styleObj = styles.find(style => style.hasOwnProperty(key));
    return styleObj ? styleObj[key] : '';
  }

  getAxisCategories(styles: any[]): string[] {
    const categories = this.getStyleValue(styles, 'categories');
    return categories ? JSON.parse(categories) : [];
  }
  
  
  

  constructor(private apiService: ApiService,private toastService: ToastService) {}

  ngOnInit(): void {
    this.getDecodedAccessToken();
    if (this.username) {
      console.log(this.username)
      this.fetchUserDetails(this.username);
      
    }
  }

  getDecodedAccessToken(): JwtPayload | null {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      this.username = decoded.username;
      return decoded;
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  fetchUserDetails(username: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getUserByUsername(username).subscribe((response: any) => {
        if (response.status === true) {
          this.userId = response.data.id;
          if (this.userId) {
            this.fetchDashConfig(this.userId);
          }
          resolve();
        } else {
          console.log('User fetch status:', response.status);
          reject();
        }
      }, (error: any) => {
        console.error('Error fetching user by username:', error);
        alert("Error: " + error.message);
        reject();
      });
    });
  }

  
  fetchWidgetDetails(widget: Widget): void {
    this.apiService.getDashWidgetByDashConfig(widget.id).subscribe((response: any) => {
      if (response.length > 0) {
        widget.widgetDetails = response[0];
      }
    }, error => {
      console.error(`Error fetching widget details for widget ${widget.id}:`, error);
    });
  }

  fetchDashConfig(id: any) {
    this.apiService.getDashConfigByUser(id).subscribe((response: any) => {
      if (response.dashboardConfigurations && response.dashboardConfigurations.length > 0) {
        this.dashConfigId = response.dashboardConfigurations[0].id;
        console.log('Fetching dashboard configuration for ID:', id);
  
        if (this.dashConfigId) {
          console.log('Dashboard Configuration ID found:', this.dashConfigId);
          this.loadDefaultWidgets(this.dashConfigId); // Assuming this should still be called
          this.apiService.WidgetConfigByDashConfig(this.dashConfigId).subscribe((response: any) => {
            if (response.status && response.data.length > 0) {
              // Filter widgets to exclude those with a position in wid_style
              const filteredWidgets = response.data.filter((widget: any) =>
                !widget.wid_style.some((style: any) => style.hasOwnProperty('position'))
              );
  
              // Map over the filtered widgets to format them
              this.widgets = filteredWidgets.map((config: any) => ({
                id: config.id,
                nameFr: config.name_fr,
                nameEng: config.name_eng,
                widStyle: config.wid_style,
                widWidth: config.wid_width,
                widHeight: config.wid_height,
                widRank: config.wid_rank
              }));
  
              // Fetch details for each widget
              this.widgets.forEach(widget => this.fetchWidgetDetails(widget));
            } else {
              console.error('No widget configurations found or invalid response');
            }
          }, error => {
            console.error('Error fetching widget configurations:', error);
          });
        }
      } else {
        console.error('No dashboard configuration found for the provided ID');
      }
    });
  }
  
  addWidget(widgetId: number): void {
    const existingWidget = this.widgets.find(widget => widget.id === widgetId);
  
    if (!existingWidget) {
      console.error('Widget not found with ID:', widgetId);
      return;
    }
  
    const defaultPosition = { x: 300, y: 100 }; // Set your default position here
  
    const newWidget = {
      id: widgetId , 
      typeorg: existingWidget.widgetDetails?.typeorg,
      typetrans: existingWidget.widgetDetails?.typetrans,
      typewid: existingWidget.widgetDetails?.typewid,
      wid_visi: existingWidget.widgetDetails?.wid_visi,
      name_fr: existingWidget.nameFr,
      name_eng: existingWidget.nameEng,
      desc_fr: existingWidget.widgetDetails?.desc_fr,
      desc_eng: existingWidget.widgetDetails?.desc_eng,
      wid_url: existingWidget.widgetDetails?.wid_url,
      wid_style: [
        ...existingWidget.widStyle, 
        { position: defaultPosition }
      ],
      wid_width: existingWidget.widWidth,
      wid_height: existingWidget.widHeight,
      wid_rank: existingWidget.widRank,
      dashboardConfigurationId: this.dashConfigId
    };
    console.log(newWidget)



    existingWidget.widStyle = newWidget.wid_style;
  


    console.log("pushed widgets: ",this.createdWidgets)
    this.widgetType = newWidget.typewid;
  
    this.apiService.createWidget(newWidget).subscribe(
      (response: any) => {
        console.log('Widget successfully created:', response);
        if (response.widgetId) {
          this.newWidgetId = response.widgetId; 
          console.log('New Widget ID:', this.newWidgetId);
          if(this.newWidgetId){
            existingWidget.id = this.newWidgetId;
            console.log('TO be pushed widget: ',existingWidget)
            this.createdWidgets.push(existingWidget);
            this.widgetPositions[existingWidget.id] = defaultPosition;
            this.sortCreatedWidgets();
            this.showSuccessToast()
          }
          
        }
      },
      (error) => {
        console.error('Error creating widget:', error);
        alert('Failed to create widget: ' + error.message);
      }
    );
}




  

  getStyleValue1(styles: any[], styleName: string): string {
    const styleObj = styles.find(style => style.hasOwnProperty(styleName));
    return styleObj ? styleObj[styleName] : 'initial';
  }

  getTextStyles(styles: any[]): any {
    return {
      'color': this.getStyleValue(styles, 'textColor'),
      'font-family': this.getStyleValue(styles, 'textFont'),
      'font-size': this.getStyleValue(styles, 'textSize'),
    };
  }

  getStyleValueFromArray(styles: any[], key: string): any {
    const styleObj = styles.find(style => style.hasOwnProperty(key));
    return styleObj ? styleObj[key] : '';
  }



  
  onDragEnded(event: CdkDragEnd, widget :any): void {
    const position = event.source.getFreeDragPosition();
    this.widgetPositions[widget.id] = position;
    console.log(this.createdWidgets)
    if (!widget) {
      console.error('No widget found or newWidgetId is null');
      return;
    }

    console.log('to update widget: '+ widget)
  
    // Fetch the latest widget configuration using the correctly named API method
    this.apiService.WidgetConfigByID(widget.id).subscribe({
      next: (response: any) => {
        if (response) {
          // Update the position in the widget's style array
          const updatedStyles = response.wid_style.map((style: any) => {
            if (style.position) {
              // If there's a position field, update it
              return { ...style, position: { x: position.x, y: position.y } };
            }
            return style;
          });
  
          // Prepare the updated widget object with the modified styles
          const updatedWidget = {
            ...response,
            wid_style: updatedStyles
          };
  
          // Call the function to update the widget configuration
          this.updateWidgetConfig(updatedWidget);
        }
      },
      error: (error) => {
        console.error('Error fetching widget configuration:', error);
      }
    });
  }
  
  

  updateWidgetConfig(widget: any): void {
    console.log('Updating widget configuration:', widget);
    this.apiService.updateWidgetConfig(widget.id, widget).subscribe({
      next: (response) => {
        console.log('Widget configuration updated successfully:', response);
      },
      error: (error) => {
        console.error('Failed to update widget configuration:', error);
      }
    });
  }



extractPosition(widStyle: any[]): { x: number, y: number } {
  const positionStyle = widStyle.find(style => style.hasOwnProperty('position'));
  return positionStyle ? positionStyle.position : { x: 0, y: 0 };
}

loadDefaultWidgets(dashConfigId: any): void {
  console.log('loadDefaultWidgets called with dashConfigId:', dashConfigId);
  this.apiService.WidgetConfigByDashConfig(dashConfigId).subscribe(
    (response: any) => {
      console.log("API Response:", response);
      if (response && response.data && response.data.length > 0) {
        response.data.forEach((widget: any) => {
          // Check if the widget has a position defined
          const positionIndex = widget.wid_style.findIndex((style: any) => style.hasOwnProperty('position'));
          if (positionIndex !== -1) {
            // Extract the position from wid_style


            // Fetch detailed widget information if necessary
            this.apiService.getDashWidgetByDashConfig(widget.id).subscribe({
              next: (detailsResponse: any) => {
                if (detailsResponse && detailsResponse.length > 0) {
                  const detail = detailsResponse[0];
                  const clonedWidget: Widget = {
                    id: widget.id,
                    nameFr: widget.name_fr,
                    nameEng: widget.name_eng,
                    widStyle: widget.wid_style,
                    widWidth: widget.wid_width,
                    widHeight: widget.wid_height,
                    widRank: widget.wid_rank,
                    widgetDetails: {
                      id: detail.id,
                      typewid: detail.typewid,
                      typetrans: detail.typetrans,
                      wid_visi: detail.wid_visi,
                      is_default: detail.is_default,
                      desc_fr: detail.desc_fr,
                      desc_eng: detail.desc_eng,
                      wid_url: detail.wid_url,
                      typeorg: detail.typeorg
                    }
                  };

                  // Add widget to createdWidgets array
                  this.createdWidgets.push(clonedWidget);
                  this.sortCreatedWidgets();
                  const position = this.extractPosition(widget.wid_style);
                  this.widgetPositions[widget.id] = position;
                  console.log("Widget with position added to createdWidgets:", clonedWidget);
                } else {
                  console.error('No widget details available for widget ID:', widget.id);
                }
              },
              error: (error) => {
                console.error('Error fetching widget details for widget ID:', widget.id, error);
              }
            });
          }
        });
        console.log('Total founded widgets:', this.createdWidgets.length);
      } else {
        console.log('No widgets found for the given dashboard configuration or data key is missing.');
      }
    },
    (error: any) => {
      console.error('Failed to load default widgets:', error);
    }
  );
}




sortCreatedWidgets(): void {
  this.createdWidgets.sort((a, b) => a.id - b.id);
}


toggleEditMode(): void {
  this.isEditMode = !this.isEditMode;
  console.log('Edit mode toggled:', this.isEditMode);
}

toggleWidgetCheck(isChecked: boolean, widgetId: number): void {
  if (isChecked) {
    // Add the widget ID to the array if it's checked and not already included
    if (!this.checkedWidgets.includes(widgetId)) {
      this.checkedWidgets.push(widgetId);
    }
  } else {
    // Remove the widget ID from the array if it's unchecked
    this.checkedWidgets = this.checkedWidgets.filter(id => id !== widgetId);
  }
  console.log(this.checkedWidgets); // Optionally log the current state for debugging
}

deleteSelectedWidgets(): void {
  if (this.checkedWidgets.length === 0) {
    this.showErrorToast()
    return;
  }

  this.checkedWidgets.forEach(widgetId => {
    this.apiService.deleteWidgetById(widgetId).subscribe({
      next: (response: any) => {
        if (response.message === "Dashboard Configuration Widget and associated Dashboard Widget deleted successfully") {
          this.sortCreatedWidgets();
          this.createdWidgets = this.createdWidgets.filter(widget => widget.id !== widgetId);
          this.sortCreatedWidgets();
          console.log('Widget deleted successfully:', widgetId);
        } else {
          console.error('Failed to delete widget:', widgetId);
        }
      },
      error: (error) => {
        console.error('Error deleting widget:', widgetId, error);
      },
      complete: () => {
        // Check if this is the last widget being processed and handle accordingly
        if (this.checkedWidgets.indexOf(widgetId) === this.checkedWidgets.length - 1) {
          this.showSuccessToast()
          // Clear checked widgets after processing all deletions
          this.checkedWidgets = [];
        }
      }
    });
  });
}

showSuccessToast() {
  this.toastService.showSuccess('success!');
}

showErrorToast() {
  this.toastService.showError('error!');
}

}








