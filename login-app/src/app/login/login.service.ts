import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
// Adjust path to environment as needed
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private apiBaseUrlForAIDoc = environment.apiBaseUrlForAIDoc;
  private loginUser = this.apiBaseUrlForAIDoc + 'user/token/';
  private getAdminUserAdmin = this.apiBaseUrlForAIDoc + "user/admin/user/ ";

  private TOKEN_KEY = 'authToken';
  private USER_KEY = 'userInfo';

  private accessToken: string | null = null;
  public currentUser$ = new BehaviorSubject<any>(null);

  constructor(private router: Router, private http: HttpClient, @Inject(PLATFORM_ID) private platformId: Object) { }

  // ---------------- LOGIN API ----------------
  loginApi(data: any) {
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    const requestedterms = JSON.stringify({
      username: data.username,
      password: data.password,
    });

    return this.http.post<any>(this.loginUser, requestedterms, {
      headers: myHeaders,
    });
  }

  // ---------------- SAVE TOKEN SECURELY ----------------
  saveLoginSession(token: string, userInfo: any) {
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

  getUserInfo(): any {
    return (
      this.currentUser$.value ||
      JSON.parse(localStorage.getItem(this.USER_KEY) || 'null')
    );
  }

  // ---------------- LOGOUT ----------------
  logOut() {
    this.accessToken = null;
    this.currentUser$.next(null);

    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    localStorage.removeItem('userInfo');
    localStorage.removeItem('user_info');
    localStorage.removeItem('user');
    localStorage.removeItem('designation');
    localStorage.removeItem('email');
    localStorage.removeItem('rememberedEmail');
    localStorage.removeItem('is_superuser');
    localStorage.removeItem('rememberMe');

    this.router.navigate(['/login']);
  }

  // ---------------- PASSWORD RESET & USER INFO ----------------

  forgetPassword(email: string): Observable<any> {
    const url = `${this.apiBaseUrlForAIDoc}/user/auth/forgot-password/`;
    const body = { email };
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.post<any>(url, body, { headers });
  }

  verifyOTP(email: string, otp: string): Observable<any> {
    const url = `${this.apiBaseUrlForAIDoc}/user/auth/verify-otp/`;
    const body = { email: email, otp: otp };
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.post<any>(url, body, { headers });
  }

  resetPassword(email: string, password: string, resetToken: string): Observable<any> {
    const url = `${this.apiBaseUrlForAIDoc}/user/auth/reset-password/`;
    const body = {
      email: email,
      password: password,
      reset_token: resetToken
    };
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.post<any>(url, body, { headers });
  }

  GetUserInfo(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Token ${token}`,
    });
    return this.http.get<any>(`${this.apiBaseUrlForAIDoc}user/me/`, { headers });
  }

  getAdminUserSingle(): Observable<any> {
    const token = localStorage.getItem('authToken');
    const myHeaders = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Token ${token}`
    });
    return this.http.get<any>(this.getAdminUserAdmin, { headers: myHeaders });
  }
}
