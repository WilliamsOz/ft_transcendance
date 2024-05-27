from django.contrib import admin
from User.models import User

# Register your models here.
class UserAdmin(admin.ModelAdmin):
	list_display = ('user_id', 'login42', 'email')

admin.site.register(User, UserAdmin)