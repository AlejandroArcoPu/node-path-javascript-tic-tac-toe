function Gameboard() {
  const board = [];

  const size = 3;

  const getBoard = () => board;

  const getCellValueBoard = () =>
    board.map((row) => row.map((cell) => cell.getValue()));

  // Initial board
  for (let i = 0; i < size; i++) {
    board[i] = [];
    for (let j = 0; j < size; j++) {
      board[i].push(Cell());
    }
  }

  const checkArrayEquals = (array) => {
    return array.every((el) => el === "X") || array.every((el) => el === "O");
  };

  const threeInRow = (board) => {
    const cellValueBoardEquals = board
      .map((row) => checkArrayEquals(row))
      .reduce((acc, num) => acc || num);
    return cellValueBoardEquals;
  };

  const threeInColumn = (board) => {
    for (let i = 0; i < size; i++) {
      for (let j = i; j < size; j++) {
        // invert
        [board[i][j], board[j][i]] = [board[j][i], board[i][j]];
      }
    }
    return threeInRow(board);
  };

  const threeInRightDiagonal = (board) => {
    if (board[0][0] === "X" || board[0][0] === "O") {
      for (let i = 0; i < size; i++) {
        if (board[i][i] !== board[0][0]) return false;
      }
      return true;
    }
    return false;
  };

  const threeInLeftDiagonal = (board) => {
    if (board[0][size - 1] === "X" || board[0][size - 1] === "O") {
      for (let i = 0; i < size; i++) {
        if (board[i][size - 1 - i] !== board[0][size - 1]) return false;
      }
      return true;
    }
    return false;
  };

  const hasAnyGap = () => {
    return getCellValueBoard()
      .map((row) => row.find((ele) => ele !== "X" && ele !== "O"))
      .some((ele) => ele != undefined);
  };

  const addToken = (token, row, column) => {
    const availableGap = board[row][column].getValue() === 0;
    if (!availableGap) return;
    board[row][column].setValue(token);
  };

  const printBoard = () => {
    console.log(getCellValueBoard());
  };

  const cleanBoard = () => {
    for (let i = 0; i < size; i++) {
      board[i] = [];
      for (let j = 0; j < size; j++) {
        board[i].push(Cell());
      }
    }
  };

  return {
    getBoard,
    printBoard,
    addToken,
    threeInRow,
    threeInColumn,
    getCellValueBoard,
    threeInRightDiagonal,
    threeInLeftDiagonal,
    hasAnyGap,
    cleanBoard,
  };
}

function Cell() {
  let value = 0;

  const getValue = () => value;

  const setValue = (newValue) => (value = newValue);

  return { getValue, setValue };
}

function GameController() {
  const board = Gameboard();
  let result = "";
  const players = [
    {
      name: "Player1",
      token: "X",
    },
    {
      name: "Player2",
      token: "O",
    },
  ];

  let activePlayer = players[0];

  const getPlayers = () => players;

  const getResult = () => result;

  const setResult = (newResult) => (result = newResult);

  const getActivePlayer = () => activePlayer;

  const setActivePlayer = (newPlayer) => (activePlayer = newPlayer);

  const switchActivePlayer = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };

  const hasWinner = () => {
    return (
      board.threeInRow(board.getCellValueBoard()) ||
      board.threeInColumn(board.getCellValueBoard()) ||
      board.threeInLeftDiagonal(board.getCellValueBoard()) ||
      board.threeInRightDiagonal(board.getCellValueBoard())
    );
  };

  const printRound = () => {
    if (hasWinner()) {
      console.log(
        `We have a winner. ${
          players.find((player) => player != getActivePlayer()).name
        } wins.`
      );
      result = players.find((player) => player != getActivePlayer()).name;
      board.printBoard();
    } else if (!board.hasAnyGap()) {
      console.log("Tie!");
      result = "Tie";
      board.printBoard();
    } else {
      board.printBoard();
      console.log(`Turn of ${activePlayer.name}`);
    }
  };

  const playRound = (row, column) => {
    if (!hasWinner() && board.hasAnyGap()) {
      console.log(`Adding token to position ${row},${column}`);
      board.addToken(getActivePlayer().token, row, column);
      switchActivePlayer();
      printRound();
    }
  };

  const resetBoard = () => {
    board.cleanBoard();
    console.clear();
    setActivePlayer(players[0]);
    setResult("");
    printRound();
  };

  printRound();

  return {
    activePlayer,
    switchActivePlayer,
    playRound,
    getActivePlayer,
    players,
    getPlayers,
    getResult,
    getBoard: board.getBoard,
    resetBoard,
  };
}

