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
    path('platforms/', views.PlatformListView.as_view(), name='platforms'),
    path('organizations/create/', views.CreateOrganizationView.as_view(), name='create-organization'),
    path('org/departments/', views.DepartmentListView.as_view(), name='department-list'),
    path('org/departments/<int:pk>/', views.DepartmentDetailView.as_view(), name='department-detail'),
    path('org/levels/', views.LevelListView.as_view(), name='level-list'),
    path('org/levels/<int:pk>/', views.LevelDetailView.as_view(), name='level-detail'),
    path('org/features/', views.FeatureListView.as_view(), name='feature-list'),
    path('org/features/<int:pk>/', views.FeatureDetailView.as_view(), name='feature-detail'),
    path('org/api/functions/', views.FunctionListView.as_view(), name='function-list'),
    path('org/api/functions/<int:pk>/', views.FunctionDetailView.as_view(), name='function-detail'),
    path('org/level-feature-access/', views.LevelFeatureAccessListView.as_view(), name='level-feature-access-list'),
    path('org/level-feature-access/<int:pk>/', views.LevelFeatureAccessDetailView.as_view(), name='level-feature-access-detail'),
    path('org/department-user-levels/', views.DepartmentUserLevelListView.as_view(), name='department-user-level-list'),
    path('org/department-user-levels/<int:pk>/', views.DepartmentUserLevelDetailView.as_view(), name='department-user-level-detail'),
]
