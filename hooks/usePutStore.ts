import mongoose from "mongoose";

import axiosInstance from "/lib/axiosInstance";
import { IStore } from "/models/Store";

const usePutStore = () => {
  const call = async (id: mongoose.Types.ObjectId, store: IStore) => {
    const response = await axiosInstance.put(`/api/store/${id}`, store);
    return response;
  };
  return call;
};

export default usePutStore;
