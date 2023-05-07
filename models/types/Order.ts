import { IMenuItem } from "./MenuItem";

export interface IOrder {
  removals?: IOrderItem[];
  combo?: IOrderExchange[];
  additionals?: IOrderItem[];
}

export interface IOrderItem {
  menuItem: IMenuItem;
  quantity: number;
}

export interface IOrderExchange {
  menuItem: IMenuItem;
  replacement: IMenuItem;
  quantity: number;
}
