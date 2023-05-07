import { AdapterUser } from "next-auth/adapters";

import { ILocation } from "./Store";

export interface IUser extends AdapterUser {
  role: string;
  locations: ILocation[];
}
