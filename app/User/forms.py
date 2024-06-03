from django import forms
from .models import User

class CodeVerificationForm(forms.Form):
    code = forms.CharField(max_length=100, required=True, widget=forms.TextInput(attrs={
        'placeholder': 'Enter verification code',
        'class': 'form-control'
    }))

class TwoFactorToggleForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['is_two_factor_enabled']
        widgets = {
            'is_two_factor_enabled': forms.CheckboxInput(attrs={
                'class': 'form-check-input',
                'type': 'checkbox',
                'role': 'switch',
                'id': 'is_two_factor_enabled'
            }),
        }

class TOTPVerificationForm(forms.Form):
    code = forms.CharField(max_length=100, required=True, widget=forms.TextInput(attrs={
        'placeholder': 'Enter verification code',
        'class': 'form-control'
    }))