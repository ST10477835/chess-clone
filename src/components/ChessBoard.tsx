import {
  setup,
  board,
  handleDragStart,
  handleDragOver,
  handleDragEnd,
  currPieces,
} from "./Logic";
export const ChessBoard = () => {
  console.log("working");
  setup();
  return (
    <>
      <div className="main">
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
        <div className="stats">
          <div className="player">
            <img src="/chess-clone/assets/chesspfp.png" />
            Player 1
          </div>
          <div className="moves">moves go here</div>
          <div className="player">
            <img src="/chess-clone/assets/chesspfp.png" />
            Player 2
          </div>
        </div>
      </div>
    </>
  );
};

export default ChessBoard;
