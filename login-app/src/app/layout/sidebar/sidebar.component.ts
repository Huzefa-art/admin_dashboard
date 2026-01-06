import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { navBarData } from './new-data';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { ApiAiService } from '../../service/apiAiService';

interface SideNavToggle {
  screenwidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {



  @Output() onToggleSideNav: EventEmitter<SideNavToggle> = new EventEmitter();
  collapsed: boolean = true;
  navData = navBarData;
  screenwidth = 0;
  userName: string = '';
  final: string = '';
  @HostListener('window: resize', ['$event'])
  onResize(event: any) {
    this.screenwidth = window.innerWidth;
    if (this.screenwidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({ collapsed: this.collapsed, screenwidth: this.screenwidth });
    }
  }

  ngOnInit(): void {
    this.GetUserInfo();
    this.screenwidth = window.innerWidth;
  }

  constructor(private _yourApiService: ApiAiService) { }

  closeSidenav(): void {
    this.collapsed = false;
    console.log('Sidebar collapsed state:', this.collapsed);
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenwidth: this.screenwidth });

  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    console.log('Sidebar collapsed state:', this.collapsed);
    this.onToggleSideNav.emit({ collapsed: this.collapsed, screenwidth: this.screenwidth });
  }

  GetUserInfo(): void {
    this._yourApiService.GetUserInfo().subscribe(
      (response) => {
        if (response && response.name) {
          this.userName = response.name;
          const nameParts = this.userName.split(' ');

          const firstName = nameParts[0];
          const lastName = nameParts[nameParts.length - 1];

          const firstChar = firstName[0];
          const lastChar = lastName[0];

          const final = firstChar + lastChar;
          this.final = final;

        }
      },
      (error) => {
        console.error('Error fetching user info', error);
      }
    );
  }
}
