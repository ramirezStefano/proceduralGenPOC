import type { Tile, Entity } from "../Dungeon/types";

export function renderAscii(
  grid: Tile[][],
  entities: Entity[],
  container: HTMLElement
) {

  const entityMap = new Map(
    entities.map(e => [`${e.x},${e.y}`, e.char])
  );

  container.innerText = grid
    .map((row, y) =>
      row
        .map((c, x) => {
          const entity = entityMap.get(`${x},${y}`);
          if (entity) return entity;

          return c === "floor" ? "." :
                 c === "wall" ? "#" :
                 c === "door" ? "+" :
                 c === "water" ? "~" :
                 c === "stairs_up" ? "<" :
                 c === "stairs_down" ? ">" :
                 " ";
        })
        .join("")
    )
    .join("\n");

}
