Django starter project

This is a minimal Django project scaffolded for quick development.

Quick start (macOS / zsh):

```bash
cd django-site
python3 -m venv .venv
.venv/bin/python -m pip install --upgrade pip setuptools wheel
.venv/bin/python -m pip install -r requirements.txt
.venv/bin/python manage.py migrate
.venv/bin/python manage.py createsuperuser
.venv/bin/python manage.py runserver 8000
```

Open http://127.0.0.1:8000 in your browser.
