import { useEffect, useState } from "react";
import { Dungeon } from "../dungeon/Dungeon";
import { renderAscii } from "../render/asciiRenderer";

export default function DungeonView() {
  const [dungeon] = useState(() => {
    const d = new Dungeon(70, 40, 1235);
    d.addRooms(12);
    d.connectRooms();
    return d;
  });

  useEffect(() => {
    const el = document.getElementById("dungeon");
    if (el) {
      renderAscii(dungeon.grid, el);
    }
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
    />
  );
}
