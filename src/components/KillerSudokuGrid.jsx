import { useState, useEffect, useRef } from "react";

const CELL_SIZE = 64;
const GRID_SIZE = 6;
const CAGE_INSET = 4;

function parseCellRef(ref) {
  const match = ref.match(/R(\d+)C(\d+)/);
  return { row: parseInt(match[1]) - 1, col: parseInt(match[2]) - 1 };
}

function validate(grid, puzzle) {
  for (let r = 0; r < GRID_SIZE; r++)
    for (let c = 0; c < GRID_SIZE; c++)
      if (grid[r][c].input !== String(puzzle.grid[r][c].value))
        return false;
  return true;
}

function CageOverlay({ cages }) {
  const totalSize = CELL_SIZE * GRID_SIZE;
  const i = CAGE_INSET;
  const segments = [];

  cages.forEach((cage) => {
    const cageCells = new Set(cage.cells.map((ref) => {
      const { row, col } = parseCellRef(ref);
      return `${row},${col}`;
    }));

    const edges = [];
    cageCells.forEach((key) => {
      const [r, c] = key.split(",").map(Number);
      if (!cageCells.has(`${r - 1},${c}`)) edges.push([c,     r,     c + 1, r    ]);
      if (!cageCells.has(`${r + 1},${c}`)) edges.push([c + 1, r + 1, c,     r + 1]);
      if (!cageCells.has(`${r},${c - 1}`)) edges.push([c,     r + 1, c,     r    ]);
      if (!cageCells.has(`${r},${c + 1}`)) edges.push([c + 1, r,     c + 1, r + 1]);
    });

    const edgeMap = new Map();
    edges.forEach((e) => {
      const key = `${e[0]},${e[1]}`;
      if (!edgeMap.has(key)) edgeMap.set(key, []);
      edgeMap.get(key).push(e);
    });

    const visitedEdges = new Set();
    edges.forEach((startEdge) => {
      if (visitedEdges.has(startEdge)) return;
      const loop = [];
      let cur = startEdge;
      while (cur && !visitedEdges.has(cur)) {
        visitedEdges.add(cur);
        loop.push([cur[0], cur[1]]);
        const candidates = edgeMap.get(`${cur[2]},${cur[3]}`) || [];
        cur = candidates.find((e) => !visitedEdges.has(e)) || null;
      }
      if (loop.length < 3) return;

      const rawPts = loop.map(([gc, gr]) => [gc * CELL_SIZE, gr * CELL_SIZE]);
      const pts = rawPts.filter(([px, py], idx) => {
        const [ppx, ppy] = rawPts[(idx - 1 + rawPts.length) % rawPts.length];
        const [npx, npy] = rawPts[(idx + 1) % rawPts.length];
        return Math.sign(px - ppx) !== Math.sign(npx - px) ||
               Math.sign(py - ppy) !== Math.sign(npy - py);
      });
      if (pts.length < 3) return;
      const n = pts.length;

      const insetPts = pts.map(([px, py], idx) => {
        const [ppx, ppy] = pts[(idx - 1 + n) % n];
        const [npx, npy] = pts[(idx + 1) % n];
        const inDx = Math.sign(px - ppx), inDy = Math.sign(py - ppy);
        const outDx = Math.sign(npx - px), outDy = Math.sign(npy - py);
        const inNx = -inDy, inNy = inDx;
        const outNx = -outDy, outNy = outDx;
        const bx = inNx + outNx;
        const by = inNy + outNy;
        return [
          px + (bx === 0 ? 0 : i * Math.sign(bx)),
          py + (by === 0 ? 0 : i * Math.sign(by)),
        ];
      });

      segments.push(
        insetPts.map(([px, py], idx) => `${idx === 0 ? "M" : "L"}${px},${py}`).join(" ") + " Z"
      );
    });
  });

  const labels = cages.map((cage) => {
    const cells = cage.cells.map(parseCellRef);
    const topLeft = cells.reduce((best, c) => {
      if (c.row < best.row || (c.row === best.row && c.col < best.col)) return c;
      return best;
    }, cells[0]);
    return {
      value: cage.value,
      x: topLeft.col * CELL_SIZE + i + 2,
      y: topLeft.row * CELL_SIZE + i + 10,
    };
  });

  return (
    <svg
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", gridColumn: "1 / -1", gridRow: "1 / -1" }}
      width={totalSize}
      height={totalSize}
    >
      <path
        d={segments.join(" ")}
        fill="none"
        stroke="#222"
        strokeWidth={1.5}
        strokeDasharray="4,3"
        strokeLinecap="round"
      />
      {labels.map((label, idx) => (
        <text key={idx} x={label.x} y={label.y} fontSize={10} fontWeight={700} fill="#333" fontFamily="system-ui, sans-serif">
          {label.value}
        </text>
      ))}
    </svg>
  );
}

