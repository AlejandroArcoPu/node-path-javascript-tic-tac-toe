function Gameboard() {
  const board = [];

  const getBoard = () => board;
  const getCellValueBoard = () =>
    board.map((row) => row.map((cell) => cell.getValue()));

  // Initial board
  for (let i = 0; i < 3; i++) {
    board[i] = [];
    for (let j = 0; j < 3; j++) {
      board[i].push(Cell());
    }
  }

  const checkAllEquals = (array) => {
    return array.every((el) => el === "1") || array.every((el) => el === "2");
  };

  const threeInRow = () => {
    const cellValueBoard = getCellValueBoard();
    const cellValueBoardEquals = cellValueBoard
      .map((row) => checkAllEquals(row))
      .reduce((acc, num) => acc || num);
    return cellValueBoardEquals;
  };

  const threeInColumn = () => {
    const cellValueBoard = getCellValueBoard();
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let inter = cellValueBoard[i][j];
        cellValueBoard[i][j] = cellValueBoard[j][i];
        cellValueBoard[j][i] = inter;
      }
    }
    console.log(cellValueBoard);
  };
  const threeInDiagonal = () => {
    const cellValueBoard = getCellValueBoard();
  };

  const addToken = (token, row, column) => {
    const availableGap = board[row][column].getValue() === 0;
    if (!availableGap) return;
    board[row][column].setValue(token);
  };

  const printBoard = () => {
    console.log(getCellValueBoard());
  };

  return { getBoard, printBoard, addToken, threeInRow, threeInColumn };
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

  const checkWinner = () => {};

  const printRound = () => {
    board.printBoard();
    console.log(`Turn of ${activePlayer.name}`);
  };

  const playRound = (row, column) => {
    console.log(`Adding token to position ${row},${column}`);
    board.addToken(getActivePlayer().token, row, column);
    switchActivePlayer();
    printRound();
  };

  printRound();

  return { activePlayer, switchActivePlayer, playRound, getActivePlayer };
}

const board = Gameboard();
board.addToken("2", 0, 0);
board.addToken("2", 1, 0);
board.addToken("2", 2, 0);
board.addToken("2", 0, 2);
board.addToken("2", 1, 2);
board.addToken("2", 2, 2);

board.printBoard();
// board.threeInRow();
board.threeInColumn();
