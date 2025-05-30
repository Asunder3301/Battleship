export { Ship };

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