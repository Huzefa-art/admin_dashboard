"""
URLs mapping for the login/user APIs.
"""
from django.urls import path
from . import views

app_name = 'login_feature'

urlpatterns = [
    path('create/', views.CreateUserView.as_view(), name='create'),
    path('verify/<str:token>/', views.UserVerificationView.as_view(), name='verify'),
    path('token/', views.CreateTokenView.as_view(), name='token'),
    path('me/', views.ManageUserView.as_view(), name='me'),
    path('admin/user/', views.ManageAdminUserAPIView.as_view(), name='edit-user'),
    path('auth/forgot-password/', views.ForgotPasswordRequestView.as_view(), name='forgot-password'),
    path('auth/verify-otp/', views.VerifyOTPView.as_view(), name='verify-otp'),
    path('auth/reset-password/', views.ResetPasswordView.as_view(), name='reset-password'),
    path('only-admin-users/', views.AdminUsersListView.as_view(), name='only-admin-users'),
]
