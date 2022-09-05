import { Heap } from './heap';

export class PriorityQueue<T> {
  list: T[];
  heap: Heap<T>;

  constructor(comparer: (x: T, y: T) => number) {
    this.list = [];
    this.heap = new Heap(this.list, comparer);

    this.size = this.size.bind(this);
    this.peek = this.peek.bind(this);
    this.poll = this.poll.bind(this);
    this.offer = this.offer.bind(this);
  }

  isEmpty(): boolean {
    return !this.list.length;
  }

  size(): number {
    return this.list.length;
  }

  peek(): T | undefined {
    if (this.list.length) {
      return this.list[0];
    } else {
      return undefined;
    }
  }

  offer(val: T): void {
    this.list.push(val);
    this.heap.up(this.list.length - 1);
  }

  poll(index: number = 0): T | undefined {
    if (index >= this.list.length) return undefined;

    if (this.list.length) {
      const res = this.list[index];

      const last = this.list.pop();
      if (this.list.length) {
        this.list[index] = last!;
        this.heap.down(index);
      }

      return res;
    } else {
      return undefined;
    }
  }
}
