from django.contrib import admin
from .models import User, Organization, Platform, Roles, Feature, Level, Department, Function

@admin.register(Platform)
class PlatformAdmin(admin.ModelAdmin):
    list_display = ('name', 'creation_date')
    search_fields = ('name',)

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'creation_date')
    search_fields = ('name',)
    filter_horizontal = ('platforms',)

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'name', 'organization', 'platform', 'is_staff', 'is_superuser')
    list_filter = ('is_staff', 'is_superuser', 'organization', 'platform')
    search_fields = ('username', 'email', 'name')

admin.site.register(Roles)
admin.site.register(Feature)
admin.site.register(Level)
admin.site.register(Department)
admin.site.register(Function)
