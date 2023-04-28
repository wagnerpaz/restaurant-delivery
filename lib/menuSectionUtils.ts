import { IMenuItem } from "/models/MenuItem";
import { IMenuSection } from "/models/Store";

export function retriveAllMenuItems(sections: IMenuSection[]) {
  const menuItems: IMenuItem[] = [];
  function traverseSections(sections: IMenuSection[]) {
    for (const section of sections) {
      if (section.items.length > 0) {
        menuItems.push(...section.items);
      }
      if (section.sections) {
        traverseSections(section.sections);
      }
    }
  }
  traverseSections(sections);
  //@ts-ignore
  return [...menuItems.filter((el) => el)];
}

export function findMenuItemSectionIndex(
  sections: IMenuSection[],
  menuItem: IMenuItem,
  previousIndex: number[] = []
): number[] | null {
  let index = 0;
  for (const section of sections) {
    if (section.items.findIndex((f) => f._id === menuItem._id) > 0) {
      return [...previousIndex, index];
    } else {
      const found = findMenuItemSectionIndex(section.sections, menuItem, [
        ...previousIndex,
        index,
      ]);
      if (found) {
        return found;
      }
    }
    index++;
  }
  return null;
}

export function navigateBySectionIndex(
  sections: IMenuSection[],
  sectionIndex: number[]
): IMenuSection {
  let curr = sections;
  const iterate = [...sectionIndex];
  const lastIndex = iterate.splice(-1)[0];
  for (const index of iterate) {
    curr = curr[index].sections;
  }
  return curr[lastIndex];
}

export function composeFullSectionNameByIndex(
  sections: IMenuSection[],
  indexes: number[]
): string | null {
  let curr = sections;
  const nameArray = [];
  for (const index of indexes) {
    nameArray.push(curr[index].name);
    curr = curr[index].sections;
  }

  return nameArray.join(" • ");
}

export function listAllSections(allSections: IMenuSection[]): IMenuSection[] {
  const result = [];
  for (const curr of allSections) {
    result.push(curr);
    result.push(...listAllSections(curr.sections));
  }
  return result;
}

export function listAllSectionsIndexes(
  allSections: IMenuSection[],
  previousIndex?: number[]
): number[][] {
  const result = [];
  let index = 0;
  for (const curr of allSections) {
    result.push([...(previousIndex || []), index]);
    result.push(
      ...listAllSectionsIndexes(curr.sections, [
        ...(previousIndex || []),
        index,
      ])
    );
    index++;
  }
  return result;
}
