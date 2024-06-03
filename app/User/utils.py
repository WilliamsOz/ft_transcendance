from django.core.mail import send_mail
from django.conf import settings
from .models import VerificationCode

def send_verification_code(user):
    code = VerificationCode.objects.create(user=user)
    subject = 'Votre code de vérification'
    message = f'Votre code de vérification est {code.code}'
    email_from = settings.EMAIL_HOST_USER
    recipient_list = [user.email]
    send_mail(subject, message, email_from, recipient_list)

