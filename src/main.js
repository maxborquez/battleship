import "./styles.css";
import { Player } from "./gameObjects.js";

const player1 = new Player("Player 1", "human");
const cpu = new Player("Computer", "computer");

const turnDisplay = document.getElementById("turnDisplay");
const playerBoardElement = document.getElementById("playerBoard");
const cpuWrapper = document.getElementById("cpuWrapper");
const cpuBoardElement = document.getElementById("cpuBoard");
const randomizeBtn = document.getElementById("randomize");
const startBtn = document.getElementById("startBtn");

let turn = "player";
let gameOver = false;

turnDisplay.textContent = `Turn: ${player1.name}`;

function renderPlayerBoard() {
  playerBoardElement.innerHTML = "";
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      const value = player1.board.board[x][y];

      if (value === "hit") {
        cell.classList.add("hit");
      } else if (value === "miss") {
        cell.classList.add("miss");
      } else if (value === "sunk") {
        cell.classList.add("sunk");
      } else if (value !== null) {
        cell.style.backgroundColor = "palegreen";
      }

      playerBoardElement.appendChild(cell);
    }
  }
}

function renderCpuBoard() {
  cpuWrapper.style.display = "grid";
  cpuBoardElement.innerHTML = "";

  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.x = x;
      cell.dataset.y = y;

      const value = cpu.board.board[x][y];

      if (value === "hit") {
        cell.classList.add("hit");
      } else if (value === "miss") {
        cell.classList.add("miss");
      } else if (value === "sunk") {
        cell.classList.add("sunk");
      }

      cpuBoardElement.appendChild(cell);
    }
  }
}

function resetPlayerBoard() {
  player1.board.ships = [];
  player1.board.board = Array(player1.board.size)
    .fill(null)
    .map(() => Array(player1.board.size).fill(null));
}

randomizeBtn.addEventListener("click", () => {
  resetPlayerBoard();
  player1.board.placeAllShipsRandomly();
  renderPlayerBoard();
});

startBtn.addEventListener("click", () => {
  randomizeBtn.style.display = "none";
  startBtn.style.display = "none";
  cpu.board.placeAllShipsRandomly();
  renderCpuBoard();
  enableCpuBoard();
  turnDisplay.textContent = `Turn: ${player1.name}`;
});

cpuBoardElement.addEventListener("click", (e) => {
  if (turn !== "player" || gameOver) return;

  const cell = e.target;
  if (cell.classList.contains("cell")) {
    const x = parseInt(cell.dataset.x);
    const y = parseInt(cell.dataset.y);

    if (cpu.board.board[x][y] === "miss" || cpu.board.board[x][y] === "hit")
      return;

    cpu.board.receiveAttack([x, y]);
    renderCpuBoard();

    if (cpu.board.allShipsAreSunk()) {
      turnDisplay.textContent = `${player1.name} wins!`;
      gameOver = true;
      disableCpuBoard();
      return;
    }

    turn = "cpu";
    disableCpuBoard();
    turnDisplay.textContent = "Turn: CPU";

    setTimeout(() => {
      cpuTurn();
    }, 1000);
  }
});

function cpuTurn() {
  let x, y;
  do {
    x = Math.floor(Math.random() * 10);
    y = Math.floor(Math.random() * 10);
  } while (
    player1.board.board[x][y] === "miss" ||
    player1.board.board[x][y] === "hit"
  );

  player1.board.receiveAttack([x, y]);
  renderPlayerBoard();

  if (player1.board.allShipsAreSunk()) {
    turnDisplay.textContent = `CPU wins!`;
    gameOver = true;
    return;
  }

  turn = "player";
  enableCpuBoard();
  turnDisplay.textContent = `Turn: ${player1.name}`;
}

function disableCpuBoard() {
  const cells = cpuBoardElement.querySelectorAll(".cell");
  cells.forEach((cell) => cell.classList.add("disabled"));
}

function enableCpuBoard() {
  const cells = cpuBoardElement.querySelectorAll(".cell");
  cells.forEach((cell) => cell.classList.remove("disabled"));
}

player1.board.placeAllShipsRandomly();
renderPlayerBoard();
