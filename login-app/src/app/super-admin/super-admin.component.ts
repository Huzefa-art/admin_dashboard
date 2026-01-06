import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { ApiAiService } from '../service/apiAiService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-super-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './super-admin.component.html',
  styleUrl: './super-admin.component.css'
})
export class SuperAdminComponent implements OnInit {

  selectedDepartment: any;
  userName: any;
  nameOfUser: string = '';
  email: string = '';
  password: string = '';
  role: string = '';

  constructor(private AuthService: AuthService, private _yourApiService: ApiAiService) {

  }
  ngOnInit(): void {

    //throw new Error('Method not implemented.');
    this.GetUserInfo();
    this.getDepartments();
    this.getLevels();
  }

  logout() {
    this.AuthService.logOut();
  }


  GetUserInfo(): void {
    this._yourApiService.GetUserInfo().subscribe(
      (response) => {
        if (response && response.name) {
          this.userName = response.name;  // Store the user's name
        }
      },
      (error) => {
        console.error('Error fetching user info', error);
      }
    );
  }
  levelsList: any[] = [];
  departmentsList: any[] = [];
  flattenedDepartments: any[] = [];
  getDepartments() {
    this._yourApiService.getDepartments().subscribe(res => {
      this.departmentsList = res;
      this.flattenedDepartments = this.flattenTreeWithIndent(this.departmentsList);
    });
  }

  flattenTreeWithIndent(tree: any[], level: number = 0): any[] {
    let flat: any[] = [];

    for (const node of tree) {
      flat.push({ id: node.id, name: node.name, indent: level });

      if (node.sub_departments?.length) {
        flat = flat.concat(this.flattenTreeWithIndent(node.sub_departments, level + 1));
      }
    }

    return flat;
  }

  levelId: any = 1;
  userId: any;
  getLevels() {
    this._yourApiService.getLevels().subscribe(res => {
      this.levelsList = res;
    });
  }


  addUser() {
    this._yourApiService.addUserinOrganization(this.email, this.password, this.nameOfUser, this.role).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Added successfully!',
          timer: 1000,
          showConfirmButton: false,
        });
        this.userId = response.id;
        this.addLevelDepartmentAccess(response.id)
      },
      (error) => {
        console.error('Error fetching user info', error);
      }
    );

  }


  addLevelDepartmentAccess(userid: any) {
    if (!this.selectedDepartment) {
      Swal.fire({
        icon: 'warning',
        title: 'No Department Selected',
        text: 'Please select a department before submitting.',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'swal-custom-popup',
          confirmButton: 'swal-custom-confirm',
        },
      });
      return; // Stop here if department not selected
    }

    const payload = {
      user_id: userid,
      department_id: this.selectedDepartment,
      level_id: this.levelId
    };

    this._yourApiService.addLevelDepartmentAccess(payload).subscribe(
      (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: response.message || 'Assigned Department successfully.',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'swal-custom-popup',
            confirmButton: 'swal-custom-confirm',
          },
        });
      },
      (error) => {
        console.log("error of OCR API", error);
        const errMessage = error?.error?.error?.non_field_errors?.[0]
          ? "User and Department should be unique"
          : 'An error occurred while assigning the department. Please try again.';

        Swal.fire({
          icon: 'error',
          title: 'Department Assigning Failed',
          text: errMessage,
          confirmButtonText: 'OK',
          customClass: {
            popup: 'swal-custom-popup',
            confirmButton: 'swal-custom-confirm',
          },
        });
      }
    );

  }

}



