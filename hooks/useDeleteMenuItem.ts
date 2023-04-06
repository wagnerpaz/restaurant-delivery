import mongoose from "mongoose";

import axiosInstance from "/lib/axiosInstance";

const useDeleteMenuItem = () => {
  const call = async (storeId: string, id: mongoose.Types.ObjectId) => {
    const response = await axiosInstance.delete(
      `/api/store/${storeId}/menu-item/${id}`
    );
    return response;
  };
  return call;
};

export default useDeleteMenuItem;
