export { Ship, Gameboard, Player };

class Ship {
    hits = 0;
    size;
    coordinates;
    constructor(size, coordinates) {
        this.size = size;
        this.coordinates = coordinates;
    }

    hit() {
        this.hits += 1;
    }

    isSunk() {
        if (this.hits >= this.size) {
            return true;
        } else {
            return false;
        }
    }
}

class Gameboard {
    ships = [];
    shipsToPlace = [5, 4, 3, 3, 2];
    misses = [];
    hits = [];

    constructor() {};

    placeShip(shipSize, position, isVertical = true) {
        if (
            (isVertical && position[1] - shipSize < -1) ||
            (!isVertical && position[0] + shipSize > 10)
        ) {
            return false;
        } else {
            const shipCoordinates = this.calculateShipCoords(shipSize, position, isVertical);

            for (const coord of shipCoordinates) {
                for (const ship of this.ships) {
                    for (const existingCoord of ship.coordinates) {
                        if (coord[0] === existingCoord[0] && coord[1] === existingCoord[1]) {
                            return false;
                        }
                    }
                }
            }
            this.ships.push(new Ship(shipSize, shipCoordinates));
            return true;
        }
    }

    calculateShipCoords(shipSize, position, isVertical) {
        const shipCoordinates = [];
        let currentPosition = position;
        if (isVertical) {
            for (let i = 0; i < shipSize; i++) {
                shipCoordinates.push([currentPosition[0], currentPosition[1]]);
                currentPosition[1] -= 1;
            }
        } else {
            for (let i = 0; i < shipSize; i++) {
                shipCoordinates.push([currentPosition[0], currentPosition[1]]);
                currentPosition[0] += 1;
            }
        }
        return shipCoordinates;
    }

    receiveAttack(attackPosition) {
        const returnObject = {
            valid: true,
            hit: false,
            sunk: false,
            won: false,
        }

        this.hits.forEach((hits) => {
            if (attackPosition[0] === hits[0] && attackPosition[1] === hits[1]) {
                returnObject.valid = false;
            }
        });

        if (returnObject.valid === true) {
            this.misses.forEach((misses) => {
                if (
                    attackPosition[0] === misses[0] &&
                    attackPosition[1] === misses[1]
                ) {
                    returnObject.valid = false;
                }
            });

            if (returnObject.valid === false) {
                return returnObject;
            }

            for (let i = 0; i < this.ships.length; i++) {
                for (let u = 0; u < this.ships[i].coordinates.length; u++) {
                    if (
                        this.ships[i].coordinates[u][0] === attackPosition[0] &&
                        this.ships[i].coordinates[u][1] === attackPosition[1]
                    ) {
                        this.ships[i].hit();
                        this.hits.push(attackPosition);
                        returnObject.hit = true;
                        if (this.ships[i].isSunk()) {
                            returnObject.sunk = true;
                            returnObject.won = true;
                            this.ships.forEach((ship) => {
                                if (!ship.isSunk) {
                                    returnObject.won = false;
                                    return;
                                }
                            });
                        }
                    }
                }
            }
        }
        this.misses.push(attackPosition);
        return returnObject;
    }
}

class Player {
    constructor(name = "Player", p2, computer = false) {
        this.name = name;
        this.p2 = p2;
        this.computer = computer;
    }

    sendAttack(opponent, attackPosition) {
        return opponent.board.receiveAttack(attackPosition);
    }

    board = new Gameboard();
}