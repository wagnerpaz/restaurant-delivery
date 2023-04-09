export function replaceAt(array: any[], index: number, element: any) {
  return [...array.slice(0, index), element, ...array.slice(index + 1)];
}

export function insertAt(array: any[], index: number, element: any) {
  return [...array.slice(0, index), element, ...array.slice(index)];
}

export function swap(array: any[], index1: number, index2: number) {
  const result = [...array];
  [result[index1], result[index2]] = [result[index2], result[index1]];
  console.log(array, index1, index2, result);
  return result;
}
