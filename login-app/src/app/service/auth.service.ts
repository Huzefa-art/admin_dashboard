import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';

    @Injectable({
      providedIn: 'root',
    })
    export class AuthService {
      private apiBaseUrlForAIDoc = environment.apiBaseUrlForAIDoc;
      private loginUser = this.apiBaseUrlForAIDoc + 'user/token/';
      private signupUser = this.apiBaseUrlForAIDoc + 'user/create/';
      private addAPIKey =
        this.apiBaseUrlForAIDoc + 'AI_Doc_Features/add-api-key/';
      private addAPIKeyURL = this.apiBaseUrlForAIDoc + 'AI_Doc_Features/add-api-key/';
      // private loginUser = "/api/user/token/";

      private TOKEN_KEY = 'authToken';
      private USER_KEY = 'userInfo';

      private accessToken: string | null = null;
      public currentUser$ = new BehaviorSubject<any>(null);

      constructor(private router: Router, private http: HttpClient,@Inject(PLATFORM_ID) private platformId: Object) {}

        // ---------------- LOGIN API ----------------
      loginApi(data: any) {
        const myHeaders = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        const requestedterms = JSON.stringify({
          email: data.email,
          password: data.password,
        });

        return this.http.post<any>(this.loginUser, requestedterms, {
          headers: myHeaders,
        });
      }

        // ---------------- SAVE TOKEN SECURELY ----------------
      saveLoginSession(token: string, userInfo: any) {
      // localStorage.setItem(this.TOKEN_KEY, token);
      // localStorage.setItem(this.USER_KEY, JSON.stringify(userInfo));

      this.accessToken = token;
      this.currentUser$.next(userInfo);
      localStorage.setItem(this.TOKEN_KEY, token);
      localStorage.setItem(this.USER_KEY, JSON.stringify(userInfo));
      }

        // ---------------- GETTERS ----------------
      getToken(): string | null {
           if (isPlatformBrowser(this.platformId)) {
             return this.accessToken || localStorage.getItem(this.TOKEN_KEY);
           }
          return null;
      }



      //old code
      // getUserInfo(): any {
      // return (
      //         this.currentUser ||
      //         JSON.parse(localStorage.getItem('userInfo') || '{}')
      // );
      // }

      getUserInfo(): any {
      return (
             this.currentUser$.value ||
             JSON.parse(localStorage.getItem(this.USER_KEY) || 'null')
      );
      }

      getUserRole(): string | null {
        const user = this.getUserInfo();
        return user?.role?.name ?? null;
      }

        // ---------------- LOGOUT (FULL CLEAN) ----------------

    // logOut(): void {
    //   if (this.isLocalStorageAvailable()) {
    //     localStorage.removeItem(this.fakeToken);
    //     localStorage.removeItem('user');
    //     localStorage.removeItem(this.userKey);

    //     localStorage.removeItem('is_superuser'); // Clear Super Admin flag
    //     localStorage.removeItem('designation'); // Clear designation
    //     localStorage.removeItem('email'); // Clear Super Admin email

    //     this.router.navigate(['/login']);
    //   }
    // }

      logOut() {
      // clear in-memory token


      // remove anything sensitive from localStorage

      this.accessToken = null;
      this.currentUser$.next(null);

      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem('userInfo');
      localStorage.removeItem('user_info');
      localStorage.removeItem('user');
      localStorage.removeItem('designation'); // Clear designation

      localStorage.removeItem('email'); // Clear Super Admin email
      localStorage.removeItem('rememberedEmail');
      localStorage.removeItem('is_superuser');
      localStorage.removeItem('rememberMe');
      // keep only non-sensitive preferences if you want:
      this.router.navigate(['/login']);
      }

        // ---------------- ADD API KEY ----------------
        addApi(data: any) {
    const token = this.getToken();

        const requestedterms = JSON.stringify({
          engine_name: data.engine,
          api_key: data.api,
          is_active: data.is_active,
          created_by: data.created_by
        });

    return this.http.post<any>(this.addAPIKeyURL, requestedterms, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
      })
    });
  }

    isLoggedIn(): boolean {
    return !!this.getToken();  // ensures new tab works
    }


      signUpApi(data: any) {
        const myHeaders = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        const requestedterms = JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name,
          organization: data.organization,
        });
        return this.http.post<any>(this.signupUser, requestedterms, {
          headers: myHeaders,
        });
      }

      addUserOrganization(data: any) {
        const myHeaders = new HttpHeaders({
          'Content-Type': 'application/json',
        });
        const requestedterms = JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name,
          organization: data.organization,
        });
        return this.http.post<any>(this.signupUser, requestedterms, {
          headers: myHeaders,
        });
      }

      // addUserOrganization(data: any): Observable<any> {

      //       const requestedterms = JSON.stringify({
      //     email: data.email,
      //     password: data.password,
      //     name: data.name,
      //     organization: data.organization,
      //   });

      //   return this.http.post<any>(this.signupUser, requestedterms);
      // }

      setUserInfo(user: any) {
        this.currentUser$.next(user);
      }
      loginInMemory(token: string, userInfo: any) {
      this.accessToken = token;              // not saved in localStorage
      this.currentUser$.next(userInfo);
      }

      getAccessToken() { return this.accessToken; }
    }
