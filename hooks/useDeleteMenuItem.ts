import mongoose from "mongoose";

import axiosInstance from "/lib/axiosInstance";
import { IMenuItem } from "/models/MenuItem";
import { IStore } from "/models/Store";

const useDeleteMenuItem = () => {
  const call = async (
    store: IStore,
    sectionIndex: number[],
    menuItem: IMenuItem
  ) => {
    const response = await axiosInstance.delete(
      `/api/store/${store._id}/menu/section/${sectionIndex}/item/${menuItem._id}`
    );
    return response;
  };
  return call;
};

export default useDeleteMenuItem;
