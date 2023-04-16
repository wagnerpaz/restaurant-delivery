import mongoose from "mongoose";

import axiosInstance from "/lib/axiosInstance";
import { IStore } from "/models/Store";

const usePutStore = () => {
  const call = async (store: IStore) => {
    if (store._id) {
      const response = await axiosInstance.put(`/api/store/${id}`, store);
      return response;
    } else {
      const response = await axiosInstance.post(`/api/store`, store);
      return response;
    }
  };
  return call;
};

export default usePutStore;
