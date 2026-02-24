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
  const detectCollision = (
    start: { i: number; j: number },
    end: { i: number; j: number },
  ) => {};
  const canMove = (
    start: { i: number; j: number },
    end: { i: number; j: number },
  ) => {
    const piece1: Pieces = currentBoard[start.i][start.j];
    const piece1Name = piece1.src?.substring(11, piece1.src?.length - 6);

    const piece2: Pieces = currentBoard[end.i][end.j];
    const piece2Name = piece2.src?.substring(11, piece2.src?.length - 6);

    switch (piece1Name) {
      case "pawn":
        const rowDiff = start.i - end.i;
        const maxMove = start.i === 6 ? 2 : 1;
        let pawnCondition1 = rowDiff <= maxMove && rowDiff > 0;
        let pawnCondition2 = start.j === end.j;

        return pawnCondition1 && pawnCondition2;
        break;
      case "rook":
        const rookCondition1 = start.i === end.i;
        const rookCondition2 = start.j === end.j;
        return (
          (rookCondition1 && !rookCondition2) ||
          (!rookCondition1 && rookCondition2)
        );
        break;
      case "knight":
        const knightCondition1 =
          Math.abs(start.i - end.i) === 1 && Math.abs(start.j - end.j) === 2;
        const knightCondition2 =
          Math.abs(start.j - end.j) === 1 && Math.abs(start.i - end.i) === 2;

        return knightCondition1 || knightCondition2;
        break;
      case "bishop":
        const bishopCondition =
          Math.abs(start.i - end.i) === Math.abs(start.j - end.j);
        return bishopCondition;
        break;
      case "queen":
        const queenCondition1 =
          Math.abs(start.i - end.i) === Math.abs(start.j - end.j);
        const queenCondition2 = start.i === end.i;
        const queenCondition3 = start.j === end.j;
        return queenCondition1 || queenCondition2 || queenCondition3;
        break;
      case "king":
        const kingCondition1 =
          start.i === end.i && Math.abs(start.j - end.j) === 1;
        const kingCondition2 =
          start.j === end.j && Math.abs(start.i - end.i) === 1;
        return kingCondition1 || kingCondition2;
        break;
    }
  };
  const swap = (
    start: { i: number; j: number },
    end: { i: number; j: number },
  ) => {
    const newBoard = currentBoard.map((row) => [...row]);

    const piece = newBoard[start.i][start.j].src;

    newBoard[start.i][start.j].src = newBoard[end.i][end.j].src;
    newBoard[end.i][end.j].src = piece;

    setCurrentBoard(newBoard);
    startingCoordinatesRef.current = null;
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
