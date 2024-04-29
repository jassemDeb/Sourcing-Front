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
                      alert("Widget duplicated succefully");
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

  constructor(private _dialog : MatDialog, private apiService: ApiService) {

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
      if(response.message=='Widget and their configuration deleted successfully'){
        alert('Widget deleted successfully');
        this.getWidgetsList();
      } 
    },
    (error: any) => {
      alert('Error: ' + error.message);
    })
  }
}
