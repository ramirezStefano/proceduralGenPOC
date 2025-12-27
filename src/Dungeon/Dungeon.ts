import { RNG } from "./rng.ts";
import type { Tile, Room, Entity } from "./types.ts";

export class Dungeon {
  rng: RNG;
  width: number;
  height: number;
  grid: Tile[][];
  rooms: Room[] = [];
  entities: Entity[] = [];
  visible: boolean[][];

  constructor(width: number, height: number, seed = Date.now()) {
    this.rng = new RNG(seed);
    this.width = width;
    this.height = height;
    this.grid = Array.from({ length: height }, () =>
      Array(width).fill("wall")
    );
    this.visible = Array.from({ length: height }, () =>
      Array(width).fill(false)
    );
  }

  randomInt(min: number, max: number) {
    return this.rng.int(min, max);
  }

  addRooms(count = 15) {
    for (let i = 0; i < count; i++) {
      const w = this.randomInt(4, 10);
      const h = this.randomInt(4, 10);
      const x = this.randomInt(1, this.width - w - 1);
      const y = this.randomInt(1, this.height - h - 1);

      const room: Room = { x, y, w, h, type: "normal" };

      if (!this.overlaps(room)) {
        this.carveRoom(room);
        this.rooms.push(room);
      }
    }
  }

  overlaps(newRoom: Room) {
    return this.rooms.some(
      (r) =>
        !(
          newRoom.x + newRoom.w < r.x ||
          newRoom.x > r.x + r.w ||
          newRoom.y + newRoom.h < r.y ||
          newRoom.y > r.y + r.h
        )
    );
  }

  carveRoom(room: Room) {
    for (let y = room.y; y < room.y + room.h; y++) {
      for (let x = room.x; x < room.x + room.w; x++) {
        this.grid[y][x] = "floor";
      }
    }
  }

  connectRooms() {
    this.rooms.sort((a, b) => a.x - b.x);
    for (let i = 1; i < this.rooms.length; i++) {
      this.carveCorridor(this.rooms[i - 1], this.rooms[i]);
    }
  }

  carveCorridor(a: Room, b: Room) {
    const ax = Math.floor(a.x + a.w / 2);
    const ay = Math.floor(a.y + a.h / 2);
    const bx = Math.floor(b.x + b.w / 2);
    const by = Math.floor(b.y + b.h / 2);

    for (let x = Math.min(ax, bx); x <= Math.max(ax, bx); x++)
      this.grid[ay][x] = "floor";
    for (let y = Math.min(ay, by); y <= Math.max(ay, by); y++)
      this.grid[y][bx] = "floor";
  }

  spawnPlayer() {
    const start = this.rooms[0];
    const x = Math.floor(start.x + start.w / 2);
    const y = Math.floor(start.y + start.h / 2);
  
    this.entities.push({
      id: "player",
      x,
      y,
      char: "@",
      type: "player",
    });
  }  

  movePlayer(dx: number, dy: number) {
    const player = this.entities.find(e => e.type === "player");
    if (!player) return;
  
    const nx = player.x + dx;
    const ny = player.y + dy;
  
    if (this.grid[ny]?.[nx] === "floor") {
      player.x = nx;
      player.y = ny;
    }
  }

  spawnEntity(e: Entity) {
    if (this.grid[e.y][e.x] === "floor") {
      this.entities.push(e);
    }
  }

  spawnEnemies(count = 6) {
    for (let i = 0; i < count; i++) {
      const room = this.rooms[this.randomInt(1, this.rooms.length - 1)];
      const x = this.randomInt(room.x + 1, room.x + room.w - 2);
      const y = this.randomInt(room.y + 1, room.y + room.h - 2);
  
      this.entities.push({
        id: `enemy-${i}`,
        x,
        y,
        char: "g",
        type: "enemy",
      });
    }
  }

  takeTurn(dx: number, dy: number) {
    this.movePlayer(dx, dy);
    this.enemyTurn();
  }

  enemyTurn() {
    const player = this.entities.find(e => e.type === "player");
    if (!player) return;
  
    for (const enemy of this.entities.filter(e => e.type === "enemy")) {
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;
      const dist = Math.abs(dx) + Math.abs(dy);
  
      // Chase if close
      if (dist <= 6) {
        const stepX = Math.sign(dx);
        const stepY = Math.sign(dy);
  
        this.tryMoveEnemy(enemy, stepX, stepY);
      } else {
        // Wander randomly
        const dir = this.randomInt(0, 3);
        const moves = [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ];
        const [mx, my] = moves[dir];
        this.tryMoveEnemy(enemy, mx, my);
      }
    }
  }

  isOccupied(x: number, y: number) {
    return this.entities.some(e => e.x === x && e.y === y);
  }
  
  tryMoveEnemy(enemy: any, dx: number, dy: number) {
    const nx = enemy.x + dx;
    const ny = enemy.y + dy;
  
    if (
      this.grid[ny]?.[nx] === "floor" &&
      !this.isOccupied(nx, ny)
    ) {
      enemy.x = nx;
      enemy.y = ny;
    }
  }
  
  
  

  computeFOV(px: number, py: number, radius = 8) {
    for (let y = py - radius; y <= py + radius; y++) {
      for (let x = px - radius; x <= px + radius; x++) {
        if (
          Math.hypot(x - px, y - py) <= radius &&
          this.visible[y]?.[x] !== undefined
        ) {
          this.visible[y][x] = true;
        }
      }
    }
  }

  toJSON() {
    return {
      rooms: this.rooms,
      entities: this.entities,
      grid: this.grid,
    };
  }
}
