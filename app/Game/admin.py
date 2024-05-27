from django.contrib import admin
from Game.models import PongGame, PongTournament , Morpion 

class PongGameAdmin(admin.ModelAdmin):
	list_display = ('id', 'playerOne', 'playerTwo', 'scorePlayerOne', 'scorePlayerTwo', 'date')

class PongTournamentAdmin(admin.ModelAdmin):
	list_display = ('id', 'numberOfPlayer')
class MorpionAdmin(admin.ModelAdmin):
	list_display = ('id', 'playerOne', 'playerTwo', 'scorePlayerOne', 'scorePlayerTwo', 'date')

admin.site.register(PongGame, PongGameAdmin)
admin.site.register(PongTournament, PongTournamentAdmin)
admin.site.register(Morpion, MorpionAdmin)