import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import Swal from 'sweetalert2';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgOtpInputModule } from 'ng-otp-input';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, FormsModule, NgOtpInputModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
    otpConfig = {
        length: 6,
        inputClass: 'code-box',
        allowNumbersOnly: true,
        containerClass: 'otp-container',
    };

    step: 'email' | 'verify' | 'reset' = 'email';
    email = '';
    email_address: any;
    passwordforlogin: any;
    passwordVisible: boolean = false;
    passwordVisibleConfirm: boolean = false;
    loadingOfLogin: boolean = false;
    isForgotPasswordMode: boolean = false;
    new_password: any;
    confirm_password: any;
    verification: boolean = false;
    otpLength = 6;
    otp: string[] = [];
    resetToken: any;


    constructor(private router: Router, private loginService: LoginService) {

    }

    ngOnInit(): void {

        if (typeof window !== 'undefined') {

            const remember = localStorage.getItem('rememberMe') === 'true';

            if (remember) {
                this.email_address = localStorage.getItem('rememberedEmail') || '';
                this.rememberMe = true;
            }
            this.otp = new Array(this.otpLength).fill('');

        }
    }


    togglePasswordVisibility(value?: any) {
        if (value == 1) {
            this.passwordVisible = !this.passwordVisible;
        }
        else if (value === 2) {
            this.passwordVisibleConfirm = !this.passwordVisibleConfirm;
        }
        else {
            this.passwordVisible = !this.passwordVisible;
        }


    }


    rememberMe: boolean = false;
    loginToAiDoc(): void {
        if (!this.email_address || !this.passwordforlogin) {
            Swal.fire({
                icon: 'warning',
                title: 'Login Failed!',
                text: 'Please enter correct credentials.',
                timer: 2000,
                showConfirmButton: false,
            });
            return;
        }

        this.loadingOfLogin = true;

        // Remember Me
        if (this.rememberMe) {
            localStorage.setItem('rememberedEmail', this.email_address);
            localStorage.setItem('rememberMe', 'true');
        } else {
            localStorage.removeItem('rememberedEmail');
            localStorage.setItem('rememberMe', 'false');
        }

        const loginData = {
            username: this.email_address,
            password: this.passwordforlogin
        };

        this.loginService.loginApi(loginData).subscribe(
            (response: any) => {
                const token = response.token;
                if (!token) {
                    this.loadingOfLogin = false;
                    Swal.fire({
                        icon: 'error',
                        title: 'Login Failed!',
                        text: 'Token not received.',
                        timer: 2000,
                        showConfirmButton: false,
                    });
                    return;
                }

                // Save minimal session
                this.loginService.saveLoginSession(token, {
                    email: response.email,
                    id: response.user_id,
                    verified: response.verified
                });

                // Save redirect_url (preserve external origins; normalize SPA paths)
                let redirectUrl = response.redirect_url || '/app/home';

                try {
                    const parsedUrl = new URL(redirectUrl);
                    // If the URL is cross-origin, keep the full href so we can do a full redirect.
                    if (parsedUrl.origin !== window.location.origin) {
                        redirectUrl = parsedUrl.href;
                    } else {
                        // Same origin → use pathname as SPA route
                        redirectUrl = parsedUrl.pathname;
                    }
                } catch (e) {
                    // Not a full URL (likely a relative path or domain without scheme) — leave as-is for now
                }

                // Ensure SPA routes start with '/'
                if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://') && !redirectUrl.startsWith('/')) {
                    redirectUrl = '/' + redirectUrl;
                }

                localStorage.setItem('redirect_url', redirectUrl);
                console.log('Final redirect path:', redirectUrl);

                // Fetch full user info
                this.loginService.GetUserInfo().subscribe(
                    (userInfo: any) => {
                        this.loginService.saveLoginSession(token, userInfo);

                        // Navigate dynamically
                        window.location.href = redirectUrl
                        // this.router.navigate([redirectUrl]).then(
                        //     success => {
                        //         if (!success) console.error('Navigation failed to', redirectUrl);
                        //         this.loadingOfLogin = false; // stop loader after navigation
                        //     },
                        //     err => {
                        //         console.error('Navigation error:', err);
                        //         this.loadingOfLogin = false;
                        //     }
                        // );
                    },
                    (error: any) => {
                        console.error('GetUserInfo error:', error);
                        window.location.href = redirectUrl;

                        // this.router.navigate([redirectUrl]).then(() => {
                        //     this.loadingOfLogin = false;
                        // });
                    }
                );
            },
            (error: any) => {
                this.loadingOfLogin = false;
                Swal.fire({
                    icon: 'error',
                    title: 'Login Failed!',
                    text: 'Unable to authenticate with your provided credentials.',
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
        );
    }

    // loginToAiDoc(): void {
    //     if (!this.email_address || !this.passwordforlogin) {
    //         Swal.fire({
    //             icon: 'warning',
    //             title: 'Login Failed!',
    //             text: 'Please enter correct credentials.',
    //             timer: 2000,
    //             showConfirmButton: false,
    //         });
    //         return;
    //     }

    //     this.loadingOfLogin = true;

    //     // Remember Me (email only)
    //     if (this.rememberMe) {
    //         localStorage.setItem('rememberedEmail', this.email_address);
    //         localStorage.setItem('rememberMe', 'true');
    //     } else {
    //         localStorage.removeItem('rememberedEmail');
    //         localStorage.setItem('rememberMe', 'false');
    //     }

    //     const loginData = {
    //         username: this.email_address,
    //         password: this.passwordforlogin
    //     };

    //     this.loginService.loginApi(loginData).subscribe(
    //         (response: any) => {
    //             const token = response.token;
    //             const loginResponseEmail = (response.email || '').toLowerCase();

    //             if (!token) {
    //                 this.loadingOfLogin = false;
    //                 Swal.fire({
    //                     icon: 'error',
    //                     title: 'Login Failed!',
    //                     text: 'Token not received.',
    //                     timer: 2000,
    //                     showConfirmButton: false,
    //                 });
    //                 return;
    //             }

    //             // Save initial session with info from login response
    //             this.loginService.saveLoginSession(token, {
    //                 email: response.email,
    //                 id: response.user_id,
    //                 verified: response.verified
    //             });

    //             // Fetch full user info
    //             this.loginService.GetUserInfo().subscribe(
    //                 (userInfo: any) => {
    //                     console.log('User Info received:', userInfo);
    //                     this.loginService.saveLoginSession(token, userInfo);

    //                     const userEmail = (userInfo.email || loginResponseEmail).toLowerCase();
    //                     console.log('Checking redirection for email:', userEmail);

    //                     if (userEmail === 'huzefa@consultant.com') {
    //                         console.log('Redirecting to /admin/dashboard');
    //                         this.router.navigate(['/admin/dashboard']).then(
    //                             success => {
    //                                 if (!success) console.error('Navigation to /admin/dashboard failed');
    //                             },
    //                             err => console.error('Navigation error:', err)
    //                         );
    //                     } else {
    //                         console.log('No redirection rule for:', userEmail);
    //                     }

    //                     this.loadingOfLogin = false;
    //                 },
    //                 (error: any) => {
    //                     console.error('GetUserInfo error:', error);
    //                     // Fallback: Redirect even if GetUserInfo fails if we have the email from login response
    //                     if (loginResponseEmail === 'huzefa@consultant.com') {
    //                         console.log('Fallback redirection for huzefa@consultant.com');
    //                         this.router.navigate(['/admin/dashboard']);
    //                     }
    //                     this.loadingOfLogin = false;
    //                 }
    //             );
    //         },
    //         (error: any) => {
    //             this.loadingOfLogin = false;
    //             Swal.fire({
    //                 icon: 'error',
    //                 title: 'Login Failed!',
    //                 text: 'Unable to authenticate with your provided credentials.',
    //                 timer: 2000,
    //                 showConfirmButton: false,
    //             });
    //         }
    //     );
    // }

    changePassword() {

    }

    onOtpChange(otp: any) {
        this.otpCode = otp;
    }



    otpCode: string = '';
    onSubmit(): void {
        if (this.step === 'email') {
            if (!this.email.trim()) {
                alert('Please enter your email.');
                return;
            }

            this.loadingOfLogin = true;

            this.loginService.forgetPassword(this.email).subscribe({
                next: (res: any) => {
                    this.loadingOfLogin = false;
                    this.step = 'verify'; // move to verification step
                },
                error: (err: any) => {
                    this.loadingOfLogin = false;
                    alert('Error sending verification code.');
                }
            });

        } else if (this.step === 'verify') {

            if (!this.otpCode || this.otpCode.length !== 6) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Invalid OTP!',
                    text: 'Please enter the complete OTP.',
                    timer: 2000,
                    showConfirmButton: false
                });
                return;
            }

            this.loadingOfLogin = true;
            // const fullOtp = this.otp.join('');

            this.loginService.verifyOTP(this.email, this.otpCode).subscribe({
                next: (res: any) => {
                    this.loadingOfLogin = false;
                    Swal.fire({
                        icon: 'success',
                        title: 'Verified Successfully!',
                        timer: 2000,
                        showConfirmButton: false,
                    }).then(() => {
                        this.resetToken = res.reset_token;
                        this.step = 'reset';
                    });
                },

                error: (err: any) => {
                    this.loadingOfLogin = false;
                    alert('Error in verification code.');
                }
            });


        }
        else if (this.step === 'reset') {
            this.loginService.resetPassword(this.email, this.new_password, this.resetToken).subscribe({
                next: (res: any) => {
                    console.log(res);
                    this.loadingOfLogin = false;
                    Swal.fire({
                        icon: 'success',
                        title: 'Password Successfully Changed!',
                        timer: 2000,
                        showConfirmButton: false,
                    }).then(() => {
                        this.verification = false;
                    });
                },

                error: (err: any) => {
                    this.loadingOfLogin = false;
                    alert('Error in chaning password.');
                }
            });

        }
    }


    getUserInfoForPermission() {
        this.loginService.getAdminUserSingle().subscribe(
            (response: any) => {


            },
            (error: any) => {

            }
        );

    }



}
