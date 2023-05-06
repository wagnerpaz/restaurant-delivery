import { IMenuItem } from "./MenuItem";

export interface IStore extends Document {
  name: string;
  logo?: string;
  slug: string;
  listed: boolean;
  locations: ILocation[];
  menu: {
    sections: IMenuSection[];
  };
  theme: { colors: { hero: string } };
}

export interface IMenuSection {
  name: string;
  index: number[];
  editMode: "realistic" | "fast";
  retracted?: boolean;
  items: IMenuItem[];
  sections: IMenuSection[];
}

export interface ILocation {
  address: string;
  address2: string;
  number: string;
  neighborhood: string;
  state: string;
  city: string;
  postalCode: string;
  main?: boolean;
}
