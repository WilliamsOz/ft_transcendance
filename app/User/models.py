from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
	id = models.AutoField(primary_key=True)
	login42 = models.CharField(max_length=50, unique=True)
	email = models.EmailField(unique=True)
	profile_photo = models.URLField(verbose_name='Profil picture')
	token = models.CharField(max_length=255)
	consent_RGPD = models.BooleanField(default=False)

	def __str__(self):
		return self.login42

	class Meta:
		verbose_name_plural = "Users"
