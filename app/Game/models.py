from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator

class PongGame(models.Model):
	id = models.AutoField(primary_key=True)
	playerOne = models.CharField(blank=False, max_length=10)
	playerTwo = models.CharField(blank=False, max_length=10)
	scorePlayerOne = models.IntegerField(blank=False, default=0)
	scorePlayerTwo = models.IntegerField(blank=False, default=0)
	date = models.DateField(default=timezone.now, blank=False)

class PongGameIA(models.Model):
	playerOne = models.CharField(blank=False, max_length=10)

class PlayersTournament(models.Model):
	name = models.CharField(max_length=100)

	def __str__(self):
		return self.name

def checkNumberOfPlayer(value):
	if value not in [4, 8]:
		raise ValidationError(f'Le nombre de joueur du tounois doit être de 4 ou 8 !')

class PongTournament(models.Model):
	id = models.AutoField(primary_key=True)
	numberOfPlayer = models.IntegerField(blank=False, validators=[checkNumberOfPlayer])
	players = models.ManyToManyField(PlayersTournament)
	current_round = models.IntegerField(default=1)
	finished = models.BooleanField(default=False)

class Match(models.Model):
	tournament = models.ForeignKey(PongTournament, on_delete=models.CASCADE, related_name='matches')
	player1 = models.ForeignKey(PlayersTournament, on_delete=models.CASCADE, related_name='player1_matches')
	player2 = models.ForeignKey(PlayersTournament, on_delete=models.CASCADE, related_name='player2_matches')
	winner = models.ForeignKey(PlayersTournament, on_delete=models.SET_NULL, null=True, blank=True, related_name='won_matches')
	round = models.IntegerField(default=1)
