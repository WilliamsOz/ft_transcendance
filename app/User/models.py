from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid
from datetime import timedelta
from django.utils import timezone

class User(AbstractUser):
	id = models.AutoField(primary_key=True)
	login42 = models.CharField(max_length=50, unique=True)
	email = models.EmailField(unique=True)
	profile_photo = models.URLField(verbose_name='Profil picture')
	token = models.CharField(max_length=255)
	is_two_factor_enabled = models.BooleanField(default=False)
	totp_key = models.CharField(max_length=100, blank=True, null=True)

	def __str__(self):
		return self.login42

	class Meta:
		verbose_name_plural = "Users"

class VerificationCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.UUIDField(default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        expiry_time = self.created_at + timedelta(minutes=10)
        return expiry_time > timezone.now()
