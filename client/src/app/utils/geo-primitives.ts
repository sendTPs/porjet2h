export class Point {
    x: number;
    y: number;

    constructor(x: number = 0, y: number = 0) {
        this.x = x;
        this.y = y;
    }

    toVector(): number[] {
        return [this.x, this.y];
    }

    toString(): string {
        return `${this.x},${this.y}`;
    }
}

// tslint:disable-next-line: max-classes-per-file
export class Rect {
    x1: number;
    y1: number;
    x2: number;
    y2: number;

    constructor(x1: number = 0, y1: number = 0, x2: number = 0, y2: number = 0) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
    }

    intersect(other: Rect): boolean {
        let tMin = Math.min(this.x1, this.x2);
        let tMax = Math.max(this.x1, this.x2);
        let oMin = Math.min(other.x1, other.x2);
        let oMax = Math.max(other.x1, other.x2);
        tMax = Math.min(tMax, oMax);
        tMin = Math.max(tMin, oMin);
        if (tMax <= tMin) {
            return false;
        }

        tMin = Math.min(this.y1, this.y2);
        tMax = Math.max(this.y1, this.y2);
        oMin = Math.min(other.y1, other.y2);
        oMax = Math.max(other.y1, other.y2);
        tMax = Math.min(tMax, oMax);
        tMin = Math.max(tMin, oMin);
        if (tMax <= tMin) {
            return false;
        }

        return true;
    }
}
