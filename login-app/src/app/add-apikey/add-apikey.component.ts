import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiAiService } from '../service/apiAiService';
import { AuthService } from '../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-apikey',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-apikey.component.html',
  styleUrl: './add-apikey.component.css',
})
export class AddApikeyComponent {
  constructor(
    private _yourApiService: ApiAiService,
    private authService: AuthService
  ) { }
  orgColorCode: string = '#000000'; // default color
  selectedDepartment: any;
  apiKey: any;
  userId: any;
  engineName: string = '';

  sidebarColor: string = '#016774';
  baseColor: string = '#066477';
  textColor: string = '#ffffff';

  ngOnInit(): void {
    this.getUsersOfAdmin();
  }

  getUsersOfAdmin() {
    this._yourApiService.geUsersAdmin().subscribe((res) => {
      this.usersList = res;
    });
  }

  created_by: any;
  usersList: any[] = [];
  addUser() {

    const addAPIData = {
      created_by: this.created_by,
      engine: this.engineName,
      api: this.apiKey,
      is_active: true,
    };

    this.authService.addApi(addAPIData).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Added successfully!',
          timer: 1000,
          showConfirmButton: false,
        });
      },
      (error: any) => {
        console.error('Error fetching user info', error);
      }
    );
  }
}



