export function areSetsEquals(arr1: any[], arr2: any[]) {
  // Sort the arrays before comparing
  const sortedArr1 = arr1.sort();
  const sortedArr2 = arr2.sort();

  const areEqual =
    sortedArr1.length === sortedArr2.length &&
    sortedArr1.every((value, index) => value === sortedArr2[index]);

  return areEqual;
}
