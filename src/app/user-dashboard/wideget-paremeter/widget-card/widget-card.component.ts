import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-widget-card',
  templateUrl: './widget-card.component.html',
  styleUrls: ['./widget-card.component.css']
})
export class WidgetCardComponent implements OnInit {

  @Input() widgetconfig: any;

  ngOnInit(): void {
    console.log("Widget data received in child component:", this.widgetconfig);
  }
}
