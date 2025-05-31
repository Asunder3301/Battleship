export {
    createBoards,
    displayShips,
    updateSquare,
    updateTurnMessage,
    updateActionMessage,
    positionToId,
    setNames,
    hideShips,
};

function positionToId(position) {
    let id = -1;
    id += position[0] + 1 + 10 * position[1];
    return id;
}

function setNames(player1Name, player2Name) {
    document.getElementById("playerName").innerText = player1Name;
    document.getElementById("opponentNmae").innerText = player2Name;
}

function createBoards() {
    const playerBoard = document.getElementById("player");
    const opponentBoard = document.getElementById("opponent");

    for (let i = 0; i < 100; i++) {
        const playerSquare = document.createElement("div");
        playerSquare.classList.add("square");
        playerSquare.id = "p" + i;
        playerBoard.appendChild(playerSquare);

        const opponentSquare = document.createElement("div");
        opponentSquare.classList.add("square");
        opponentSquare.id = "o" + i;
        opponentBoard.appendChild(opponentSquare);
    }
}

function displayShips(player) {
    const board = player.board;
    for (let i = 0; i < board.ships.length; i++) {
        for (let u = 0; u < board.ships[i].coordinates.length; u++) {
            let id;
            if (player.p2) {
				id = "o" + positionToId(board.ships[i].coords[u]);
			} else {
				id = "p" + positionToId(board.ships[i].coords[u]);
			}
			const shipSquare = document.getElementById(id);
			shipSquare.classList.add("ship");
        }
    }
}

function hideShips(player) {
	const board = player.board;
	for (let i = 0; i < board.ships.length; i++) {
		for (let u = 0; u < board.ships[i].coords.length; u++) {
			let id;
			if (player.p2) {
				id = "o" + positionToId(board.ships[i].coords[u]);
			} else {
				id = "p" + positionToId(board.ships[i].coords[u]);
			}
			const shipSquare = document.getElementById(id);
			shipSquare.classList.remove("ship");
		}
	}
}

function updateSquare(squareId, status) {
	const square = document.getElementById(squareId);
	if (status === "hit") {
		square.classList.add("hit");
	} else if (status === "miss") {
		square.classList.add("miss");
	} else {
		square.classList.remove("hit");
		square.classList.add("sunk");
	}
}

function updateTurnMessage(messageText) {
	const messageDiv = document.querySelector(".turn");
	messageDiv.innerText = messageText;
}

function updateActionMessage(messageText, message1) {
	let messageDiv;
	if (message1 === 1) {
		messageDiv = document.getElementById("message1");
	} else {
		messageDiv = document.getElementById("message2");
	}
	messageDiv.innerText = messageText;
}