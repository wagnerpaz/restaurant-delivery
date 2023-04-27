import mongoose from "mongoose";

import axiosInstance from "/lib/axiosInstance";
import { IUser } from "/models/User";

const usePutUser = () => {
  const call = async (user: IUser) => {
    const response = await axiosInstance.put(`/api/user`, user);
    return response.data;
  };
  return call;
};

export default usePutUser;
