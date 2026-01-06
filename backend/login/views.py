"""
Views for the Login/User APIs.
"""
from rest_framework import generics, authentication, permissions, status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.views import APIView
from rest_framework.settings import api_settings
from django.utils.translation import gettext_lazy as _
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from django.contrib.auth import get_user_model

from .permissions import IsAdminUser

from .serializers import (
    UserSerializer,
    AuthTokenSerializer,
    AdminUserCreateSerializer,
    AdminUserUpdateSerializer,
    ForgotPasswordRequestSerializer,
    OTPVerificationSerializer,
    ResetPasswordSerializer,
    ResetPasswordSerializer,
    PlatformSerializer,
    DepartmentSerializer,
    LevelSerializer,
    FunctionSerializer,
    FeatureSerializer,
    LevelFeatureAccessSerializer,
    DepartmentUserLevelSerializer
)
import random
import uuid
from django.utils import timezone
# from django.core.mail import send_mail
from .models import Roles, Platform, Organization, Department, Level, Feature, Function, LevelFeatureAccess, DepartmentUserLevel

User = get_user_model()

class CreateUserView(generics.CreateAPIView):
    """"Create a new user in the system."""
    serializer_class = UserSerializer

class UserVerificationView(APIView):
    serializer_class = None

    def get(self, request, token):
        user = get_user_model().get_user_by_verification_token(token)
        if user and not user.verified:
            user.verified = True
            user.save()

            return Response(
                {'detail': 'User successfully verified'},
                status=status.HTTP_200_OK
                )
        else:
            return Response(
                {'detail': 'Invalid or already verified token'},
                status=status.HTTP_400_BAD_REQUEST
                )

class CreateTokenView(ObtainAuthToken):
    """Create a new auth token for user using Django ModelBackend only."""

    serializer_class = AuthTokenSerializer
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        print(f"[CreateTokenView] Received login request for: {email}")

        serializer = self.serializer_class(
            data=request.data,
            context={'request': request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        print(f"[CreateTokenView] ModelBackend returned: {user}")

        token, created = Token.objects.get_or_create(user=user)
        print(f"[CreateTokenView] Token {'created' if created else 'retrieved'}: {token.key}")

        if not getattr(user, 'verified', True):
            print(f"[CreateTokenView] User verified={user.verified}, denying access.")
            return Response({
                'detail': _('Your email address is not verified. Please check your email.')
            }, status=status.HTTP_401_UNAUTHORIZED)

        print(f"[CreateTokenView] Login success. Returning token.")
        return Response({
            'token': token.key,
            'user_id': user.id,
            'email': user.email,
            'verified': user.verified,
        })

class ManageUserView(generics.RetrieveUpdateAPIView):
    """Manage the authenticated user"""
    serializer_class = UserSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """Retrieve and return the authenticated user"""
        return self.request.user

class ManageAdminUserAPIView(generics.RetrieveUpdateDestroyAPIView):
    """manage the authenticated user"""
    serializer_class = AdminUserCreateSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get_object(self):
        """Return authenticated admin user"""
        return self.request.user

    def get_serializer_class(self):
        if self.request.method in ['PUT', 'PATCH']:
            return AdminUserUpdateSerializer
        return AdminUserCreateSerializer

class ForgotPasswordRequestView(APIView):
    serializer_class = ForgotPasswordRequestSerializer
    """Step 1: User submits email to receive OTP"""
    def post(self, request):
        serializer = ForgotPasswordRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'User with this email not found.'}, status=404)

        otp = str(random.randint(100000, 999999))
        user.otp = otp
        user.otp_expiry = timezone.now() + timezone.timedelta(minutes=10)
        user.reset_token = None
        user.save()

        # send_mail(
        #     subject="DCMS - OTP for Password Reset",
        #     message=f"Your OTP is {otp}. It is valid for 10 minutes.",
        #     from_email="noreply@smmart.ai",
        #     recipient_list=[email],
        #     fail_silently=False
        # )

        return Response({'detail': 'OTP sent to email.'}, status=200)

