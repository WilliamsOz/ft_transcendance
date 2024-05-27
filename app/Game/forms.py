from django import forms
from Game.models import PongGame, PongGameIA, PongTournament, PlayersTournament

class PongGameForm(forms.ModelForm):
	class Meta:
		model = PongGame
		fields = ['playerOne', 'playerTwo']
		labels = {
			'playerOne': 'Joueur 1',
			'playerTwo': 'Joueur 2',
		}

class PongGameFormIA(forms.ModelForm):
	class Meta:
		model = PongGameIA
		fields = ['playerOne']
		labels = {'playerOne': 'Joueur 1'}

class PongTournamentForm(forms.ModelForm):
	class Meta:
		model = PongTournament
		fields = ['numberOfPlayer']
		labels = {
			'numberOfPlayer': 'Nombre de joueurs'
		}

class PlayerTournamentForm(forms.ModelForm):
	class Meta:
		model = PlayersTournament
		fields = ['name']
		labels = {
			'name': 'Nom du joueur'
		}