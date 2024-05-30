import { Component, OnInit } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { ApiService } from 'src/app/api.service';

interface JwtPayload {
  username: string;
  exp: number;
  iat: number;
  // Include other payload properties as per your JWT structure
}

interface Widget {
  typeorg: string;
  typetrans: string;
  typewid: string;
  wid_visi: string;
  name_fr: string;
  name_eng: string;
  desc_fr: string;
  desc_eng: string;
  wid_url: string;
  wid_style: string[];
  wid_width: string;
  wid_height: string;
  wid_rank: number;
  dashboardConfigurationId: number;
}

@Component({
  selector: 'app-wideget-paremeter',
  templateUrl: './wideget-paremeter.component.html',
  styleUrls: ['./wideget-paremeter.component.css']
})
export class WidegetParemeterComponent implements OnInit {
  username: string | undefined;
  userId: number | null = null;  
  orgId: number | null = null; 
  dashconfigid: number | null = null;
  dashwidgetID: number | null = null;
  widgets: any[] = [];
  widgetconfigs: any[] = [];
  menuItems: any[] = [];
  defaultwidgetconfigs: any[] = [];
  NewWidget: Widget | null = null;

  constructor(private apiService: ApiService) {}

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

  ngOnInit(): void {
    const tokenPayload = this.getDecodedAccessToken();   
    console.log('Username:', this.username);

    if (this.username) {
      this.fetchUserDetails(this.username).then(() => {
        if (this.userId) {
          this.fetchOrganizationDetails(this.userId).then(() => {
            if (this.orgId) {
              this.fetchWidgetConfigs(this.orgId);
            }
          });
        }
      });
    } else {
      console.error('No username available from token');
    }
  }
  
  async fetchUserDetails(username: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getUserByUsername(username).subscribe((response: any) => {
        if (response.status === true) {
          this.userId = response.data.id; 
          console.log('UserID:', this.userId);
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

  async fetchOrganizationDetails(userId: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getOrgByUser(userId).subscribe((response: any) => {
        if (response.status === true && response.data.length > 0) {
          this.orgId = response.data[0].id; 
          console.log('OrgID:', this.orgId);
          resolve();
        } else {
          console.log('No organization data found');
          reject();
        }
      }, (error: any) => {
        console.error('Error fetching organization:', error);
        alert("Error: " + error.message);
        reject();
      });
    });
  }

  fetchWidgetConfigs(orgId: number): void {
    this.apiService.getDefaultWidgetByOrg(orgId).subscribe((response: any) => {
      if (response.status) {
        this.defaultwidgetconfigs = response.data;
        this.menuItems = this.defaultwidgetconfigs.map(config => ({
          id: config.id,
          name_fr: config.name_fr
        }));
        console.log('Items uploaded:', this.menuItems);

        // Now that we have the default widget configs, we can load the widgets
        this.loadWidgets();
      } else {
        console.error('Widget config fetch status:', response.status);
      }
    }, (error: any) => {
      console.error('Error fetching widget configs:', error);
      alert('Error: ' + error.message);
    });
  }

  loadWidgets(): void {
    if (this.orgId) {
      this.apiService.getWidgetByOrg(this.orgId).subscribe((response: any) => {
        this.widgets = response.data;
        console.log('Widgets loaded:', this.widgets);

        // Fetch the dashboard configuration ID after loading the widgets
        this.getDashConfig().then(() => {
          if (this.dashconfigid) {
            this.loadWidgetConfigs();
          }
        });
      }, (error: any) => {
        console.error('Error fetching widgets:', error);
        alert('Error: ' + error.message);
      });
    } else {
      console.error('Org ID is not set when trying to load widgets');
    }
  }

  async getDashConfig(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.apiService.getDashConfigByUser(this.userId!).subscribe((response: any) => {
        if (response.dashboardConfigurations && response.dashboardConfigurations.length > 0) {
          this.dashconfigid = response.dashboardConfigurations[0].id;
          resolve();
        } else {
          console.error('No Dashboard Configuration ID found');
          reject();
        }
      }, (error: any) => {
        console.error('Failed to get dashboard configuration by user:', error);
        reject();
      });
    });
  }

  loadWidgetConfigs(): void {
    if (this.dashconfigid) {
      console.log('DashConfigID:', this.dashconfigid);
      this.apiService.WidgetConfigByDashConfig(this.dashconfigid).subscribe((response: any) => {
        if (response.status && response.data.length > 0) {
          response.data.forEach((config: any) => {
            this.widgetconfigs.push(config);
          });
          console.log("Widget configs loaded:", response.data);
        } else {
          console.log("No widget configs found for DashConfigID:", this.dashconfigid);
        }
      }, (error: any) => {
        console.error("Error loading widget configs for DashConfigID:", this.dashconfigid, error);
        alert('Error: ' + error.message);
      });
    } else {
      console.error('DashConfigID is not set.');
    }
  }

  onMenuItemClick(itemId: number): void {
    console.log('Clicked item ID:', itemId);
    this.apiService.getDashConfigByUser(this.userId!).subscribe((response: any) => {
      if (response.dashboardConfigurations && response.dashboardConfigurations.length > 0) {
        const dashConfigId = response.dashboardConfigurations[0].id;
        this.dashconfigid = dashConfigId;

        this.apiService.getDashWidgetByDashConfig(dashConfigId).subscribe((response: any) => {
          if (response.id) {
            const widgetId = response.id;
            this.apiService.WidgetById(widgetId).subscribe((widgetDetails: any) => {
              const defaultConfig = this.defaultwidgetconfigs.find(config => config.id === itemId);

              this.NewWidget = {
                typeorg: widgetDetails.typeorg || defaultConfig?.typeorg,
                typetrans: widgetDetails.typetrans || defaultConfig?.typetrans,
                typewid: widgetDetails.typewid || defaultConfig?.typewid,
                wid_visi: widgetDetails.wid_visi || defaultConfig?.wid_visi,
                name_fr: widgetDetails.name_fr || defaultConfig?.name_fr,
                name_eng: widgetDetails.name_eng || defaultConfig?.name_eng,
                desc_fr: widgetDetails.desc_fr || defaultConfig?.desc_fr,
                desc_eng: widgetDetails.desc_eng || defaultConfig?.desc_eng,
                wid_url: widgetDetails.wid_url || defaultConfig?.wid_url,
                wid_style: widgetDetails.wid_style || defaultConfig?.wid_style,
                wid_width: widgetDetails.wid_width || defaultConfig?.wid_width,
                wid_height: widgetDetails.wid_height || defaultConfig?.wid_height,
                wid_rank: widgetDetails.wid_rank || defaultConfig?.wid_rank,
                dashboardConfigurationId: dashConfigId
              };
              console.log('New Widget Prepared:', this.NewWidget);
              this.createWidget(this.NewWidget);
              window.location.reload();
            }, error => console.error('Failed to load widget details:', error));
          } else {
            console.error('No Dashboard Widget ID found');
          }
        }, error => console.error('Failed to get dashboard widget by config:', error));
      } else {
        console.error('No Dashboard Configuration ID found');
      }
    }, error => console.error('Failed to get dashboard configuration by user:', error));
  }

  // Method to create a widget using the API
  createWidget(widgetData: any): void {
    this.apiService.createWidget(widgetData).subscribe(response => {
      console.log('Widget successfully created:', response);
    }, error => {
      console.error('Error creating widget:', error);
      alert('Failed to create widget: ' + error.message);
    });
  }
}
