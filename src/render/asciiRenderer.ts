import type { Tile } from "../Dungeon/types";

export function renderAscii(
  grid: Tile[][],
  container: HTMLElement
) {
  container.innerText = grid
    .map((row) =>
      row
        .map((c) =>
          c === "floor" ? "." :
          c === "wall" ? "#" :
          c === "door" ? "+" :
          c === "water" ? "~" :
          c === "stairs_up" ? "<" :
          c === "stairs_down" ? ">" :
          " "
        )
        .join("")
    )
    .join("\n");
}
