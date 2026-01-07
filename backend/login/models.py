"""
Database models.
"""

from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin
)
from django.conf import settings
import hashlib
from django.utils.timezone import now
from django.core.exceptions import ValidationError

class UserMananager(BaseUserManager):
    """Manager for users."""

    def create_user(self, email, username=None, password=None, organization=None,
                    package=None, role=None, platform=None, is_admin=False, **extra_fields):
        """Create and save a user"""
        if not email:
            raise ValueError("User must have an email.")
        
        if not username:
            # Fallback if username is not provided, though it should be
            username = email

        if is_admin is False:
            if not organization:
                raise ValueError("User must have an organization.")

            if role is None:
                role = Roles.objects.get(name='admin')

            user = self.model(
                email=self.normalize_email(email),
                username=username,
                organization=organization,
                role=role,
                platform=platform,
                **extra_fields
            )
            user.set_password(password)
            user.save(using=self.db)
        else:
            user = self.model(
                email=self.normalize_email(email),
                username=username,
                organization=organization,
                role=role,
                platform=platform,
                **extra_fields
            )
            user.set_password(password)
            user.save(using=self.db)

        return user

    def create_superuser(self, email, password, username=None, organization=None,
                          role=None, **extra_fields):
        """Create and return new superuser"""
        if not username:
            username = email
            
        user = self.create_user(
            email=email, 
            username=username,
            password=password,
            organization=organization,
            role=role, 
            is_admin=True, 
            **extra_fields
        )
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self.db)

        return user


class Platform(models.Model):
    """Platform model to integrate different platforms."""
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(null=True, blank=True)
    creation_date = models.DateTimeField(auto_now_add=True)
    redirect_url = models.CharField(max_length=255, null=True, blank=True)  # e.g. /admin/dashboard

    
    def __str__(self):
        return self.name


class Organization(models.Model):
    name = models.CharField(max_length=255, null=True)
    sidebar_color = models.CharField(max_length=255, null=True)
    text_color = models.CharField(max_length=255, null=True)
    base_color = models.CharField(max_length=255, null=True)
    title_of_browser = models.CharField(max_length=255, null=True)

    # New fields
    home_page_banner = models.ImageField(upload_to='organization/banners/', null=True, blank=True)
    basket_image = models.ImageField(upload_to='organization/baskets/', null=True, blank=True)
    favicon = models.ImageField(upload_to='organization/favicons/', null=True, blank=True)
    logo = models.ImageField(upload_to='organization/logos/', null=True, blank=True)
    
    # Platform integration
    platforms = models.ManyToManyField(Platform, related_name='organizations', blank=True)

    # Who columns
    creation_date = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField(null=True, blank=True)
    last_update_date = models.DateTimeField(auto_now=True)
    last_updated_by = models.IntegerField(null=True, blank=True)
    last_update_login = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.name



class Roles(models.Model):
    """Roles in the system."""
    ADMIN = 'admin'
    EDITOR = 'editor'
    VIEWER = 'viewer'
    
    ROLE_CHOICES = [
        (ADMIN, 'Admin'),
        (EDITOR, 'Editor'),
        (VIEWER, 'Viewer'),
    ]
    
    name = models.CharField(max_length=255, choices=ROLE_CHOICES, default='viewer')

    description = models.CharField(max_length=255, null=True, blank=True)
     # who columns
    creation_date = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField(null=True, blank=True)
    last_update_date = models.DateTimeField(auto_now=True)
    last_updated_by = models.IntegerField(null=True, blank=True)
    last_update_login = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.get_name_display()



class User(AbstractBaseUser, PermissionsMixin):
    """User in the system."""
    email = models.EmailField(max_length=255)
    username = models.CharField(max_length=255, unique=True)
    name = models.CharField(max_length=255)
    designation = models.CharField(max_length=255, default="Staff")
    created_at = models.DateTimeField(auto_now_add=True)
    otp = models.CharField(max_length=6, null=True, blank=True)
    otp_expiry = models.DateTimeField(null=True, blank=True)
    reset_token = models.CharField(max_length=255, null=True, blank=True)
    organization = models.ForeignKey(
        'Organization', on_delete=models.CASCADE, null=True, blank=True
        )
    role = models.ForeignKey(
        'Roles', null=True, blank=True, on_delete=models.PROTECT
        )
    platform = models.ForeignKey(
        'Platform', on_delete=models.SET_NULL, null=True, blank=True, related_name='users'
    )
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    verified = models.BooleanField(default=False)
    ad_flag = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=64, blank=True, null=True)

    objects = UserMananager()

    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email']

    def generate_verification_token(self):
        data_to_hash = f"{self.email}{settings.SECRET_KEY}"
        self.verification_token = hashlib.sha256(
            data_to_hash.encode()
            ).hexdigest()
        self.save()

    @staticmethod
    def get_user_by_verification_token(verification_token):
        try:
            return User.objects.get(verification_token=verification_token)
        except User.DoesNotExist:
            return None