export default function KillerSudokuGrid({ puzzle, onComplete, onGiveUp }) {
  const [grid, setGrid] = useState(() =>
    puzzle.grid.map((row) =>
      row.map((cell) => ({
        ...cell,
        input: cell.given ? String(cell.value) : "",
        notes: new Set(),
      }))
    )
  );
  const [selectedCell, setSelectedCell] = useState({ row: 0, col: 0 });
  const [noteMode, setNoteMode] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [confirmGiveUp, setConfirmGiveUp] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startTime = useRef(Date.now());
  const containerRef = useRef(null);

  useEffect(() => {
    if (completed) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [completed]);

  useEffect(() => {
    containerRef.current?.focus();
  }, []);

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  }

  function fillCell(row, col, val) {
    if (!grid[row] || grid[row][col].given || completed) return;
    const next = grid.map((r) => r.map((c) => ({ ...c, notes: new Set(c.notes) })));
    if (noteMode && val !== "") {
      const notes = next[row][col].notes;
      if (notes.has(val)) notes.delete(val);
      else notes.add(val);
    } else {
      next[row][col].input = val;
      next[row][col].notes = new Set();
    }
    setGrid(next);
    if (!noteMode && validate(next, puzzle)) {
      const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
      const topRow = next[0].map((c) => c.input).join("");
      setCompleted(true);
      if (onComplete) onComplete({ topRow, elapsedSeconds: elapsed });
    }
  }

  function handleKeyDown(e) {
    if (completed || !selectedCell) return;
    const { row, col } = selectedCell;
    if (e.key === "ArrowUp")    { e.preventDefault(); setSelectedCell({ row: Math.max(0, row - 1), col }); return; }
    if (e.key === "ArrowDown")  { e.preventDefault(); setSelectedCell({ row: Math.min(GRID_SIZE - 1, row + 1), col }); return; }
    if (e.key === "ArrowLeft")  { e.preventDefault(); setSelectedCell({ row, col: Math.max(0, col - 1) }); return; }
    if (e.key === "ArrowRight") { e.preventDefault(); setSelectedCell({ row, col: Math.min(GRID_SIZE - 1, col + 1) }); return; }
    if (e.key === "Backspace" || e.key === "Delete") { fillCell(row, col, ""); return; }
    if (/^[1-6]$/.test(e.key)) { fillCell(row, col, e.key); return; }
  }

  function handleNumpad(val) {
    if (!selectedCell) return;
    fillCell(selectedCell.row, selectedCell.col, val);
  }

  function handleGiveUp() {
    const elapsed = Math.floor((Date.now() - startTime.current) / 1000);
    if (onGiveUp) onGiveUp({ elapsedSeconds: elapsed });
  }

  const totalSize = CELL_SIZE * GRID_SIZE;

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      style={{ outline: "none", display: "inline-block" }}
    >
      {/* Timer */}
      <div style={{ marginBottom: 12 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a", fontFamily: "system-ui, sans-serif" }}>
          ⏱ {formatTime(elapsedSeconds)}
        </span>
      </div>

      {completed && (
        <div style={{ marginBottom: 16, padding: "12px 16px", backgroundColor: "#dcfce7", borderRadius: 8, fontWeight: 600, color: "#166534", fontFamily: "system-ui, sans-serif" }}>
          🎉 Puzzle complete! Time: {formatTime(elapsedSeconds)}
        </div>
      )}

      {/* Grid */}
      <div style={{ display: "inline-block", position: "relative" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${GRID_SIZE}, ${CELL_SIZE}px)`,
            border: "3px solid #1a1a1a",
            gap: 0,
            position: "relative",
            width: totalSize,
            height: totalSize,
          }}
        >
          {grid.map((row, r) =>
            row.map((cell, c) => {
              const isSelected = selectedCell?.row === r && selectedCell?.col === c;
              const isGiven = cell.given;
              const borderRight = (c + 1) % 3 === 0 && c !== 5 ? "3px solid #1a1a1a" : "1px solid #ccc";
              const borderBottom = (r + 1) % 2 === 0 && r !== 5 ? "3px solid #1a1a1a" : "1px solid #ccc";
              const hasNotes = cell.notes.size > 0 && !cell.input;

              return (
                <div
                  key={`${r}-${c}`}
                  onClick={() => { setSelectedCell({ row: r, col: c }); containerRef.current?.focus(); }}
                  style={{
                    width: CELL_SIZE,
                    height: CELL_SIZE,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRight,
                    borderBottom,
                    backgroundColor: completed ? "#dcfce7" : isSelected ? "#dbeafe" : isGiven ? "#f0f0f0" : "#fff",
                    cursor: "pointer",
                    position: "relative",
                    boxSizing: "border-box",
                    userSelect: "none",
                  }}
                >
                  {hasNotes ? (
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3, 1fr)",
                      gridTemplateRows: "repeat(2, 1fr)",
                      width: "100%",
                      height: "100%",
                      padding: 3,
                      boxSizing: "border-box",
                    }}>
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: 11,
                          fontWeight: 600,
                          color: cell.notes.has(String(n)) ? "#6b7280" : "transparent",
                          lineHeight: 1,
                        }}>
                          {n}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <span style={{
                      fontSize: 28,
                      fontWeight: isGiven ? 700 : 600,
                      color: isGiven ? "#1a1a1a" : "#2563eb",
                      pointerEvents: "none",
                    }}>
                      {cell.input}
                    </span>
                  )}
                </div>
              );
            })
          )}
          <CageOverlay cages={puzzle.killercage} />
        </div>
      </div>

      {/* Numpad */}
      {!completed && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <button
                key={n}
                onClick={() => handleNumpad(String(n))}
                style={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  fontSize: 24,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  backgroundColor: "#f3f4f6",
                  border: "2px solid #d1d5db",
                  borderRadius: 8,
                  cursor: "pointer",
                }}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => handleNumpad("")}
              style={{
                width: CELL_SIZE,
                height: CELL_SIZE,
                fontSize: 18,
                fontWeight: 700,
                color: "#1a1a1a",
                backgroundColor: "#fee2e2",
                border: "2px solid #fca5a5",
                borderRadius: 8,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>
          {/* Note mode toggle */}
          <div style={{ marginTop: 10 }}>
            <button
              onClick={() => setNoteMode((m) => !m)}
              style={{
                padding: "6px 18px",
                fontSize: 13,
                fontWeight: 600,
                color: noteMode ? "#fff" : "#374151",
                backgroundColor: noteMode ? "#6b7280" : "#f3f4f6",
                border: "2px solid #d1d5db",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              ✏️ Notes {noteMode ? "ON" : "OFF"}
            </button>
          </div>
        </div>
      )}

      {/* Give Up */}
      {!completed && (
        <div style={{ marginTop: 16 }}>
          {!confirmGiveUp && (
            <button
              onClick={() => setConfirmGiveUp(true)}
              style={{ padding: "8px 20px", fontSize: 14, color: "#6b7280", backgroundColor: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: 6, cursor: "pointer" }}
            >
              Give Up
            </button>
          )}
          {confirmGiveUp && (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "#555" }}>Are you sure?</span>
              <button onClick={handleGiveUp} style={{ padding: "8px 20px", fontSize: 14, backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>
                Yes, give up
              </button>
              <button onClick={() => setConfirmGiveUp(false)} style={{ padding: "8px 20px", fontSize: 14, color: "#1a1a1a", backgroundColor: "#e5e7eb", border: "none", borderRadius: 6, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
