from django.shortcuts import render, redirect, get_object_or_404
from Game.models import PongGame, PongTournament, Match, PlayersTournament , Morpion
from User.models import User
from Game.forms import PongGameForm, PongGameFormIA, PongTournamentForm, PlayerTournamentForm , MorpionForm
from django.http import JsonResponse, HttpResponseRedirect
import json, random
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required

@login_required
def home_game(request, id):
	user = User.objects.get(id=id)
	return render(request, 'Game/home_game.html', {'user': user})

@login_required
def play_game(request, id, playerOne, playerTwo):
	user = User.objects.get(id=id)
	return render(request, 'Game/play_game.html', {'user': user, 'playerOne': playerOne, 'playerTwo': playerTwo})

@login_required
def play_ia_game(request, id, playerOne):
	user = User.objects.get(id=id)
	return render(request, 'Game/play_ia_game.html', {'user': user, 'playerOne': playerOne})

@login_required
def rapid_game_auth(request, id):
	user = User.objects.get(id=id)
	if request.method == 'POST':
		form = PongGameForm(request.POST)
		if form.is_valid():
			playerOne = form.cleaned_data['playerOne']
			playerTwo = form.cleaned_data['playerTwo']
			return redirect('play_game', id=id, playerOne=playerOne, playerTwo=playerTwo)
	else:
		form = PongGameForm()
	return render(request, 'Game/rapid_game_auth.html', {'user': user, 'form': form})

@login_required
def ia_game(request, id):
	user = User.objects.get(id=id)
	if request.method == 'POST':
		form = PongGameFormIA(request.POST)
		if form.is_valid():
			playerOne = form.cleaned_data['playerOne']
			return redirect('play_ia_game', id=id, playerOne=playerOne)
	else:
		form = PongGameFormIA()
	return render(request, 'Game/ia_game.html', {'user': user, 'form': form})

@login_required
def create_tournament(request, id):
	user = get_object_or_404(User, id=id)
	if request.method == 'POST':
		tournament_form = PongTournamentForm(request.POST)
		if tournament_form.is_valid():
			# Créer un objet PongTournament avec le nombre de joueur spécifié dans le formulaire
			tournament = PongTournament.objects.create(
				numberOfPlayer=tournament_form.cleaned_data['numberOfPlayer']
			)
			# Redirige vers la vue de registration des joueurs
			return HttpResponseRedirect(reverse('player_registration', args=[id, tournament.id]))
	else:
		tournament_form = PongTournamentForm()
	return render(request, 'Game/create_tournament.html', {'user': user, 'tournament_form': tournament_form})

@login_required
def player_registration(request, id, tournament_id):
	# Récupère l'utilisateur et le tournoi, ou retourne une erreur 404
	user = get_object_or_404(User, id=id)
	tournament = get_object_or_404(PongTournament, id=tournament_id)
	if request.method == 'POST':
		# Créer une liste de formulaire de joueurs avec les données de la requête POST
		player_forms = [PlayerTournamentForm(request.POST, prefix=str(i)) for i in range(tournament.numberOfPlayer)]
		if all(form.is_valid() for form in player_forms):
			# Si tous les formulaires sont valides, enregistre chaque joueur et l'ajoute au tournoi
			for form in player_forms:
				player = form.save()
				tournament.players.add(player)
			# Redirige vers la vue de démarrage du tournoi
			return HttpResponseRedirect(reverse('start_tournament', args=[id, tournament_id]))
	else:
		player_forms = [PlayerTournamentForm(prefix=str(i)) for i in range(tournament.numberOfPlayer)]
	return render(request, 'Game/player_registration.html', {'user': user, 'player_forms': player_forms, 'tournament_id': tournament_id})

@login_required
def start_tournament(request, id, tournament_id):
	# Récupère l'utilisateur
	user = get_object_or_404(User, id=id)
	
	# On récupère l'id du tournoi
	tournament = get_object_or_404(PongTournament, id=tournament_id)
	
	# Vérifie si des matchs existent déjà pour ce tournoi
	if not Match.objects.filter(tournament=tournament).exists():
		# Si aucun match n'existe, génère les matchs pour le tournoi
		generate_matches(tournament)
	
	# Récupère tous les matchs du tournoi
	matches = Match.objects.filter(tournament=tournament)
	
	# Identifie le match actuel
	current_match = matches.filter(winner__isnull=True).first()

	return render(request, 'Game/start_tournament.html', {
		'user': user,
		'tournament': tournament,
		'matches': matches,
		'current_match': current_match
	})

def generate_matches(tournament):
	# Vérifiez si des matchs existent déjà pour ce tournoi
	if Match.objects.filter(tournament=tournament).exists():
		return  # Ne rien faire si des matchs existent déjà

	# Récupère tous les joueurs du tournoi et les convertit en liste
	players = list(tournament.players.all())
	# Mélange aléatoirement la liste des joueurs pour des matchs aléatoires
	random.shuffle(players)
	# Parcourt les joueurs deux par deux pour créer des matchs
	for i in range(0, len(players), 2):
		# Vérifie qu'il y a un deuxième joueur pour former un match
		if i + 1 < len(players):
			# Créer un match avec deux joueurs consécutifs de la liste mélangée
			Match.objects.create(tournament=tournament, player1=players[i], player2=players[i + 1], round=tournament.current_round)

def get_winner_of_match(match, winner_name):
	if (match.player1.name == winner_name):
		return match.player1
	return match.player2

