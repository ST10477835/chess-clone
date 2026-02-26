import { useState, useEffect, useRef } from "react";
import "./Chess.scss";
import { createInitialBoard, type Pieces } from "./ChessPieces";

interface Square {
  id: string;
  color: string;
  src: string | null;
  coordinates: { i: number; j: number };
}
const Chess = () => {
  //dictates player side color
  const [isWhite, setWhite] = useState(true);
  const [currentBoard, setCurrentBoard] = useState<Square[][]>([]);
  //drag related variables
  const startingCoordinatesRef = useRef<{ i: number; j: number } | null>(null);
  const currentKingPosition = useRef<{ i: number; j: number }>({ i: 7, j: 4 });
  /*
  const [startingPosition, setStartingPosition] = useState<Square>();
  const [endingPosition, setEndingPosition] = useState<Square>();
  const [currentPiece, setCurrentPiece] = useState<Pieces>();*/

  useEffect(() => {
    const initialBoard = createInitialBoard(isWhite);
    const ranks: number[] = [1, 2, 3, 4, 5, 6, 7, 8];
    const files: string[] = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const newBoard: Square[][] = [];
    for (let i = 0; i < ranks.length; i++) {
      newBoard[i] = [];
      for (let j = 0; j < files.length; j++) {
        let rank = isWhite ? ranks[7 - i] : ranks[i];
        let file = isWhite ? files[j] : files[7 - j];
        newBoard[i].push({
          id: file + rank,
          color: (i + j) % 2 == 1 ? "black" : "white",
          src: initialBoard[i][j].src,
          coordinates: { i: i, j: j },
        });
      }
    }
    setCurrentBoard(newBoard);
  }, [isWhite]);

  //drag related functions
  const handleDragStart = (file: Square) => {
    startingCoordinatesRef.current = file.coordinates;
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, file: Square) => {
    e.preventDefault();

    //-----------------SWAPPING LOGIC---------------------
    const start = startingCoordinatesRef.current;
    if (!start) return;
    const end = file.coordinates;

    canMove(start, end) && swap(start, end);
  };
  const canMove = (
    start: { i: number; j: number },
    end: { i: number; j: number },
  ) => {
    const piece1: Pieces = currentBoard[start.i][start.j];
    const piece1Name = piece1.src?.substring(11, piece1.src?.length - 6);

    const piece2: Pieces = currentBoard[end.i][end.j];
    const piece2Name = piece2.src?.substring(11, piece2.src?.length - 4);

    switch (piece1Name) {
      case "pawn":
        const rowDiff = start.i - end.i;
        const maxMove = start.i === 6 ? 2 : 1;
        const pawnCondition1 = rowDiff <= maxMove && rowDiff > 0; //either move 1 or 2
        const pawnCondition2 = start.j === end.j; //same column
        const pawnCondition3 = checkPawnCollisions(start, end); //checks collisions

        //piece taking logic

        const pawnCondition4 =
          Math.abs(start.i - end.i) && Math.abs(start.j - end.j)
            ? piece2Name?.includes("-b")
              ? true
              : false
            : false;
        if (pawnCondition4) {
          currentBoard[end.i][end.j].src = null;
        }
        return (
          (pawnCondition1 &&
            pawnCondition2 &&
            pawnCondition3 &&
            piece2Name === undefined) ||
          pawnCondition4
        );
        break;
      case "rook":
        const rookCondition1 = start.i === end.i;
        const rookCondition2 = start.j === end.j;
        const rookCondition3 = checkRookCollisions(start, end);
        const rookCondition4 = piece2Name?.includes("-b");
        if (rookCondition4) {
          currentBoard[end.i][end.j].src = null;
        }
        return (
          ((rookCondition1 && !rookCondition2) ||
            (!rookCondition1 && rookCondition2)) &&
          rookCondition3 &&
          (piece2Name === undefined || rookCondition4)
        );
        break;
      case "knight":
        const knightCondition1 =
          Math.abs(start.i - end.i) === 1 && Math.abs(start.j - end.j) === 2;
        const knightCondition2 =
          Math.abs(start.j - end.j) === 1 && Math.abs(start.i - end.i) === 2;
        const knightCondition3 = piece2Name?.includes("-b");
        if (knightCondition3) {
          currentBoard[end.i][end.j].src = null;
        }
        return (
          (knightCondition1 || knightCondition2) &&
          (piece2Name === undefined || knightCondition3)
        );
        break;
      case "bishop":
        const bishopCondition1 =
          Math.abs(start.i - end.i) === Math.abs(start.j - end.j);
        const bishopCondition2 = checkBishopCollisions(start, end);
        const bishopCondition3 = piece2Name?.includes("-b");
        if (bishopCondition3) {
          currentBoard[end.i][end.j].src = null;
        }
        return (
          bishopCondition1 &&
          bishopCondition2 &&
          (piece2Name === undefined || bishopCondition3)
        );
        break;
      case "queen":
        const queenCondition1 =
          Math.abs(start.i - end.i) === Math.abs(start.j - end.j);
        const queenCondition2 = start.i === end.i || start.j === end.j;
        const queenCondition3 = checkBishopCollisions(start, end);
        const queenCondition4 = checkRookCollisions(start, end);
        const queenCondition5 = piece2Name?.includes("-b");
        if (queenCondition5) {
          currentBoard[end.i][end.j].src = null;
        }
        return (
          ((queenCondition1 && queenCondition3) ||
            (queenCondition2 && queenCondition4)) &&
          (piece2Name === undefined || queenCondition5)
        );
        break;
      case "king":
        const kingCondition1 =
          start.i === end.i && Math.abs(start.j - end.j) === 1;
        const kingCondition2 =
          start.j === end.j && Math.abs(start.i - end.i) === 1;
        const kingCondition3 =
          Math.abs(start.i - end.i) === 1 && Math.abs(start.j - end.j) === 1;
        const kingCondition4 = piece2Name?.includes("-b");
        if (kingCondition4) {
          currentBoard[end.i][end.j].src = null;
        }
        return (
          kingCondition1 ||
          kingCondition2 ||
          (kingCondition3 && (piece2Name === undefined || kingCondition4))
        );
        break;
    }
  };
  const checkPawnCollisions = (
    start: { i: number; j: number },
    end: { i: number; j: number },
  ) => {
    if (Math.abs(start.i - end.i) === 2) {
      return !currentBoard[start.i - 1][start.j].src;
    } else {
      return !currentBoard[end.i][end.j].src;
    }
  };
  const checkRookCollisions = (
    start: { i: number; j: number },
    end: { i: number; j: number },
  ) => {
    const rookCondition1 = start.i === end.i;
    const rookCondition2 = start.j === end.j;
    if (rookCondition1 && !rookCondition2) {
      if (end.j < start.j) {
        for (let j = end.j + 1; j < start.j; j++) {
          if (currentBoard[start.i][j].src) {
            return false;
          }
        }
        return true;
      } else {
        for (let j = start.j + 1; j < end.j; j++) {
          if (currentBoard[start.i][j].src) {
            return false;
          }
        }
        return true;
      }
    } else {
      if (end.i < start.i) {
        for (let i = end.i + 1; i < start.i; i++) {
          if (currentBoard[i][start.j].src) {
            return false;
          }
        }
        return true;
      } else {
        for (let i = start.i + 1; i < end.i; i++) {
          if (currentBoard[i][start.j].src) {
            return false;
          }
        }
        return true;
      }
    }
  };
  const checkBishopCollisions = (
    start: { i: number; j: number },
    end: { i: number; j: number },
  ) => {
    const iStep = end.i > start.i ? 1 : -1;
    const jStep = end.j > start.j ? 1 : -1;

    let i = start.i + iStep;
    let j = start.j + jStep;

    while (i !== end.i && j !== end.j) {
      if (currentBoard[i][j].src) return false;
      i += iStep;
      j += jStep;
    }
    return true;
  };
  const swap = (
    start: { i: number; j: number },
    end: { i: number; j: number },
  ) => {
    if (currentBoard[start.i][start.j].src?.includes("king")) {
      currentKingPosition.current = { i: end.i, j: end.j };
    }
    const newBoard = currentBoard.map((row) => [...row]);

    const piece = newBoard[start.i][start.j].src;

    newBoard[start.i][start.j].src = newBoard[end.i][end.j].src;
    newBoard[end.i][end.j].src = piece;

    setCurrentBoard(newBoard);
    startingCoordinatesRef.current = null;
    console.log(
      `king position:${currentKingPosition.current.i}, ${currentKingPosition.current.j}`,
    );
  };
  return (
    <>
      <div className="container">
        <div className="board">
          {currentBoard.map((rank, i) => (
            <div className="rank" key={i.toString()}>
              {rank.map((file, j) => (
                <div
                  className={`file ${file.color}`}
                  key={file.id}
                  onDragOver={handleDragOver}
                  onDrop={(e) => {
                    handleDrop(e, file);
                  }}
                >
                  <img
                    draggable
                    onDragStart={() => handleDragStart(file)}
                    src={currentBoard[i][j].src?.toString()}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <button onClick={() => setWhite(!isWhite)}>switch sides</button>
      <div>state: {isWhite ? "white" : "black"}</div>
    </>
  );
};

export default Chess;
