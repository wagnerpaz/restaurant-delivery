import { useContext } from "react";
import ToastContext from "/contexts/ToastContext";

const useToast = () => {
  const { open } = useContext(ToastContext);
  return open || (() => {});
};

export default useToast;
