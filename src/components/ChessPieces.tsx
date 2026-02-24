export interface Pieces {
  src: string | null;
  color: string;
  curr_pos?: string;
  first_move?: boolean;
}

const blank: Pieces = { src: null, color: "", curr_pos: "" };
const pawn_b: Pieces = {
  src: "src/assets/pawn-b.svg",
  color: "black",
  curr_pos: "",
  first_move: false,
};
const pawn_w: Pieces = {
  src: "src/assets/pawn-w.svg",
  color: "white",
  curr_pos: "",
  first_move: false,
};
const rook_b: Pieces = {
  src: "src/assets/rook-b.svg",
  color: "black",
  curr_pos: "",
};
const rook_w: Pieces = {
  src: "src/assets/rook-w.svg",
  color: "white",
  curr_pos: "",
};
const knight_b: Pieces = {
  src: "src/assets/knight-b.svg",
  color: "black",
  curr_pos: "",
};
const knight_w: Pieces = {
  src: "src/assets/knight-w.svg",
  color: "white",
  curr_pos: "",
};
const bishop_b: Pieces = {
  src: "src/assets/bishop-b.svg",
  color: "black",
  curr_pos: "",
};
const bishop_w: Pieces = {
  src: "src/assets/bishop-w.svg",
  color: "white",
  curr_pos: "",
};
const queen_b: Pieces = {
  src: "src/assets/queen-b.svg",
  color: "black",
  curr_pos: "",
};
const queen_w: Pieces = {
  src: "src/assets/queen-w.svg",
  color: "white",
  curr_pos: "",
};
const king_b: Pieces = {
  src: "src/assets/king-b.svg",
  color: "black",
  curr_pos: "",
};
const king_w: Pieces = {
  src: "src/assets/king-w.svg",
  color: "white",
  curr_pos: "",
};

export function createInitialBoard(isWhite: boolean): Pieces[][] {
  const board: Pieces[][] = isWhite
    ? [
        [
          rook_b,
          knight_b,
          bishop_b,
          queen_b,
          king_b,
          bishop_b,
          knight_b,
          rook_b,
        ],
        Array(8).fill(pawn_b),
        ...Array(4)
          .fill(null)
          .map(() => Array(8).fill(blank)),
        Array(8).fill(pawn_w),
        [
          rook_w,
          knight_w,
          bishop_w,
          queen_w,
          king_w,
          bishop_w,
          knight_w,
          rook_w,
        ],
      ]
    : [
        [
          rook_w,
          knight_w,
          bishop_w,
          king_w,
          queen_w,
          bishop_w,
          knight_w,
          rook_w,
        ],
        Array(8).fill(pawn_w),
        ...Array(4)
          .fill(null)
          .map(() => Array(8).fill(blank)),
        Array(8).fill(pawn_b),
        [
          rook_b,
          knight_b,
          bishop_b,
          king_b,
          queen_b,
          bishop_b,
          knight_b,
          rook_b,
        ],
      ];

  return board;
}
