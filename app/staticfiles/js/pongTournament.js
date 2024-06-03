// Sélectionner le canvas et le contexte 2D
const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

// Définir les variables du jeu
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX;
let ballSpeedY;
const paddleHeight = 66;
const paddleWidth = 6;
let paddle1Y = (canvas.height - paddleHeight) / 2;
let paddle2Y = (canvas.height - paddleHeight) / 2;
let player1UpPressed = false;
let player1DownPressed = false;
let player2UpPressed = false;
let player2DownPressed = false;
let scorePlayerOne;
let scorePlayerTwo;
let gameStarted;
let gamePaused;
let leftPlayer;
let rightPlayer;
let type_of_game;
const currentMatchElement = document.getElementById('current-match');
const continueTournamentButton = document.getElementById("continueTournamentButton");
const matchOverMessage = document.getElementById("matchOverMessage");
const nextMatch = document.getElementById("nextMatch");
const endOfRound = document.getElementById("endOfRound");
let	matchPlayed = false;
let roundNumber = 1;

// Fonction pour afficher le texte clignotant
function drawStartText() {
	// Fonction pour démarrer le jeu
	document.addEventListener("keydown", function(event) {
		if (matchPlayed == true)
			return ;
		else if (event.key === " " && !gameStarted) {
			// matchPlayed = true;
			gameStarted = true;
			gameLoop();
		}
	});

	// Effacer le texte précédent en le rendant transparent
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	// Afficher le texte uniquement si le jeu n'est pas en pause
	if (!gamePaused) {
		// Style du texte
		ctx.fillStyle = "#FFFFFF";
		ctx.font = "20px Arial";
		ctx.textAlign = "center";

		// Afficher le texte au milieu du canvas
		ctx.fillText("Appuyer sur espace pour jouer", canvas.width / 2, canvas.height / 2);
	}

	setTimeout(function() {
		// Effacer le texte après un court délai
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Appeler récursivement la fonction pour réafficher le texte
		setTimeout(drawStartText, 500); // Réafficher le texte toutes les 500 millisecondes
	}, 500); // Effacer le texte après 500 millisecondes
}

function	setUpDataForGame() {
	gameStarted = false;
	gamePaused = false;
	leftPlayer = document.querySelector(".FightFont:nth-child(1)");
	rightPlayer = document.querySelector(".FightFont:nth-child(3)");
	scorePlayerOne = 0;
	scorePlayerTwo = 0;
	ballSpeedX = 5;
	ballSpeedY = 5;
}

// Fonction pour Afficher le jeu la partie
function displayGame() {
	setUpDataForGame();
	canvas.style.display = "block";
	drawStartText();
}

// Fonction pour afficher les scores des joueurs
function drawScores() {
	// Style du texte
	ctx.fillStyle = "#FFFFFF";
	ctx.font = "20px Arial";
	// Score du joueur de gauche
	ctx.fillText("Score: " + scorePlayerOne, 42, canvas.height - 20);
	// Score du joueur de droite
	ctx.fillText("Score: " + scorePlayerTwo, canvas.width - 42, canvas.height - 20);
}

// Fonction de dessin de la balle
function drawBall() {
	ctx.fillStyle = "#FFFFFF";
	// Dessiner un carré à la position de la balle
	ctx.fillRect(ballX - 5, ballY - 5, 7, 7); // La taille du carré est de 10x10 pixels
}

// Fonction de dessin des raquettes
function drawPaddles() {
	// Raquette gauche
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight);
	// Raquette droite
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);
}

// Fonction pour dessiner une ligne pointillée
function drawDottedLine() {
	ctx.beginPath();
	ctx.setLineDash([5, 15]); // Définir le motif des segments (5 pixels de couleur, 15 pixels d'espace)
	let startY = Math.max(15, canvas.height / 2 - 200); // Limiter la ligne au bord supérieur du terrain
	let endY = Math.min(canvas.height - 15, canvas.height / 2 + 200); // Limiter la ligne au bord inférieur du terrain
	ctx.moveTo(canvas.width / 2, startY); // Déplacer le point de départ au centre de la largeur du canvas
	ctx.lineTo(canvas.width / 2, endY); // Dessiner une ligne verticale jusqu'au bas du canvas
	ctx.strokeStyle = "#FFFFFF"; // Couleur de la ligne
	ctx.stroke(); // Dessiner la ligne
	ctx.closePath();
}

