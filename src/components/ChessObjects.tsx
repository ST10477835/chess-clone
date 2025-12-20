export interface Pieces {
  src: string | null;
  color: string;
  curr_pos?: string;
  first_move?: boolean;
}
export const blank: Pieces = { src: null, color: "", curr_pos: "" };
const pawn_b: Pieces = {
  src: "/chess-clone/assets/pawn-b.svg",
  color: "black",
  curr_pos: "",
  first_move: false,
};
const pawn_w: Pieces = {
  src: "/chess-clone/assets/pawn-w.svg",
  color: "white",
  curr_pos: "",
  first_move: false,
};
const rook_b: Pieces = {
  src: "/chess-clone/assets/rook-b.svg",
  color: "black",
  curr_pos: "",
};
const rook_w: Pieces = {
  src: "/chess-clone/assets/rook-w.svg",
  color: "white",
  curr_pos: "",
};
const knight_b: Pieces = {
  src: "/chess-clone/assets/knight-b.svg",
  color: "black",
  curr_pos: "",
};
const knight_w: Pieces = {
  src: "/chess-clone/assets/knight-w.svg",
  color: "white",
  curr_pos: "",
};
const bishop_b: Pieces = {
  src: "/chess-clone/assets/bishop-b.svg",
  color: "black",
  curr_pos: "",
};
const bishop_w: Pieces = {
  src: "/chess-clone/assets/bishop-w.svg",
  color: "white",
  curr_pos: "",
};
const queen_b: Pieces = {
  src: "/chess-clone/assets/queen-b.svg",
  color: "black",
  curr_pos: "",
};
const queen_w: Pieces = {
  src: "/chess-clone/assets/queen-w.svg",
  color: "white",
  curr_pos: "",
};
const king_b: Pieces = {
  src: "/chess-clone/assets/king-b.svg",
  color: "black",
  curr_pos: "",
};
const king_w: Pieces = {
  src: "/chess-clone/assets/king-w.svg",
  color: "white",
  curr_pos: "",
};
export const pieces_w: Pieces[][] = [
  [rook_b, knight_b, bishop_b, queen_b, king_b, bishop_b, knight_b, rook_b],
  [pawn_b, pawn_b, pawn_b, pawn_b, pawn_b, pawn_b, pawn_b, pawn_b],
  [blank, blank, blank, blank, blank, blank, blank, blank],
  [blank, blank, blank, blank, blank, blank, blank, blank],
  [blank, blank, blank, blank, blank, blank, blank, blank],
  [blank, blank, blank, blank, blank, blank, blank, blank],
  [pawn_w, pawn_w, pawn_w, pawn_w, pawn_w, pawn_w, pawn_w, pawn_w],
  [rook_w, knight_w, bishop_w, queen_w, king_w, bishop_w, knight_w, rook_w],
];
export const pieces_b: Pieces[][] = [
  [rook_w, knight_w, bishop_w, queen_w, king_w, bishop_w, knight_w, rook_w],
  [pawn_w, pawn_w, pawn_w, pawn_w, pawn_w, pawn_w, pawn_w, pawn_w],
  [blank, blank, blank, blank, blank, blank, blank, blank],
  [blank, blank, blank, blank, blank, blank, blank, blank],
  [blank, blank, blank, blank, blank, blank, blank, blank],
  [blank, blank, blank, blank, blank, blank, blank, blank],
  [pawn_b, pawn_b, pawn_b, pawn_b, pawn_b, pawn_b, pawn_b, pawn_b],
  [rook_b, knight_b, bishop_b, queen_b, king_b, bishop_b, knight_b, rook_b],
];
