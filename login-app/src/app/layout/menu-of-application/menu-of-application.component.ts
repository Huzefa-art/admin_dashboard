import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { ApiAiService } from '../../service/apiAiService';
import { DocumentService } from '../../service/document.service';
import { BreadcrumbService } from '../../service/breadcrumb.service';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { AuthService } from '../../service/auth.service';
import { Title } from '@angular/platform-browser';
import { Renderer2 } from '@angular/core';

@Component({
  selector: 'app-menu-of-application',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-of-application.component.html',
  styleUrls: ['./menu-of-application.component.scss']
})
export class MenuOfApplicationComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  menuOpen: boolean = false;
  activeDocumentId: number | null = null;
  activeTemplateId: number | null = null;
  documentsOpen: boolean = false;
  featureOpen: boolean = false;
  departmentOpen: boolean = false;
  manageUsersOpen: boolean = false;
  templatesOpen: boolean = false;
  structureOpem: boolean = false;
  projectsOpen: boolean = false;
  uploadDocumentOpen: boolean = false;
  mergerSpan: boolean = false;
  uploadTemplateOpen: boolean = false;
  viewTemplateOpen: boolean = false;
  templatesListOpen: boolean = false;
  ocrDocListOpen: boolean = false;
  autoFillOpen: boolean = false;
  documentTagger: boolean = false;
  documentTaggerButton: boolean = false;
  addFeaturesOpen: boolean = false;
  addLevelsOpen: boolean = false;
  addFunctionsOpen: boolean = false;
  addDepartmentsOpen: boolean = false;
  assignFeaturesOpen: boolean = false;
  assignDepartmentsOpen: boolean = false;
  flowChartOpen: boolean = false;

  dashboardDocument: boolean = false;
  newPageDocument: boolean = false;
  proposalRFPDocument: boolean = false;
  addNewUserSpan: boolean = false;
  viewUserSpan: boolean = false;
  bulkUploadDocSpan: boolean = false;
  simpleUploadDocSpan: boolean = false;
  documentsList: any[] = [];
  templatesList: any[] = [];
  expandedDocumentId: number | null = null; // Track which document is expanded
  expandedTemplateId: number | null = null;
  headingsMap: { [key: number]: any[] } = {};
  templatesNamesMap: { [key: number]: any[] } = {};
  expandedSectionId: number | null = null;
  expandedSubSectionId: number | null = null;
  userName: string = '';
  final: string = '';
  organizationStructure: boolean = false;

  options = [
    { label: 'Open AI', value: 'gpt', enabled: true },
    { label: 'Perplexity', value: 'perplexity', enabled: true },
    { label: 'Deep Seek', value: 'deepseek', enabled: true },
  ];
  isDropdownVisible: boolean = true;
  selectedOption: string = '';

  selectedDocumentId: number | null = null; // Tracks the selected document
  selectedTemplateId: number | null = null;
  selectedHeadingId: number | null = null;
  selectedTemplateNameId: number | null = null;
  private routerSubscription!: Subscription;
  goTelecom: boolean = false;
  inseyab: boolean = false;
  mod: boolean = false;
  fusionai: boolean = false;
  civilDefence: boolean = false;
  level1Options: boolean = false;
  Dashboard: boolean = false;;
  Templates: boolean = false;;
  GenerateDocUsingAI: boolean = false;;
  GenerateProposalUsingAI: boolean = false;
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

  constructor(private router: Router, private _yourApiService: ApiAiService, private documentService: DocumentService, private breadcrumbService: BreadcrumbService, private cdr: ChangeDetectorRef, private activatedRoute: ActivatedRoute, private authService: AuthService, private titleService: Title,
    private renderer: Renderer2) {

  }

  ngOnInit(): void {

    // this.routerSubscription = this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //    // this.resetMenu();
    //     this.clearSelectedDocument();
    //   }
    // });


    // this.getDocumentList();
    // this.getTemplatesList();
    this.GetUserInfo();
    this.getUserInfoForPermission();
    // this.selectedOption = this.documentService.getSelectedOption();
    // this.onOptionChange('openai');
    this.documentService.getSelectedOption().subscribe((option) => {
      this.selectedOption = option;
    });

    this.documentService.templateCreated$.subscribe(() => {
      this.getTemplatesList();
      this.cdr.detectChanges();
    });

    this.documentService.documentCreated$.subscribe(() => {
      this.getDocumentList();
      this.cdr.detectChanges();
    });

    // this.documentService.documentHeadingsUpdated$.subscribe((documentId: number) => {
    //   this._yourApiService.getCompleteDocument(documentId).subscribe((res) => {
    //     this.headingsMap[documentId] = res.sections;
    //     this.cdr.detectChanges();
    //   });
    // });

    // this.documentService.templateHeadingsUpdated$.subscribe((templateId: number) => {
    //   this._yourApiService.seeTemplate(templateId).subscribe((res) => {
    //     this.templatesNamesMap[templateId] = res.sections;
    //     this.cdr.detectChanges();
    //   });
    // });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        this.dashboardDocument = event.url.includes('/app/dashboard');

        this.uploadTemplateOpen = event.url.includes('/app/template');
        this.viewTemplateOpen = event.url.includes('/app/View-Templates');

        // if (url.includes('/app/template')) {
        //   this.activeTemplate = 'Create a template';
        // } else if (url.includes('/app/View-Templates')) {
        //   this.activeTemplate = 'View Templates';
        // } else {
        //   this.activeTemplate = null;
        // }
        this.projectsOpen = event.url.includes('/app/project');
        this.newPageDocument = event.url.includes('/app/new-page');
        this.proposalRFPDocument = event.url.includes('/app/rfpropose');
        this.ocrDocListOpen = event.url.includes('/app/ocrDocList');
        this.uploadDocumentOpen = event.url.includes('/app/upload_document');
        this.addNewUserSpan = event.url.includes('/app/addNewUser');
        this.viewUserSpan = event.url.includes('/app/viewUserList');
        this.mergerSpan = event.url.includes('/app/merger');
        this.bulkUploadDocSpan = event.url.includes('/app/bulk-doc');
        this.simpleUploadDocSpan = event.url.includes('/app/simple-doc');
        this.autoFillOpen = event.url.includes('/app/autoFill');
        this.addFeaturesOpen = event.url.includes('/app/features');
        this.addLevelsOpen = event.url.includes('/app/levels');
        this.addFunctionsOpen = event.url.includes('/app/functions');
        this.addDepartmentsOpen = event.url.includes('/app/departments');
        this.assignFeaturesOpen = event.url.includes('/app/level-features');
        this.assignDepartmentsOpen = event.url.includes('/app/level-departments');
        this.flowChartOpen = event.url.includes('/app/architecture');
      }
    });

  }

  ngAfterViewInit() {
    // For Bootstrap 5 (without jQuery)
    // const tooltipTriggerList = Array.from(document.querySelectorAll('[data-toggle="tooltip"]'))
    // tooltipTriggerList.forEach((el: any) => {
    //   new bootstrap.Tooltip(el);
    // });
  }


  ngOnDestroy(): void {
    // if (this.routerSubscription) {
    //   this.routerSubscription.unsubscribe();
    // }
    this.clearSelectedDocument();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    const sidebar = document.querySelector('.layout-sidebar');
    if (sidebar) {
      sidebar.classList.toggle('active');
    } else {
      // console.error('Sidebar element not found.');
    }
  }

  //   GetUserInfo(): void {
  //     this._yourApiService.GetUserInfo().subscribe(
  //       (response) => {

  //      if (response.access_levels && response.access_levels.length > 0) {
  //   const levelName = response.access_levels[0].level_name;

  //   if (levelName === "Level 1") {
  //     this.Dashboard = true;
  //     this.Templates = true;
  //     this.GenerateDocUsingAI = true;
  //     this.ManageDocumentsProjects = true;
  //     this.DocumentsRepository = true;
  //     this.AddtoRepository = true;
  //     this.ManageUsers = true;
  //     this.AutoDetails = true;
  //     this.AddFeatures = true;
  //     this.AddLevels = true;
  //     this.AddFunctions = true;
  //     this.AddDepartments = true;
  //     this.AssignFeatures = true;
  //     this.AssignDepartments = true;
  //     this.flowChartComponent = true;
  //   } else if (levelName === "Level 2") {
  //     // You can set limited permissions here if needed
  //        this.Dashboard = true;
  //         this.Templates = true;
  //   this.AddtoRepository = true;
  //      this.GenerateDocUsingAI = true;
  //     this.ManageDocumentsProjects = true;
  //     this.DocumentsRepository = true;
  //        this.AutoDetails = true;
  //   }
  //   else if (levelName === "Level 3") {
  //   this.AddtoRepository = true;
  //   }
  // } else {
  //   // No access_levels at all (empty array), show only Bulk Upload
  //   this.AddtoRepository = true;
  // }

  //         if (response && response.name) {
  //           this.userName = response.name;
  //           const nameParts = this.userName.split(' ');

  //           const firstName = nameParts[0];
  //           const lastName = nameParts[nameParts.length - 1];

  //           const firstChar = firstName[0];
  //           const lastChar = lastName[0];

  //           const final = firstChar + lastChar;
  //           this.final = final;

  //           const orgName = response?.organization?.name;
  //           if (orgName) {
  //             this.setThemeByOrganization(orgName);
  //           }

  //           if (response && response.api_key) {
  //             // Update enabled state of options based on response
  //             this.options = this.options.map((option) => {
  //               if (option.value === 'openai') {
  //                 return { ...option, enabled: response.api_key.gpt };
  //               } else if (option.value === 'perplexity') {
  //                 return { ...option, enabled: response.api_key.perplexity };
  //               }
  //               return option;
  //             });
  //           }

  //           this.authService.setUserInfo(response);
  //           this.documentService.setDropdownOptions(this.options);

  //         }
  //       },
  //       (error) => {
  //         console.error('Error fetching user info', error);
  //       }
  //     );
  //   }

  GetUserInfo(): void {
    this._yourApiService.GetUserInfo().subscribe(
      (response) => {
        const isAdmin = response?.role?.name === 'admin';
        const orgName = response?.organization?.name?.toLowerCase() || '';

        // 🌟 Common info
        this.userName = response.name;
        const nameParts = this.userName.split(' ');
        const initials = nameParts[0][0] + nameParts[nameParts.length - 1][0];
        this.final = initials;


        this.baseColor = response.organization.base_color;
        this.textColor = response.organization.text_color;
        this.sidebarColor = response.organization.sidebar_color;
        this.logoMenu = response.organization.logo;
        this.favicon = response.organization.favicon;
        this.title_of_browser = response.organization.title_of_browser;
        // 🌟 Theme and branding
        if (orgName.includes('go telecom')) {
          this.titleService.setTitle('Go Telecom');
          this.setFavicon('assets/images/goTelco_Final.ico');
        } else if (orgName.includes('ministry of defence')) {
          this.titleService.setTitle('MOD');
          this.setFavicon('assets/images/MOD_Final.ico');
        } else if (orgName.includes('civil defense department')) {
          this.titleService.setTitle('CDefence');
          this.setFavicon('assets/images/cdefence-icon.ico');
        }
        else if (orgName.includes('fusion ai')) {
          this.titleService.setTitle('FusionAI');
          this.setFavicon('assets/images/FusionLogo.png');
        }
        else if (orgName.includes('inseyab')) {
          this.titleService.setTitle('Inseyab');
          this.setFavicon(this.favicon);
        }
        else if (orgName.includes('tradeforesight')) {
          this.titleService.setTitle('Trade foresight');
          this.setFavicon(this.favicon);
        }
        else if (orgName.includes('go money')) {
          this.documentTaggerButton = true;
        }

        else {
          if (this.title_of_browser || this.favicon) {
            this.titleService.setTitle(this.title_of_browser);
            this.setFavicon(this.favicon);
          }
          else {
            this.titleService.setTitle('AI DGMS');
            this.setFavicon('assets/images/AiDGMS_FavIcon.ico');
          }
        }
        // full access to Admin according to requriement
        if (isAdmin) {
          this.Dashboard = true;
          this.Templates = true;
          this.GenerateDocUsingAI = true;
          this.GenerateProposalUsingAI = true;
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
          this.GenerateProposalUsingAI = true;
        } else {
          // set access by `can_access` flags which are not admin

          const features = response.access_levels?.[0]?.features || [];

          const hasAccess = (code: string): boolean =>
            features.some((f: any) => f.feature?.code === code && f.can_access === true);

          this.Dashboard = hasAccess('dashboard_stats');
          this.Templates = hasAccess('template');
          this.GenerateDocUsingAI = hasAccess('generate_document');
          this.GenerateProposalUsingAI = hasAccess('rfp_generate');
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

        const orgNameFoTheme = response?.organization?.name;
        if (orgNameFoTheme) this.setThemeByOrganization(orgNameFoTheme);


        // 🌟 Special organization logic
        if (orgName.includes('go telecom') || orgName.includes('go money')) {
          this.Templates = false;
          this.GenerateDocUsingAI = false;
          this.GenerateProposalUsingAI = false;
        }

        // 🌟 API key logic (OpenAI, Perplexity)
        if (response?.api_key) {
          this.options = this.options.map(option => {
            if (option.value === 'openai') {
              return { ...option, enabled: response.api_key.gpt };
            } else if (option.value === 'perplexity') {
              return { ...option, enabled: response.api_key.perplexity };
            }
            return option;
          });
        }

        // 🌟 Set user info in services
        this.authService.setUserInfo(response);
        this.documentService.setDropdownOptions(this.options);
      },
      (error) => {
        console.error('Error fetching user info', error);
      }
    );
  }


  // GetUserInfo(): void {
  //   this._yourApiService.GetUserInfo().subscribe(
  //     (response) => {
  //       if (response?.role?.name === 'admin') {
  //         // ✅ Give all access
  //         this.Dashboard = true;
  //         this.Templates = true;
  //         this.GenerateDocUsingAI = true;
  //         this.ManageDocumentsProjects = true;
  //         this.DocumentsRepository = true;
  //         this.AddtoRepository = true;
  //         this.ManageUsers = true;
  //         this.AutoDetails = true;
  //         this.AddFeatures = true;
  //         this.AddLevels = true;
  //         this.AddFunctions = true;
  //         this.AddDepartments = true;
  //         this.AssignFeatures = true;
  //         this.AssignDepartments = true;
  //         this.flowChartComponent = true;
  //       } else {
  //         // ✅ Role is not admin – handle by access level
  //         const levelName = response.access_levels?.[0]?.level_name;

  //         if (levelName === 'Level 1') {
  //           this.Dashboard = true;
  //           this.Templates = true;
  //           this.GenerateDocUsingAI = true;
  //           this.ManageDocumentsProjects = true;
  //           this.DocumentsRepository = true;
  //           this.AddtoRepository = true;
  //           this.ManageUsers = true;
  //           this.AutoDetails = true;
  //           this.AddFeatures = true;
  //           this.AddLevels = true;
  //           this.AddFunctions = true;
  //           this.AddDepartments = true;
  //           this.AssignFeatures = true;
  //           this.AssignDepartments = true;
  //           this.flowChartComponent = true;
  //         } else if (levelName === 'Level 2') {
  //           this.Dashboard = true;
  //           this.Templates = true;
  //           this.AddtoRepository = true;
  //           this.GenerateDocUsingAI = true;
  //           this.ManageDocumentsProjects = true;
  //           this.DocumentsRepository = true;
  //           this.AutoDetails = true;
  //         } else if (levelName === 'Level 3') {
  //           this.AddtoRepository = true;
  //         }
  //         else if (levelName === 'Level 4') {
  //           this.AddtoRepository = true;
  //           this.DocumentsRepository = true;
  //         }
  //          else {
  //           // Empty level list
  //           this.AddtoRepository = true;
  //         }
  //       }

  //       // 🌟 Common info setup (same for all roles)
  //       this.userName = response.name;
  //       const nameParts = this.userName.split(' ');
  //       const initials = nameParts[0][0] + nameParts[nameParts.length - 1][0];
  //       this.final = initials;

  //       const orgName = response?.organization?.name;
  //       if (orgName) this.setThemeByOrganization(orgName);

  //         if (orgName.toLowerCase().includes('go telecom')) {
  //     this.Templates = false;
  //     this.GenerateDocUsingAI = false;
  //   }


  //       if(orgName){
  //          if (orgName.toLowerCase().includes('go telecom')) {
  //     this.titleService.setTitle('Go Teleco');
  //     this.setFavicon('assets/images/goTelco_Final.ico');
  //   } else if (orgName.toLowerCase().includes('ministry of defence')) {
  //     this.titleService.setTitle('MOD');
  //     this.setFavicon('assets/images/MOD_Final.ico');
  //   } else if (orgName.toLowerCase().includes('civil defense department')) {
  //     this.titleService.setTitle('CDefence');
  //     this.setFavicon('assets/images/cdefence-icon.ico');
  //   } else {
  //     this.titleService.setTitle('AI DGMS');
  //     this.setFavicon('assets/images/AiDGMS_FavIcon.ico');
  //   }
  //       }

  //       if (response?.api_key) {
  //         this.options = this.options.map(option => {
  //           if (option.value === 'openai') {
  //             return { ...option, enabled: response.api_key.gpt };
  //           } else if (option.value === 'perplexity') {
  //             return { ...option, enabled: response.api_key.perplexity };
  //           }
  //           return option;
  //         });
  //       }

  //       this.authService.setUserInfo(response);
  //       this.documentService.setDropdownOptions(this.options);
  //     },
  //     (error) => {
  //       console.error('Error fetching user info', error);
  //     }
  //   );
  // }

  setFavicon(iconUrl: string): void {
    const link: HTMLLinkElement = this.renderer.createElement('link');
    link.setAttribute('rel', 'icon');
    link.setAttribute('type', 'image/x-icon');
    link.setAttribute('href', iconUrl);

    const existingFavicon = document.querySelector("link[rel*='icon']");
    if (existingFavicon) {
      existingFavicon.parentNode?.removeChild(existingFavicon);
    }

    this.renderer.appendChild(document.head, link);
  }

  // setFavicon(iconUrl: string) {
  //   const head = this.document.head;
  //   let existingIcon = head.querySelector("link[rel='icon']");

  //   if (existingIcon) this.renderer.removeChild(head, existingIcon);

  //   const link = this.renderer.createElement('link');
  //   this.renderer.setAttribute(link, 'rel', 'icon');
  //   this.renderer.setAttribute(link, 'href', iconUrl);

  //   this.renderer.appendChild(head, link);
  // }


  userRole: any;
  hideManageUsersOnAdmin: boolean = false;
  getUserInfoForPermission() {
    this._yourApiService.getAdminUserSingle().subscribe(
      (response: any) => {
        this.userRole = response.role.name;

        if (this.userRole == "admin") {
          this.hideManageUsersOnAdmin = true;
        }
      },
      (error: any) => {

      }
    );

  }
  gotoHome() {
    this.router.navigate(['/app/home']);
  }

  getDocumentList() {
    this._yourApiService.getDocumentList().subscribe(res => {
      this.documentsList = res;
      // this.filteredDocumentsList = res;
    });

  }

  getTemplatesList() {
    this._yourApiService.getTemplates().subscribe(
      (data: any[]) => {

        this.templatesList = data;
      },
      (error) => {
        console.error('Error fetching templates:', error);

        // Display a SweetAlert2 error popup
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Failed to fetch templates. Please try again later.',
          footer: 'Contact support if the issue persists.',
        });
      }
    );
  }

  templateOptions = ['Create a template', 'View Templates'];
  activeTemplate: string | null = null;
  toggleTemplates(event: Event) {
    this.templatesOpen = !this.templatesOpen;
    this.templatesListOpen = false;
    this.documentsOpen = false;
    this.projectsOpen = false;
    this.uploadDocumentOpen = false;
    this.ocrDocListOpen = false;
    this.dashboardDocument = false;
    this.featureOpen = false;
    this.departmentOpen = false;
    event.stopPropagation();
  }

  toggleOrganizationStructure(event: Event) {
    this.structureOpem = !this.structureOpem;
    this.templatesListOpen = false;
    this.templatesOpen = false;
    this.documentsOpen = false;
    this.projectsOpen = false;
    this.uploadDocumentOpen = false;
    this.ocrDocListOpen = false;
    this.dashboardDocument = false;
    this.featureOpen = false;
    this.departmentOpen = false;
    event.stopPropagation();
  }

  toggleTemplatesList(event: Event) {
    this.templatesListOpen = !this.templatesListOpen;
    this.documentsOpen = false;
    this.templatesOpen = false;
    this.projectsOpen = false;
    this.uploadDocumentOpen = false;
    this.ocrDocListOpen = false;
    this.dashboardDocument = false;
    this.featureOpen = false;
    this.departmentOpen = false;
    event.stopPropagation();
  }

  toggleProjects(event: Event) {
    this.projectsOpen = !this.projectsOpen;
    this.templatesListOpen = false;
    this.documentsOpen = false;
    this.templatesOpen = false;
    this.uploadDocumentOpen = false;
    this.ocrDocListOpen = false;
    this.dashboardDocument = false;
    this.featureOpen = false;
    this.departmentOpen = false;
    event.stopPropagation();
  }

  toggleOpenDocument(event: Event) {
    this.uploadDocumentOpen = !this.uploadDocumentOpen;
    this.templatesListOpen = false;
    this.documentsOpen = false;
    this.templatesOpen = false;
    this.projectsOpen = false;
    this.ocrDocListOpen = false;
    this.dashboardDocument = false;
    this.featureOpen = false;
    this.departmentOpen = false;
    event.stopPropagation();
  }

  toggleOCRDocList(event: Event) {
    this.ocrDocListOpen = !this.ocrDocListOpen;
    this.templatesListOpen = false;
    this.documentsOpen = false;
    this.templatesOpen = false;
    this.uploadDocumentOpen = false;
    this.dashboardDocument = false;
    this.featureOpen = false;
    this.departmentOpen = false;
    event.stopPropagation();
  }

  setActiveTemplate(option: string) {
    // Set the clicked option as active
    this.activeTemplate = option;
    // Keep the dropdown open after an option is clicked

    if (option === 'Create a template') {
      this.router.navigate(['/app/template']);
    } else if (option === 'View Templates') {
      this.router.navigate(['/app/View-Templates']);
    }

    this.templatesOpen = true;
  }

  // navigateToTemplate() {
  //   this.router.navigate(['/app/template']);
  // }

  navigateToViewTemplate() {
    this.router.navigate(['/app/View-Templates']);
  }



  toggleDocuments(event: Event): void {
    this.documentsOpen = !this.documentsOpen;
    this.templatesOpen = false;
    this.templatesListOpen = false;
    this.featureOpen = false;
    this.departmentOpen = false;
    event.stopPropagation(); // Prevent the click from propagating to the document listener
  }

  toggleManageUsers(event: Event) {
    this.templatesOpen = false;
    this.templatesListOpen = false;
    this.documentsOpen = false;
    this.featureOpen = false;
    this.departmentOpen = false;
    this.manageUsersOpen = !this.manageUsersOpen;
    event.stopPropagation();
  }

  toggleDocumentOpen(event: Event) {
    this.templatesOpen = false;
    this.templatesListOpen = false;
    this.manageUsersOpen = false;
    this.documentsOpen = !this.documentsOpen;
    this.featureOpen = false;
    this.departmentOpen = false;
    event.stopPropagation();
  }

  toggleFeaturesOpen(event: Event) {
    this.templatesOpen = false;
    this.templatesListOpen = false;
    this.manageUsersOpen = false;
    this.documentsOpen = false;
    this.featureOpen = !this.featureOpen;
    this.departmentOpen = false;
    event.stopPropagation();
  }
  toggleDepartmentOpen(event: Event) {
    this.templatesOpen = false;
    this.templatesListOpen = false;
    this.manageUsersOpen = false;
    this.documentsOpen = false;
    this.featureOpen = false;
    this.departmentOpen = !this.departmentOpen;
    event.stopPropagation();
  }


  filteredDocumentsList: any[] = [];
  toggleDocument(documentId: number) {
    if (this.expandedDocumentId === documentId) {
      // Collapse the document if it's already expanded
      // this.filteredDocumentsList = this.documentsList;
      this.openDocument(documentId);
      this.expandedDocumentId = null;
      this.selectedDocumentId = null;
    } else {
      this.expandedDocumentId = documentId;
      this.selectedDocumentId = documentId; // Set selected document
      //this.activeDocumentId = documentId;
      // this.filteredDocumentsList = [this.documentsList.find(doc => doc.id === documentId)];
      this.openDocument(documentId);
      this.documentService.setHeadingId(null);
      // Check if headings are already fetched for this document
      if (!this.headingsMap[documentId]) {
        this._yourApiService.getCompleteDocument(documentId).subscribe(res => {
          this.headingsMap[documentId] = res.sections; // Store sections (headings) for this document
        });
      }
    }
    if (this.activeDocumentId === documentId) {
      this.activeDocumentId = null; // Deselect if the same document is clicked
    } else {
      this.activeDocumentId = documentId; // Set the new active document
      // this.onDocumentClick(documentId);
    }
  }

  toggleTemplate(templateId: number) {

    if (this.expandedTemplateId === templateId) {
      this.openTemplate(templateId);
      this.expandedTemplateId = null;
      this.selectedTemplateId = null;
    } else {
      this.expandedTemplateId = templateId;
      this.selectedTemplateId = templateId;
      this.openTemplate(templateId);
      this.documentService.setTemplateNamesHeadingId(null);
      // Check if headings are already fetched for this document

      if (!this.templatesNamesMap[templateId]) {
        this._yourApiService.seeTemplate(templateId).subscribe(res => {
          this.templatesNamesMap[templateId] = res.sections; // Store sections (headings) for this document
        });
      }

    }
    if (this.activeTemplateId === templateId) {
      this.activeTemplateId = null; // Deselect if the same document is clicked
    } else {
      this.activeTemplateId = templateId; // Set the new active document
      // this.onDocumentClick(documentId);
    }
  }

  resetMenu() {
    this.filteredDocumentsList = this.documentsList; // Show all documents again
    this.expandedDocumentId = null;
    this.activeDocumentId = null;
  }

  onDocumentClick(documentId: number) {
    // Get the document's sections (headings)



    const sections = this.headingsMap[documentId] || [];

    const sectionContents = sections.map(section => ({
      heading: section.heading,
      content: section.section_contents[0]?.content || '',
      subsections: section.subsections || []
    }));

    // Store or send the document's full sections to the new-page component
    this.documentService.setDocumentSections(sectionContents);

    // Navigate to new-page component
    this.router.navigate(['/app/new-page']);
  }


  openDocument(documentId: number) {
    // Check if headings are already fetched for this document
    this.documentService.setDocumentId(documentId);
    // this.filteredDocumentsList = [this.documentsList.find(doc => doc.id === documentId)];
    const documentTitle = this.getDocumentTitleById(documentId);
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Home', url: '/' }, // Parent page for documents
      // { label: 'Documents', url: '/documents' }, // Parent page for documents
      { label: documentTitle, url: `/${documentId}` } // Document name
    ]);

    if (!this.headingsMap[documentId]) {
      this._yourApiService.getCompleteDocument(documentId).subscribe(res => {
        const mainId = res.id;
        this.headingsMap[documentId] = res.sections; // Store sections (headings) for this document
        const sectionContents = res.sections.map((section: any) => ({
          id: section.id,
          heading: section.heading,

          section_contents: section.section_contents.map((content: any) => ({
            id: content.id, // Include content ID
            content: content.content,
            creation_date: content.creation_date,
            created_by: content.created_by,
            last_update_date: content.last_update_date,
            last_updated_by: content.last_updated_by,
          })),

          content: section.section_contents[0]?.content || '',
          subsections: section.subsections || []
        }));

        this.documentService.setDocumentSections(sectionContents);
        // this.breadcrumbService.setBreadcrumbs([
        //   { label: 'Home', url: '/' }, // Parent page for documents
        //   { label: documentTitle, url: `/${documentId}` } // Document name
        // ]);
        //  this.router.navigate(['/app/new-page']);
        this.router.navigate(['/app/new-page'], { queryParams: { id: mainId } });
        this.documentService.triggerDocTitle();
        // this.breadcrumbService.setBreadcrumbs([
        //   { label: 'Home', url: '/' },
        //   { label: documentTitle, url: `/${documentId}` }
        // ]);

        // this.router.navigate(['/app/new-page'], { queryParams: { id: documentId, title: documentTitle } });

      });
    } else {
      // If headings are already fetched, directly navigate
      const sections = this.headingsMap[documentId];
      const sectionContents = sections.map(section => ({
        heading: section.heading,
        content: section.section_contents[0]?.content || '',

        section_contents: section.section_contents.map((content: any) => ({
          id: content.id, // Include content ID
          content: content.content,
          creation_date: content.creation_date,
          created_by: content.created_by,
          last_update_date: content.last_update_date,
          last_updated_by: content.last_updated_by,
        })),
        subsections: section.subsections || []
      }));

      this.documentService.setDocumentSections(sectionContents);


      this.router.navigate(['/app/new-page'], { queryParams: { id: documentId } });
      // this.router.navigate(['/app/new-page']);

    }
  }

  openTemplate(templateId: number) {

    this.documentService.setTemplateId(templateId);
    const templateTitle = this.getTemplateTitleById(templateId);
    this.breadcrumbService.setBreadcrumbs([
      { label: 'Home', url: '/' },
      { label: 'Templates', url: 'View-Templates' },
      { label: templateTitle, url: `/app/template?id=${templateId}` } // Document name
    ]);

    if (!this.templatesNamesMap[templateId]) {
      this._yourApiService.seeTemplate(templateId).subscribe(res => {

        const mainId = res.id;
        this.templatesNamesMap[templateId] = res.sections; // Store sections (headings) for this document
        const sectionContents = res.sections.map((section: any) => ({
          id: section.id,
          template: section.template,
          heading: section.heading,
          subsections: section.subsections || []
        }));

        this.documentService.setTemplateSections(sectionContents);
        this.router.navigate(['/app/template'], { queryParams: { id: mainId } });
        this.documentService.triggerDocTitle();
      });
    } else {
      const sections = this.templatesNamesMap[templateId];
      const sectionContents = sections.map(section => ({
        id: section.id,
        template: section.template,
        heading: section.heading,
        subsections: section.subsections || []
      }));

      this.documentService.setTemplateSections(sectionContents);
      this.router.navigate(['/app/template'], { queryParams: { id: templateId } });

    }

  }

  // previewDocument(document: any) {
  //   // Set the current documentNumber and load all sections
  //   this.documentNumber = document.id;

  //   // Populate combinedLines with all sections and their contents
  //   this.combinedLines = document.sections.map(section => ({
  //     type: 'title', content: section.heading
  //   })).concat(
  //     document.sections.flatMap(section => section.section_contents.map(content => ({
  //       type: 'input', content: content.content
  //     })))
  //   );

  //   // Now route to 'new-page' to display all sections
  //   this.router.navigate(['/new-page']); // Ensure 'new-page' is a valid route
  // }



  onHeadingClick(documentId: number, headingId: number, event: Event) {
    event.stopPropagation();
    this.selectedDocumentId = documentId; // Track the document to which the heading belongs
    this.selectedHeadingId = headingId;
    this.expandedSectionId = this.expandedSectionId === headingId ? null : headingId;
    // this.documentService.setDocumentId(documentId);
    this.documentService.setHeadingId(headingId);

    const documentTitle = this.getDocumentTitleById(documentId);
    const sectionTitle = this.getSectionTitleById(documentId, headingId);
    const documentUrl = this.formatUrl('/app/new-page', { id: documentId.toString() });
    const sectionUrl = this.formatUrl(`/app/new-page?id=${documentId}/sections`, { id: headingId.toString() });


    this.breadcrumbService.setBreadcrumbs([
      { label: 'Home', url: '/' }, // Adjust URL as necessary
      // { label: documentTitle, url: `/${documentId}` }, // URL to the document
      { label: documentTitle, url: `/app/new-page?id=${documentId}` },
      { label: sectionTitle, url: `/${documentId}/sections/${headingId}` } // URL to the section
    ]);

    // Navigate to the new page
    this.router.navigate(['/app/new-page'], { queryParams: { id: documentId } });


    // this.router.navigate(['/app/new-page']); // Adjust the route as needed
  }


  onTemplatesHeadingClick(templateId: number, nameId: number, event: Event) {
    event.stopPropagation();
    this.selectedTemplateId = templateId;
    this.selectedTemplateNameId = nameId;
    this.expandedSectionId = this.expandedSectionId === nameId ? null : nameId;
    this.documentService.setTemplateNamesHeadingId(nameId);

    const templateTitle = this.getTemplateTitleById(templateId);
    const sectionTitle = this.getTemplateSectionTitleById(templateId, nameId);
    const documentUrl = this.formatUrl('/app/template', { id: templateId.toString() });
    const sectionUrl = this.formatUrl(`/app/template?id=${templateId}/sections`, { id: nameId.toString() });


    this.breadcrumbService.setBreadcrumbs([
      { label: 'Home', url: '/' },
      { label: 'Templates', url: 'View-Templates' },
      { label: templateTitle, url: `/app/template?id=${templateId}` },
      { label: sectionTitle, url: `/${templateId}/sections/${templateId}` }
    ]);

    this.router.navigate(['/app/template'], { queryParams: { id: templateId } });
  }


  formatUrl(base: string, params: Record<string, string>): string {
    const queryParams = new URLSearchParams(params).toString();
    return `${base}?${queryParams}`;
  }

  onSubsectionClick(documentId: number, sectionId: number, subsectionId: number) {
    console.log(`Document ${documentId}, Section ${sectionId}, Subsection ${subsectionId} clicked.`);
    this.expandedSubSectionId = this.expandedSubSectionId === subsectionId ? null : subsectionId;

    // You can add any specific action for subsections here
  }

  onChildSubsectionClick(documentId: number, sectionId: number, subsectionId: number, childid: number) {
    console.log(`Document ${documentId}, Section ${sectionId}, Subsection ${subsectionId} clicked.`);
    // You can add any specific action for subsections here
  }



  getDocumentTitleById(documentId: number): string {
    const document = this.documentsList.find(doc => doc.id === documentId);
    return document ? document.title : '';
  }

  private getSectionTitleById(documentId: number, headingId: number): string {
    const section = this.headingsMap[documentId]?.find(sec => sec.id === headingId);
    return section ? section.heading : '';
  }

  getTemplateTitleById(templateId: number): string {
    const template = this.templatesList.find(doc => doc.id === templateId);
    return template ? template.name : '';
  }

  private getTemplateSectionTitleById(templateId: number, nameId: number): string {
    const section = this.templatesNamesMap[templateId]?.find(sec => sec.id === nameId);
    return section ? section.heading : '';
  }


  toggleDropdown(): void {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  onOptionChange(option: string): void {
    this.documentService.setSelectedOption(option);
  }

  clearSelectedDocument() {
    this.selectedDocumentId = null;
    this.selectedHeadingId = null;
  }

  clearSelectedTemplate() {
    this.selectedTemplateId = null;
    this.selectedTemplateNameId = null;
  }

  openProject(event: Event) {
    this.toggleProjects(event);
    this.router.navigate(['/app/project']);
  }

  openUploadDocument(event: Event) {
    //this.toggleOpenDocument(event);
    this.router.navigate(['/app/upload_document']);
    event.stopPropagation();
  }

  openUploadTemplate(event: Event) {
    //this.toggleOpenDocument(event);
    this.router.navigate(['/app/template']);
    event.stopPropagation();
  }
  openViewTemplate(event: Event) {
    //this.toggleOpenDocument(event);
    this.router.navigate(['/app/View-Templates']);
    event.stopPropagation();
  }

  openOCRDocList(event: Event) {
    this.documentService.setShowOCRDocument(false);
    // this.toggleOCRDocList(event);
    this.router.navigate(['/app/ocrDocList']);
    event.stopPropagation();
  }

  routeToDashboard(event: Event) {
    this.router.navigate(['/app/dashboard']);
    event.stopPropagation();
  }

  routeToNewPage(event: Event) {
    this.router.navigate(['/app/new-page']);
    event.stopPropagation();
  }


  goToNewPageFromMenu() {
    this.router.navigate(['/app/new-page'], {
      state: {
        fromMenu: true
      }
    });
  }
  goToProposalFromMenu() {
    this.router.navigate(['/app/rfpropose'], {
      state: {
        fromMenu: true
      }
    });
  }

  routeToAddNewUser(event: Event) {
    this.router.navigate(['/app/addNewUser']);
    event.stopPropagation();
  }
  routeToProposal(event: Event) {
    this.router.navigate(['/app/rfpropose']);
    event.stopPropagation();
  }

  routeToViewUser(event: Event) {
    this.router.navigate(['/app/viewUserList']);
    event.stopPropagation();
  }

  routeToMerger(event: Event) {
    this.router.navigate(['/app/merger']);
    event.stopPropagation();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClickT(event: Event): void {
    const clickedElement = event.target as HTMLElement;

    // Define conditions to prevent the dropdown from closing
    const isInsideDocumentDropdown = clickedElement.closest('.document-dropdown') !== null;
    const isOnDocumentDetailsPage = clickedElement.closest('.top-section') !== null;
    const isOnDocumentVersionBar = clickedElement.closest('.version_and_butonsBar') !== null;


    if (isInsideDocumentDropdown || isOnDocumentDetailsPage || isOnDocumentVersionBar) {
      return; // Do not close the dropdown
    }

    // Close the dropdown if clicking outside
    this.documentsOpen = false;
    this.templatesOpen = false;
    this.templatesListOpen = false;
    this.selectedDocumentId = null;
    this.activeTemplate = null;
  }



  //uploadBulkDocument working


  isBulkUploadModalOpen: boolean = false;
  bulkFiles: File[] = [];
  openBulkUploadModal() {
    // this.isBulkUploadModalOpen = true;
    // this.bulkUploadDocSpan = true;
    this.router.navigate(['/app/bulk-doc']);
  }

  openSimpleUploadModal() {
    // this.isBulkUploadModalOpen = true;
    // this.bulkUploadDocSpan = true;
    this.router.navigate(['/app/simple-doc']);
  }
  closeBulkUploadModal() {
    this.isBulkUploadModalOpen = false;
    this.bulkFiles = [];
  }
  onBulkFileSelected(event: any) {
    const files = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.bulkFiles.push(files[i]);
    }
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      for (let i = 0; i < event.dataTransfer.files.length; i++) {
        this.bulkFiles.push(event.dataTransfer.files[i]);
      }
    }
  }
  uploadBulkFiles() {
    const formData = new FormData();
    this.bulkFiles.forEach(file => {
      formData.append('files', file);
    });

    // Call API (Replace with your actual API service)
    this._yourApiService.bulkUploadDocumentOCR(formData).subscribe(
      (response) => {

        console.log("uploadDocumentUpload Dcms", response)
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Documents Updated successfully.',
          confirmButtonText: 'OK',
        });
      },
      (error) => {
        console.log("error of OCR API", error)
        Swal.fire({
          icon: 'error',
          title: 'Upload Failed',
          text: 'An error occurred while uploading the documents OCR. Please try again.',
          confirmButtonText: 'OK',
        });
      }
    )

    // Close modal after submission
    this.closeBulkUploadModal();
  }

  triggerFileUpload() {
    this.fileInput.nativeElement.click();
  }

  // --------------------------

  isDocumentTemplate: boolean = true; // default

  navigateToTemplate(isDocument: boolean): void {
    this.isDocumentTemplate = isDocument;
    this.uploadTemplateOpen = true;
    this.viewTemplateOpen = false;

    this.router.navigate(['/app/template'], {
      queryParams: { isDocument, id: null }
    });
  }
  baseColor: any;
  sidebarColor: any;
  textColor: any;
  logoMenu: any;
  favicon: any;
  title_of_browser: any;


  setThemeByOrganization(orgName: string): void {
    const root = document.documentElement;

    switch (orgName.toLowerCase()) {
      case 'go telecom':
        this.goTelecom = true
        root.style.setProperty('--gradient-bg', 'rgba(0, 73, 81, 1)');
        root.style.setProperty('--engineTextColor', '#014B53');
        root.style.setProperty('--tableHeader', '#066478');
        root.style.setProperty('--gradient-bg-active', '#4CE0D1');
        root.style.setProperty('--sidebarButtonsHover', 'white');
        root.style.setProperty('--gradient-bg-hover', '#006d71');
        root.style.setProperty('--addButtonColor', 'linear-gradient(92.77deg, #014B53 0%, #4CE0D1 136.58%)');
        root.style.setProperty('--addNewOnly', '#014B53');
        root.style.setProperty('--ocrToggleActive', '#066477');
        root.style.setProperty('--letsUploadDoc', '#046276');
        root.style.setProperty('--dropUIBorderDashed', '#05713A');
        root.style.setProperty('--dropFileText', '#014B53');
        root.style.setProperty('--inviteText', '#066478');
        root.style.setProperty('--inviteTextHover', '#044c5b');
        root.style.setProperty('--trackChangesButton', 'rgba(6, 100, 120, 0.2)');
        root.style.setProperty('--trackChangesButtonHover', 'rgba(6, 100, 120, 0.2)');
        root.style.setProperty('--view-buttonColor', 'rgba(6, 100, 120, 0.2)');
        root.style.setProperty('--colorOfUploadBox', '#008fa0');
        root.style.setProperty('--colorOfBackgroundUploadBox', '#f7fafa');
        root.style.setProperty('--documentByTags', 'linear-gradient(180deg, #004951 0%, #00A5B7 100%);');
        root.style.setProperty('--deleteButton', 'linear-gradient(99.75deg, #ff0000 1.72%, #ff6347 45.77%, #ff4500 96.01%)');
        root.style.setProperty('--background-of-buttons-menu', 'rgba(255, 255, 255, 0.15)');
        root.style.setProperty('--sidebarMatch', 'linear-gradient(0deg, rgba(1, 103, 116, 0.95), rgba(1, 103, 116, 0.95)');
        root.style.setProperty('--gradient-for-dcms-dark-green', 'linear-gradient(90.88deg, #004951 0%, #006672 100%)');
        root.style.setProperty('--color-for-Text', 'white');
        root.style.setProperty('--logOutMenu', 'var(--Zinc-100, #F4F4F5)');
        root.style.setProperty('--logOutText', 'black');
        root.style.setProperty('--logOutHover', 'black');
        root.style.setProperty('--avatarMenu', '#4CE0D1');
        root.style.setProperty('--avatarText', 'white');
        root.style.setProperty('--sideBarColor', 'linear-gradient(0deg, rgba(1, 103, 116, 0.95), rgba(1, 103, 116, 0.95))');
        root.style.setProperty('--colorForSideButtonsText', 'white');
        root.style.setProperty('--mainQuestion', '#046276');
        root.style.setProperty('--themeTextColor', '#066478');
        root.style.setProperty('--MenubarTextcolor', 'white');
        root.style.setProperty('--function-color-start', '#3B82F6');
        root.style.setProperty('--function-color-end', '#1E40AF');
        root.style.setProperty('--department-color-start', '#14B8A6');
        root.style.setProperty('--department-color-end', '#0F766E');
        root.style.setProperty('--sub-department-color-start', '#F97316');
        root.style.setProperty('--sub-department-color-end', '#EA580C');
        root.style.setProperty('--iconColor', '#014B53');
        root.style.setProperty('--iconStroke', '#014B53');
        root.style.setProperty('--themeColor', '#014B53');

        break;



      case 'tradeforesight':
        this.inseyab = true;
        const lighter1 = this.adjustColorBrightness(this.baseColor, 20); // 20% lighter
        const darker1 = this.adjustColorBrightness(this.baseColor, -10); // 10% darker


        const lighter51 = this.adjustColorBrightness(this.baseColor, 5);
        const lighter101 = this.adjustColorBrightness(this.baseColor, 10);
        const lighter201 = this.adjustColorBrightness(this.baseColor, 20);

        /*  50 % lighter (much brighter)  */
        const lighter501 = this.adjustColorBrightness(this.baseColor, 50);

        /*  80 % lighter (almost pastel) */
        const lighter801 = this.adjustColorBrightness(this.baseColor, 80);
        this.inseyab = true
        root.style.setProperty('--gradient-bg', this.baseColor);
        root.style.setProperty('--sideBarColor', this.sidebarColor);
        root.style.setProperty('--gradient-bg-active', lighter51);
        root.style.setProperty('--gradient-bg-hover', lighter51);
        root.style.setProperty('--engineTextColor', this.baseColor);
        root.style.setProperty('--tableHeader', this.baseColor);
        root.style.setProperty('--sidebarButtonsHover', this.textColor);
        root.style.setProperty('--addButtonColor', this.baseColor);
        root.style.setProperty('--addNewOnly', this.baseColor);
        root.style.setProperty('--ocrToggleActive', this.baseColor);
        root.style.setProperty('--letsUploadDoc', this.baseColor);
        root.style.setProperty('--dropUIBorderDashed', this.baseColor);
        root.style.setProperty('--dropFileText', this.baseColor);
        root.style.setProperty('--inviteText', this.baseColor);
        root.style.setProperty('--inviteTextHover', lighter51);
        root.style.setProperty('--trackChangesButton', darker1);
        root.style.setProperty('--trackChangesButtonHover', lighter51);
        root.style.setProperty('--view-buttonColor', this.baseColor);
        root.style.setProperty('--colorOfUploadBox', this.baseColor);
        root.style.setProperty('--colorOfBackgroundUploadBox', '#f7fafa');
        root.style.setProperty('--documentByTags', this.baseColor);
        root.style.setProperty('--deleteButton', 'linear-gradient(99.75deg, #ff0000 1.72%, #ff6347 45.77%, #ff4500 96.01%)');
        root.style.setProperty('--background-of-buttons-menu', this.baseColor);
        root.style.setProperty('--sidebarMatch', this.baseColor);
        root.style.setProperty('--gradient-for-dcms-dark-green', this.sidebarColor);
        root.style.setProperty('--color-for-Text', this.textColor);
        root.style.setProperty('--logOutMenu', 'var(--Zinc-100, #F4F4F5)');
        root.style.setProperty('--logOutText', 'black');
        root.style.setProperty('--logOutHover', 'black');
        root.style.setProperty('--avatarMenu', lighter201);
        root.style.setProperty('--avatarText', this.textColor);
        root.style.setProperty('--colorForSideButtonsText', this.textColor);
        root.style.setProperty('--mainQuestion', this.baseColor);
        root.style.setProperty('--themeTextColor', this.textColor);
        root.style.setProperty('--MenubarTextcolor', this.textColor);
        root.style.setProperty('--iconColor', this.baseColor);
        root.style.setProperty('--iconStroke', this.baseColor);
        root.style.setProperty('--themeColor', this.baseColor);

        break;


      // case 'ministry of defence':
      //   root.style.setProperty('--gradient-bg', '#8FA0D8');
      //   root.style.setProperty('--gradient-bg-active', '#8FA0D8');
      //   root.style.setProperty('--gradient-bg-hover', '#ABB9E4');
      //   root.style.setProperty('--addButtonColor', 'linear-gradient(92.77deg,rgb(2, 31, 137) 0%,rgb(172, 186, 255) 136.58%)');
      //   root.style.setProperty('--inviteText', '#066478');
      //   root.style.setProperty('--inviteTextHover', '#044c5b');
      //   root.style.setProperty('--trackChangesButton', 'rgba(6, 100, 120, 0.2)');
      //   root.style.setProperty('--trackChangesButtonHover', 'rgba(6, 100, 120, 0.2)');
      //   root.style.setProperty('--view-buttonColor', 'rgba(6, 100, 120, 0.2)');
      //   root.style.setProperty('--colorOfUploadBox', '#c7d3f0');
      //   root.style.setProperty('--colorOfBackgroundUploadBox', '#dbe2f7');
      //    root.style.setProperty('--documentByTags', 'linear-gradient(180deg, #004951 0%, #00A5B7 100%);');
      //   root.style.setProperty('--deleteButton', 'linear-gradient(99.75deg, #ff0000 1.72%, #ff6347 45.77%, #ff4500 96.01%)');
      //   root.style.setProperty('--background-of-buttons-menu', 'rgba(255, 255, 255, 0.2)');
      //   root.style.setProperty('--sidebarMatch', '#8FA0D8');
      //   root.style.setProperty('--gradient-for-dcms-dark-green', 'linear-gradient(90.88deg, #004951 0%, #006672 100%)');
      //   root.style.setProperty('--color-for-Text', 'white');
      //   break;

      // case 'civil defense department':
      //   root.style.setProperty('--gradient-bg', 'linear-gradient(270deg, #000643 0%, #000B7E 100%)');
      //   root.style.setProperty('--gradient-bg-hover', '#ABB9E4');
      //   root.style.setProperty('--gradient-bg-active', '#ABB9E4');
      //   root.style.setProperty('--addButtonColor', 'linear-gradient(92.77deg,rgb(13, 1, 83) 0%,rgb(98, 76, 224) 136.58%)');
      //   root.style.setProperty('--inviteText', '#066478');
      //   root.style.setProperty('--inviteTextHover', '#044c5b');
      //   root.style.setProperty('--trackChangesButton', 'rgba(6, 100, 120, 0.2)');
      //   root.style.setProperty('--trackChangesButtonHover', 'rgba(6, 100, 120, 0.2)');
      //   root.style.setProperty('--view-buttonColor', 'rgba(6, 100, 120, 0.2)');
      //   root.style.setProperty('--colorOfUploadBox', '#008fa0');
      //   root.style.setProperty('--colorOfBackgroundUploadBox', 'linear-gradient(270deg, #e6e9f8 0%, #d9ddf9 100%)');
      //    root.style.setProperty('--documentByTags', 'linear-gradient(180deg, #004951 0%, #00A5B7 100%);');
      //   root.style.setProperty('--deleteButton', 'linear-gradient(99.75deg, #ff0000 1.72%, #ff6347 45.77%, #ff4500 96.01%)');
      //   root.style.setProperty('--background-of-buttons-menu', 'rgba(255, 255, 255, 0.2)');
      //   root.style.setProperty('--sidebarMatch', '#000643');
      //   root.style.setProperty('--gradient-for-dcms-dark-green', 'linear-gradient(90.88deg, #654321 0%, #abcdef 100%)');
      //   root.style.setProperty('--color-for-Text', 'white');
      //   break;


      case 'ministry of defence':
        this.mod = true;
        // root.style.setProperty('--gradient-bg', 'linear-gradient(94.72deg, #05713A 0%, #05C168 100%)');
        root.style.setProperty('--gradient-bg', 'rgba(5, 153, 81, 1)');
        root.style.setProperty('--tableHeader', '#05713A');
        root.style.setProperty('--engineTextColor', '#05713A');
        root.style.setProperty('--gradient-bg-active', '#05713A');
        root.style.setProperty('--gradient-bg-hover', '#008545');
        root.style.setProperty('--sidebarButtonsHover', 'white');
        root.style.setProperty('--addButtonColor', 'linear-gradient(94.72deg, #05713A 0%, #05C168 100%)');
        root.style.setProperty('--addNewOnly', '#05713A');
        root.style.setProperty('--ocrToggleActive', '#05713A');
        root.style.setProperty('--letsUploadDoc', '#05713A');
        root.style.setProperty('--dropUIBorderDashed', '#05713A');
        root.style.setProperty('--dropFileText', '#05713A');
        root.style.setProperty('--inviteText', '#05713A');
        root.style.setProperty('--inviteTextHover', '#044c5b');
        root.style.setProperty('--trackChangesButton', 'rgba(6, 100, 120, 0.2)');
        root.style.setProperty('--trackChangesButtonHover', 'rgba(6, 100, 120, 0.2)');
        root.style.setProperty('--view-buttonColor', 'rgba(6, 100, 120, 0.2)');
        root.style.setProperty('--colorOfUploadBox', '#c7d3f0');
        root.style.setProperty('--colorOfBackgroundUploadBox', '#dbe2f7');
        root.style.setProperty('--documentByTags', 'linear-gradient(180deg, #004951 0%, #00A5B7 100%);');
        root.style.setProperty('--deleteButton', 'linear-gradient(99.75deg, #ff0000 1.72%, #ff6347 45.77%, #ff4500 96.01%)');
        root.style.setProperty('--background-of-buttons-menu', '#FFFFFF');
        root.style.setProperty('--sidebarMatch', '#8FA0D8');
        root.style.setProperty('--gradient-for-dcms-dark-green', 'linear-gradient(90.88deg, #004951 0%, #006672 100%)');
        root.style.setProperty('--color-for-Text', 'white');
        root.style.setProperty('--logOutMenu', '#05713A');
        root.style.setProperty('--logOutText', 'white');
        root.style.setProperty('--avatarMenu', '#05713A');
        root.style.setProperty('--avatarText', 'white');
        root.style.setProperty('--sideBarColor', '#FFFFFF');
        root.style.setProperty('--colorForSideButtonsText', '#657479');
        root.style.setProperty('--mainQuestion', '#05713A');
        root.style.setProperty('--themeTextColor', '#05713A');
        root.style.setProperty('--MenubarTextcolor', '#657479');
        root.style.setProperty('--department-color-start', '#14B8A6');
        root.style.setProperty('--department-color-end', '#0F766E');
        root.style.setProperty('--themeColor', '#05713A');
        root.style.setProperty('--iconColor', '#05713A');
        root.style.setProperty('--iconStroke', '#05713A');
        break;

      case 'fusion ai':
        this.fusionai = true;
        // root.style.setProperty('--gradient-bg', 'linear-gradient(94.72deg, #05713A 0%, #05C168 100%)');
        root.style.setProperty('--gradient-bg', 'rgba(5, 153, 81, 1)');
        root.style.setProperty('--tableHeader', '#05713A');
        root.style.setProperty('--engineTextColor', '#05713A');
        root.style.setProperty('--gradient-bg-active', '#05713A');
        root.style.setProperty('--gradient-bg-hover', '#008545');
        root.style.setProperty('--sidebarButtonsHover', 'white');
        root.style.setProperty('--addButtonColor', 'linear-gradient(94.72deg, #05713A 0%, #05C168 100%)');
        root.style.setProperty('--addNewOnly', '#05713A');
        root.style.setProperty('--ocrToggleActive', '#05713A');
        root.style.setProperty('--letsUploadDoc', '#05713A');
        root.style.setProperty('--dropUIBorderDashed', '#05713A');
        root.style.setProperty('--dropFileText', '#05713A');
        root.style.setProperty('--inviteText', '#05713A');
        root.style.setProperty('--inviteTextHover', '#044c5b');
        root.style.setProperty('--trackChangesButton', 'rgba(6, 100, 120, 0.2)');
        root.style.setProperty('--trackChangesButtonHover', 'rgba(6, 100, 120, 0.2)');
        root.style.setProperty('--view-buttonColor', 'rgba(6, 100, 120, 0.2)');
        root.style.setProperty('--colorOfUploadBox', '#c7d3f0');
        root.style.setProperty('--colorOfBackgroundUploadBox', '#dbe2f7');
        root.style.setProperty('--documentByTags', 'linear-gradient(180deg, #004951 0%, #00A5B7 100%);');
        root.style.setProperty('--deleteButton', 'linear-gradient(99.75deg, #ff0000 1.72%, #ff6347 45.77%, #ff4500 96.01%)');
        root.style.setProperty('--background-of-buttons-menu', '#FFFFFF');
        root.style.setProperty('--sidebarMatch', '#8FA0D8');
        root.style.setProperty('--gradient-for-dcms-dark-green', 'linear-gradient(90.88deg, #004951 0%, #006672 100%)');
        root.style.setProperty('--color-for-Text', 'white');
        root.style.setProperty('--logOutMenu', '#05713A');
        root.style.setProperty('--logOutText', 'white');
        root.style.setProperty('--avatarMenu', '#05713A');
        root.style.setProperty('--avatarText', 'white');
        root.style.setProperty('--sideBarColor', '#FFFFFF');
        root.style.setProperty('--colorForSideButtonsText', '#657479');
        root.style.setProperty('--mainQuestion', '#05713A');
        root.style.setProperty('--themeTextColor', '#05713A');
        root.style.setProperty('--MenubarTextcolor', '#657479');
        root.style.setProperty('--department-color-start', '#14B8A6');
        root.style.setProperty('--department-color-end', '#0F766E');
        root.style.setProperty('--themeColor', '#05713A');
        root.style.setProperty('--iconColor', '#05713A');
        root.style.setProperty('--iconStroke', '#05713A');
        break;

      case 'civil defense department':
        this.civilDefence = true;
        root.style.setProperty('--gradient-bg', 'linear-gradient(94.72deg, #05713A 0%, #05C168 100%)');
        root.style.setProperty('--tableHeader', '#05713A');
        root.style.setProperty('--engineTextColor', '#05713A');
        root.style.setProperty('--gradient-bg-active', '#05713A');
        root.style.setProperty('--gradient-bg-hover', '#05713A');
        root.style.setProperty('--sidebarButtonsHover', 'white');
        root.style.setProperty('--addButtonColor', 'linear-gradient(94.72deg, #05713A 0%, #05C168 100%)');
        root.style.setProperty('--addNewOnly', '#05713A');
        root.style.setProperty('--ocrToggleActive', '#05713A');
        root.style.setProperty('--letsUploadDoc', '#05713A');
        root.style.setProperty('--dropUIBorderDashed', '#05713A');
        root.style.setProperty('--dropFileText', '#05713A');
        root.style.setProperty('--inviteText', '#066478');
        root.style.setProperty('--inviteTextHover', '#044c5b');
        root.style.setProperty('--trackChangesButton', 'rgba(6, 100, 120, 0.2)');
        root.style.setProperty('--trackChangesButtonHover', 'rgba(6, 100, 120, 0.2)');
        root.style.setProperty('--view-buttonColor', 'rgba(6, 100, 120, 0.2)');
        root.style.setProperty('--colorOfUploadBox', '#c7d3f0');
        root.style.setProperty('--colorOfBackgroundUploadBox', '#dbe2f7');
        root.style.setProperty('--documentByTags', 'linear-gradient(180deg, #004951 0%, #00A5B7 100%);');
        root.style.setProperty('--deleteButton', 'linear-gradient(99.75deg, #ff0000 1.72%, #ff6347 45.77%, #ff4500 96.01%)');
        root.style.setProperty('--background-of-buttons-menu', '#FFFFFF');
        root.style.setProperty('--sidebarMatch', '#8FA0D8');
        root.style.setProperty('--gradient-for-dcms-dark-green', 'linear-gradient(90.88deg, #004951 0%, #006672 100%)');
        root.style.setProperty('--color-for-Text', 'white');
        root.style.setProperty('--logOutMenu', '#05713A');
        root.style.setProperty('--logOutText', 'white');
        root.style.setProperty('--avatarMenu', '#05713A');
        root.style.setProperty('--avatarText', 'white');
        root.style.setProperty('--sideBarColor', '#FFFFFF');
        root.style.setProperty('--colorForSideButtonsText', '657479');
        root.style.setProperty('--mainQuestion', '#05713A');
        root.style.setProperty('--themeTextColor', '#05713A');
        root.style.setProperty('--MenubarTextcolor', '#657479');
        root.style.setProperty('--department-color-start', '#14B8A6');
        root.style.setProperty('--department-color-end', '#0F766E');
        root.style.setProperty('--themeColor', '#05713A');
        root.style.setProperty('--iconColor', '#05713A');
        root.style.setProperty('--iconStroke', '#05713A');
        break;

      default:
        root.style.setProperty('--gradient-bg', 'gray');
        root.style.setProperty('--gradient-for-dcms-dark-green', 'gray');
        // root.style.setProperty('--deleteButton', 'linear-gradient(99.75deg, #ff0000 1.72%, #ff6347 45.77%, #ff4500 96.01%)');
        //   root.style.setProperty('--logOutMenu', 'var(--Zinc-100, #F4F4F5)');
        // root.style.setProperty('--logOutText', 'black');
        // root.style.setProperty('--logOutHover', 'black');


        const lighter = this.adjustColorBrightness(this.baseColor, 20); // 20% lighter
        const darker = this.adjustColorBrightness(this.baseColor, -20); // 10% darker


        const lighter5 = this.adjustColorBrightness(this.baseColor, 5);
        const lighter10 = this.adjustColorBrightness(this.baseColor, 10);
        const lighter20 = this.adjustColorBrightness(this.baseColor, 20);

        /*  50 % lighter (much brighter)  */
        const lighter50 = this.adjustColorBrightness(this.baseColor, 50);

        /*  80 % lighter (almost pastel) */
        const lighter80 = this.adjustColorBrightness(this.baseColor, 80);
        this.inseyab = true
        root.style.setProperty('--gradient-bg', this.baseColor);
        root.style.setProperty('--sideBarColor', this.sidebarColor);
        root.style.setProperty('--gradient-bg-active', darker);
        root.style.setProperty('--gradient-bg-hover', lighter5);
        root.style.setProperty('--engineTextColor', this.baseColor);
        root.style.setProperty('--tableHeader', this.baseColor);
        root.style.setProperty('--sidebarButtonsHover', this.textColor);
        root.style.setProperty('--addButtonColor', this.baseColor);
        root.style.setProperty('--addNewOnly', this.baseColor);
        root.style.setProperty('--ocrToggleActive', this.baseColor);
        root.style.setProperty('--letsUploadDoc', this.baseColor);
        root.style.setProperty('--dropUIBorderDashed', this.baseColor);
        root.style.setProperty('--dropFileText', this.baseColor);
        root.style.setProperty('--inviteText', this.baseColor);
        root.style.setProperty('--inviteTextHover', lighter5);
        root.style.setProperty('--trackChangesButton', darker);
        root.style.setProperty('--trackChangesButtonHover', lighter5);
        root.style.setProperty('--view-buttonColor', this.baseColor);
        root.style.setProperty('--colorOfUploadBox', this.baseColor);
        root.style.setProperty('--colorOfBackgroundUploadBox', '#f7fafa');
        root.style.setProperty('--documentByTags', this.baseColor);
        root.style.setProperty('--deleteButton', 'linear-gradient(99.75deg, #ff0000 1.72%, #ff6347 45.77%, #ff4500 96.01%)');
        root.style.setProperty('--background-of-buttons-menu', this.baseColor);
        root.style.setProperty('--sidebarMatch', this.baseColor);
        root.style.setProperty('--gradient-for-dcms-dark-green', this.sidebarColor);
        root.style.setProperty('--color-for-Text', this.textColor);
        root.style.setProperty('--logOutMenu', 'var(--Zinc-100, #F4F4F5)');
        root.style.setProperty('--logOutText', 'black');
        root.style.setProperty('--logOutHover', 'black');
        root.style.setProperty('--avatarMenu', lighter20);
        root.style.setProperty('--avatarText', this.textColor);
        if (this.sidebarColor == "#ffffff" || this.sidebarColor == "white") {
          root.style.setProperty('--colorForSideButtonsText', this.baseColor);
        }
        else {
          root.style.setProperty('--colorForSideButtonsText', this.textColor);
        }

        // root.style.setProperty('--colorForSideButtonsText', this.textColor);
        root.style.setProperty('--mainQuestion', this.baseColor);
        if (this.sidebarColor == "#ffffff" || this.sidebarColor == "white") {
          root.style.setProperty('--themeTextColor', this.baseColor);
        }

        root.style.setProperty('--MenubarTextcolor', this.textColor);

        if (this.sidebarColor == "#ffffff" || this.sidebarColor == "white") {
          root.style.setProperty('--MenubarTextcolor', this.baseColor);
        }
        else {
          root.style.setProperty('--MenubarTextcolor', this.textColor);
        }
        root.style.setProperty('--iconColor', this.baseColor);
        root.style.setProperty('--iconStroke', this.baseColor);
        root.style.setProperty('--themeColor', this.baseColor);


    }
  }

  logout() {
    this.authService.logOut();
  }

  openAutoDetails(event: Event) {
    this.router.navigate(['/app/autoFill']);
  }
  openDocumentTaggers(event: Event) {
    window.open('https://dcms.decisions.social/', '_blank');
  }
  openFeatures(event: Event) {
    this.router.navigate(['/app/features']);
  }

  openLevels(event: Event) {
    this.router.navigate(['/app/levels']);
  }

  openDepartments(event: Event) {
    this.router.navigate(['/app/departments']);
  }
  openFunctions(event: Event) {
    this.router.navigate(['/app/functions']);
  }

  openAssignFeatures(event: Event) {
    this.router.navigate(['/app/level-features']);
  }
  openAssignDepartments(event: Event) {
    this.router.navigate(['/app/level-departments']);
  }
  openArchitecture(event: Event) {
    this.router.navigate(['/app/architecture']);
  }


  useInDocument(id: any): void {
    const mainId = id;

    this.documentService.triggerProject();
    this.documentService.setProjectsOnNewPage(true);

    this.documentService.setDocumentId(mainId);
    this.router.navigate(['/app/new-page'], { queryParams: { id: mainId } });
  }

  adjustColorBrightness(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00FF) + amt;
    const B = (num & 0x0000FF) + amt;

    return (
      '#' +
      (
        0x1000000 +
        (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
        (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
        (B < 255 ? (B < 0 ? 0 : B) : 255)
      )
        .toString(16)
        .slice(1)
    );
  }

  hexToHsl(hex: string): { h: number; s: number; l: number } {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const l = (max + min) / 2;

    let h = 0, s = 0;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  hslToHex(h: number, s: number, l: number): string {
    s /= 100; l /= 100;

    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
      Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));

    return `#${((1 << 24) + (f(0) << 16) + (f(8) << 8) + f(4)).toString(16).slice(1)}`;
  }

  /** lighten by N % (e.g. 25 = +25 % lightness) */
  lightenHex(hex: string, deltaL: number): string {
    const { h, s, l } = this.hexToHsl(hex);
    const newL = Math.min(100, l + deltaL);
    return this.hslToHex(h, s, newL);
  }



}