// Fonction principale de dessin
function draw() {
	// Effacer le canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// Dessiner les bordures
	ctx.fillStyle = "#FFFFFF";
	ctx.fillRect(0, 5, canvas.width, 5); // Barre supérieure
	ctx.fillRect(0, canvas.height - 11, canvas.width, 5); // Barre inférieure
	// Dessiner la ligne pointillée au centre
	drawDottedLine();
	// Dessiner la balle
	drawBall();
	// Dessiner les raquettes
	drawPaddles();
	// Dessiner les scores des joueurs
	drawScores();
}

// Fonction pour réinitialiser la position de la balle
function resetBall() {
	ballX = canvas.width / 2;
	ballY = canvas.height / 2;
	ballSpeedX = -ballSpeedX; // Inverser la direction de la balle
	ballSpeedY = -ballSpeedY;
}

// Fonction de collision de la balle avec les côtés du terrain
function ballCollision() {
	// Vérifier si la balle touche le bord gauche
	if (ballX - 10 < 0) {
		// Score pour le joueur de droite
		scorePlayerTwo++;
		// Réinitialiser la position de la balle
		resetBall();
	}
	// Vérifier si la balle touche le bord droit
	if (ballX + 10 > canvas.width) {
		// Score pour le joueur de gauche
		scorePlayerOne++;
		// Réinitialiser la position de la balle
		resetBall();
	}
}

//Colision de la balle sur les paddles des joueurs
function paddleCollision() {
	// Vérifiez si la balle touche le paddle gauche
	if (ballX - 10 <= paddleWidth && ballY >= paddle1Y && ballY <= paddle1Y + paddleHeight) {
		ballSpeedX = -ballSpeedX; // Inverser la direction de la balle
	}
	// Vérifiez si la balle touche le paddle droit
	if (ballX + 10 >= canvas.width - paddleWidth && ballY >= paddle2Y && ballY <= paddle2Y + paddleHeight) {
		ballSpeedX = -ballSpeedX; // Inverser la direction de la balle
	}
}

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(event) {
	// Joueur de gauche
	if (event.key === "e") {
		player1UpPressed = true;
	} else if (event.key === "d") {
		player1DownPressed = true;
	}
	// Joueur de droite
	if (event.key === "o") {
		player2UpPressed = true;
	} else if (event.key === "l") {
		player2DownPressed = true;
	}
}

function keyUpHandler(event) {
	// Joueur de gauche
	if (event.key === "e") {
		player1UpPressed = false;
	} else if (event.key === "d") {
		player1DownPressed = false;
	}
	// Joueur de droite
	if (event.key === "o") {
		player2UpPressed = false;
	} else if (event.key === "l") {
		player2DownPressed = false;
	}
}

function updatePaddles() {
	// Joueur de gauche
	if (player1UpPressed && paddle1Y > 15) {
		paddle1Y -= 7;
	} else if (player1DownPressed && paddle1Y + paddleHeight < canvas.height - 15) {
		paddle1Y += 7;
	}
	
	// Joueur de droite
	if (player2UpPressed && paddle2Y > 15) {
		paddle2Y -= 7;
	} else if (player2DownPressed && paddle2Y + paddleHeight < canvas.height - 15) {
		paddle2Y += 7;
	}
}

// Fonction pour mettre le jeu en pause
document.addEventListener("keydown", function(event) {
	if (matchPlayed == true)
		return ;
	// Mettre en pause et reprendre le jeu avec la touche "p"
	if (event.key === "p") {
		gamePaused = !gamePaused;
	}
});

function whoWinTheMatch() {
	if (scorePlayerOne > scorePlayerTwo)
		winner = document.querySelector('.FightFont:nth-child(1)').textContent;
	else
		winner = document.querySelector('.FightFont:nth-child(3)').textContent;
	return winner;
}

