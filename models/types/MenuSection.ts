import { IMenuItem } from "./MenuItem";
import { IStore } from "./Store";

export interface IMenuSection {
  store: IStore;
  parentSection: IMenuSection;
  name: string;
  index: number[];
  editMode: "realistic" | "fast";
  retracted?: boolean;
  items: IMenuItem[];
}
