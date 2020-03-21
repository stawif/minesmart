from django import forms
from .models import Owner

class OwnerForm(forms.ModelForm):
    password = forms.CharField(max_length=30,widget=forms.PasswordInput)

    class Meta:
        model = Owner
        fields = ('name','username','password','contact')