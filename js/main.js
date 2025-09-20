'use strict';

const MINE = '💣';
const FLAG = '🚩';

let gBoard;
const gLevel = { SIZE: 4, MINES: 2 };
const gGame = { isOn: true, shownCount: 0, markedCount: 0 };

function onInit() {
  gBoard = buildBoard(gLevel.SIZE);
  // שלב ראשון – מיקומים קבועים כדי שיהיה נוח לבדוק
  setMinesFixed(gBoard, [{ i: 1, j: 1 }, { i: 2, j: 3 }]);
  setMinesNegsCount(gBoard);
  renderBoard(gBoard);
  console.log('Minesweeper loaded');
}

// בונה מטריצה של אובייקטים
function buildBoard(size) {
  const board = [];
  for (let i = 0; i < size; i++) {
    board[i] = [];
    for (let j = 0; j < size; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
      };
    }
  }
  return board;
}

// מיקומים קבועים (בהמשך נחליף לרנדומלי)
function setMinesFixed(board, locs) {
  for (const { i, j } of locs) board[i][j].isMine = true;
}

// מחשב לכל תא כמה מוקשים יש בסביבתו
function setMinesNegsCount(board) {
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      if (board[i][j].isMine) continue;
      board[i][j].minesAroundCount = countNegMines(board, i, j);
    }
  }
}

function countNegMines(board, ci, cj) {
  let count = 0;
  for (let i = ci - 1; i <= ci + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (let j = cj - 1; j <= cj + 1; j++) {
      if (j < 0 || j >= board[0].length) continue;
      if (i === ci && j === cj) continue;
      if (board[i][j].isMine) count++;
    }
  }
  return count;
}

// מצייר טבלה לדף
function renderBoard(board) {
  const elBoard = document.querySelector('.board');
  let html = '';
  for (let i = 0; i < board.length; i++) {
    html += '<tr>';
    for (let j = 0; j < board[0].length; j++) {
      html += `<td data-i="${i}" data-j="${j}"
                 onclick="onCellClicked(this, ${i}, ${j})"
                 oncontextmenu="onCellMarked(event, this, ${i}, ${j})"></td>`;
    }
    html += '</tr>';
  }
  elBoard.innerHTML = html;
}

// קליק שמאלי – חושף תא
function onCellClicked(elCell, i, j) {
  if (!gGame.isOn) return;

  const cell = gBoard[i][j];
  if (cell.isShown || cell.isMarked) return;

  cell.isShown = true;
  elCell.classList.add('shown');

  if (cell.isMine) {
    elCell.classList.add('mine');
    elCell.textContent = MINE;
    revealAllMines();
    gGame.isOn = false;
    alert('BOOM 💥');
    return;
  }

  // מציגים את מספר השכנים (או ריק אם 0)
  elCell.textContent = cell.minesAroundCount || '';
}

// קליק ימני – סימון/ביטול דגל
function onCellMarked(ev, elCell, i, j) {
  ev.preventDefault();
  if (!gGame.isOn) return;

  const cell = gBoard[i][j];
  if (cell.isShown) return;

  cell.isMarked = !cell.isMarked;
  elCell.classList.toggle('flag', cell.isMarked);
  elCell.textContent = cell.isMarked ? FLAG : '';
}

function revealAllMines() {
  for (let i = 0; i < gBoard.length; i++) {
    for (let j = 0; j < gBoard[0].length; j++) {
      const cell = gBoard[i][j];
      if (cell.isMine) {
        const elCell = document.querySelector(`[data-i="${i}"][data-j="${j}"]`);
        elCell.classList.add('mine', 'shown');
        elCell.textContent = MINE;
      }
    }
  }
}

// מפעיל את המשחק כשהדף נטען
document.addEventListener('DOMContentLoaded', onInit);