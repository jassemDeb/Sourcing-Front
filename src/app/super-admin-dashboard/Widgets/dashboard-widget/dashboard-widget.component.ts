import { Component, OnInit, ViewChild } from '@angular/core';
import { AddwidgetComponent } from './addwidget/addwidget.component';
import { ApiService } from 'src/app/api.service';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { EditwidgetComponent } from './editwidget/editwidget.component';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ToastService } from '../../../toast.service';
import { ConfirmationDialogComponent } from '../../../confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-dashboard-widget',
  templateUrl: './dashboard-widget.component.html',
  styleUrls: ['./dashboard-widget.component.css']
})
export class DashboardWidgetComponent implements OnInit {

  displayedColumns: string[] = [
    'id',
    'typewid',
    'typetrans',
    'wid_visi',
    'is_default',
    'action'
  ];

  dataSource!: MatTableDataSource<any>;

  selectedOrganizationType: string = '';
  selectedWidgetType: string = '';
  selectedWidgetVisibility: string = '';
  selectedTransactionType: string = '';

  isSearchPanelVisible: boolean = false;
  filterMode: 'AND' | 'OR' = 'AND';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatMenuTrigger) trigger!: MatMenuTrigger;
  isDupliquerEnabled: boolean = false;

  closeMenu() {
    if (this.trigger.menuOpen) {
      this.trigger.closeMenu();
    }
  }
  widget :any;
  widgetconfig :any;
  toggleDupliquer(event: MatSlideToggleChange, id : number) {
    
    console.log('Toggle state:', event.checked);
    if (event.checked) {
      console.log('API call triggered.');
      this.apiService.WidgetById(id).subscribe(
        (widgetResponse: any) => {
          if (widgetResponse) {
            this.widget = widgetResponse;
            // Inside the WidgetById subscription, make the WidgetConfig API call
            this.apiService.WidgetConfig(id).subscribe(
              (configResponse: any) => {
                if (configResponse) {
                  this.widgetconfig = configResponse;
                  // Merge widget and widget configuration JSON objects
                  const mergedWidget = { ...this.widget, ...this.widgetconfig };
                  console.log('Merged JSON:', mergedWidget);
                  this.apiService.addwidget(mergedWidget).subscribe((response:any)=>{
                    if(response.message=="Widget added"){
                      this.showSuccessToast()
                      this.ngOnInit();
              
                    } else {
                      alert(response.message);
                    }
                  },
                  (error: any) => {
                    alert('Error: ' + error.message);
                  }
                  );
                } else {
                  alert('Error fetching widget configuration');
                }
              },
              (error: any) => {
                alert('Error: ' + error.message);
              }
            );
          } else {
            alert('Error fetching widget');
          }
        },
        (error: any) => {
          alert('Error: ' + error.message);
        }
      );
      
    }
    
  }

  ngOnInit(): void {
    this.getWidgetsList();
  }

  constructor(private _dialog : MatDialog, private apiService: ApiService,private toastService: ToastService) {

  }

  openConfirmationDialog(id: number): void {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Confirmer', message: 'Tu es sur de supprimer?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteUser((id));
      }
    });
  }

  getWidgetsList(){
    this.apiService.getAllWidgets().subscribe((response : any) =>{
      if(response){
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      } else (error: any) => {
        alert('Error: ' + error.message);
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  openAddForm(){
    this._dialog.open(AddwidgetComponent, {
    });
  }

  openEditForm(data : any){
    this._dialog.open(EditwidgetComponent, {
      data,
    });
  }

  deleteUser(id : number){
    this.apiService.deleteWidgetById(id).subscribe((response : any) =>{
      if(response.message){
        this.showSuccessToast()
        this.getWidgetsList();
        this.ngOnInit()
      } 
    },
    (error: any) => {
      alert('Error: ' + error.message);
    })
  }

  reloadPage(event: MouseEvent) : void {
    window.location.reload();
  }

  applySearch() {
    const filters = {
      organizationType: this.selectedOrganizationType,
      widgetType: this.selectedWidgetType,
      widgetVisibility: this.selectedWidgetVisibility,
      transactionType: this.selectedTransactionType
    };

    this.dataSource.filterPredicate = (data: any, filter: string): boolean => {
      const searchFilters = JSON.parse(filter);

      if (this.filterMode === 'AND') {
        return (!searchFilters.organizationType || data.organizationType === searchFilters.organizationType) &&
               (!searchFilters.widgetType || data.typewid === searchFilters.widgetType) &&
               (!searchFilters.widgetVisibility || data.wid_visi === searchFilters.widgetVisibility) &&
               (!searchFilters.transactionType || data.typetrans === searchFilters.transactionType);
      } else {
        return (!searchFilters.organizationType || data.organizationType === searchFilters.organizationType) ||
               (!searchFilters.widgetType || data.typewid === searchFilters.widgetType) ||
               (!searchFilters.widgetVisibility || data.wid_visi === searchFilters.widgetVisibility) ||
               (!searchFilters.transactionType || data.typetrans === searchFilters.transactionType);
      }
    };

    this.dataSource.filter = JSON.stringify(filters);

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  resetFilters() {
    this.selectedOrganizationType = '';
    this.selectedWidgetType = '';
    this.selectedWidgetVisibility = '';
    this.selectedTransactionType = '';
    this.applySearch();
  }

  toggleSearchPanel() {
    this.isSearchPanelVisible = !this.isSearchPanelVisible;
  }

  toggleFilterMode() {
    this.filterMode = this.filterMode === 'AND' ? 'OR' : 'AND';
  }

  

  showSuccessToast() {
    this.toastService.showSuccess('This is a success message!');
  }

  showErrorToast() {
    this.toastService.showError('This is an error message!');
  }
}
