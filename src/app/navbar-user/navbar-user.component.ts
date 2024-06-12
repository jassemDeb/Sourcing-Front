import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Router , ActivatedRoute, NavigationEnd} from '@angular/router';
import { navbarData } from './nav-data';
import { filter } from 'rxjs/operators';
import { INavbarData } from './helper';

interface SideNavToggle {
  screenWidth : number;
  collapsed : boolean;
}

@Component({
  selector: 'app-navbar-user',
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.css']
})
export class NavbarUserComponent implements OnInit {

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = true ;
  screenWidth = 0; 
  navData = navbarData;
  multiple: boolean = false;

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 768) {
      this.collapsed = false;
    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
  }


  constructor(private router: Router) {
    
  }

  
  onLogout(){
    alert("Succees to logout");
    localStorage.removeItem("token");
    this.router.navigateByUrl('/');
  }

  toggleCollapse() : void{
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  closeSidenav() : void{
    this.collapsed = false;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth});
  }

  redirectTo(route: string, event: MouseEvent): void {
    event.preventDefault();
    this.router.navigate([route]);
  }

  handleClick(item: INavbarData) : void {
    if (!this.multiple) {
      for(let modelItem of this.navData) {
        if (item !== modelItem && modelItem.expanded) {
          modelItem.expanded = false;
        }
      }
    }
    item.expanded = !item.expanded;
  }

  home(event : MouseEvent): void {
    event.preventDefault();
    this.router.navigate(['/user']);
  }
}
