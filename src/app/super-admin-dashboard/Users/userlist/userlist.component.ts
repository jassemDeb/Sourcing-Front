import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EdituserComponent } from './edituser/edituser.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ApiService } from 'src/app/api.service';
import { ToastService } from '../../../toast.service';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';

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

  constructor(private _dialog : MatDialog, private apiService: ApiService,private toastService: ToastService
  ) {

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

  

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteUser(id : number){
    this.apiService.deleteUserById(id).subscribe((response : any) =>{
      if(response.message){
        this.showSuccessToast()
        this.ngOnInit()
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
  reloadPage(event: MouseEvent) : void {
    window.location.reload();
  }


  showSuccessToast() {
    this.toastService.showSuccess('This is a success message!');
  }

  showErrorToast() {
    this.toastService.showError('This is an error message!');
  }
}
