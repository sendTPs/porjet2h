import * as CST from '@models/constants';
import { Node } from '@models/node';
import { Point2d } from '@models/point2d.class';

export class HashArrayPoint2d { // <T extends Point2d>

    readonly DISTANCE_CONCAT_25: number = 25;
    readonly DISTANCE_CONCAT_2: number = 2;

    start: Node<Point2d>[];
    end: Node<Point2d>[];
    values: Set<string>;
    size: number[];
    lenght: number;
    private indexDone: Set<number>;
    constructor() {
        this.end = [];
        this.start = [];
        this.size = [];
        this.lenght = 0;
        this.values = new Set<string>();
    }

    add(newPoint: Point2d): boolean {
        // tslint:disable-next-line: prefer-for-of
        if (this.values.has(`${newPoint.x}:${newPoint.y}`)) { return false; }
        this.values.add(`${newPoint.x}:${newPoint.y}`);
        let newNode: Node<Point2d>;
        for (let it = 0; it < this.lenght; it++) {
            const startNode: Node<Point2d> | undefined = this.start[it];
            const endNode: Node<Point2d> | undefined = this.end[it];
            newNode = new Node(newPoint);
            if (this.isInsertBefore(startNode, newNode)) {
                const distTop =
                    Math.pow(startNode.value.x - newPoint.x, 2) + Math.pow(startNode.value.y - newPoint.y, 2);
                if (distTop === 1) {
                    const nodeCurrent = startNode;
                    this.size[it]++;
                    nodeCurrent.previous = newNode;
                    newNode.next = nodeCurrent;
                    this.start[it] = newNode;
                    return true;
                }
            } else if (!this.isInsertBefore(endNode, newNode)) {
                const distBottom =
                    Math.pow(endNode.value.x - newPoint.x, 2) + Math.pow(endNode.value.y - newPoint.y, 2);
                if (distBottom === 1) {
                    const nodeCurrent = endNode;
                    this.size[it]++;
                    nodeCurrent.next = newNode;
                    newNode.previous = nodeCurrent;
                    this.end[it] = newNode;
                    return true;
                }
            }
        }
        newNode = new Node<Point2d>(newPoint);
        this.start.push(newNode);
        this.end.push(newNode);
        this.size.push(1);
        this.lenght++;
        return true;
    }

    isInsertBefore(nodeCurrent: Node<Point2d>, newNode: Node<Point2d>): boolean {
        return this.isSwapNeeded(nodeCurrent, newNode);
    }

    isSwapNeeded(current: Node<Point2d>, newNode: Node<Point2d>): boolean {
        const currentDist =
            Math.pow(current.value.x, 2) + Math.pow(current.value.y, 2);
        const nextDist =
            Math.pow(newNode.value.x, 2) + Math.pow(newNode.value.y, 2);
        return nextDist < currentDist;
    }

    swap2(firstNode: Node<Point2d>, secondNode: Node<Point2d>): void {
        const tempoPrevious1 = firstNode.previous;
        firstNode.previous = secondNode;
        secondNode.next = firstNode;
        firstNode.next = secondNode.next;
        secondNode.previous = tempoPrevious1;
    }

    concat(): void {
        this.indexDone = new Set<number>();
        this.checkConcat_Top_Bottom(this.DISTANCE_CONCAT_2);
        this.checkConcat_Top_Top(this.DISTANCE_CONCAT_2);
        this.checkConcat_Bottom_Bottom(this.DISTANCE_CONCAT_2);
        this.checkConcat_Top_Bottom(this.DISTANCE_CONCAT_25);
        this.checkConcat_Top_Top(this.DISTANCE_CONCAT_25);
        this.checkConcat_Bottom_Bottom(this.DISTANCE_CONCAT_25);
        this.start = this.start.filter((start) => start.value.x !== CST.HAVE_TO_BE_DELETE);
        this.end = this.end.filter((end) => end.value.x !== CST.HAVE_TO_BE_DELETE);
        this.size = this.size.filter((size) => size !== 0);
    }

    private checkConcat_Top_Bottom(DISTANCE_CONCAT: number): void {
        for (let index1 = 0; index1 < this.start.length; index1++) {
            for (let index2 = 0; index2 < this.end.length; index2++) {
                if (index1 === index2 || this.indexDone.has(index1)) {
                    continue;
                } else {
                    const dist =
                        Math.pow(this.start[index1].value.x - this.end[index2].value.x, 2) +
                        Math.pow(this.start[index1].value.y - this.end[index2].value.y, 2);
                    if (dist <= DISTANCE_CONCAT) {
                        this.end[index2].next = this.start[index1];
                        this.start[index1].previous = this.end[index2];
                        this.end[index2] = this.end[index1];

                        this.end[index1] = new Node(CST.TO_DELETE);
                        this.start[index1] = new Node(CST.TO_DELETE);
                        this.size[index2] += this.size[index1];
                        this.size[index1] = 0;
                        this.indexDone.add(index1);
                    }
                }
            }
        }
    }

    private checkConcat_Top_Top(DISTANCE_CONCAT: number): void {
        for (let index1 = 0; index1 < this.start.length; index1++) {
            for (let index2 = 0; index2 < this.start.length; index2++) {
                if (index1 === index2 || this.indexDone.has(index1)) {
                    continue;
                } else {
                    const dist =
                        Math.pow(this.start[index1].value.x - this.start[index2].value.x, 2) +
                        Math.pow(this.start[index1].value.y - this.start[index2].value.y, 2);
                    if (dist <= DISTANCE_CONCAT) {
                        this.switchEndArray(index2);
                        this.start[index2].next = this.start[index1];
                        this.start[index1].previous = this.start[index2];
                        this.start[index2] = this.end[index2];
                        this.end[index2] = this.end[index1];
                        this.end[index1] = new Node(CST.TO_DELETE);
                        this.start[index1] = new Node(CST.TO_DELETE);
                        this.size[index2] += this.size[index1];
                        this.size[index1] = 0;
                        this.indexDone.add(index1);
                    }
                }
            }
        }
    }

    private checkConcat_Bottom_Bottom(DISTANCE_CONCAT: number): void {
        for (let index1 = 0; index1 < this.end.length; index1++) {
            for (let index2 = 0; index2 < this.end.length; index2++) {
                if (index1 === index2 || this.indexDone.has(index1)) {
                    continue;
                } else {
                    const dist =
                        Math.pow(this.end[index1].value.x - this.end[index2].value.x, 2) +
                        Math.pow(this.end[index1].value.y - this.end[index2].value.y, 2);
                    if (dist <= DISTANCE_CONCAT) {
                        this.switchEndArray(index1);
                        this.end[index2].next = this.end[index1];
                        this.end[index1].previous = this.end[index2];
                        this.end[index2] = this.start[index1];
                        this.end[index1] = new Node(CST.TO_DELETE);
                        this.start[index1] = new Node(CST.TO_DELETE);
                        this.size[index2] += this.size[index1];
                        this.size[index1] = 0;
                        this.indexDone.add(index1);
                    }
                }
            }
        }
    }

    switchEndArray(index: number): void {
        let nodeCurrent: Node<Point2d> | undefined;
        nodeCurrent = this.end[index];
        while (typeof (nodeCurrent) !== 'undefined') {
            const temp: Node<Point2d> | undefined = nodeCurrent.next;
            nodeCurrent.next = nodeCurrent.previous;
            nodeCurrent.previous = temp;
            nodeCurrent = nodeCurrent.next;
        }

    }

}
