import { experiments } from "webpack";
import { Ship, Gameboard } from "./logic";

// test if ship sinks
test("sink ship", () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(true);
});

// test if ship is not sunk
test("ship is not sunk", () => {
    const ship = new Ship(3);
    ship.hit();
    ship.hit();
    expect(ship.isSunk()).toBe(false);
})

// test valid vertical ship 
test("place valid vertical ship", () => {
    const board = new Gameboard();
    expect(board.placeShip(3, [5, 5], true)).toBe(true);
});

// test invalid vertical ship
test("place invalid vertical ship", () => {
    const board = new Gameboard();
    expect(board.placeShip(3, [5, 0], true)).toBe(false);
});

// test valid horizontal ship
test("place valid horizontal ship", () => {
    const board = new Gameboard();
    expect(board.placeShip(3, [5, 5], false)).toBe(true);
});

// test invalid horizontal ship
test("place invalid horizontal ship", () => {
    const board = new Gameboard;
    expect(board.placeShip(3, [9, 5], false)).toBe(false)
});

// test hit
test("hit ship", () => {
    const board = new Gameboard();
    board.placeShip(3, [0, 2], true);
    expect(board.receiveAttack([0, 2])).toBe(true);
});

// test miss
test("ship not hit", () => {
    const board = new Gameboard();
    board.placeShip(3, [0, 2], true);
    expect(board.receiveAttack([0, 3])).toBe(false);
})