import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BreadcrumbService } from '../../service/breadcrumb.service';

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.css'
})
export class BreadcrumbComponent implements OnInit {

  //isBreadcrumbDisabled: boolean = true;
  isBreadcrumbDisabled: boolean = false;

  breadcrumbs: Array<{ label: string, url: string }> = [];

  constructor(private breadcrumbService: BreadcrumbService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.breadcrumbService.getBreadcrumbs().subscribe(breadcrumbs => {
      this.breadcrumbs = breadcrumbs;
    });
    this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.breadcrumbs = this.createBreadcrumbs(this.activatedRoute.root);
      }
    });

  }

  currentPage: string | undefined;

  setCurrentPage(page: string) {
    this.currentPage = page; // Set the current page title (e.g., "Home", "Docs")
  }

  decodeUrl(url: string): string {
    return decodeURIComponent(url);
  }

  createBreadcrumbs(route: ActivatedRoute, url: string = '', breadcrumbs: Array<{ label: string; url: string }> = []): Array<{ label: string; url: string }> {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      if (routeURL !== 'home') {
        var label = child.snapshot.data['breadcrumb'];
        breadcrumbs.push({ label: label == 'app' ? 'Home' : label || routeURL, url });
      }


      // const label = child.snapshot.data['breadcrumb'] || routeURL;
      // const isHome = url === '/';
      // breadcrumbs.push({ label: isHome ? 'Home' : label, url });

      //breadcrumbs.push({ label: child.snapshot.data['breadcrumb'] || routeURL, url });
      return this.createBreadcrumbs(child, url, breadcrumbs); // Recursive call
    }
    return breadcrumbs;
  }

  onBreadcrumbClick(url: string): void {
    this.router.navigate([url]);
  }
}
