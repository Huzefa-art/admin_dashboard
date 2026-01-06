import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SuperAdminMenuComponent } from '../super-admin-menu/super-admin-menu.component';
import { SuperAdminTopbarComponent } from '../super-admin-topbar/super-admin-topbar.component';

@Component({
  selector: 'app-super-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SuperAdminMenuComponent, SuperAdminTopbarComponent],
  templateUrl: './super-admin-layout.component.html',
  styleUrl: './super-admin-layout.component.css'
})
export class SuperAdminLayoutComponent {


  isSidebarVisible = false;


  ngOnInit() {
    this.isSidebarVisible = window.innerWidth >= 992; // lg breakpoint
  }


  toggleSidebar() {
    this.isSidebarVisible = !this.isSidebarVisible;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = (event.target as Window).innerWidth;
    if (width >= 992) {
      this.isSidebarVisible = true;
    } else {
      this.isSidebarVisible = false;
    }
  }

}
