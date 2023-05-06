import axiosInstance from "/lib/axiosInstance";

const useGetStore = () => {
  const call = async (storeId: string) => {
    const response = await axiosInstance.get(`/api/store/${storeId}`);
    return response.data;
  };
  return call;
};

export default useGetStore;
