import { IMenuItem } from "./MenuItem";
import { IStore } from "./Store";

export interface IMenuSection {
  store: IStore;
  parentSection: IMenuSection;
  name: string;
  index: number[];
  editModeProduct: "realistic" | "fast";
  editModeIngredient: "realistic" | "fast";
  retracted?: boolean;
  items: IMenuItem[];
}
