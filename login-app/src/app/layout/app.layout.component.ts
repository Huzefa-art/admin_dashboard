// import { animate, style, transition, trigger } from '@angular/animations';
// import { Component, Input, input, OnDestroy, Renderer2, ViewChild, HostListener } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule, NavigationEnd, Router } from '@angular/router';
// import { filter, Subscription } from 'rxjs';
// import { MenuOfApplicationComponent } from './menu-of-application/menu-of-application.component';
// import { TopbarOfApplicationComponent } from './topbar-of-application/topbar-of-application.component';
// import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
// import { SidebarComponent } from './sidebar/sidebar.component';

// @Component({
//   selector: 'app-layout',
//   standalone: true,
//   imports: [CommonModule, RouterModule, MenuOfApplicationComponent, TopbarOfApplicationComponent, BreadcrumbComponent, SidebarComponent],
//   templateUrl: './app.layout.component.html',
//   styleUrls: ['./app.layout.component.css']
// })
// export class AppLayoutComponent {

//   isMobile = window.innerWidth < 992;
//   sidebarActive = !this.isMobile;

//   @HostListener('window:resize')
//   onResize() {
//     this.isMobile = window.innerWidth < 992;
//     if (!this.isMobile) {
//       this.sidebarActive = true;
//     }
//   }

//   toggleSidebar() {
//     this.sidebarActive = !this.sidebarActive;
//   }
//   isSuperAdmin: boolean = false;
//   ngOnInit() {
//     this.sidebarActive = !this.isMobile;

//     const user = JSON.parse(localStorage.getItem('user') || '{}');

//     // this.isSuperAdmin = localStorage.getItem('is_superuser') === 'true' &&
//     //                     localStorage.getItem('designation') === 'Admin' &&
//     //                     localStorage.getItem('email') === 'super.admin@inseyab.com';

//     this.isSuperAdmin =
//       user?.is_superuser === true &&
//       user?.designation === 'Admin' &&
//       user?.email === 'huzefa@consultant.com';

//     if (this.isSuperAdmin) {
//       this.router.navigate(['/admin']);
//     }
//   }
//   // @Input() collapsed = false;
//   // @Input() screenwidth = 0;

//   constructor(public renderer: Renderer2, public router: Router) {
//   }




//   //     getBodyClass(): string {
//   //         let styleclass ='';
//   //         if(this.collapsed && this.screenwidth > 768)[
//   //           styleclass = 'body-skimmed'
//   //         ]
//   //         else if(this.collapsed && this.screenwidth > 768 && this.screenwidth > 0){
//   //           styleclass = 'body-md-sreen'
//   //         }
//   //           return styleclass;
//   //       }

// }
import { Component, HostListener, Renderer2, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MenuOfApplicationComponent } from './menu-of-application/menu-of-application.component';
import { TopbarOfApplicationComponent } from './topbar-of-application/topbar-of-application.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { SidebarComponent } from './sidebar/sidebar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MenuOfApplicationComponent,
    TopbarOfApplicationComponent,
    BreadcrumbComponent,
    SidebarComponent
  ],
  templateUrl: './app.layout.component.html',
  styleUrls: ['./app.layout.component.css']
})
export class AppLayoutComponent implements OnInit {

  isMobile = window.innerWidth < 992;
  sidebarActive = !this.isMobile;
  isSuperAdmin: boolean = false;

  constructor(public renderer: Renderer2, public router: Router) { }

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

  ngOnInit() {
    this.sidebarActive = !this.isMobile;

    if (typeof window === 'undefined') return;

    // Get user info from localStorage (set during login)
    const user = JSON.parse(localStorage.getItem('userInfo') || '{}');

    // Determine if user is Super Admin dynamically
    this.isSuperAdmin =
      !!user?.is_superuser &&
      (user?.designation === 'Admin' || user?.designation === 'Super Admin');

    // If Super Admin, navigate to admin dashboard
    if (this.isSuperAdmin) {
      let redirectUrl = localStorage.getItem('redirect_url') || '/admin/dashboard';

      // Absolute SPA route (starts with '/') → navigate using router
      if (redirectUrl.startsWith('/')) {
        this.router.navigate([redirectUrl]).catch(err => console.error('Navigation error:', err));
        return;
      }

      let parsedUrl: URL | null = null;

      // Try parsing as-is (works if full URL with scheme)
      try {
        parsedUrl = new URL(redirectUrl);
      } catch (e) {
        // If missing scheme but looks like a host (domain or host:port or IP), prepend http:// and try again
        const looksLikeHost = /^[^\/]+\.[^\/]+/.test(redirectUrl) || /^\d+\.\d+\.\d+\.\d+(:\d+)?$/.test(redirectUrl) || /^\w+:\d+$/.test(redirectUrl);
        if (looksLikeHost) {
          try {
            parsedUrl = new URL('http://' + redirectUrl);
          } catch (e2) {
            parsedUrl = null;
          }
        }
      }

      if (parsedUrl) {
        // External origin → full navigation
        if (parsedUrl.origin !== window.location.origin) {
          window.location.href = parsedUrl.href;
        } else {
          // Same origin → navigate to the pathname as SPA route
          this.router.navigate([parsedUrl.pathname]).catch(err => console.error('Navigation error:', err));
        }
      } else {
        // Not a full URL → assume SPA route
        this.router.navigate([redirectUrl]).catch(err => console.error('Navigation error:', err));
      }
    }
  }
}

//       try {
//         const parsedUrl = new URL(redirectUrl);

//         // Full URL → different origin → use window.location.href
//         if (parsedUrl.origin !== window.location.origin) {
//           window.location.href = redirectUrl;
//         } else {
//           // Same origin → SPA route
//           this.router.navigate([parsedUrl.pathname]).catch(err => console.error('Navigation error:', err));
//         }
//       } catch (e) {
//         // Not a full URL → assume SPA route
//         this.router.navigate([redirectUrl]).catch(err => console.error('Navigation error:', err));
//       }
//     }
//   }
// }
