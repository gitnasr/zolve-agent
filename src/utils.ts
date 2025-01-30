export class Helper {
  static SplitArrayIntoChucks = <T>(
    array: Array<T>,
    size: number = 5
  ): Array<Array<T>> => {
    const Chunks = [];
    for (let index = 0; index < array.length; index += size) {
      let start = index;
      let stop = index + size;
      if (stop > array.length) {
        stop = array.length;
      }
      const Chunk = array.slice(start, stop);
      Chunks.push(Chunk);
    }

    return Chunks;
  };
}
