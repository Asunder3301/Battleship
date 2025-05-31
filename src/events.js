export { addAttackListeners, addModalListener, addPlaceListeners, addDoneListener };
import {
	updateSquare,
	updateTurnMessage,
	updateActionMessage,
	positionToId,
	displayShips,
	hideShips,
} from "./display";

let p1Turn = true;
let verticalOrientation = true;
let playerAttackCallback;
let opponentAttackCallback;
let playerPlaceCallback;
let opponentPlaceCallback;

function idToPosition(id) {
	id = parseInt(id);
	const attackPos = [id % 10, Math.floor(id / 10)];
	return attackPos;
}

function addModalListener() {
	return new Promise((resolve) => {
		const startModal = document.querySelector(".start-modal");
		startModal.showModal();
		const submitBtn = startModal.querySelector('button[type="submit"]');
		submitBtn.addEventListener("click", (e) => {
			e.preventDefault();
			const p1NameInput = startModal.querySelector('input[name="p1Name"]');
			const p2NameInput = startModal.querySelector('input[name="p2Name"]');
			const p2AICheckbox = startModal.querySelector('input[name="p2AI"]');
			startModal.close();

			resolve({
				p1Name: p1NameInput.value || "Player 1",
				p2Name: p2NameInput.value || "Player 2",
				p2AI: p2AICheckbox.checked,
			});
		});
	});
}

function addDoneListener(player) {
	return new Promise((resolve) => {
		updateTurnMessage(player.name + " place your ships!");
		const placeBtn = document.querySelector(".place");
		placeBtn.addEventListener("click", (e) => {
			e.preventDefault();
			if (player.board.shipsToPlace.length < 1) {
				hideShips(player);
				p1Turn = !p1Turn;
				resolve();
			}
		});
	});
}

function handlePlaceClick(player) {
	return function (e) {
		if ((player.p2 && !p1Turn) || (!player.p2 && p1Turn)) {
			const board = player.board;
			const attackPos = idToPosition(e.target.id.substring(1));
			if (board.shipsToPlace.length > 0) {
				if (
					board.placeShip(
						board.shipsToPlace[board.shipsToPlace.length - 1],
						attackPos,
						verticalOrientation
					)
				) {
					board.shipsToPlace.pop();
					displayShips(player);
				}
			}
		}
	};
}

function addPlaceListeners(player, opponent) {
	const playerBoard = document.getElementById("player");
	const opponentBoard = document.getElementById("opponent");
	playerPlaceCallback = handlePlaceClick(player);
	opponentPlaceCallback = handlePlaceClick(opponent);
	addOrientationListener();
	for (let i = 0; i < playerBoard.childNodes.length; i++) {
		playerBoard.childNodes[i].addEventListener("click", playerPlaceCallback);
		if (!opponent.computer) {
			opponentBoard.childNodes[i].addEventListener("click", opponentPlaceCallback);
		}
	}
}

function addOrientationListener() {
	const orientationDiv = document.querySelector(".orientation");
	orientationDiv.addEventListener("click", (e) => {
		verticalOrientation = !verticalOrientation;
	});
}

function handleAttackClick(attacker, receiver) {
	return function (e) {
		if (attacker.p2) {
			if (p1Turn) {
				updateActionMessage("Can't attack yourself!", 1);
			} else {
				p1Turn = true;
				updateTurnMessage(receiver.name + "'s turn");
				processAttack(e.target, attacker, receiver);
			}
		} else {
			if (!p1Turn) {
				updateActionMessage("Can't attack yourself!", 2);
			} else {
				p1Turn = false;
				updateTurnMessage(receiver.name + "'s turn");
				processAttack(e.target, attacker, receiver);
			}
		}
	};
}

function addAttackListeners(player, opponent) {
	document.querySelector(".place").style.visibility = "hidden";
	document.querySelector(".orientation").style.visibility = "hidden";
	p1Turn = true;
	updateTurnMessage(player.name + "'s turn");
	const playerBoard = document.getElementById("player");
	const opponentBoard = document.getElementById("opponent");
	playerAttackCallback = handleAttackClick(opponent, player);
	opponentAttackCallback = handleAttackClick(player, opponent);
	for (let i = 0; i < playerBoard.childNodes.length; i++) {
		opponentBoard.childNodes[i].addEventListener("click", opponentAttackCallback);
		if (!opponent.computer) {
			playerBoard.childNodes[i].addEventListener("click", playerAttackCallback);
		}
	}
}

function computerAttack(attacker, receiver) {
	let attackIndex = "p" + Math.floor(Math.random() * 100);
	let square = document.getElementById(attackIndex);
	while (true) {
		attackIndex = "p" + Math.floor(Math.random() * 100);
		square = document.getElementById(attackIndex);
		if (processAttack(square, attacker, receiver)) {
			break;
		}
	}
	p1Turn = true;
	updateTurnMessage(receiver.name + "'s turn");
}

function processAttack(square, attacker, receiver) {
	let messageLocation;
	if (receiver.p2) {
		messageLocation = 2;
	} else {
		messageLocation = 1;
	}
	const attackPos = idToPosition(square.id.substring(1));
	const attackRes = attacker.sendAttack(receiver, attackPos);
	if (attackRes.valid) {
		if (attackRes.hit) {
			updateSquare(square.id, "hit");
			updateActionMessage("Hit!", messageLocation);
		} else {
			updateSquare(square.id, "miss");
			updateActionMessage("Miss!", messageLocation);
		}
		if (attackRes.sunk) {
			updateActionMessage("Sunk!", messageLocation);
			receiver.board.ships.forEach((ship) => {
				if (ship.isSunk()) {
					ship.coords.forEach((coord) => {
						let id = square.id.charAt(0);
						id += positionToId(coord);
						updateSquare(id, "sunk");
					});
					console.log(ship.coords);
				}
			});
		}
		if (attackRes.won) {
			removeSquareListeners();
			updateTurnMessage(attacker.name + " WON!");
		} else if (receiver.computer) {
			computerAttack(receiver, attacker);
		}
	} else {
		p1Turn = !p1Turn;
		updateActionMessage("Already attacked there!", messageLocation);
		updateTurnMessage(attacker.name + "'s turn");
	}
	return attackRes.valid;
}

function removeSquareListeners() {
	const playerBoard = document.getElementById("player");
	const opponentBoard = document.getElementById("opponent");
	for (let i = 0; i < playerBoard.childNodes.length; i++) {
		playerBoard.childNodes[i].removeEventListener("click", playerAttackCallback);
		opponentBoard.childNodes[i].removeEventListener("click", opponentAttackCallback);
	}
}