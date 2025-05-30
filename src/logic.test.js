import { Ship } from "./logic";

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

