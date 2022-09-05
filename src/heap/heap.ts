export class Heap<T> {
  list: T[];
  comparer: (x: T, y: T) => number;

  /**
   * @param {T[]} list
   * @param {(x: T, y: T) => number} comparer
   * @param {number=} length - The list element's count. If you want to discard some tail data, set this parameter; otherwise, please ignore.
   * @return {Heap}
   */
  constructor(list: T[], comparer: (x: T, y: T) => number, length?: number) {
    this.list = list;
    this.comparer = comparer;

    this.up = this.up.bind(this);
    this.down = this.down.bind(this);

    const n = length || list.length;
    for (let i = (n - 2) >> 1; i >= 0; i--) {
      this.down(i, n);
    }
  }
  /**
   * @param {number} index
   * @param {number=} length - The array element's count. If you want to discard some tail data, set this parameter; otherwise, please ignore.
   */
  down(index: number, length?: number) {
    const { list, comparer } = this;
    const n = length !== undefined ? length : list.length;

    const left = index * 2 + 1;
    const right = left + 1;

    let targetIndex = index;
    if (left < n && comparer(list[targetIndex], list[left]) > 0) targetIndex = left;
    if (right < n && comparer(list[targetIndex], list[right]) > 0) targetIndex = right;

    if (targetIndex === index) return;

    [list[targetIndex], list[index]] = [list[index], list[targetIndex]];
    this.down(targetIndex, length);
  }
  /**
   * @param {number} index
   */
  up(index: number) {
    if (index === 0) return;

    const { list, comparer } = this;

    const parentIndex = (index - 1) >> 1;
    if (comparer(list[parentIndex], list[index]) > 0) {
      [list[parentIndex], list[index]] = [list[index], list[parentIndex]];
    }

    this.up(parentIndex);
  }
}
