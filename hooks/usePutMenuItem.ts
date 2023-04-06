import mongoose from "mongoose";

import axiosInstance from "/lib/axiosInstance";
import { IMenuItem } from "/models/MenuItem";
import { IStore } from "/models/Store";

const usePutMenuItem = () => {
  const call = async (
    store: IStore,
    menuItem: IMenuItem,
    sectionIndex?: number
  ) => {
    if (menuItem._id) {
      return await axiosInstance.put(
        `/api/store/${store._id}/menu-item/${menuItem._id}`,
        menuItem
      );
    } else {
      return await axiosInstance.put(
        `/api/store/${store._id}/menu-item/section/${sectionIndex}`,
        menuItem
      );
    }
  };
  return call;
};

export default usePutMenuItem;
