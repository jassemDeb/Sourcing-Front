import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EdituserComponent } from './edituser/edituser.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-userlist',
  templateUrl: './userlist.component.html',
  styleUrls: ['./userlist.component.css']
})
export class UserlistComponent implements OnInit  {
  displayedColumns: string[] = [
    'id',
    'email',
    'roles',
    'fullname',
    'username',
    'isAdmin',
    'created_at',
    'updated_at',
    'action'
  ];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getUsersList();
  }

  constructor(private _dialog : MatDialog, private apiService: ApiService) {

  }

  getUsersList(){
    this.apiService.getAllUsers().subscribe((response : any) =>{
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

  deleteUser(id : number){
    this.apiService.deleteUserById(id).subscribe((response : any) =>{
      if(response.message=='User deleted successfully'){
        alert('User deleted successfully');
        this.getUsersList();
      } 
    },
    (error: any) => {
      alert('Error: ' + error.message);
    })
    }

  openEditForm(data : any){
    this._dialog.open(EdituserComponent, {
      data,
    });
  }
  

}
