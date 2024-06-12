import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Router , ActivatedRoute, NavigationEnd} from '@angular/router';
import { navbarData } from './nav-data';
import { filter } from 'rxjs/operators';
import { INavbarData } from './helper';
import { jwtDecode } from 'jwt-decode';
import { ApiService } from 'src/app/api.service';

interface SideNavToggle {
  screenWidth : number;
  collapsed : boolean;
}

interface JwtPayload {
  username: string;
  exp: number;
  iat: number;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed = true ;
  screenWidth = 0; 
  navData = navbarData;
  multiple: boolean = false;
  username: string | undefined;
  currentFlag: string = 'us';

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if(this.screenWidth <= 768) {
      this.collapsed = false;
    }
  }

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.getDecodedAccessToken();
  }


  constructor(private router: Router) {
    
  }
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

  redirectTo(route: string): void {
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
    this.router.navigate(['/sasp']);
  }

  toggleFlag() {
    this.currentFlag = this.currentFlag === 'us' ? 'fr' : 'us';
    console.log(this.currentFlag)
  }
}
