import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ApiAiService } from '../../service/apiAiService';
import { AuthService } from '../../service/auth.service';
import { DocumentService } from '../../service/document.service';

@Component({
  selector: 'app-super-admin-menu',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './super-admin-menu.component.html',
  styleUrl: './super-admin-menu.component.css'
})
export class SuperAdminMenuComponent {


  constructor(private router: Router, private _yourApiService: ApiAiService, private documentService: DocumentService, private authService: AuthService) {

  }
  ngOnInit(): void {
    this.GetUserInfo();
  }

  final: string = '';
  userName: string = '';

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

        // this.authService.setUserInfo(response);
      },
      (error) => {
        console.error('Error fetching user info', error);
      }
    );
  }

}