class VerifyOTPView(APIView):
    serializer_class = OTPVerificationSerializer
    """Step 2: User submits email + OTP to get reset token"""
    def post(self, request):
        serializer = OTPVerificationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        otp = serializer.validated_data['otp']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=404)

        if user.otp != otp:
            return Response({'detail': 'Invalid OTP.'}, status=400)
        if timezone.now() > user.otp_expiry:
            return Response({'detail': 'OTP has expired.'}, status=400)

        reset_token = str(uuid.uuid4())
        user.reset_token = reset_token
        user.otp = None
        user.otp_expiry = None
        user.save()

        return Response({'reset_token': reset_token}, status=200)

class ResetPasswordView(APIView):
    serializer_class = ResetPasswordSerializer
    """Step 3: User submits email + reset_token + new password"""
    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']
        reset_token = serializer.validated_data['reset_token']

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'detail': 'User not found.'}, status=404)

        if user.reset_token != reset_token:
            return Response({'detail': 'Invalid or expired reset token.'}, status=403)

        user.set_password(password)
        user.reset_token = None
        user.save()

        return Response({'detail': 'Password reset successful.'}, status=200)

class PlatformListView(generics.ListAPIView):
    """List all platforms."""
    queryset = Platform.objects.all()
    serializer_class = PlatformSerializer
    permission_classes = [permissions.IsAuthenticated]

class AdminUsersListView(APIView):
    serializer_class = UserSerializer
    authentication_classes = [authentication.TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):
        
        if not request.user.is_superuser:
            return Response({"error": "You are not authorized to view this list."}, status=status.HTTP_403_FORBIDDEN)

        User = get_user_model()
        try:
            admin_role = Roles.objects.get(name=Roles.ADMIN)
        except Roles.DoesNotExist:
            return Response({"error": "Admin role not found."}, status=status.HTTP_404_NOT_FOUND)

        admin_users = User.objects.filter(role=admin_role)
        serializer = UserSerializer(admin_users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class DepartmentListView(generics.ListCreateAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class DepartmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer
    permission_classes = [permissions.IsAuthenticated]

class LevelListView(generics.ListCreateAPIView):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer
    permission_classes = [permissions.IsAuthenticated]

class LevelDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Level.objects.all()
    serializer_class = LevelSerializer
    permission_classes = [permissions.IsAuthenticated]

class FeatureListView(generics.ListCreateAPIView):
    queryset = Feature.objects.all()
    serializer_class = FeatureSerializer
    permission_classes = [permissions.IsAuthenticated]

class FeatureDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Feature.objects.all()
    serializer_class = FeatureSerializer
    permission_classes = [permissions.IsAuthenticated]

class FunctionListView(generics.ListCreateAPIView):
    queryset = Function.objects.all()
    serializer_class = FunctionSerializer
    permission_classes = [permissions.IsAuthenticated]

class FunctionDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Function.objects.all()
    serializer_class = FunctionSerializer
    permission_classes = [permissions.IsAuthenticated]

class LevelFeatureAccessListView(generics.ListCreateAPIView):
    queryset = LevelFeatureAccess.objects.all()
    serializer_class = LevelFeatureAccessSerializer
    permission_classes = [permissions.IsAuthenticated]

class LevelFeatureAccessDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = LevelFeatureAccess.objects.all()
    serializer_class = LevelFeatureAccessSerializer
    permission_classes = [permissions.IsAuthenticated]

class DepartmentUserLevelListView(generics.ListCreateAPIView):
    queryset = DepartmentUserLevel.objects.all()
    serializer_class = DepartmentUserLevelSerializer
    permission_classes = [permissions.IsAuthenticated]

class DepartmentUserLevelDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DepartmentUserLevel.objects.all()
    serializer_class = DepartmentUserLevelSerializer
    permission_classes = [permissions.IsAuthenticated]
