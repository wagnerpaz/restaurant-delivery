import axios from "redaxios";

const axiosInstance = axios.create({
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
  },
});

export default axiosInstance;
