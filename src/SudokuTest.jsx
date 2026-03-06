import KillerSudokuGrid from "./components/KillerSudokuGrid";
import puzzle2 from "./puzzles/puzzle2.json";

export default function SudokuTest() {
  return (
    <div style={{ padding: 40 }}>
      <h1>Sudoku Test</h1>
      <KillerSudokuGrid puzzle={puzzle2} />
    </div>
  );
}
