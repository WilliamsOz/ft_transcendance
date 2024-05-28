from django.contrib import admin
from Game.models import Morpion 

class MorpionAdmin(admin.ModelAdmin):
	list_display = ('id', 'playerOne', 'playerTwo', 'scorePlayerOne', 'scorePlayerTwo', 'date')

admin.site.register(Morpion, MorpionAdmin)