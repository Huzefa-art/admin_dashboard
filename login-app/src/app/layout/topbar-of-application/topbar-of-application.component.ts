import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { ApiAiService } from '../../service/apiAiService';
import { filter } from 'rxjs/operators';
import { DocumentService } from '../../service/document.service';
import { TopBarServiceService } from '../../top-bar-service.service';
import { BreadcrumbComponent } from '../breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-topbar-of-application',
  standalone: true,
  imports: [CommonModule, RouterModule, BreadcrumbComponent],
  templateUrl: './topbar-of-application.component.html',
  styleUrl: './topbar-of-application.component.css',
})
export class TopbarOfApplicationComponent {
  isDarkMode = false;
  isDropdownOpen = false;

  userName: string = '';
  final: string = '';
  designation: string = '';

  isHomePage: boolean = false;

  selectedOption: string = 'gpt';
  orgName: any;
  goTelcoBanner: boolean = false;


  Dashboard: boolean = false;;
  Templates: boolean = false;;
  GenerateDocUsingAI: boolean = false;;
  ManageDocumentsProjects: boolean = false;;
  DocumentsRepository: boolean = false;;
  AddtoRepository: boolean = false;;
  ManageUsers: boolean = false;;
  AutoDetails: boolean = false;;
  AddFeatures: boolean = false;;
  AddLevels: boolean = false;;
  AddFunctions: boolean = false;;
  AddDepartments: boolean = false;;
  AssignFeatures: boolean = false;;
  AssignDepartments: boolean = false;
  flowChartComponent: boolean = false;
  organizationStructure: boolean = false;


  constructor(
    private router: Router,
    private authService: AuthService,
    private renderer: Renderer2,
    private _yourApiService: ApiAiService,
    private topbarService: TopBarServiceService,
    private documentService: DocumentService
  ) { }

  generateNewPageContent = false;
  viewUsersLIst: boolean = false;
  ocrDoctList: boolean = false;
  templateContent: boolean = false;
  options = [
    { label: 'Open AI', value: 'gpt', enabled: true },
    { label: 'Perplexity', value: 'perplexity', enabled: true },
    { label: 'Deep Seek', value: 'deepseek', enabled: true },
  ];

  checkIfHome(): void {
    this.isHomePage = this.router.url === '/app/home'; // adjust if your home route is different
  }
  showProfileDropdown = false;

  toggleProfileDropdown() {
    setTimeout(() => {
      this.showProfileDropdown = !this.showProfileDropdown;
    }, 0);
  }



  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.addClass(document.body, 'dark-mode');
    } else {
      this.renderer.removeClass(document.body, 'dark-mode');
    }
  }
  ngOnInit(): void {
    this.GetUserInfo();
    this.checkIfHome();

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.checkIfHome();
      });

    this.topbarService.customContent$.subscribe((value: any) => {
      this.generateNewPageContent = value;
    });
    this.topbarService.viewUsersList$.subscribe((value: any) => {
      this.viewUsersLIst = value;
    });
    this.topbarService.ocrDocList$.subscribe((value: any) => {
      this.ocrDoctList = value;
    });
    this.topbarService.templateScreen$.subscribe((value: any) => {
      this.templateContent = value;
    });

    this.documentService.getSelectedOption().subscribe((option) => {
      this.selectedOption = option;
    });
  }



  closeDropdown() {
    this.isDropdownOpen = false;
  }



  goToUploadDoc() {
    this.router.navigate(['/app/upload_document']);
  }

  logout() {
    this.authService.logOut();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  GetUserInfo(): void {
    this._yourApiService.GetUserInfo().subscribe(
      (response) => {
        if (response && response.name) {
          const isAdmin = response?.role?.name === 'admin';
          this.userName = response.name;
          const nameParts = this.userName.split(' ');
          const firstName = nameParts[0];
          this.designation = response.designation;
          const lastName = nameParts[nameParts.length - 1];
          const firstChar = firstName[0];
          const lastChar = lastName[0];
          const final = firstChar + lastChar;
          this.final = final;

          if (response && response.api_key) {
            this.options = this.options.map((option) => {
              if (option.value === 'openai') {
                return { ...option, enabled: response.api_key.gpt };
              } else if (option.value === 'perplexity') {
                return { ...option, enabled: response.api_key.perplexity };
              }
              return option;
            });
          }

          if (isAdmin) {
            this.Dashboard = true;
            this.Templates = true;
            this.GenerateDocUsingAI = true;
            this.ManageDocumentsProjects = true;
            this.DocumentsRepository = true;
            this.AddtoRepository = true;
            this.ManageUsers = true;
            this.AddFeatures = true;
            this.AddLevels = true;
            this.AddFunctions = true;
            this.AddDepartments = true;
            this.AssignFeatures = true;
            this.AssignDepartments = true;
            this.flowChartComponent = true;
            this.organizationStructure = true;
          } else {
            // set access by `can_access` flags which are not admin

            const features = response.access_levels?.[0]?.features || [];

            const hasAccess = (code: string): boolean =>
              features.some((f: any) => f.feature?.code === code && f.can_access === true);

            this.Dashboard = hasAccess('dashboard_stats');
            this.Templates = hasAccess('template');
            this.GenerateDocUsingAI = hasAccess('generate_document');
            this.ManageDocumentsProjects = hasAccess('projects');
            this.DocumentsRepository = hasAccess('documents_repository');
            this.AddtoRepository = true; // ← keep always allowed, if needed
            this.ManageUsers = hasAccess('manage_users');
            this.AddFeatures = hasAccess('add_features');
            this.AddLevels = hasAccess('add_levels');
            this.AddFunctions = hasAccess('add_functions'); // ← if tied to a feature, check with `hasAccess('...')`
            this.AddDepartments = hasAccess('add_departments'); // same as above
            this.AssignFeatures = hasAccess('assign_features');
            this.AssignDepartments = hasAccess('assign_departments');
            this.flowChartComponent = hasAccess('flow_architecture');

            if (this.AssignDepartments || this.AssignFeatures || this.AddDepartments || this.AddFunctions || this.AddLevels || this.AddFeatures || this.flowChartComponent) {
              this.organizationStructure = true;
            }
          }

          const orgName = response?.organization?.name;
          if (orgName) {
            this.orgName = orgName.toLowerCase();
            this.goTelcoBanner = false;
            if (this.orgName.includes('go telecom')) {
              // Handle Go Telecom case
              this.goTelcoBanner = true;
            }
          }

        }
      },
      (error) => {
        console.error('Error fetching user info', error);
      }
    );
  }

  onOptionChange(option: any): void {
    this.documentService.setSelectedOption(option);
    this.closeDropdown();
  }

  onNewChat() {
    this.goToNewPageFromTopbar();
  }
  onNewTemplate() {
    this.goToTemplateFromTopbar();
  }

  routeToAddNewUser() {
    this.router.navigate(['/app/addNewUser']);
  }

  routeToUploadDoc() {
    this.router.navigate(['/app/upload_document']);
  }



  goToNewPageFromTopbar() {

    this.topbarService.setFromTopbar(true);
    this.router.navigate(['/app/new-page'], {
      state: {
        fromTopbar: true
      }
    });
  }

  goToTemplateFromTopbar() {
    this.topbarService.setTemplateContent(true);
    this.router.navigate(['/app/template'], {
      state: {
        fromTopbarTemplate: true
      }
    });
  }

  // goToTemplateFromTopbar() {
  //   this.topbarService.setTemplateContent(true);

  //   this.router.navigate(['/app/template'], {
  //     queryParams: { isDocument: true, fromTopbarTemplate: true }
  //   });
  // }

}
