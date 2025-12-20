import { useState } from "react";
import type { Pieces } from "./ChessObjects";
import { pieces_b, pieces_w, blank } from "./ChessObjects";
import "./ChessBoard.scss";
interface Square {
  id: string;
  pos: string;
  color: string;
  piece: Pieces;
}
export const ChessBoard = () => {
  const [isWhite] = useState(true);
  const [currPos, setCurrPos] = useState("");
  const [startingPos, setStartingPos] = useState("");
  const board: Square[][] = [];
  const [check, setCheck] = useState(false);
  const [currPieces, setCurrPieces] = useState(isWhite ? pieces_w : pieces_b);
  console.log(check);
  const setup = () => {
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
      case "pawn":
        //Move only one block forward & move two blocks on line 6
        if (j1 === j2) {
          //If moving vertically only
          if (
            Math.abs(i2 - i1) === 1 ||
            (i1 === 6 && Math.abs(i2 - i1) === 2)
          ) {
            {
              return true;
            }
          }
        }
        break;
      case "rook":
        //If same row and different column or vice versa
        if ((j1 === j2 && i1 !== i2) || (i1 === i2 && j1 !== j2)) {
          return true;
        }
        break;
      case "knight":
        if (
          (Math.abs(i2 - i1) === 2 && Math.abs(j2 - j1) === 1) ||
          (Math.abs(j2 - j1) === 2 && Math.abs(i2 - i1) === 1)
        ) {
          return true;
        }
        break;
      case "bishop":
        if (Math.abs(i2 - i1) === Math.abs(j2 - j1)) {
          return true;
        }
        break;
      case "queen":
        if (
          (j1 === j2 && i1 !== i2) ||
          (i1 === i2 && j1 !== j2) ||
          Math.abs(i2 - i1) === Math.abs(j2 - j1)
        ) {
          return true;
        }
        break;
      case "king":
        if (Math.abs(i2 - i1) <= 1 && Math.abs(j2 - j1) <= 1) {
          return true;
        }
        break;
      default:
        return false;
    }
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
    if (
      isWhite ? currPiece.src?.includes("-w") : currPiece.src?.includes("-b")
    ) {
      if (currPiece.src?.includes("pawn")) {
        //detect pawn piece starting
        if (j1 === j2 && i2 === i1 - 1) {
          //detect if its in the same column and is only moving one square
          if (destPiece.src === null) {
            //detect empty destination square
            swap({ i: i1, j: j1 }, { i: i2, j: j2 });

            if (
              currPieces[i2 - 1][j2 + 1].src?.includes("king") ||
              currPieces[i2 - 1][j2 - 1].src?.includes("king")
            ) {
              setCheck(true);
            }
          }
        } else if (j1 === j2 && Math.abs(i1 - i2) === 2 && i1 === 6) {
          //detect if its in the same column, if its moving
          if (destPiece.src === null) {
            swap({ i: i1, j: j1 }, { i: i2, j: j2 });

            if (
              currPieces[i2 - 1][j2 + 1].src?.includes("king") ||
              currPieces[i2 - 1][j2 - 1].src?.includes("king")
            ) {
              console.log("check");
              setCheck(true);
            }
          } else {
            console.log("not met1");
          }

          currPiece.first_move = false;
          console.log("changed");
        } else if (Math.abs(i2 - i1) === 1 && Math.abs(j2 - j1) === 1) {
          if (destPiece.src !== null) {
            if (i2 === i1 - 1) {
              if (
                (currPiece.src.includes("-b") &&
                  destPiece.src.includes("-w")) ||
                (currPiece.src.includes("-w") && destPiece.src.includes("-b"))
              ) {
                const temp = newPieces[i1][j1];
                newPieces[i1][j1] = newPieces[i2][j2];
                newPieces[i2][j2] = temp;
                newPieces[i1][j1] = blank;
                setCurrPieces(newPieces);
                console.log("piece taken");
                if (
                  currPieces[i2 - 1][j2 + 1].src?.includes("king") ||
                  currPieces[i2 - 1][j2 - 1].src?.includes("king")
                ) {
                  console.log("check");
                  setCheck(true);
                }
              } else {
                console.log("not met");
              }
            }
            console.log("diagonal move");
          }
        } else {
          console.log("not met2");
        }
      } else if (currPiece.src?.includes("rook")) {
        if (j1 === j2 || i1 === i2) {
          if (
            (destPiece.src === null && j1 === j2 && i1 !== i2) ||
            (i1 === i2 && j1 !== j2)
          ) {
            swap({ i: i1, j: j1 }, { i: i2, j: j2 });
          } else if (destPiece.src === null) {
            if (j1 === j2) {
              let rowsToCheck = Math.abs(i1 - i2) - 1;
              console.log(rowsToCheck + " rows to check");
              let canMove = true;

              if (i1 > i2) {
                console.log("direction up");
                for (let i = 1; i <= rowsToCheck; i++) {
                  if (currPieces[i1 - i][j1] !== blank) {
                    console.log("caught");
                    canMove = false;
                    break;
                  }
                }
              } else if (i2 > i1) {
                console.log("direction down");
                for (let i = 1; i <= rowsToCheck; i++) {
                  if (currPieces[i1 - i][j1] !== blank) {
                    console.log("caught");
                    canMove = false;
                    break;
                  }
                }
              }
              if (canMove) {
                const temp = newPieces[i1][j1];
                newPieces[i1][j1] = newPieces[i2][j2];
                newPieces[i2][j2] = temp;
                setCurrPieces(newPieces);
              }
            } else if (i1 === i2) {
              let columnsToCheck = Math.abs(j1 - j2) - 1;
              console.log("j1: " + j1);
              console.log("j2:" + j2);
              console.log(columnsToCheck + " columns to check");
              let canMove = true;
              if (j1 > j2) {
                console.log("direction left");
                for (let i = 1; i <= columnsToCheck; i++) {
                  if (currPieces[i1][j1 - i] !== blank) {
                    console.log("caught");
                    canMove = false;
                    break;
                  }
                }
              } else if (j1 < j2) {
                console.log("direction right");
                for (let i = 1; i <= columnsToCheck; i++) {
                  if (currPieces[i1][j1 + i] !== blank) {
                    canMove = false;
                    break;
                  }
                }
              }
              if (canMove) {
                const temp = newPieces[i1][j1];
                newPieces[i1][j1] = newPieces[i2][j2];
                newPieces[i2][j2] = temp;
                setCurrPieces(newPieces);
              }
            }
          }
        } else {
          console.log("not met");
        }
      } else if (currPiece.src?.includes("knight")) {
        if (
          (Math.abs(i1 - i2) === 2 && Math.abs(j1 - j2) === 1) ||
          (Math.abs(j1 - j2) === 2 && Math.abs(i1 - i2) === 1)
        ) {
          swap({ i: i1, j: j1 }, { i: i2, j: j2 });
        } else {
          console.log("not met");
        }
      } else if (currPiece.src?.includes("bishop")) {
        if (Math.abs(i2 - i1) === Math.abs(j2 - j1)) {
          //abs removes sign so "-5" === 5
          if (destPiece == blank) {
            if (Math.abs(j2 - j1) - 1 == 0) {
              //moved one square
              console.log("moved");
            } else {
              let squaresToCheck = Math.abs(i1 - i2) - 1;
              let canMove = true;
              let up = i2 < i1;
              let dir = j2 < j1; //true == left false == right
              console.log("squares to check: " + squaresToCheck);
              console.log(up ? "up" : "down");
              console.log(dir ? "left" : "right");
              for (let i = 1; i <= squaresToCheck; i++) {
                let curr_i = up ? i1 - i : i1 + 1;
                let curr_j = dir ? j1 - i : j1 + 1;
                if (currPieces[curr_i][curr_j] !== blank) {
                  console.log("no no");
                  canMove = false;
                  break;
                }
              }
              if (canMove) {
                const temp = newPieces[i1][j1];
                newPieces[i1][j1] = newPieces[i2][j2];
                newPieces[i2][j2] = temp;
                setCurrPieces(newPieces);
              }
            }
          } else {
            console.log("cant move");
          }
        } else {
          console.log("not met");
        }
      } else if (currPiece.src?.includes("queen")) {
        if (Math.abs(i2 - i1) === Math.abs(j2 - j1) || j1 === j2 || i1 === i2) {
          let type = Math.abs(i2 - i1) === Math.abs(j2 - j1) ? true : false;
          console.log(type);
          if (type) {
            if (destPiece == blank) {
              if (Math.abs(j2 - j1) - 1 == 0) {
                //moved one square
                console.log("moved");
              } else {
                let squaresToCheck = Math.abs(i1 - i2) - 1;
                let canMove = true;
                let up = i2 < i1;
                let dir = j2 < j1; //true == left false == right
                console.log("squares to check: " + squaresToCheck);
                console.log(up ? "up" : "down");
                console.log(dir ? "left" : "right");
                for (let i = 1; i <= squaresToCheck; i++) {
                  let curr_i = up ? i1 - i : i1 + 1;
                  let curr_j = dir ? j1 - i : j1 + 1;
                  if (currPieces[curr_i][curr_j] !== blank) {
                    console.log("no no");
                    canMove = false;
                    break;
                  }
                }
                if (canMove) {
                  const temp = newPieces[i1][j1];
                  newPieces[i1][j1] = newPieces[i2][j2];
                  newPieces[i2][j2] = temp;
                  setCurrPieces(newPieces);
                }
              }
            } else {
              console.log("cant move");
            }
          } else {
            if (destPiece.src === null && (j1 - j2 === 1 || i1 - i2 === 1)) {
              const temp = newPieces[i1][j1];
              newPieces[i1][j1] = newPieces[i2][j2];
              newPieces[i2][j2] = temp;
              setCurrPieces(newPieces);
            } else if (destPiece.src === null) {
              if (j1 === j2) {
                let rowsToCheck = Math.abs(i1 - i2) - 1;
                console.log(rowsToCheck + " rows to check");
                let canMove = true;

                if (i1 > i2) {
                  console.log("direction up");
                  for (let i = 1; i <= rowsToCheck; i++) {
                    if (currPieces[i1 - i][j1] !== blank) {
                      console.log("caught");
                      canMove = false;
                      break;
                    }
                  }
                } else if (i2 > i1) {
                  console.log("direction down");
                  for (let i = 1; i <= rowsToCheck; i++) {
                    if (currPieces[i1 - i][j1] !== blank) {
                      console.log("caught");
                      canMove = false;
                      break;
                    }
                  }
                }
                if (canMove) {
                  const temp = newPieces[i1][j1];
                  newPieces[i1][j1] = newPieces[i2][j2];
                  newPieces[i2][j2] = temp;
                  setCurrPieces(newPieces);
                }
              } else if (i1 === i2) {
                let columnsToCheck = Math.abs(j1 - j2) - 1;
                console.log("j1: " + j1);
                console.log("j2:" + j2);
                console.log(columnsToCheck + " columns to check");
                let canMove = true;
                if (j1 > j2) {
                  console.log("direction left");
                  for (let i = 1; i <= columnsToCheck; i++) {
                    if (currPieces[i1][j1 - i] !== blank) {
                      console.log("caught");
                      canMove = false;
                      break;
                    }
                  }
                } else if (j1 < j2) {
                  console.log("direction right");
                  for (let i = 1; i <= columnsToCheck; i++) {
                    if (currPieces[i1][j1 + i] !== blank) {
                      canMove = false;
                      break;
                    }
                  }
                }
                if (canMove) {
                  const temp = newPieces[i1][j1];
                  newPieces[i1][j1] = newPieces[i2][j2];
                  newPieces[i2][j2] = temp;
                  setCurrPieces(newPieces);
                }
              }
            }
          }
        } else {
          console.log("not met");
        }
      } else if (currPiece.src?.includes("king")) {
        if (Math.abs(i2 - i1) <= 1 && Math.abs(j2 - j1) <= 1) {
          if (currPieces[i2][j2] == blank) {
            swap({ i: i1, j: j1 }, { i: i2, j: j2 });
          }
        } else {
          console.log("not met");
        }
      } else {
        const temp = newPieces[i1][j1];
        newPieces[i1][j1] = newPieces[i2][j2];
        newPieces[i2][j2] = temp;
        setCurrPieces(newPieces); // <— THIS triggers re-render
      }
    }
  };

  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    square: Square
  ) => {
    e.dataTransfer.setData("text/plain", "piece");
    let r = Number.parseInt(square.pos.charAt(0));
    let f = Number.parseInt(square.pos.charAt(1));
    setStartingPos(r.toString() + f);
  };
  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    square: Square
  ) => {
    e.preventDefault();
    setCurrPos(square.pos);
  };
  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    let r = Number.parseInt(currPos.charAt(0));
    let f = Number.parseInt(currPos.charAt(1));
    swapPieces(startingPos, r.toString() + f);
  };
  return (
    <>
      <div className="main">
        <div className="player">
          <img src="/chess-clone/assets/chesspfp.png" alt="" />
          Player 2
        </div>
        <div className="board">
          {board.map((rank, i) => (
            <div className="rank" key={i.toString()}>
              {rank.map((square, j) => {
                return (
                  <div key={square.id}>
                    <div
                      onDragOver={(e) => handleDragOver(e, square)}
                      className={`square ${square.color}`}
                    >
                      <p className="fileLabel">
                        {j === 0 ? square.id.charAt(0) : ""}
                      </p>
                      <p className="rankLabel">
                        {i === 7 ? square.id.charAt(1) : ""}
                      </p>
                      <img
                        draggable
                        onDragStart={(e) => handleDragStart(e, square)}
                        onDragOver={(e) => handleDragOver(e, square)}
                        onDragEnd={(e) => handleDragEnd(e)}
                        src={currPieces[i][j].src?.toString()}
                      ></img>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
        <div className="player">
          <img src="/chess-clone/assets/chesspfp.png" alt="" />
          Player 1
        </div>
      </div>
    </>
  );
};

export default ChessBoard;
