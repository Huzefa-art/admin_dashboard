import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { ApiAiService } from '../service/apiAiService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-organization',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-organization.component.html',
  styleUrl: './add-organization.component.css'
})
export class AddOrganizationComponent {


  constructor(private _yourApiService: ApiAiService, private auth_service: AuthService) {

  }
  orgColorCode: string = '#000000'; // default color
  selectedDepartment: any;
  userName: any;
  nameOfUser: string = '';
  organization: string = '';
  email: string = '';
  password: string = '';
  role: string = '';
  browserTitle: string = '';


  sidebarColor: string = '#016774';
  baseColor: string = '#066477';
  textColor: string = '#ffffff';

  ngOnInit(): void {

    //throw new Error('Method not implemented.');
    this.GetUserInfo();
    this.getDepartments();
    this.getLevels();
  }


  GetUserInfo(): void {
    this._yourApiService.GetUserInfo().subscribe(
      (response: any) => {
        if (response && response.name) {
          this.userName = response.name;  // Store the user's name
        }
      },
      (error: any) => {
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

    const formData = new FormData();

    formData.append('email', this.email);
    formData.append('password', this.password);
    formData.append('name', this.nameOfUser);

    // Organization info (strings)
    formData.append('organization.name', this.organization);
    formData.append('organization.text_color', this.textColor);
    formData.append('organization.base_color', this.baseColor);
    formData.append('organization.sidebar_color', this.sidebarColor);
    formData.append('organization.title_of_browser', this.browserTitle);

    // Images (files)
    if (this.logoImage) formData.append('organization.logo', this.logoImage);
    if (this.bannerImage) formData.append('organization.home_page_banner', this.bannerImage);
    if (this.faviconImage) formData.append('organization.favicon', this.faviconImage);
    if (this.basketImage) formData.append('organization.basket_image', this.basketImage);

    const loginData = {
      email: this.email,
      password: this.password,
      name: this.nameOfUser,
      organization: {
        name: this.organization,
        text_color: this.textColor,
        base_color: this.baseColor,
        sidebar_color: this.sidebarColor,
        title_of_browser: this.browserTitle,
        logo: this.logoImage,
        home_page_banner: this.bannerImage,
        favicon: this.faviconImage,
        basket_image: this.basketImage

      }
    };

    formData

    this.auth_service.addUserOrganization(formData).subscribe(
      (response: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Added successfully!',
          timer: 1000,
          showConfirmButton: false,
        });
        this.userId = response.id;
      },
      (error: any) => {
        console.error('Error fetching user info', error);
      }
    );

  }


  basketImage: File | null = null;
  logoImage: File | null = null;
  bannerImage: File | null = null;
  faviconImage: File | null = null;

  onImageChange(event: any, type: string) {
    const file = event.target.files[0];
    if (!file) return;

    const input = event.target;
    const maxSizes = {
      basket: 10 * 1024,
      logo: 20 * 1024,
      banner: 2 * 1024 * 1024,
      favicon: 5 * 1024
    };

    const img = new Image();
    const reader = new FileReader();

    reader.onload = () => {
      img.onload = () => {
        let valid = true;
        const { width, height } = img;
        const size = file.size;
        let errorMessage = '';
        switch (type) {
          case 'basket':
            valid = size <= maxSizes.basket;
            if (!valid) {
              errorMessage = `Basket image must be ≤ 10KB.`;
            }
            break;
          case 'logo':
            valid = width <= 230 && height <= 80 && size <= maxSizes.logo;
            if (!valid) {
              errorMessage = `Logo image must be max 180x80 pixels and ≤ 20KB. Your image is ${width}x${height} pixels and ${(size / 1024).toFixed(2)}KB.`;
            }
            break;
          case 'banner':
            valid = width <= 2340 && height <= 1024 && size <= maxSizes.banner;
            if (!valid) {
              errorMessage = `Banner image must be max 2340x1024 pixels and ≤ 30KB. Your image is ${width}x${height} pixels and ${(size / 1024 / 1024).toFixed(2)}KB.`;
            }
            break;
          case 'favicon':
            // Accept ICO/PNG 16x16 or 32x32
            // valid =
            //   size <= maxSizes.favicon
            break;
        }

        if (!valid) {
          // alert(`${type} image is too large or has invalid dimensions.`);
          alert(errorMessage);
          input.value = ''; // Clear the file input
          return;
        }

        // Assign if valid
        if (type === 'basket') this.basketImage = file;
        else if (type === 'logo') this.logoImage = file;
        else if (type === 'banner') this.bannerImage = file;
        else if (type === 'favicon') this.faviconImage = file;
      };

      img.onerror = () => {
        alert(`Unable to read image. Make sure it's a valid image file.`);
        input.value = '';
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  }


  onDropSingle(event: DragEvent): void {
    event.preventDefault();
    const droppedFiles = event.dataTransfer?.files;

    if (droppedFiles && droppedFiles.length > 1) {
      Swal.fire({
        icon: 'warning',
        title: 'Only one file allowed',
        text: 'Please drop only one file at a time.',
      });
      return;
    }

    if (droppedFiles && droppedFiles.length === 1) {
      // this.files = [droppedFiles[0]];
      // this.fileName = droppedFiles[0].name;
    } else {
      // this.files = [];
      // this.fileName = 'No file chosen';
    }
  }

  removeSelectedFile(): void {
    // this.files = [];
    // this.fileName = '';
  }



}





