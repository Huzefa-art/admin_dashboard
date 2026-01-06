import { Injectable } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { filter, distinctUntilChanged, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class BreadcrumbService {
    private breadcrumbs$ = new BehaviorSubject<Array<{ label: string, url: string }>>([]);
    currentPage: string | undefined;

    constructor(private router: Router, private activatedRoute: ActivatedRoute) {
        this.router.events
          .pipe(
            filter(event => event instanceof NavigationEnd),
            distinctUntilChanged(),
            map(() => this.buildBreadcrumb(this.activatedRoute.root))
          )
          .subscribe((breadcrumbs) => this.breadcrumbs$.next(breadcrumbs));
      }

      private buildBreadcrumb(route: ActivatedRoute, url: string = '', breadcrumbs: Array<any> = []): Array<any> {
        const children: ActivatedRoute[] = route.children;

        if (children.length === 0) {
          return breadcrumbs;
        }

        for (const child of children) {
          const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
          if (routeURL !== '') {
            url += `/${routeURL}`;
          }


          const label = child.snapshot.data['breadcrumb'];
          if (label) {
            breadcrumbs.push({ label, url });
          }

          return this.buildBreadcrumb(child, url, breadcrumbs);
        }

        return breadcrumbs;
      }

      getBreadcrumbs() {
        return this.breadcrumbs$.asObservable();
      }

      setBreadcrumbs(breadcrumbs: Array<{ label: string; url: string }>) {
        this.breadcrumbs$.next(breadcrumbs);
      }



setCurrentPage(page: string) {
    this.currentPage = page; // Set the current page title (e.g., "Home", "Docs")
}

}
