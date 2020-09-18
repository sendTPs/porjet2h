/*
  | 0 (a) | 1 (c) | 2 (e) |
  | 3 (b) | 4 (d) | 5 (f) |
  | 6 (0) | 7 (0) | 8 (1) |
*/

export class MatrixSVG {

    static N_ROWS: number;
    static M_ROWS: number;

    arr: number[];

    constructor() {
        // tslint:disable: no-magic-numbers
        MatrixSVG.N_ROWS = 3;
        MatrixSVG.M_ROWS = 3;
        this.arr = new Array<number>(MatrixSVG.N_ROWS * MatrixSVG.M_ROWS).fill(0);
        this.arr[0] = 1;
        this.arr[4] = 1;
        this.arr[8] = 1;
    }

    static at(i: number, j: number): number {
        const index: number = j * MatrixSVG.M_ROWS + i;
        if (MatrixSVG.N_ROWS * MatrixSVG.M_ROWS <= index) {
            throw new RangeError(`Index ${index} (${i}, ${j}) out of range [0, 9)`);
        }
        return index;
    }

    translate(x: number, y: number): MatrixSVG {
        this.arr[2] += x;
        this.arr[5] += y;
        return this;
    }

    rotate(a: number): MatrixSVG {
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const other: MatrixSVG = new MatrixSVG();
        other.arr[0] = cos;
        other.arr[1] = -sin;
        other.arr[3] = sin;
        other.arr[4] = cos;
        this.mul(other);
        return this;
    }

    scale(sx: number, sy: number): MatrixSVG {
        const other: MatrixSVG = new MatrixSVG();
        other.arr[0] = sx;
        other.arr[4] = sy;
        this.mul(other);
        return this;
    }

    mul(other: MatrixSVG): void {
        const newArr = new Array<number>(MatrixSVG.N_ROWS * MatrixSVG.M_ROWS).fill(0);
        for (let i = 0; i < MatrixSVG.N_ROWS; ++i) {
            for (let j = 0; j < MatrixSVG.M_ROWS; ++j) {
                let acc = 0;
                for (let k = 0; k < MatrixSVG.N_ROWS; ++k) {
                    acc += this.arr[MatrixSVG.at(i, k)] * other.arr[MatrixSVG.at(k, j)];
                }
                newArr[MatrixSVG.at(i, j)] = acc;
            }
        }
        this.arr = newArr;
    }

    inverse(): MatrixSVG {
        const ret: MatrixSVG = this.copy();

        const a = ret.arr[0];
        const c = ret.arr[1];
        const e = ret.arr[2];
        const b = ret.arr[3];
        const d = ret.arr[4];
        const f = ret.arr[5];

        const det = a * d - b * c;

        ret.arr[0] = d;
        ret.arr[1] = -c;
        ret.arr[2] = c * f - d * e;
        ret.arr[3] = -b;
        ret.arr[4] = a;
        ret.arr[5] = e * b - a * f;
        ret.arr[6] = 0;
        ret.arr[7] = 0;
        ret.arr[8] = det;

        ret.arr = ret.arr.map((element) => {
            return element / det;
        });

        return ret;
    }

    toString(): string {
        return `matrix(${this.arr[0]}, ${this.arr[3]}, ${this.arr[1]}, ${this.arr[4]}, ${this.arr[2]}, ${this.arr[5]})`;
    }

    copy(): MatrixSVG {
        const ret: MatrixSVG = new MatrixSVG();
        ret.arr = this.arr.slice(0);
        return ret;
    }

    isIdentity(): boolean {
        for (let i = 0; i < this.arr.length; ++i) {
            const expect: number = Number(!Boolean(i % 4));
            const err = Math.abs(this.arr[i] - expect);
            if (err > 10E-4) {
                return false;
            }
        }
        return true;
    }
}
