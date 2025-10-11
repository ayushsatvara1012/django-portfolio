from django import forms

class FeedbackForm(forms.Form):
    name = forms.CharField(
        max_length=100,
        widget=forms.TextInput(attrs={'placeholder': 'Enter your name'})
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={'placeholder': 'Enter your email'})
    )
    message = forms.CharField(
        widget=forms.Textarea(attrs={'placeholder': 'Share your feedback here...'})
    )
    rating = forms.ChoiceField(choices=[
        (5, '★★★★★ Excellent'),
        (4, '★★★★ Very Good'),
        (3, '★★★ Good'),
        (2, '★★ Fair'),
        (1, '★ Poor')
    ])
