from django.db import models

class User(models.Model):
    user_id = models.AutoField(primary_key=True)
    login42 = models.CharField(max_length=50, unique=True)
    email = models.EmailField(unique=True)
    # profile_photo = models.ImageField(verbose_name='Profil picture')
    token = models.CharField(max_length=255)

    def __str__(self):
        return "Games"
    
    class Meta:
        verbose_name_plural = "Users"