class Document(models.Model):
    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255, blank=True, null=True)
    tags = models.CharField(
        max_length=255,
        blank=True,
        null=True,
        help_text="Comma-separated list of tags."
    )
    category = models.CharField(max_length=100, blank=True, null=True)
    file = models.FileField(upload_to='documents/')
    uploaded_by = models.ForeignKey(
        'User', null=True, blank=True, on_delete=models.CASCADE
        )
    uploaded_at = models.DateTimeField(auto_now_add=True)
    ocr_text = models.TextField(blank=True, null=True, help_text="OCR processed text (if applicable)")
    ocr_html = models.TextField(blank=True, null=True, help_text="OCR processed text in HTML format") 
    filename = models.CharField(max_length=255, blank=True, null=True)
     # Reference to Project (optional, can be null)
    project = models.ForeignKey(
        'Project', null=True, blank=True, on_delete=models.SET_NULL
    )
    # who columns
    creation_date = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField(null=True, blank=True)
    last_update_date = models.DateTimeField(auto_now=True)
    last_updated_by = models.IntegerField(null=True, blank=True)
    last_update_login = models.IntegerField(null=True, blank=True)


    def delete(self, *args, **kwargs):
        if self.file:
            self.file.delete(save=False)
        super().delete(*args, **kwargs)

    def __str__(self):
        return self.title



class DocumentPermission(models.Model):
    """Tracks document access for users."""
    VIEW = 'view'
    EDIT = 'edit'
    
    PERMISSION_CHOICES = [
        (VIEW, 'View'),
        (EDIT, 'Edit'),
    ]
    
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    permission = models.CharField(max_length=10, choices=PERMISSION_CHOICES)
    granted_by = models.ForeignKey('User', on_delete=models.CASCADE, related_name='granted_permissions')
    granted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} - {self.permission} - {self.document.title}"


class DocumentVersion(models.Model):
    """Model to manage document versions."""
    file = models.FileField(upload_to='document_versions/', blank=True, null=True)
    filename = models.CharField(max_length=255, blank=True, null=True)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name="versions")
    version_number = models.PositiveIntegerField()
    content = models.TextField()  # Stores the versioned content
    edited_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=now)

    class Meta:
        unique_together = ('document', 'version_number')
        ordering = ['-version_number']  # Latest version first

    def __str__(self):
        return f"{self.document.title} - v{self.version_number}"
    

class APIKeys(models.Model):
    engine_name = models.CharField(max_length=100)
    api_key = models.TextField()
    is_active = models.BooleanField(default=True)
    # who columns
    creation_date = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey('User', null=True, blank=True, on_delete=models.SET_NULL)
    last_update_date = models.DateTimeField(auto_now=True)
    last_updated_by = models.IntegerField(null=True, blank=True)
    last_update_login = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.engine_name
    


class Project(models.Model):

    project_name = models.CharField(max_length=255)
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE
    )
    creation_date = models.DateTimeField(auto_now_add=True)
    created_by = models.IntegerField(null=True, blank=True)
    last_update_date = models.DateTimeField(auto_now=True)
    last_updated_by = models.IntegerField(null=True, blank=True)
    last_update_login = models.IntegerField(null=True, blank=True)


