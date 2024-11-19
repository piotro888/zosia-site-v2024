#!/bin/sh
set -eu

# This script creates a superuser based on the environment variables:
# DJANGO_SUPERUSER_USERNAME
# DJANGO_SUPERUSER_EMAIL
# DJANGO_SUPERUSER_PASSWORD

python manage.py createsuperuser --noinput