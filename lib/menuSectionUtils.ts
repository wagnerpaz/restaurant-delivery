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
