import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ApiService } from 'src/app/api.service';
import { EditorgComponent } from './editorg/editorg.component';
import { ToastService } from '../../../toast.service';
import { ConfirmationDialogComponent } from 'src/app/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-org-list',
  templateUrl: './org-list.component.html',
  styleUrls: ['./org-list.component.css']
})
export class OrgListComponent implements OnInit {

  displayedColumns: string[] = [
    'id',
    'name',
    'type',
    'enabled',
    'created_at',
    'updated_at',
    'action'
  ];

  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    this.getOrgsList();
  }

  constructor(private _dialog : MatDialog, private apiService: ApiService,private toastService: ToastService) {

  }
  openConfirmationDialog(id: number): void {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data: { title: 'Confirmer', message: 'Tu es sur de supprimer?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteOrg((id));
      }
    });
  }
  getOrgsList(){
    this.apiService.getAllOrgs().subscribe((response : any) =>{
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

  deleteOrg(id : number){
    this.apiService.deleteOrgById(id).subscribe((response : any) =>{
      if(response.message=='Organization and associated entity deleted successfully'){
        this.showSuccessToast()
        this.getOrgsList();
      } 
    },
    (error: any) => {
      alert('Error: ' + error.message);
    })
    }

  openEditForm(data : any){
    this._dialog.open(EditorgComponent, {
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
