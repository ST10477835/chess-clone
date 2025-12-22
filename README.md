# Chess Clone (React + TypeScript)

This project is a **basic chess clone** implemented using **React** and **TypeScript**. It focuses on rendering a chessboard, displaying pieces, and allowing drag-and-drop movement with simple, rule-based validation per piece.

---

## Overview

The `ChessBoard` component dynamically generates an 8×8 chessboard and manages piece movement using React state. Each square knows its position, color, and which piece it contains. Movement logic is handled manually for each piece type.

This project is intended as a **learning exercise**, not a full chess engine.

---

## Features

* 8×8 chessboard rendered dynamically
* Light and dark square coloring
* SVG chess pieces
* Drag-and-drop piece movement
* Basic move validation for:

  * Pawn
  * Rook
  * Knight
  * Bishop
  * Queen
  * King
* Board orientation based on player color (white/black)

---

## How the Code Works

### Board Setup

* The board is built using nested loops over ranks and files.
* Each square is represented by a `Square` object:

```ts
interface Square {
  id: string;     // e.g. "1a"
  pos: string;    // array index position (e.g. "00")
  color: string;  // "light" or "dark"
  piece: Pieces;
}
```

* Squares are stored in a 2D array (`Square[][]`).

---

### Piece State

* `currPieces` stores the current piece layout as a 2D array
* Initial pieces are loaded from `ChessObjects.ts`
* Pieces are swapped by cloning the board state and updating it immutably

---

### Movement Validation

Movement rules are implemented in the `conditions` function using a `switch` statement based on the piece’s SVG source:

* **Pawn**: moves forward 1 square, or 2 squares from starting rank
* **Rook**: horizontal or vertical movement
* **Knight**: L-shaped movement
* **Bishop**: diagonal movement
* **Queen**: combination of rook and bishop movement
* **King**: one square in any direction

Only moves to **empty squares** are currently allowed.

---

### Drag and Drop Logic

* Drag start stores the starting square position
* Drag over updates the current target square
* Drag end validates the move and swaps pieces if valid

Uses native HTML drag events:

* `onDragStart`
* `onDragOver`
* `onDragEnd`

---

## Limitations

This chess clone does **not** currently support:

* Capturing opponent pieces
* Turn switching
* Check or checkmate detection
* Castling
* En passant
* Pawn promotion
* Path blocking (pieces can jump through others except knights)

---

## Tech Stack

* React
* TypeScript
* SCSS

---

## Purpose

This project was built to:

* Practice React state management
* Learn drag-and-drop interactions
* Implement rule-based logic in TypeScript
* Understand 2D array board representations

---

## Future Improvements

* Implement capturing logic
* Add turn-based movement
* Prevent illegal path traversal
* Add check and checkmate detection
* Improve UI and animations

---

## License

This project is for educational purposes.
