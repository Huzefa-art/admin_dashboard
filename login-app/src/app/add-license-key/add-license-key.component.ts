import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiAiService } from '../service/apiAiService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-license-key',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-license-key.component.html',
  styleUrl: './add-license-key.component.css'
})
export class AddLicenseKeyComponent {

  constructor(private _yourApiService: ApiAiService) {

  }
  expiry: any = "";
  vm_num: any = "";

  addLicense() {
    this._yourApiService.licenseKeyDownload(this.vm_num, this.expiry)
      .subscribe((response: Blob) => {
        // Create a temporary URL for the Blob
        const blob = new Blob([response]);
        const url = window.URL.createObjectURL(blob);

        // Create a hidden <a> element and trigger download
        const a = document.createElement('a');
        a.href = url;
        a.download = `license_${this.vm_num}_${this.expiry}.lic`; // 👈 set your desired file name
        document.body.appendChild(a);
        a.click();

        // Cleanup
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        Swal.fire({
          title: 'Downloaded!',
          text: 'License file has been downloaded successfully.',
          icon: 'success',
          showConfirmButton: false,
          timer: 3000,
        });
      },
        (error) => {
          Swal.fire({
            title: 'Error!',
            text: 'Failed to download license file.',
            icon: 'error',
            showConfirmButton: true,
          });
        });
  }

}
