import mongoose from "mongoose";
import axiosInstance from "/lib/axiosInstance";

const usePutUpload = () => {
  const call = async (
    uploadPath: string,
    fileKey: string,
    dataUrl: string,
    id: mongoose.Types.ObjectId
  ) => {
    const blob = await (await fetch(dataUrl)).blob();
    const formData = new FormData();
    formData.append(fileKey, blob);

    return axiosInstance.put(`/api/upload${uploadPath}?id=${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };
  return call;
};

export default usePutUpload;
