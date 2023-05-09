import { IMenuSection } from "./MenuSection";

export interface IStore extends Document {
  active?: boolean;
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
