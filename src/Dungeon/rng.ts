export class RNG {
    private seed: number;

    constructor(seed:number){
        this.seed = seed;
    }

    next(){
        this.seed = (this.seed * 1664525 + 1013904223) % 2**32;
        return this.seed / 2**32;
    }

    int(min:number, max:number){
        return Math.floor(this.next() * (max - min +1 ) + min);
    }
}