class Template(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()
    content = models.TextField()

    created_by = models.ForeignKey(
        'User', null=True, blank=True, on_delete=models.CASCADE
    )

    creation_date = models.DateTimeField(auto_now_add=True)
    last_update_date = models.DateTimeField(auto_now=True)
    last_updated_by = models.IntegerField(null=True, blank=True)
    last_update_login = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return self.name


class LDAPConfiguration(models.Model):
    name = models.CharField(max_length=100, unique=True)
    server_uri = models.CharField(max_length=255)
    domain = models.CharField(max_length=100)
    search_base = models.CharField(max_length=255)
    bind_username_encrypted = models.BinaryField()
    bind_password_encrypted = models.BinaryField()
    created_at = models.DateTimeField(auto_now_add=True)


class Function(models.Model):
    name = models.CharField(max_length=255)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='functions_created')
    last_updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='functions_updated')

class Department(models.Model):
    name = models.CharField(max_length=255)
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE)
    function = models.ForeignKey(Function, on_delete=models.SET_NULL, null=True, blank=True)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.CASCADE, related_name='subdepartments')
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_departments')
    last_updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_departments')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)



# class Level(models.Model):
#     number = models.PositiveIntegerField(unique=True)
#     name = models.CharField(max_length=100)  # e.g., "Final Approver", "Reviewer"
#     created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='levels_created')
#     last_updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='levels_updated')
    

#     class Meta:
#         ordering = ['number']

#     def __str__(self):
#         return f"L{self.number} - {self.name}"

class Level(models.Model):
    number = models.PositiveIntegerField()  # 🔁 Removed unique=True
    name = models.CharField(max_length=100)
    created_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='levels_created'
    )
    last_updated_by = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True, related_name='levels_updated'
    )

    class Meta:
        ordering = ['number']

    def clean(self):
        # ✅ Custom validation for uniqueness within the same organization
        if self.created_by and self.created_by.organization:
            org = self.created_by.organization
            exists = Level.objects.filter(
                number=self.number,
                created_by__organization=org
            ).exclude(pk=self.pk).exists()

            if exists:
                raise ValidationError(f"Level number {self.number} already exists in your organization.")

    def save(self, *args, **kwargs):
        self.clean()  # 🔁 Call validation before saving
        super().save(*args, **kwargs)

    def __str__(self):
        return f"L{self.number} - {self.name}"
    

class DepartmentUserLevel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    level = models.ForeignKey(Level, on_delete=models.CASCADE)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='department_user_levels_created')
    last_updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='department_user_levels_updated')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'department')  # One level per user per department

    def __str__(self):
        return f"{self.user.email} - {self.level} in {self.department.name}"



class PersonalInfo(models.Model):
    name = models.CharField(max_length=255)
    department = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField()
    mobile_no = models.CharField(max_length=20)
    landline_no = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)


class Feature(models.Model):
    code = models.CharField(max_length=100)
    name = models.CharField(max_length=255)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_features')
    last_updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_features')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class LevelFeatureAccess(models.Model):
    level = models.ForeignKey(Level, on_delete=models.CASCADE)
    feature = models.ForeignKey(Feature, on_delete=models.CASCADE)
    can_access = models.BooleanField(default=False)

    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_feature_accesses')
    last_updated_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='updated_feature_accesses')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('level', 'feature')

    def __str__(self):
        return f"{self.level.name} - {self.feature.code} - {'Yes' if self.can_access else 'No'}"


class DocumentApproval(models.Model):
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='approvals')
    assigned_to = models.ForeignKey(User, on_delete=models.CASCADE, related_name='approvals_assigned')
    assigned_level = models.ForeignKey(Level, on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=[
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ], default='pending')
    comments = models.TextField(null=True, blank=True)
    action_taken_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approval_actions')
    action_taken_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class DocumentViewHistory(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-viewed_at']  


class FavoriteDocument(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    document = models.ForeignKey(Document, on_delete=models.CASCADE)
    marked_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'document')


# models.py

class DocumentComment(models.Model):
    """Stores comments on a document. Only viewers can create comments."""
    document = models.ForeignKey(
        Document, on_delete=models.CASCADE, related_name='comments'
    )
    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='comments'
    )
    selected_text = models.TextField()    
    comment = models.TextField()          
   
    version = models.ForeignKey(
        DocumentVersion, on_delete=models.SET_NULL, null=True, blank=True
    )
    paragraph_index = models.PositiveIntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return f'Comment by {self.user.email} on {self.document.title}'
    
class OnlyOfficeTempDoc(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True
    )
    temp_url = models.TextField()
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.temp_url}"
