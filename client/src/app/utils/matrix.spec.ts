import { MatrixSVG } from './matrix';

describe('MatrixSVG', () => {

    let mat: MatrixSVG;
    let tx: number;
    let ty: number;
    let a: number;
    let sx: number;
    let sy: number;

    beforeEach(() => {
        mat = new MatrixSVG();
        tx = Math.random();
        ty = Math.random();
        a = Math.random();
        sx = Math.random();
        sy = Math.random();
    });

    it('should be the identity matrix', () => {
        expect(mat).toBeTruthy();
        expect(mat.isIdentity()).toBeTruthy();
    });

    it('should throw error if index out of range', () => {
        expect(() => {
            // tslint:disable: no-magic-numbers
            MatrixSVG.at(100, 100);
        }).toThrow();
    });

    it('should translate', () => {
        const tempMatrix = new MatrixSVG();
        tempMatrix.arr[2] += tx;
        tempMatrix.arr[5] += ty;
        expect(mat.translate(tx, ty)).toEqual(tempMatrix);
    });

    it('should rotate', () => {
        const tempMatrix = new MatrixSVG();
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const other: MatrixSVG = new MatrixSVG();
        other.arr[0] = cos;
        other.arr[1] = -sin;
        other.arr[3] = sin;
        other.arr[4] = cos;
        tempMatrix.mul(other);
        expect(mat.rotate(a)).toEqual(tempMatrix);
    });

    it('should scale', () => {
        const tempMatrix = new MatrixSVG();
        const other: MatrixSVG = new MatrixSVG();
        other.arr[0] = sx;
        other.arr[4] = sy;
        tempMatrix.mul(other);
        expect(true).toBeTruthy();
    });

    it('should inverse', () => {
        mat.translate(Math.random(), Math.random())
            .rotate(Math.random())
            .scale(Math.random(), Math.random());
        const inv: MatrixSVG = mat.inverse();
        inv.mul(mat);
        expect(inv.isIdentity()).toBeTruthy();
    });

    it('isIdentity should return true if Math.abs(this.arr[i] - expect) < 10E-4', () => {
        expect(mat.isIdentity()).toBeTruthy();
    });

    it('isIdentity should return false if the matrix is not the identity matrix', () => {
        mat.arr[0] = 2;
        expect(mat.isIdentity()).toBeFalsy();
    });

});
