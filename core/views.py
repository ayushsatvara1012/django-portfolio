from django.shortcuts import render, redirect
from django.contrib import messages
from .forms import FeedbackForm
from .models import Feedback


def home(request):
    return render(request, 'core/home.html')


def about(request):
    return render(request, 'core/about.html')


def contact(request):
    return render(request, 'core/contact.html')


def feedback(request):
    if request.method == 'POST':
        form = FeedbackForm(request.POST)
        if form.is_valid():
            Feedback.objects.create(
                name=form.cleaned_data['name'],
                email=form.cleaned_data['email'],
                message=form.cleaned_data['message'],
                rating=form.cleaned_data['rating']
            )
            messages.success(request, f'Thank you {form.cleaned_data["name"]} for your feedback!')
            return redirect('home')
    else:
        form = FeedbackForm()
    return render(request, 'core/feedback.html', {'form': form})
