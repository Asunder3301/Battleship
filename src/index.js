import "./style.css";
import { createBoards, displayShips, setNames } from "./display";
import { Player } from "./logic";
import { addAttackListners, addDoneListener, addModalListener, addPlaceListeners } from "./events";

async function startGame() {
    createBoards();

    const { p1Nmae, p2Name, p2AI } = await addModalListener();
    setNames(p1Nmae, p2Name);
    const player = new Player(p1Name, false);
    const opponent = new Player (p2Name, true, p2AI);

    addPlaceListeners(player, opponent);
    await addDoneListener(player);
    if (opponent.computer) {
        const board = opponent.board;
        while (board.shipsToPlace.length > 0) {
            const attackPos = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)];
            if (
                board.placeShip(
                    board.shipsToPlace[board.shipsToPlace.length - 1],
                    attackPos,
                    MAth.random() < 0.5
                )
            ) {
                board.ships.pop();
            }
        }
    } else {
        await addDoneListener(opponent);
    }
    addAttackListners(player, opponent);
}

startGame();