function ScreenController() {
  const game = GameController();
  const mainElement = document.querySelector("main");
  const gameboard = game.getBoard();

  const displayResult = (result) => {
    const dialogResultElement = document.querySelector(".result-dialog");
    if (result === "Tie") {
      const tieElement = document.querySelector(".tie");
      tieElement.style.display = "flex";
    } else {
      const winnerElement = document.querySelector(".winner");
      const winnerResultElement = document.querySelector(".result-winner");
      winnerResultElement.textContent = result;
      winnerElement.style.display = "flex";
    }
    dialogResultElement.showModal();
    confetti();
  };

  const updateCellValue = (event) => {
    const posX = event.target.id[0];
    const posY = event.target.id[1];
    game.playRound(posX, posY);
    displayActivePlayer();
    const cellElementToUpdate = event.target;
    cellElementToUpdate.textContent = gameboard[posX][posY].getValue();
    // once click remove the listener
    cellElementToUpdate.removeEventListener("click", updateCellValue);
    if (game.getResult() !== "") {
      displayResult(game.getResult());
    }
  };

  const displayPlayers = () => {
    const players = game.getPlayers();
    players.forEach((player) => {
      const playersElement = document.querySelector(".players");
      const playerElement = document.createElement("div");
      playerElement.classList = "gameboard-cell player";
      playerElement.id = player.name;
      playerElement.textContent = player.token;
      playersElement.appendChild(playerElement);
    });
  };

  const displayActivePlayer = () => {
    const playerInactive = game
      .getPlayers()
      .find((player) => player.name !== game.getActivePlayer().name);
    const playerInactiveElement = document.getElementById(
      `${playerInactive.name}`
    );
    const playerActiveElement = document.getElementById(
      `${game.getActivePlayer().name}`
    );
    playerActiveElement.style.borderWidth = "7px";
    playerInactiveElement.style.borderWidth = "2px";
  };

  const resetBoard = () => {
    const gameboardElement = document.querySelector(".gameboard");
    const resetButton = document.querySelector(".reset-button");
    game.resetBoard();
    gameboardElement.remove();
    const newGameboard = document.createElement("div");
    newGameboard.classList = "gameboard";
    mainElement.insertBefore(newGameboard, resetButton);
    displayInitialBoard();
    displayActivePlayer();
  };

  const displayInitialBoard = () => {
    const gameboardElement = document.querySelector(".gameboard");
    gameboard.forEach((row, i) => {
      const rowElement = document.createElement("div");
      rowElement.classList = "gameboard-row";
      gameboardElement.appendChild(rowElement);
      row.forEach((cell, j) => {
        const cellElement = document.createElement("div");
        cellElement.classList = "gameboard-cell";
        cellElement.id = `${i}${j}`;
        rowElement.appendChild(cellElement);
        cellElement.addEventListener("click", updateCellValue);
      });
    });

    const resetButtonElement = document.querySelector(".reset-button");
    const resultButtonElement = document.querySelector(".result-button");
    resetButtonElement.addEventListener("click", resetBoard);
    resultButtonElement.addEventListener("click", () => {
      const dialogResultElement = document.querySelector(".result-dialog");
      const tieElement = document.querySelector(".tie");
      const winnerElement = document.querySelector(".winner");
      resetBoard();
      dialogResultElement.close();
      tieElement.style.display = "none";
      winnerElement.style.display = "none";
    });
  };

  displayPlayers();
  displayActivePlayer();
  displayInitialBoard();
}

ScreenController();
