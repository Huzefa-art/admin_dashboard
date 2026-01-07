// import { inject } from '@angular/core';
// import { CanActivateFn, Router } from '@angular/router';
// import { AuthService } from '../service/auth.service';

// export const authGuard: CanActivateFn = (route, state) => {
//   let _router = inject(Router);
//   let authService = inject(AuthService);
//   const isLoggedIn = authService.isLoggedIn();
//   const isAuthRoute = state.url === '/login' || state.url === '/signup'; // Includes signup
//   const isLoginOrSignupRoute = state.url === '/login';

//   if (isLoggedIn && isLoginOrSignupRoute) {
//     _router.navigate(['/app/home']);
//     return false;
//   }

//   if (!isLoggedIn && !isAuthRoute) {
//     // Redirect unauthenticated users to the login page
//     _router.navigate(['/login']);
//     return false;
//   }

//   // if (!isLoggedIn && !isLoginOrSignupRoute) {
//   //   alert("Not Authenticated");
//   //   _router.navigate(['/login']);
//   //   return false;
//   // }

//   let isSuperAdmin = false;
//   if (typeof window !== 'undefined') {
//     const userInfoStr = localStorage.getItem('userInfo');
//     if (userInfoStr) {
//       try {
//         const userInfo = JSON.parse(userInfoStr);
//         isSuperAdmin = (!!userInfo.is_superuser &&
//           (userInfo.designation === 'Admin' || userInfo.designation === 'Super Admin')) ||
//           (userInfo.email || '').toLowerCase() === 'huzefa@consultant.com';
//       } catch (e) {
//         isSuperAdmin = false;
//       }
//     }
//   }

//   // If super admin tries to access normal app routes
//   if (isLoggedIn && !isAuthRoute && isSuperAdmin && state.url.startsWith('/app')) {
//     _router.navigate(['/admin/dashboard']);
//     return false;
//   }



//   return true;
// };


import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isLoggedIn = authService.isLoggedIn();
  const isAuthRoute = state.url === '/login' || state.url === '/signup';

  if (isLoggedIn && state.url === '/login') {
    const redirectUrl = localStorage.getItem('redirect_url') || '/app/home';
    // router.navigate([redirectUrl]);
    if (redirectUrl.startsWith('http://') || redirectUrl.startsWith('https://')) {
      window.location.href = redirectUrl; // full URL → use browser navigation
    } else {
      router.navigate([redirectUrl]); // internal SPA route
    }
    return false;
  }

  if (!isLoggedIn && !isAuthRoute) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
