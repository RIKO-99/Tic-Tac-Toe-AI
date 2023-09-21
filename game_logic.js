//initializing the Original Board
var origBoard;

//human
const huPlayer = 'O';

//AI
const aiPlayer = 'X';

//winning combinations in array using board indexes
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

//Select each element of the class cell
const cells = document.querySelectorAll('.cell');
startGame();

//start game function
function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

// Turn click function listen to click from human player and ai
function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}

//Turn function takes squareid and player paramaters
function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

//checkwin function takes in two arguments board and player
function checkWin(board, player) {
	//check index that the player have played
	//add it to an acumulater array
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

//Game over function that takes in gamewon param
function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}
	//go to every cell and prevent it from being clicked again
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "AI win!.");
}

// Declarewinner function takes who won param
//either AI or hu player 
function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

//check for available spots
function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

// bestspot function retuns the minimux algo on the board with the aiplayer
function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

//checkTie function checks if all available spots have been filled
function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

//the main minimax function
function minimax(newBoard, player) {
	var availSpots = emptySquares();

	//check for terminal state such as win,lose and tie
	//and return a value accordingly
	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}

	//array to collect all objects
	var moves = [];

	//loop through the available spots
	for (var i = 0; i < availSpots.length; i++) {
		//create an object for each and store the index of the store
		var move = {};
		move.index = newBoard[availSpots[i]];

		//set the empty spot to the current player
		newBoard[availSpots[i]] = player;

		/*collect the score resulted from calling minimax 
		on the opponent of the current player */
		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		//reset the spot to empty
		newBoard[availSpots[i]] = move.index;

		//push the object to the array
		moves.push(move);
	}

	//if is AI turn loop over the moves and choose the move
	// with the highest score
	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {

		//else loop over the moves and choose the move with lowest score
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	//return the chosen move (object) from the moves array
	return moves[bestMove];
}
