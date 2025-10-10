from django import forms

class FeedbackForm(forms.Form):
    name = forms.CharField(max_length=100)
    email = forms.EmailField()
    message = forms.CharField(widget=forms.Textarea)
    rating = forms.ChoiceField(choices=[
        (5, '★★★★★ Excellent'),
        (4, '★★★★ Very Good'),
        (3, '★★★ Good'),
        (2, '★★ Fair'),
        (1, '★ Poor')
    ])
