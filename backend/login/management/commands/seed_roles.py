from django.core.management.base import BaseCommand
from login.models import Roles

class Command(BaseCommand):
    help = "Seed default roles: admin, editor, viewer"

    def handle(self, *args, **options):
        roles = [
            ('admin', 'Administrator role'),
            ('editor', 'Editor role'),
            ('viewer', 'Viewer role'),
        ]
        for name, desc in roles:
            Roles.objects.get_or_create(name=name, defaults={'description': desc})
        self.stdout.write(self.style.SUCCESS('Roles seeded successfully.'))
