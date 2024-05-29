import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';

@Component({
  selector: 'app-widget-card',
  templateUrl: './widget-card.component.html',
  styleUrls: ['./widget-card.component.css']
})
export class WidgetCardComponent implements OnInit {

  @Input() widgetconfig: any;

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    console.log("Widget data received in child component:", this.widgetconfig);
  }

  editWidget(widget: any) {
    console.log('Editing widget:', widget.id);
    // Implement your logic to handle edit
  }

  deleteWidget(widgetId: number) {
    console.log('Deleting widget:', widgetId);
    // Implement your logic to handle delete
    this.apiService.deleteWidgetById(widgetId).subscribe((respnse: any)=>{
      if(respnse.message=="Dashboard Configuration Widget and associated Dashboard Widget deleted successfully"){
        alert('deleted');
        window.location.reload();
      }
    })
  }
}
