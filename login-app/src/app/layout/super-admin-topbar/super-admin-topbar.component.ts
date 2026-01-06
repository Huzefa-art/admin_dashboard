import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-super-admin-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './super-admin-topbar.component.html',
  styleUrl: './super-admin-topbar.component.css'
})
export class SuperAdminTopbarComponent {


  constructor(private router: Router) { }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
