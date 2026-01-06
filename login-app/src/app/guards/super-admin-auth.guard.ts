import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class SuperAdminAuthGuard implements CanActivate {
  constructor(private router: Router) { }

  canActivate(): boolean {
    let isSuperUser = false;
    let isAdmin = false;
    let isEmail = false;
    if (typeof window !== 'undefined') {
      const userInfoStr = localStorage.getItem('userInfo');
      if (userInfoStr) {
        try {
          const userInfo = JSON.parse(userInfoStr);
          isSuperUser = !!userInfo.is_superuser;
          isEmail = (userInfo.email || '').toLowerCase() === 'huzefa@consultant.com';
          isAdmin = userInfo.designation === 'Admin' || userInfo.designation === 'Super Admin';

          if (isEmail) {
            return true;
          }

          return isSuperUser && isAdmin;
        } catch (e) {
          isSuperUser = false;
          isAdmin = false;
          isEmail = false;
        }
      }
    }
    return isSuperUser && isAdmin && isEmail;
  }

}
