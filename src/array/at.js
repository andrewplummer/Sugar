/**
 * Gets the element(s) at the given index.
 *
 * @param {Array} arr - The array.
 * @param {number|number[]} index - The index to return the element at.
 *   If this is an array, multiple elements will be returned.
 * @param {boolean} loop - When `true`, overshooting the end of the array will
 * begin counting from the other end. Default `false`.
 *
 * @example
 *
 *   [1,2,3].at(0)       -> 1
 *   [1,2,3].at(2)       -> 3
 *   [1,2,3].at(4)       -> undefined
 *   [1,2,3].at(4, true) -> 2
 *   [1,2,3].at(-1)      -> 3
 *   [1,2,3].at([0, 1])  -> [1, 2]
 *
 **/
export default function(arr, index, loop = false) {
  if (Array.isArray(index)) {
    return index.map((i) => {
      return getElement(arr, i, loop);
    });
  } else {
    return getElement(arr, index, loop);
  }
}

function getElement(arr, index, loop) {
  index = +index;
  if (loop) {
    index %= arr.length;
  }
  if (index < 0) {
    index += arr.length;
  }
  return arr[index];
}
