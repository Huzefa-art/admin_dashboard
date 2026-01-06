import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiAiService } from '../service/apiAiService';
import { AuthService } from '../service/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-view-organizations',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-organizations.component.html',
  styleUrl: './view-organizations.component.css',
})
export class ViewOrganizationsComponent {
  constructor(
    private _yourApiService: ApiAiService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.getUsersOfAdmin();

  }
  usersList: any[] = [];

  getUsersOfAdmin() {
    this._yourApiService.geUsersAdmin().subscribe((res) => {
      this.usersList = res;
    });
  }

  toggleDropdownOptions(user: any) {
    this.usersList.forEach((d) => {
      if (d !== user) d.isDropdownOpen = false;
    });
    user.isDropdownOpen = !user.isDropdownOpen;
  }

  hideMainOption: boolean = false;
  toggleEdit(user: any) {
    if (user.isEditing) {
      this.saveUserAssignedByEdit(user);
    }
    user.isEditing = !user.isEditing;
    user.isDropdownOpen = false;
    this.hideMainOption = true;
  }

  saveUserAssignedByEdit(user: any) {
    const payload = {
      user_id: user.user.id,
      department_id: user.department.id,
      level_id: user.level.id,
    };

    this._yourApiService
      .patchDepartmentAssignedUser(user.id, payload)
      .subscribe(
        (res) => {
          Swal.fire({
            icon: 'success',
            title: 'User updated successfully!',
            timer: 1000,
            showConfirmButton: false,
          });
          user.isEditing = false;
          this.hideMainOption = false;
        },
        (error: any) => {
          console.error('Error updating document:', error);
        }
      );
  }

  deleteUserAssigned(user_id: any) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this._yourApiService
          .deleteDepartmentAssignedUser(user_id)
          .subscribe((res) => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Your department level access has been deleted.',
              icon: 'success',
              showConfirmButton: false,
              timer: 1000,
            });
            this.getUsersOfAdmin();
          });
      }
    });
  }

  cancelEdit(doc: any) {
    const index = this.usersList.findIndex(d => d.id === doc.id);
    if (index !== -1) {
      this.usersList[index].isEditing = false;
      this.usersList[index].isDropdownOpen = false;
    }
    this.hideMainOption = false;
  }

  toggleStatus(user: any): void {
    const newStatus = !user.verified;

    this._yourApiService.activeDeactive(newStatus).subscribe({
      next: (response) => {
        user.verified = newStatus;
        console.log(`User ${user.name} status updated to ${newStatus ? 'Active' : 'Inactive'} `);
      },
      error: (error) => {
        console.error('Error updating status:', error);
      }
    });

  }

}
