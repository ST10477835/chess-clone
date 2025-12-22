import { useState } from "react";
import type { Pieces } from "./ChessObjects";
import { pieces_b, pieces_w } from "./ChessObjects";

interface Square {
  id: string;
  pos: string;
  color: string;
  piece: Pieces;
}
const [isWhite] = useState(true);
const [currPos, setCurrPos] = useState("");

export const board: Square[][] = [];
const [startingPos, setStartingPos] = useState("");
export const [currPieces, setCurrPieces] = useState(
  isWhite ? pieces_w : pieces_b
);

export const setup = () => {
  const files: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"]; //columns
  const ranks: number[] = [1, 2, 3, 4, 5, 6, 7, 8]; //rows

  for (let i = 0; i < ranks.length; i++) {
    board[i] = [];
    for (let j = 0; j < files.length; j++) {
      let rank = isWhite ? ranks[7 - i] : ranks[i];
      let file = isWhite ? files[j] : files[7 - j];
      let pos = i.toString() + j;
      let color = (i + j) % 2 == 1 ? "dark" : "light";

      board[i].push({
        id: rank + file,
        pos: pos,
        color: color,
        piece: currPieces[i][j],
      });
    }
  }
};
setup();
const conditions = (
  currPiece: Pieces,
  coord1: Coordinates,
  coord2: Coordinates
) => {
  let i1 = coord1.i;
  let i2 = coord2.i;
  let j1 = coord1.j;
  let j2 = coord2.j;
  switch (currPiece.src) {
    case "/chess-clone/assets/pawn-b.svg":
    case "/chess-clone/assets/pawn-w.svg":
      //Move only one block forward & move two blocks on line 6
      if (j1 === j2) {
        //If moving vertically only
        if (Math.abs(i2 - i1) === 1 || (i1 === 6 && Math.abs(i2 - i1) === 2)) {
          {
            return true;
          }
        }
      }
      break;
    case "/chess-clone/assets/rook-b.svg":
    case "/chess-clone/assets/rook-w.svg":
      //If same row and different column or vice versa
      if ((j1 === j2 && i1 !== i2) || (i1 === i2 && j1 !== j2)) {
        return true;
      }
      break;
    case "/chess-clone/assets/knight-b.svg":
    case "/chess-clone/assets/knight-w.svg":
      if (
        (Math.abs(i2 - i1) === 2 && Math.abs(j2 - j1) === 1) ||
        (Math.abs(j2 - j1) === 2 && Math.abs(i2 - i1) === 1)
      ) {
        return true;
      }
      break;
    case "/chess-clone/assets/bishop-b.svg":
    case "/chess-clone/assets/bishop-w.svg":
      if (Math.abs(i2 - i1) === Math.abs(j2 - j1)) {
        return true;
      }
      break;
    case "/chess-clone/assets/queen-b.svg":
    case "/chess-clone/assets/queen-w.svg":
      if (
        (j1 === j2 && i1 !== i2) ||
        (i1 === i2 && j1 !== j2) ||
        Math.abs(i2 - i1) === Math.abs(j2 - j1)
      ) {
        return true;
      }
      break;
    case "/chess-clone/assets/king-b.svg":
    case "/chess-clone/assets/king-w.svg":
      if (Math.abs(i2 - i1) <= 1 && Math.abs(j2 - j1) <= 1) {
        return true;
      }
      break;
    default:
      console.log("none worked");
      break;
  }

  return false;
};
interface Coordinates {
  i: number;
  j: number;
}
const swapPieces = (start: string, end: string) => {
  const newPieces = currPieces.map((row) => [...row]);

  const swap = (coord1: Coordinates, coord2: Coordinates) => {
    const temp = newPieces[coord1.i][coord1.j];
    newPieces[coord1.i][coord1.j] = newPieces[coord2.i][coord2.j];
    newPieces[coord2.i][coord2.j] = temp;
    setCurrPieces(newPieces);
  };
  const [i1, j1] = start.split("").map(Number);
  const [i2, j2] = end.split("").map(Number);

  let currPiece = currPieces[i1][j1];
  let destPiece = currPieces[i2][j2];
  if (isWhite ? currPiece.src?.includes("-w") : currPiece.src?.includes("-b")) {
    if (
      conditions(currPiece, { i: i1, j: j1 }, { i: i2, j: j2 }) &&
      destPiece.src === null
    ) {
      swap({ i: i1, j: j1 }, { i: i2, j: j2 });
    }
  }
};

export const handleDragStart = (
  e: React.DragEvent<HTMLDivElement>,
  square: Square
) => {
  e.dataTransfer.setData("text/plain", "piece");
  let r = Number.parseInt(square.pos.charAt(0));
  let f = Number.parseInt(square.pos.charAt(1));
  setStartingPos(r.toString() + f);
};
export const handleDragOver = (
  e: React.DragEvent<HTMLDivElement>,
  square: Square
) => {
  e.preventDefault();
  setCurrPos(square.pos);
};
export const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  let r = Number.parseInt(currPos.charAt(0));
  let f = Number.parseInt(currPos.charAt(1));
  swapPieces(startingPos, r.toString() + f);
};
