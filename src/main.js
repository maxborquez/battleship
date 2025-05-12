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

turnDisplay.textContent = `Turn: ${player1.name}`;

function renderPlayerBoard() {
  playerBoardElement.innerHTML = "";
  for (let x = 0; x < 10; x++) {
    for (let y = 0; y < 10; y++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");

      if (player1.board.board[x][y] !== null) {
        cell.classList.add("occupied");
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
});

cpuBoardElement.addEventListener("click", (e) => {
  const cell = e.target;
  if (cell.classList.contains("cell")) {
    const x = cell.dataset.x;
    const y = cell.dataset.y;
  }
});

player1.board.placeAllShipsRandomly();
renderPlayerBoard();

