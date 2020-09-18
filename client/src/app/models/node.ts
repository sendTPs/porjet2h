export class Node<T> {
    value: T;
    previous: Node<T> | undefined;
    next: Node<T> | undefined;

    constructor(value: T) {
        this.value = value;
        this.previous = undefined;
        this.next = undefined;
    }
}
