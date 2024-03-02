"use strict";

const player = (sign) => {
  this.sign = sign;

  // Get player's sign
  const getSign = () => {
    return sign;
  };

  return { getSign };
};

const gameboard = (() => {
  // Possible win conditons
  const WIN_COMBINATIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  let board = new Array(9);
  let turn = 1;

  // Get what sign is on the cell
  const getCell = (location) => {
    return board[location];
  };

  // Assign the cell a sign
  const setCell = (sign, location) => {
    board[location] = sign;
  };

  // Get current turn
  const getTurn = () => {
    return turn;
  };

  // Update turn
  const setTurn = (newTurn) => {
    turn = newTurn;
  };

  // Check for a winner or draw
  const checkCondition = (sign) => {
    // Check for winner
    for (let i = 0; i < WIN_COMBINATIONS.length; i++) {
      let combination = new Array(0);

      for (let j = 0; j < WIN_COMBINATIONS[i].length; j++) {
        if (gameboard.getCell(WIN_COMBINATIONS[i][j]) == sign) {
          combination.push(WIN_COMBINATIONS[i][j]);
        }

        if (combination.length == 3) {
          displayController.highlightWin(combination);
          displayController.status.textContent = sign + " Won!";
          displayController.endGame();
          return;
        }
      }
    }

    // Check for a draw
    for (let i = 0; i < 9; i++) {
      if (gameboard.getCell(i) == undefined) {
        return;
      }

      if (i == 8 && gameboard.getCell(i) != undefined) {
        displayController.status.textContent = "Draw!";
      }
    }
  };

  // Restart the game
  const resetBoard = () => {
    board = new Array(9);
    gameboard.setTurn(1);
  };

  return { getCell, setCell, getTurn, setTurn, checkCondition, resetBoard };
})();

const displayController = (() => {
  const status = document.querySelector(".status"); // Status of the game
  const restart = document.querySelector(".restart"); // Restart button

  const player1 = player("X");
  const player2 = player("O");

  let displayBoard = new Array(9); // Array for displaying the board

  /*
        Assign each element of disPlayBoard array a cell from game board
        And an eventListener that fires when it is clicked
    */
  for (let i = 0; i < 9; i++) {
    displayBoard[i] = document.querySelector(`.cell-${i + 1}`);

    displayBoard[i].addEventListener("click", () => {
      if (displayBoard[i].classList.contains("not-allowed")) {
        return;
      }

      let turn = gameboard.getTurn();
      let sign;

      if (turn % 2 == 0) {
        sign = player2.getSign();
        status.textContent = "X's Turn";
      } else {
        sign = player1.getSign();
        status.textContent = "O's Turn";
      }

      displayBoard[i].textContent = sign;
      displayBoard[i].classList.add("not-allowed");
      gameboard.setCell(sign, i);
      gameboard.checkCondition(sign);
      gameboard.setTurn(++turn);
    });
  }

  // Highlight the winning combination
  const highlightWin = (combination) => {
    for (let i = 0; i < combination.length; i++) {
      displayBoard[combination[i]].classList.add("highlight");
    }
  };

  // End the game and prevent players from making new move
  const endGame = () => {
    for (let i = 0; i < displayBoard.length; i++) {
      if (!displayBoard[i].classList.contains("not-allowed")) {
        displayBoard[i].classList.add("not-allowed");
      }
    }
  };

  // Reset the game and allow players to make moves again
  restart.addEventListener("click", () => {
    gameboard.resetBoard();

    for (let i = 0; i < displayBoard.length; i++) {
      status.textContent = "X's Turn";
      displayBoard[i].textContent = "";
      displayBoard[i].classList.remove("not-allowed");
      displayBoard[i].classList.remove("highlight");
    }
  });

  return { status, highlightWin, endGame };
})();
