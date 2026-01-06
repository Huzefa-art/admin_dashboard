import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SuperAdminLayoutComponent } from './layout/super-admin-layout/super-admin-layout.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { AddOrganizationComponent } from './add-organization/add-organization.component';
import { AddApikeyComponent } from './add-apikey/add-apikey.component';
import { ViewOrganizationsComponent } from './view-organizations/view-organizations.component';
import { AddLicenseKeyComponent } from './add-license-key/add-license-key.component';
import { authGuard } from './guards/auth.guard';
import { SuperAdminAuthGuard } from './guards/super-admin-auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    {
        path: 'admin',
        component: SuperAdminLayoutComponent,
        canActivate: [authGuard, SuperAdminAuthGuard],
        children: [
            { path: 'dashboard', component: SuperAdminComponent },
            { path: 'organization', component: AddOrganizationComponent },
            { path: 'api', component: AddApikeyComponent },
            { path: 'organizations', component: ViewOrganizationsComponent },
            { path: 'license', component: AddLicenseKeyComponent },
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
        ]
    },
    { path: '', redirectTo: '/login', pathMatch: 'full' }
];
