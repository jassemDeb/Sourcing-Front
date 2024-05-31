import { Component, OnInit } from '@angular/core';
import { CdkDragStart, CdkDragMove, CdkDragEnd } from '@angular/cdk/drag-drop';
import { jwtDecode } from 'jwt-decode';
import { ApiService } from 'src/app/api.service';



interface JwtPayload {
  username: string;
  exp: number;
  iat: number;
  // Include other payload properties as per your JWT structure
}

interface Widget {
  id: number;
  nameFr: string;
  nameEng: string;
  widStyle: any[]; // Array of style objects
  widWidth: string;
  widHeight: string;
  widRank: string;
  widgetDetails?: WidgetDetails; // Optional property to store associated widget details
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


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  widgets: Widget[] = [];
  username: string | undefined;
  userId: number | null = null;  
  dashConfigId : number | null = null;  
  widgetType: string | undefined;
  widgetCreated: Widget | null = null;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.getDecodedAccessToken();
    if (this.username){
      this.fetchUserDetails(this.username);

    }
  }

  //GETTING USER CONNECTED
  getDecodedAccessToken(): JwtPayload | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(token);  
      this.username = decoded.username; 
      console.log('Username connected: '+ this.username);
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
          console.log('UserID:', this.userId);
          if (this.userId){
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

  //GETTING DASH WIDGET FOR WIDGET CONFIG
  fetchWidgetDetails(widget: Widget): void {
    this.apiService.getDashWidgetByDashConfig(widget.id).subscribe((response : any) => {
      if (response.length > 0) {
        widget.widgetDetails = response[0]; // Associate the first found details (adjust logic as needed)
      }
    }, error => {
      console.error(`Error fetching widget details for widget ${widget.id}:`, error);
    });
  }

  //GETTING THE CURRENT DASH CONFIG
  fetchDashConfig(id : any) {
    this.apiService.getDashConfigByUser(id).subscribe((response: any)=>{
      this.dashConfigId = response.dashboardConfigurations[0].id;
      console.log('Dash config id : ' +this.dashConfigId);
      if (this.dashConfigId){
        this.apiService.WidgetConfigByDashConfig(this.dashConfigId).subscribe((response: any) => {
          if (response.status && response.data.length > 0) {
            this.widgets = response.data.map((config: any) => ({
              id: config.id,
              nameFr: config.name_fr,
              nameEng: config.name_eng,
              widStyle: config.wid_style,
              widWidth: config.wid_width,
              widHeight: config.wid_height,
              widRank: config.wid_rank
            }));
            this.widgets.forEach(widget => this.fetchWidgetDetails(widget));
            console.log(this.widgets)
          } else {
            console.error('No widget configurations found or invalid response');
          }
        }, error => {
          console.error('Error fetching widget configurations:', error);
        });
      }
    })
  }

  
  addWidget(widgetId: number): void {
    // Find the widget from the widgets array using widgetId
    const existingWidget = this.widgets.find(widget => widget.id === widgetId);
  
    if (!existingWidget) {
      console.error('Widget not found with ID:', widgetId);
      return;
    }
  
    // Create a new widget object based on the existing widget
    const newWidget = {
      id: widgetId ,
      typeorg: existingWidget.widgetDetails?.typeorg,
      typetrans: existingWidget.widgetDetails?.typetrans,
      typewid: existingWidget.widgetDetails?.typewid,
      wid_visi: existingWidget.widgetDetails?.wid_visi ,
      name_fr:  existingWidget.nameFr,
      name_eng:  existingWidget.nameEng,
      desc_fr: existingWidget.widgetDetails?.desc_fr ,
      desc_eng: existingWidget.widgetDetails?.desc_eng ,
      wid_url: existingWidget.widgetDetails?.wid_url ,
      wid_style:  existingWidget.widStyle,
      wid_width:  existingWidget.widWidth,
      wid_height:  existingWidget.widHeight,
      wid_rank:  existingWidget.widRank,
      dashboardConfigurationId: this.dashConfigId  // Assuming this is already set
    };

    this.widgetCreated = existingWidget;
    this.widgetType = newWidget.typewid;
    console.log(this.widgetType);

    console.log(newWidget);
  
    // Send the new widget data to the API
   this.apiService.createWidget(newWidget).subscribe(
      response => {
        console.log('Widget successfully created:', response);
      },
      error => {
        console.error('Error creating widget:', error);
        alert('Failed to create widget: ' + error.message);
      }
    ); 
  }


  getStyleValue(styles: any[], styleName: string): string {
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
  

}
