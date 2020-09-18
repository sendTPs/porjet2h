
export const isAtLine = (point: number[], lineStart: number[], lineEnd: number[], width: number): boolean => {
    validateLength(point, 2);
    validateLength(lineStart, 2);
    validateLength(lineEnd, 2);

    const halfWidth = width / 2.0;

    const directionVector = vectorMinus(lineEnd, lineStart);
    const toPoint = vectorMinus(point, lineStart);

    const parallel = vectorProject(toPoint, directionVector);
    const perpendicular = vectorMinus(toPoint, parallel);

    const perpendicularModule = vectorModule(perpendicular);
    if (halfWidth < perpendicularModule) {
        return false;
    }

    // direction size + size of 2 widthss
    const directionModule = vectorModule(directionVector);
    const behindLength = halfWidth;
    const forwardLength = directionModule + halfWidth;

    const parallelModule = vectorModule(parallel);

    // if parallel pointing behind direction vector
    if (vectorDot(directionVector, parallel) < 0) {
        return parallelModule <= behindLength;
    }

    return parallelModule <= forwardLength;
};

export const vectorProject = (vector: number[], onto: number[]): number[] => {
    validateLength(vector, 2);
    validateLength(onto, 2);

    const moduleSquare: number = onto[0] * onto[0] + onto[1] * onto[1];

    const ratio = vectorDot(vector, onto) / moduleSquare;

    return [ratio * onto[0], ratio * onto[1]];
};

export const vectorMinus = (v0: number[], v1: number[]): number[] => {
    validateLength(v0, 2);
    validateLength(v1, 2);

    return [v0[0] - v1[0], v0[1] - v1[1]];
};

export const vectorPlus = (v0: number[], v1: number[]): number[] => {
    validateLength(v0, 2);
    validateLength(v1, 2);

    return [v0[0] + v1[0], v0[1] + v1[1]];
};

export const vectorModule = (vector: number[]): number => {
    validateLength(vector, 2);
    return Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);
};

export const vectorDot = (v0: number[], v1: number[]): number => {
    validateLength(v0, 2);
    validateLength(v1, 2);

    return v0[0] * v1[0] + v0[1] * v1[1];
};

export const vectorMultiplyConst = (v: number[], x: number): number[] => {
    validateLength(v, 2);

    return [v[0] * x, v[1] * x];
};

export const vectorMultiplyVector = (v: number[], v1: number[]): number[] => {
    validateLength(v, 2);
    validateLength(v1, 2);

    return [v[0] * v1[0], v[1] * v1[1]];
};

export const vectorDivideVector = (v: number[], v1: number[]): number[] => {
    validateLength(v, 2);
    validateLength(v1, 2);

    const v2 = [v[0], v[1]];

    if (v2[0] !== 0) {
        v2[0] /= v1[0];
    }
    if (v2[1] !== 0) {
        v2[1] /= v1[1];
    }

    return v2;
};

export const vectorGetAbsolute = (v: number[]): number[] => {
    validateLength(v, 2);

    return [Math.abs(v[0]), Math.abs(v[1])];
};

// tslint:disable: no-any
const validateLength = (list: any[], expectedLength: number): void => {
    if (list.length !== expectedLength) {
        throw new Error('List length not valid. Expected ' + expectedLength + ', got ' + list.length);
    }
};
