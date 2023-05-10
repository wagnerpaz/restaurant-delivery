export function replaceAt(array: any[], index: number, element: any) {
  if (index < 0) {
    return [...array];
  }
  return [...array.slice(0, index), element, ...array.slice(index + 1)];
}

export function insertAt(array: any[], index: number, element: any) {
  return [...array.slice(0, index), element, ...array.slice(index)];
}

export function removeAt(array: any[], index: number) {
  return array.slice(0, index).concat(array.slice(index + 1));
}

export function moveTo(array: any[], fromIndex: number, toIndex: number) {
  const newArray = [...array];
  const element = newArray[fromIndex];
  newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, element);
  return newArray;
}

export function swap(array: any[], index1: number, index2: number) {
  const result = [...array];
  [result[index1], result[index2]] = [result[index2], result[index1]];
  return result;
}
