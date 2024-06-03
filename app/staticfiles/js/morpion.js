document.addEventListener('DOMContentLoaded', () => {
    const tiles = Array.from(document.querySelectorAll('.tile'));
    const playerDisplay = document.querySelector('.display-player');
    const resetButton = document.querySelector('#reset');
    const announcer = document.querySelector('.announcer');
    
    const scriptTag = document.querySelector('script[src*="morpion.js"]');
    
    const userLogin42 = scriptTag.dataset.userLogin42;
    const playerSymbolUserLogin42 = scriptTag.dataset.playerSymbolUserLogin42;
    const playerTwo = scriptTag.dataset.playerTwo;
    const player_id = scriptTag.dataset.player_id;
    console.log("User Login42:", userLogin42);
    console.log("Player Symbol User Login42:", playerSymbolUserLogin42);
    console.log("Player Two:", playerTwo);
    
    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = getRandomPlayer(); // Sélection aléatoire du joueur
    let isGameActive = true;
    let scorePlayerOne = 0;
    let scorePlayerTwo = 0;

    const PLAYERX_WON = 'PLAYERX_WON';
    const PLAYERO_WON = 'PLAYERO_WON';
    const TIE = 'TIE';

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
        [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ];

    function getRandomPlayer() {
        return Math.random() < 0.5 ? "X" : "O";
    }

    function handleResultValidation() {
        for (const condition of winningConditions) {
            const [a, b, c] = condition.map(i => board[i]);
            if (a !== '' && a === b && b === c) {
                if (a === 'X') {
                    scorePlayerOne++;
                    announce(PLAYERX_WON);
                } else {
                    scorePlayerTwo++;
                    announce(PLAYERO_WON);
                }
                isGameActive = false;
                endGame();
                return;
            }
        }
        if (!board.includes('')) {
            announce(TIE);
            endGame();
        }
    }

    function endGame() {
        const playerOne = userLogin42;
        const date = new Date().toISOString().split('T')[0];
    
        const gameOverMessage = document.getElementById("gameOverMessage");
        gameOverMessage.style.display = "block";
        
        const data = {
            playerOne: playerOne,
            playerTwo: playerTwo,
            scorePlayerOne: scorePlayerOne,
            scorePlayerTwo: scorePlayerTwo,
            date: date,
        };
    
        console.log("Data to be sent:", data);
        
        // Déterminer le résultat du jeu
        let resultMessage = '';
        if (scorePlayerOne > scorePlayerTwo) {
            resultMessage = `${userLogin42} a gagné`;
        } else if (scorePlayerOne < scorePlayerTwo) {
            resultMessage = `${playerTwo} a gagné`;
        } else {
            resultMessage = 'Égalité';
        }
    
        console.log(resultMessage);
        $.ajax({
            type: "POST",
            url: "/save_morpion_game/",
            data: data,

            success: function(response) {
            
                window.location.href = `/game_over/${player_id}/${resultMessage}`;
                console.log(resultMessage);
                console.log("Scores envoyés avec succès !");
            },
            error: function(xhr, status, error){
                console.error("Erreur lors de l'envoi des scores :", error);
            },
            headers: {
                'X-CSRFToken': $('input[name="csrfmiddlewaretoken"]').val()
            }
        });
    }
    

    const announce = (type) => {
        switch (type) {
            case PLAYERO_WON:
                announcer.innerHTML = 'Player <span class="playerO">O</span> Won';
                break;
            case PLAYERX_WON:
                announcer.innerHTML = 'Player <span class="playerX">X</span> Won';
                break;
            case TIE:
                announcer.innerText = 'Tie';
        }
        announcer.classList.remove('hide');
    };

    const isValidAction = (tile) => {
        return tile.innerText !== 'X' && tile.innerText !== 'O';
    };

    const updateBoard = (index) => {
        board[index] = currentPlayer;
    }

    const changePlayer = () => {
        playerDisplay.classList.remove(`player${currentPlayer}`);
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        playerDisplay.innerText = currentPlayer;
        playerDisplay.classList.add(`player${currentPlayer}`);
    }

    changePlayer();

    const userAction = (tile, index) => {
        if (isValidAction(tile) && isGameActive) {
            tile.innerText = currentPlayer;
            tile.classList.add(`player${currentPlayer}`);
            updateBoard(index);
            handleResultValidation();
            changePlayer();
        }
    }

    const resetBoard = () => {
        board = ['', '', '', '', '', '', '', '', ''];
        isGameActive = true;
        announcer.classList.add('hide');
        if (currentPlayer === 'O') {
            changePlayer();
        }
        tiles.forEach(tile => {
            tile.innerText = '';
            tile.classList.remove('playerX', 'playerO');
        });
    }

    tiles.forEach((tile, index) => {
        tile.addEventListener('click', () => userAction(tile, index));
    });

    resetButton.addEventListener('click', resetBoard);
});