function endTournament(currentMatchElement, winner) {
	const winnerTournament = document.getElementById('tournamentWinner');
	const pauseGameInfos = document.getElementById("pauseGameInfos");
	const commandGameInfos = document.getElementById("commandGameInfos");

	pauseGameInfos.style.display = "none";
	commandGameInfos.style.display = "none";
	gameStarted = false;
	canvas.style.display = "none";
	winnerTournament.textContent = "Tournois terminé, vainqueur : " + winner;
	winnerTournament.style.display = "block";
	currentMatchElement.innerHTML = '';
	return ;
}

function	endMatch(winner, currentRoundNumber) {
	const pauseGameInfos = document.getElementById("pauseGameInfos");
	const commandGameInfos = document.getElementById("commandGameInfos");

	pauseGameInfos.style.display = "none";
	commandGameInfos.style.display = "none";
	if (roundNumber != currentRoundNumber)
	{
		gameStarted = false;
		roundNumber = currentRoundNumber;
		canvas.style.display = "none";
		nextMatch.style.display = "none";
		matchOverMessage.textContent = "Match terminée, vainqueur : " + winner;
		endOfRound.style.display = "block";
	}
	else
	{
		gameStarted = false;
		canvas.style.display = "none";
		matchOverMessage.textContent = "Match terminée, vainqueur : " + winner;
		matchOverMessage.style.display = "block";
		nextMatch.style.display = "block";
		continueTournamentButton.style.display = "block";
	}
	matchPlayed = true;
}

document.addEventListener('DOMContentLoaded', (event) => {
	if (continueTournamentButton) {
		continueTournamentButton.addEventListener('click', function() {
			continueTournamentButton.style.display = "none";
			matchOverMessage.style.display = "none";
			nextMatch.style.display = "none";
			window.location.reload();
		});
	}
});

// Fonction pour terminer le match ou tournois
function endGame() {
	const matchId = currentMatchElement.dataset.matchId;
	const winner = whoWinTheMatch(); // Fonction pour déterminer le gagnant du match

	// Envoyer une requête POST pour enregistrer le gagnant du match
	fetch(`/end_match/${matchId}/`, {
		method: 'POST',
		headers: {
			'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value
		},
		body: JSON.stringify({ winner: winner }) // Envoyer le gagnant du match dans le corps de la requête
	})
	.then(response => response.json())
	.then(data => {
		if (data.winner) {
			document.querySelector(`#match-${matchId} .winner`).textContent = winner;
		}
		if (data.next_match_id) {
			// Mettre à jour l'affichage du prochain match avec les nouveaux joueurs
			document.querySelector('.FightFont:nth-child(1)').textContent = data.next_player1;
			document.querySelector('.FightFont:nth-child(3)').textContent = data.next_player2;
			currentMatchElement.dataset.matchId = data.next_match_id;
			endMatch(winner, data.current_round);
		}
		else
		{
			// Si aucun prochain match n'est disponible, terminer le tournoi
			if (data.tournament_finished) {
				endTournament(currentMatchElement, winner);
			}
		}
	});
}

// Boucle de jeu
function gameLoop() {
	if (!gamePaused && gameStarted) {
		// Mettre à jour la position de la balle
		ballX += ballSpeedX;
		ballY += ballSpeedY;
		// Vérifier les collisions avec les bords du canvas
		if (ballY - 10 < 10 || ballY + 10 > canvas.height - 15) {
			ballSpeedY = -ballSpeedY; // Inverser la direction de la balle
		}
		// Vérifier les collisions avec les bords du terrain
		ballCollision();
		// Vérifier les collisions avec les paddles
		paddleCollision();
		// Déplacer les paddles
		updatePaddles();
		// Boucler la fonction
		draw();
		
		// Vérifier si l'un des joueurs a gagné la partie
		if (scorePlayerOne === 1 || scorePlayerTwo === 1)
			endGame();
	}
	draw();
	requestAnimationFrame(gameLoop);
}