let currentPlayer;
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];
let isComputerTurn = false;
let humanPlayer;
let computerPlayer;

function chooseRandomStartPlayer() {
    if (Math.random() < 0.5) {
        humanPlayer = "X";
        computerPlayer = "O";
        currentPlayer = "X";
        isComputerTurn = false;
    } else {
        humanPlayer = "O";
        computerPlayer = "X";
        currentPlayer = "X";
        isComputerTurn = true;
    }
}

function findBestMove() {
    // Eerst kijken of computer kan winnen
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === "") {
            gameState[i] = computerPlayer;
            if (checkWinCondition()) {
                gameState[i] = "";
                return i;
            }
            gameState[i] = "";
        }
    }

    // Dan kijken of we de speler moeten blokkeren
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === "") {
            gameState[i] = humanPlayer;
            if (checkWinCondition()) {
                gameState[i] = "";
                return i;
            }
            gameState[i] = "";
        }
    }

    // Probeer het centrum te pakken
    if (gameState[4] === "") return 4;

    // Probeer een hoek
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(i => gameState[i] === "");
    if (availableCorners.length > 0) {
        return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Neem een willekeurige beschikbare positie
    const availableMoves = gameState.map((cell, index) => cell === "" ? index : null).filter(cell => cell !== null);
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
}

function makeComputerMove() {
    if (!gameActive || !isComputerTurn) return;
    
    setTimeout(() => {
        const bestMove = findBestMove();
        const cell = document.querySelector(`[data-index="${bestMove}"]`);
        gameState[bestMove] = computerPlayer;
        cell.textContent = computerPlayer;
        moveSound.play();
        isComputerTurn = false;
        checkWin();
    }, 500);
}

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

const statusText = document.getElementById('statusText');
const restartBtn = document.getElementById('restartBtn');
const cells = document.querySelectorAll('.cell');
const moveSound = document.getElementById('moveSound');

statusText.textContent = `Speler ${currentPlayer} is aan de beurt`;

function handleCellClick(clickedCellEvent) {
    const clickedCell = clickedCellEvent.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (gameState[clickedCellIndex] !== "" || !gameActive || isComputerTurn) {
        return;
    }

    gameState[clickedCellIndex] = humanPlayer;
    clickedCell.textContent = humanPlayer;
    moveSound.play();
    isComputerTurn = true;

    checkWin();
    if (gameActive) {
        makeComputerMove();
    }
}

function checkWinCondition() {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            return true;
        }
    }
    return false;
}

function checkWin() {
    if (checkWinCondition()) {
        const winner = isComputerTurn ? humanPlayer : computerPlayer;
        statusText.textContent = `${winner === humanPlayer ? 'Jij hebt' : 'De computer heeft'} gewonnen!`;
        gameActive = false;
        return;
    }

    if (!gameState.includes("")) {
        statusText.textContent = `Gelijkspel!`;
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusText.textContent = isComputerTurn ? 
        "De computer denkt na..." : 
        "Jij bent aan de beurt";
}

function restartGame() {
    gameActive = true;
    gameState = ["", "", "", "", "", "", "", "", ""];
    cells.forEach(cell => cell.textContent = "");
    chooseRandomStartPlayer();
    statusText.textContent = isComputerTurn ? 
        "De computer begint..." : 
        "Jij mag beginnen!";
    
    if (isComputerTurn) {
        makeComputerMove();
    }
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
restartBtn.addEventListener('click', restartGame);
chooseRandomStartPlayer();
statusText.textContent = isComputerTurn ? 
    "De computer begint..." : 
    "Jij mag beginnen!";

if (isComputerTurn) {
    makeComputerMove();
}
