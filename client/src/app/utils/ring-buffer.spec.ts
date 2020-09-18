import { RingBuffer } from './ring-buffer';

describe('Utility-RingBuffer', () => {
    const len = 64;
    let mock: RingBuffer<number> = new RingBuffer<number>(0);

    beforeEach(() => {
        mock = new RingBuffer<number>(len);
    });

    it('should construct correctly', () => {
        expect(mock.index).toEqual(0);
        expect(mock.len).toEqual(len);
        expect(mock.arr.length).toEqual(len);
    });

    it('should overflow correctly', () => {
        // Filling up the buffer
        for (let i = 0; i < len; ++i) {
            mock.add(i);
        }
        // Let's rewrite everything .. in reverse
        for (let i = len - 1; i >= 0; --i) {
            mock.add(i);
        }
        // Now let's assert
        for (let i = 0; i < len; ++i) {
            expect(mock.arr[i]).toEqual(len - i - 1);
        }
    });

    it('should memset to the correct value', () => {
        const setTo = Math.random();
        mock.memSet(setTo);
        mock.arr.forEach((value: number) => expect(value).toEqual(setTo));
    });
});