@csrf_exempt
def end_match(request, match_id):
	# Extraire les données dans la requête HTTP
	data = json.loads(request.body)
	# Récupère le gagnant depuis la requête
	winner_name = data.get('winner')

	# Récupère l'instance du match passé en paramètre
	match = Match.objects.get(id=match_id)
	# Détermine le gagnant en fonction de l'instance match courante
	match_winner = get_winner_of_match(match, winner_name)
	# Mise à jour du gagnant dans l'instance match courante
	match.winner = match_winner
	# Sauvegarde de l'instance
	match.save()

	# Récupère l'instance du tournoi courant
	tournament_id = match.tournament_id
	# Vérifie si tous les matchs ont été joués
	all_matches_played = Match.objects.filter(tournament_id=tournament_id, winner__isnull=True).count() == 0

	# Si tous les matchs ont été joués, avancez au prochain tour ou terminez le tournoi
	if all_matches_played:
		advance_tournament_round(tournament_id)

	current_round = PongTournament.objects.get(id=tournament_id).current_round

	# Récupère le prochain match du tournoi à jouer (1er match où le champ "winner" est vide)
	next_match = Match.objects.filter(tournament=match.tournament, winner__isnull=True).first()

	# Vérifie si le tournoi est terminé
	tournament_finished = Match.objects.filter(tournament_id=tournament_id, winner__isnull=True).count() == 0 and PongTournament.objects.get(id=tournament_id).finished

	# Renvoi un dictionnaire contenant les données du match joué et à jouer
	response_data = {
		'winner': match_winner.name,
		'next_match_id': next_match.id if next_match else None,
		'next_player1': next_match.player1.name if next_match else None,
		'next_player2': next_match.player2.name if next_match else None,
		'tournament_finished': tournament_finished,
		'current_round': current_round,
	}

	return JsonResponse(response_data)

def advance_tournament_round(tournament_id):
	# Récupère le tournoi courant
	tournament = PongTournament.objects.get(id=tournament_id)
	
	# Récupère tous les matchs du tour actuel
	matches = Match.objects.filter(tournament=tournament, round=tournament.current_round)
	
	# Identifier tous les gagnants du tour
	winners = [match.winner for match in matches]

	# Vérifie s'il y a plus d'un gagnant
	if len(winners) > 1:
		# Avance le tour actuel
		tournament.current_round += 1
		tournament.save()

		# Créer de nouveaux matchs pour le prochain tour
		existing_matches = set()
		for i in range(0, len(winners), 2):
			if i + 1 < len(winners):
				player1 = winners[i]
				player2 = winners[i + 1]
				# Vérifie si un match entre ces deux joueurs existe déjà
				if not Match.objects.filter(tournament=tournament, player1=player1, player2=player2).exists():
					Match.objects.create(tournament=tournament, player1=player1, player2=player2, round=tournament.current_round)

	else:
		# Marquer le tournoi comme terminé s'il ne reste qu'un seul gagnant
		tournament.finished = True
		tournament.save()

@login_required
def morpion_form(request, id):
	user = User.objects.get(id=id)
	initial_data = {'playerOne': user.login42}
	if request.method == 'POST':
		form = MorpionForm(request.POST, initial=initial_data)
		if form.is_valid():
			playerTwo = form.cleaned_data['playerTwo']
# 			game = form.save()
			return redirect('morpion_game', id=user.id, playerTwo=playerTwo)  # Utilisation de player_two avec un underscore minuscule
	else:
		form = MorpionForm(initial=initial_data)
	return render(request, 'Game/morpion_form.html', {'user': user, 'form': form})


@login_required
def morpion_game(request, id, playerTwo):
	user = User.objects.get(id=id)
	
	player_symbols = {
		'user_login42': 'X',
		'playerTwo': 'O'
	}    
	return render(request, 'Game/morpion_game.html', {'user': user, 'playerTwo': playerTwo, 'player_symbols': player_symbols})


@login_required
def save_morpion_game(request):
	if request.method == "POST":
		playerOne = request.POST.get('playerOne')
		playerTwo = request.POST.get('playerTwo')
		scorePlayerOne = request.POST.get('scorePlayerOne')
		scorePlayerTwo = request.POST.get('scorePlayerTwo')
		date = request.POST.get('date')
		
			
		morpion_game = Morpion(playerOne=playerOne, 
		playerTwo=playerTwo, scorePlayerOne=scorePlayerOne, scorePlayerTwo=scorePlayerTwo, date=date)
		morpion_game.save()
		return JsonResponse({'message': 'Scores enregistré avec succès !'})
	else:
		return JsonResponse({'error': 'Méthode non autorisée'}, status=405)


@login_required
def game_over(request, id, result):
	user = User.objects.get(id=id)
	print(f"Result message: {result}") 
	return render(request, 'Game/morpion_end.html',{'user': user, 'result': result}) 



@login_required
def game_history(request, id):
    user = get_object_or_404(User, id=id)
    morpion_games = Morpion.objects.filter(playerOne=user.login42) | Morpion.objects.filter(playerTwo=user.login42)

    games_data = []
    for game in morpion_games:
        if game.scorePlayerOne == game.scorePlayerTwo:
            result = "Égalité"
        elif (game.scorePlayerOne > game.scorePlayerTwo and game.playerOne == user.login42) or (game.scorePlayerTwo > game.scorePlayerOne and game.playerTwo == user.login42):
            result = "Gagné"
        else:
            result = "Perdu"
        
        games_data.append({
            'game_id': game.id,
            'playerOne': game.playerOne,
            'playerTwo': game.playerTwo,
            'result': result,
            'date': game.date,
        })

    context = {
        'user': user,
        'games': games_data
    }

    return render(request, 'Game/morpion_history.html', context)