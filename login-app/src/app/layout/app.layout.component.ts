import { animate, style, transition, trigger } from '@angular/animations';
import { Component, Input, input, OnDestroy, Renderer2, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, NavigationEnd, Router } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { MenuOfApplicationComponent } from './menu-of-application/menu-of-application.component';
import { TopbarOfApplicationComponent } from './topbar-of-application/topbar-of-application.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuOfApplicationComponent, TopbarOfApplicationComponent, BreadcrumbComponent, SidebarComponent],
  templateUrl: './app.layout.component.html',
  styleUrls: ['./app.layout.component.css']
})
export class AppLayoutComponent {

  isMobile = window.innerWidth < 992;
  sidebarActive = !this.isMobile;

  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth < 992;
    if (!this.isMobile) {
      this.sidebarActive = true;
    }
  }

  toggleSidebar() {
    this.sidebarActive = !this.sidebarActive;
  }
  isSuperAdmin: boolean = false;
  ngOnInit() {
    this.sidebarActive = !this.isMobile;

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // this.isSuperAdmin = localStorage.getItem('is_superuser') === 'true' &&
    //                     localStorage.getItem('designation') === 'Admin' &&
    //                     localStorage.getItem('email') === 'super.admin@inseyab.com';

    this.isSuperAdmin =
      user?.is_superuser === true &&
      user?.designation === 'Admin' &&
      user?.email === 'huzefa@consultant.com';

    if (this.isSuperAdmin) {
      this.router.navigate(['/admin']);
    }
  }
  // @Input() collapsed = false;
  // @Input() screenwidth = 0;

  constructor(public renderer: Renderer2, public router: Router) {
  }




  //     getBodyClass(): string {
  //         let styleclass ='';
  //         if(this.collapsed && this.screenwidth > 768)[
  //           styleclass = 'body-skimmed'
  //         ]
  //         else if(this.collapsed && this.screenwidth > 768 && this.screenwidth > 0){
  //           styleclass = 'body-md-sreen'
  //         }
  //           return styleclass;
  //       }

}
