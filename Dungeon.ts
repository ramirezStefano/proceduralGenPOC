// dungeon.ts
// A simple procedural dungeon generator in TypeScript making a ASCII representation.

type Tile = 'wall' | 'floor';

interface Room {
  x: number;
  y: number;
  w: number;
  h: number;
}

class Dungeon {
  width: number;
  height: number;
  grid: Tile[][];
  rooms: Room[] = [];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.grid = Array.from({ length: height }, () => Array(width).fill('wall'));
  }

  randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  addRooms(count = 10) {
    for (let i = 0; i < count; i++) {
      const w = this.randomInt(4, 8);
      const h = this.randomInt(4, 8);
      const x = this.randomInt(1, this.width - w - 1);
      const y = this.randomInt(1, this.height - h - 1);

      const room: Room = { x, y, w, h };

      if (!this.overlaps(room)) {
        this.carveRoom(room);
        this.rooms.push(room);
      }
    }
  }

  overlaps(newRoom: Room) {
    return this.rooms.some(r =>
      !(newRoom.x + newRoom.w < r.x ||
        newRoom.x > r.x + r.w ||
        newRoom.y + newRoom.h < r.y ||
        newRoom.y > r.y + r.h)
    );
  }

  carveRoom(room: Room) {
    for (let y = room.y; y < room.y + room.h; y++) {
      for (let x = room.x; x < room.x + room.w; x++) {
        this.grid[y][x] = 'floor';
      }
    }
  }

  connectRooms() {
    this.rooms.sort((a, b) => a.x - b.x);
    for (let i = 1; i < this.rooms.length; i++) {
      const prev = this.rooms[i - 1];
      const curr = this.rooms[i];
      this.carveCorridor(prev, curr);
    }
  }

  carveCorridor(a: Room, b: Room) {
    const ax = Math.floor(a.x + a.w / 2);
    const ay = Math.floor(a.y + a.h / 2);
    const bx = Math.floor(b.x + b.w / 2);
    const by = Math.floor(b.y + b.h / 2);

    for (let x = Math.min(ax, bx); x <= Math.max(ax, bx); x++)
      this.grid[ay][x] = 'floor';
    for (let y = Math.min(ay, by); y <= Math.max(ay, by); y++)
      this.grid[y][bx] = 'floor';
  }

  print() {
    console.log(this.grid.map(row => row.map(c => (c === 'floor' ? '.' : '#')).join('')).join('\n'));
  }
}

const dungeon = new Dungeon(50, 30);
dungeon.addRooms(10);
dungeon.connectRooms();
dungeon.print();

