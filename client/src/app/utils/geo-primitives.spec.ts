import { Point, Rect } from './geo-primitives';

describe('Point', () => {

    let point: Point;

    beforeEach(() => {
        point = new Point(Math.random(), Math.random());
    });

    it('should return a vector of its value', () => {
        const vec: number[] = point.toVector();
        expect(vec).toContain(point.x);
        expect(vec).toContain(point.y);
    });

    it('should stringify correctly', () => {
        expect(point.toString()).toEqual(`${point.x},${point.y}`);
    });

});

describe('Rect', () => {
    let rect: Rect;

    beforeEach(() => {
        const x1 = Math.random();
        const y1 = Math.random();
        rect = new Rect(x1, y1, x1 + 1, y1 + 1);
    });

    it('should find the intersection correctly', () => {
        // tslint:disable: no-magic-numbers
        const other: Rect = new Rect(rect.x1, rect.y1, rect.x1 + 0.5, rect.y1 + 0.5);
        expect(other.intersect(rect)).toBeTruthy();
        other.x1 = rect.x1 + 10000;
        other.x2 = other.x1 + 0.5;
        expect(other.intersect(rect)).toBeFalsy();
        other.x1 = rect.x1;
        other.x2 = rect.x1 + 0.5;
        other.y1 = rect.y1 + 10000;
        other.y2 = other.y1 + 0.5;
        expect(other.intersect(rect)).toBeFalsy();
    });
});
