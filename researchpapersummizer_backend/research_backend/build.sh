#!/usr/bin/env bash
# Exit on error
set -o errexit

pip install -r requirements.txt

cd research_backend
python manage.py collectstatic --noinput
python manage.py migrate
