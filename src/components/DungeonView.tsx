import { useEffect, useState } from "react";
import { Dungeon } from "../Dungeon/Dungeon";
import { renderAscii } from "../render/asciiRenderer";

export default function DungeonView() {
  const [dungeon] = useState(() => {
    const d = new Dungeon(70, 40, Math.random()*10000);
    d.addRooms(12);
    d.connectRooms();
    d.spawnPlayer();
    return d;
  });

  const rerender = () => {
    const el = document.getElementById("dungeon");
    if (el) {
      renderAscii(dungeon.grid, dungeon.entities, el);
    }
  };


  useEffect(() => {
    rerender();

    const onKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
        case "w":
          dungeon.movePlayer(0, -1);
          break;
        case "ArrowDown":
        case "s":
          dungeon.movePlayer(0, 1);
          break;
        case "ArrowLeft":
        case "a":
          dungeon.movePlayer(-1, 0);
          break;
        case "ArrowRight":
        case "d":
          dungeon.movePlayer(1, 0);
          break;
        default:
          return;
      }
      rerender();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [dungeon]);


  return (
    <pre
      id="dungeon"
      style={{
        fontFamily: "monospace",
        lineHeight: "1",
        fontSize: "12px",
        userSelect: "none",
      }}
      tabIndex={0}
    />
  );
}
