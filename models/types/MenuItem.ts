export type ItemTypeType = "product" | "ingredient";

export interface IMenuItem {
  store: IStore;
  name: string;
  nameDetail?: string;
  images?: {
    main?: string;
    others?: string[];
  };
  details?: {
    short?: string;
    long?: string;
  };
  price?: number;
  pricePromotional?: number;
  itemType: ItemTypeType;
  composition?: IMenuItemCompositionItem[];
  customizeType: "template" | "individual";
  customizeTemplateSectionIndex: string;
  customizeTemplateMenuItem: IMenuItem;
  additionals?: IMenuItemAdditionalsCategory[];
  sides?: ISidesItem[];
}

export interface IMenuItemCompositionItem {
  id?: string;
  section?: string;
  ingredient?: IMenuItem;
  essential?: boolean;
  quantity?: number;
}

export interface IMenuItemAdditionalsCategory {
  id?: string;
  categoryName?: string;
  min?: number;
  max?: number;
  items?: IMenuItemAdditionalsItem[];
}

export interface IMenuItemAdditionalsItem {
  id?: string;
  sectionIndex: string;
  ingredient: IMenuItem;
  min?: number;
  max?: number;
  charge?: boolean;
}

export interface ISidesItem {
  menuItem: IMenuItem;
  quantity?: number;
  essential?: boolean;
  exchanges?: IExchangesItem[];
}

export interface IExchangesItem {
  scope: "menu-section" | "menu-item";
  menuSectionIndex?: string;
  menuItem?: IMenuItem;
}
