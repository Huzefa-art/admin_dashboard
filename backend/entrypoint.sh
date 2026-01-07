#!/bin/sh

# Run migrations
echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate --noinput

# Seed default roles
echo "Seeding roles..."
python manage.py seed_roles

# Start Gunicorn
echo "Starting Gunicorn..."
exec gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 1 --timeout 120
