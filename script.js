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
    return array.every((el) => el === "1") || array.every((el) => el === "2");
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
    if (board[0][0] === "1" || board[0][0] === "2") {
      for (let i = 0; i < size; i++) {
        if (board[i][i] !== board[0][0]) return false;
      }
      return true;
    }
    return false;
  };

  const threeInLeftDiagonal = (board) => {
    if (board[0][size - 1] === "1" || board[0][size - 1] === "2") {
      for (let i = 0; i < size; i++) {
        if (board[i][size - 1 - i] !== board[0][size - 1]) return false;
      }
      return true;
    }
    return false;
  };

  const hasAnyGap = () => {
    return getCellValueBoard()
      .map((row) => row.find((ele) => ele !== "1" && ele !== "2"))
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

  const players = [
    {
      name: "Player1",
      token: "1",
    },
    {
      name: "Player2",
      token: "2",
    },
  ];

  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;

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
      board.printBoard();
    } else if (!board.hasAnyGap()) {
      console.log("Tie!");
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

  printRound();

  return {
    activePlayer,
    switchActivePlayer,
    playRound,
    getActivePlayer,
    players,
    getBoard: board.getBoard,
  };
}

function ScreenController() {
  const game = GameController();

  const gameboardElement = document.querySelector(".gameboard");
  const gameboard = game.getBoard();
  gameboard.forEach((row) => {
    const rowElement = document.createElement("div");
    rowElement.classList = "gameboard-row";
    gameboardElement.appendChild(rowElement);
    row.forEach((cell) => {
      const cellElement = document.createElement("div");
      cellElement.classList = "gameboard-cell";
      rowElement.appendChild(cellElement);
    });
  });
}

ScreenController();
