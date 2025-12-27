export type Tile =
  | "wall"
  | "floor"
  | "door"
  | "water"
  | "stairs_up"
  | "stairs_down";

export interface Room {
  x: number;
  y: number;
  w: number;
  h: number;
  type?:
    | "start"
    | "end"
    | "normal"
    | "treasure"
    | "event"
    | "chest"
    | "monster"
    | "shop"
    | "npc"
    | "secret";
}

export interface Entity {
  id: string;
  x: number;
  y: number;
  char: string;
  type: "player" | "enemy" | "item";

  hp?: number;
  maxHp?: number;
  attack?: number;
}

