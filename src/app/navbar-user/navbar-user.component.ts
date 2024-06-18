import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { Router , ActivatedRoute, NavigationEnd} from '@angular/router';
import { navbarData } from './nav-data';
import { filter } from 'rxjs/operators';
import { INavbarData } from './helper';
import { jwtDecode } from 'jwt-decode';
import { ApiService } from 'src/app/api.service';
import { countries } from 'country-flag-icons'
import { ToastService } from '../toast.service';
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
  username: string | undefined;
  currentFlag: string = 'fr';

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


  constructor(private router: Router, private apiService: ApiService,private toastService: ToastService) {
    
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
    this.showSuccessToast();
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
  toggleFlag() {
    this.currentFlag = this.currentFlag === 'us' ? 'fr' : 'us';
    console.log(this.currentFlag)
  }

  setting(event : MouseEvent): void {
    event.preventDefault();
    this.router.navigate(['/user/settings']);
  }

  showSuccessToast() {
    this.toastService.showSuccess('Logging out success!');
  }

  showErrorToast() {
    this.toastService.showError('error!');
  }
}
