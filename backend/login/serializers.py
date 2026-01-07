"""
Serializers for the login/user api view.
"""
from django.contrib.auth import (
    get_user_model,
    authenticate,
)
from django.utils.translation import gettext as _

from rest_framework import serializers
from drf_spectacular.utils import extend_schema_field

# from user.utils import decrypt_email
# from core.models import (
#     Organization,
#     Roles, DepartmentUserLevel, LevelFeatureAccess, Feature, User
# )


# from core.models import (
#     Organization,
# )

from .models import User, Roles, Organization, DepartmentUserLevel, LevelFeatureAccess, Feature, Platform, Department, Level, Function

# from organization.serializers import OrganizationSerializer
# from roles.serializers import RoleSerializer
# from core.models import (
#     Roles,
# )

ROLES = {
    'admin',
    'editor',
    'viewer',
}



class PlatformSerializer(serializers.ModelSerializer):
    """Serializer for Platform object."""
    class Meta:
        model = Platform
        fields = ['id', 'name', 'description']

class OrganizationSerializer(serializers.ModelSerializer):
    """Serializer for Organization object with image validations and platform integration"""

    logo = serializers.ImageField(required=False, allow_null=True)
    favicon = serializers.ImageField(required=False, allow_null=True)
    home_page_banner = serializers.ImageField(required=False, allow_null=True)
    basket_image = serializers.ImageField(required=False, allow_null=True)
    
    # Fields for automated user creation
    admin_email = serializers.EmailField(write_only=True, required=False)
    admin_password = serializers.CharField(write_only=True, required=False, style={'input_type': 'password'})
    admin_name = serializers.CharField(write_only=True, required=False)
    base_username = serializers.CharField(write_only=True, required=False)
    platform_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )

    MAX_SIZE_MB = 2
    ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/x-icon']

    class Meta:
        model = Organization
        fields = [
            'id',
            'name',
            'sidebar_color',
            'text_color',
            'base_color',
            'title_of_browser',
            'home_page_banner',
            'basket_image',
            'favicon',
            'logo',
            'platforms',
            'creation_date',
            'created_by',
            'last_update_date',
            'last_updated_by',
            'last_update_login',
            'admin_email',
            'admin_password',
            'admin_name',
            'base_username',
            'platform_ids',
        ]
        read_only_fields = ['id', 'creation_date', 'created_by', 'platforms']

    def validate_image(self, image, field_name):
        """Validate image type and file size"""
        if image:
            if image.content_type not in self.ALLOWED_IMAGE_TYPES:
                raise serializers.ValidationError(
                    f"The file uploaded for '{field_name}' must be an image (jpg, png, gif, webp, ico)."
                )

            if image.size > self.MAX_SIZE_MB * 1024 * 1024:
                raise serializers.ValidationError(
                    f"The file uploaded for '{field_name}' must be smaller than {self.MAX_SIZE_MB}MB."
                )
        return image

    def validate_logo(self, value):
        return self.validate_image(value, 'logo')

    def validate_favicon(self, value):
        return self.validate_image(value, 'favicon')

    def validate_home_page_banner(self, value):
        return self.validate_image(value, 'home_page_banner')

    def validate_basket_image(self, value):
        return self.validate_image(value, 'basket_image')

    def create(self, validated_data):
        # Extract the write-only fields for creating platform users
        admin_email = validated_data.pop('admin_email', None)
        admin_password = validated_data.pop('admin_password', None)
        admin_name = validated_data.pop('admin_name', None)
        base_username = validated_data.pop('base_username', None)
        platform_ids = validated_data.pop('platform_ids', [])

        # Create the organization
        organization = Organization.objects.create(**validated_data)

        # Set platforms
        if platform_ids:
            platforms = Platform.objects.filter(id__in=platform_ids)
            organization.platforms.set(platforms)

            # Create platform-specific users
            if admin_email and admin_password and base_username:
                role = Roles.objects.get(name='admin')
                for platform in platforms:
                    username = f"{base_username}_{platform.name.lower().replace(' ', '_')}"
                    get_user_model().objects.create_user(
                        email=admin_email,
                        username=username,
                        name=admin_name or base_username,
                        password=admin_password,
                        organization=organization,
                        role=role,
                        platform=platform,
                        verified=True,
                        is_staff=True
                    )

        return organization

    def update(self, instance, validated_data):
        """Update and return an organization instance"""
        user = self.context['request'].user
        # instance.id = user.organization_id # This seems wrong if we are updating any org

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.last_updated_by = user.id
        instance.save()
        return instance


class RoleSerializer(serializers.ModelSerializer):
    """Serializer for UserRole Object"""
    class Meta:
        model = Roles
        fields = [
            'id', 'name', 'description', 'creation_date', 'created_by',
            'last_update_date', 'last_updated_by', 'last_update_login'
            ]

        read_only_fields = ['id', 'creation_date', 'created_by']

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['id', 'name', 'organization', 'function']

class LevelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level
        fields = ['id', 'number', 'name']

class FunctionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Function
        fields = ['id', 'name', 'organization']

class FeatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Feature
        fields = ['code', 'name']

class LevelFeatureAccessSerializer(serializers.ModelSerializer):
    feature = FeatureSerializer()

    class Meta:
        model = LevelFeatureAccess
        fields = ['feature', 'can_access']

class DepartmentUserLevelSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    function_name = serializers.CharField(source='department.function.name', read_only=True)
    level_name = serializers.CharField(source='level.name', read_only=True)
    level_number = serializers.IntegerField(source='level.number', read_only=True)
    features = serializers.SerializerMethodField()

    class Meta:
        model = DepartmentUserLevel
        fields = ['department_name', 'function_name', 'level_name', 'level_number', 'features']

    def get_features(self, obj):
        accesses = LevelFeatureAccess.objects.filter(level=obj.level, can_access=True)
        return LevelFeatureAccessSerializer(accesses, many=True).data

class UserSerializer(serializers.ModelSerializer):
    """Serializer for user object."""
    organization = OrganizationSerializer(required=True)
    role = RoleSerializer(required=False)
    platform = PlatformSerializer(required=False)
    access_levels = serializers.SerializerMethodField()
    class Meta:
        model = get_user_model()
        fields = ['id', 'email', 'username', 'password', 'name', 'organization', 'designation', 'role', 'platform', 'is_superuser', 'access_levels']
        extra_kwargs = {'password': {'write_only': True, 'min_length': 5}}

    def create(self, validated_data):
        organization_data = validated_data.pop('organization', None)
        organization = Organization.objects.create(**organization_data)
        role = Roles.objects.get(name='admin')

        user = get_user_model().objects.create_user(
            organization=organization, role=role, verified=True, is_staff=True, **validated_data
        )
        user.generate_verification_token()

        return user

    def update(self, instance, validated_data):
        """Update and return a user instance."""
        if 'email' in validated_data:
            # raise serializers.ValidationError("Email cannot be changed.")
            pass # Allow for now or handle differently

        password = validated_data.pop('password', None)
        user = super().update(instance, validated_data)
        if password:
            user.set_password(password)
            user.save()

        return user
    
    @extend_schema_field(DepartmentUserLevelSerializer(many=True))
    def get_access_levels(self, user):
        dept_levels = DepartmentUserLevel.objects.filter(user=user)
        return DepartmentUserLevelSerializer(dept_levels, many=True).data

class AuthTokenSerializer(serializers.Serializer):
    """Serializer for user auth token."""
    username = serializers.CharField()
    password = serializers.CharField(
        style={'input_type': 'password'},
        trim_whitespace=False
    )

    def validate(self, attrs):
        """Validate and authenticate the user."""
        username = attrs.get('username')
        password = attrs.get('password')
        user = authenticate(
            request=self.context.get('request'),
            username=username,
            password=password
        )
        if not user:
            msg = _("Unable to authenticate with provided credentials!")
            raise serializers.ValidationError(msg, code='authorization')

        attrs['user'] = user
        return attrs

class ForgotPasswordRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()

class OTPVerificationSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=6)
    reset_token = serializers.CharField()

class AdminUserCreateSerializer(UserSerializer):
    organization = OrganizationSerializer(required=False)
    user_creation_date = serializers.SerializerMethodField()

    @extend_schema_field(serializers.DateTimeField())
    def get_user_creation_date(self, obj):
        return obj.created_at.strftime('%Y-%m-%dT%H:%M:%S.%fZ') if obj.created_at else None
    
    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + ['user_creation_date', 'organization']

    def update(self, instance, validated_data):
        """Update the user, specifically handling the role field."""
        role_data = validated_data.pop('role', None)  # Extract role from validated_data

        if role_data:
            role_name = role_data.get('name')
            if role_name in ROLES:
                role, _ = Roles.objects.get_or_create(name=role_name)
                instance.role = role  # Update user's role
            else:
                raise ValueError('Invalid Role Name')

        # Update other user fields
        return super().update(instance, validated_data)

    def create(self, validated_data):
        """Create and return a user with encrypted password"""
        request_user = self.context['request'].user
        organization = request_user.organization
        role_data = validated_data.pop('role')

        if role_data['name'] in ROLES:
            role, _ = Roles.objects.get_or_create(name=role_data['name'])
        else:
            raise ValueError('Invalid Role Name')

        user = get_user_model().objects.create_user(
            organization=organization,
            role=role, is_staff=False, verified=True, **validated_data
        )

        return user

    def get_fields(self):
        fields = super().get_fields()
        fields['role'].read_only = False
        fields['organization'].read_only = True
        return fields

class AdminUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ['role']

    def update(self, instance, validated_data):
        """Update and return non admin user"""
        role_data = validated_data.pop('role')

        if role_data['name'] in ROLES:
            role, _ = Roles.objects.get_or_create(name=role_data['name'])
        else:
            raise ValueError('Invalid Role Name')

        user = super().update(
            instance=instance, role=role, validated_data=validated_data
        )

        return user



