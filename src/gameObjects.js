class Ship {
  constructor(size) {
    this.size = size;
    this.hitted = 0;
    this.coordinates = [];
  }

  hit() {
    this.hitted++;
  }

  isSunk() {
    return this.hitted >= this.size;
  }
}

class Gameboard {
  constructor() {
    this.size = 10;
    this.board = Array(this.size)
      .fill(null)
      .map(() => Array(this.size).fill(null));
    this.ships = [];
    this.missedAttacks = [];
  }

  placeShip(ship, startX, startY, isHorizontal = true) {
    const size = ship.size;

    if (
      (isHorizontal && startY + size >= this.size) ||
      (!isHorizontal && startX + size >= this.size)
    ) {
      throw new Error("The ship is out board");
    }

    for (let i = 0; i < size; i++) {
      const x = startX + (isHorizontal ? 0 : i);
      const y = startY + (isHorizontal ? i : 0);
      if (this.board[x][y] !== null) {
        throw new Error("Ya hay un barco en esa posición.");
      }
    }

    for (let i = 0; i < size; i++) {
      const x = startX + (isHorizontal ? 0 : i);
      const y = startY + (isHorizontal ? i : 0);
      this.board[x][y] = ship;
      ship.coordinates.push([x, y]);
    }

    this.ships.push(ship);
  }

  receiveAttack([x, y]) {
    const target = this.board[x][y];

    if (target === null) {
      this.board[x][y] = "miss";
      this.missedAttacks.push([x, y]);
      return "Miss";
    }

    target.hit();
    this.board[x][y] = "hit";

    if (target.isSunk()) {
      this.board[x][y] = "sunk";
      return "Sunk";
    }

    return "Hit";
  }

  allShipsAreSunk() {
    let sunked = 0;
    this.ships.forEach((ship) => {
      if (ship.isSunk()) {
        sunked++;
      }
    });

    if (sunked === this.ships.length) {
      return true;
    } else {
      return false;
    }
  }

  placeAllShipsRandomly() {
    const shipTypes = [
      { name: "Battleship", size: 4, count: 1 },
      { name: "Cruiser", size: 3, count: 2 },
      { name: "Submarine", size: 2, count: 3 },
      { name: "Destroyer", size: 1, count: 4 },
    ];

    for (const type of shipTypes) {
      for (let i = 0; i < type.count; i++) {
        let placed = false;

        while (!placed) {
          const isHorizontal = Math.random() < 0.5;
          const startX = Math.floor(Math.random() * this.size);
          const startY = Math.floor(Math.random() * this.size);

          const ship = new Ship(type.size);

          try {
            this.placeShip(ship, startX, startY, isHorizontal);
            placed = true;
          } catch (e) {}
        }
      }
    }
  }
}

class Player {
  constructor(name, type) {
    this.name = name;
    this.type = type;
    this.board = new Gameboard();
  }
}

export { Ship, Gameboard, Player };
