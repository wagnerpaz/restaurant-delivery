import axiosInstance from "/lib/axiosInstance";

const useGetIngredients = () => {
  const call = async () => {
    const response = await axiosInstance.get(`/api/ingredient`);
    return response.data;
  };
  return call;
};

export default useGetIngredients;
