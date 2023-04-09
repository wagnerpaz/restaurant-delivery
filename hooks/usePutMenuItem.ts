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
      const response = await axiosInstance.put(
        `/api/store/${store._id}/menu-item/${menuItem._id}`,
        menuItem
      );
      return response.data;
    } else {
      const response = await axiosInstance.put(
        `/api/store/${store._id}/menu-item/section/${sectionIndex}`,
        menuItem
      );
      return response.data;
    }
  };
  return call;
};

export default usePutMenuItem;