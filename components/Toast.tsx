import classNames from "classnames";
import React, { ReactNode } from "react";
import { useTimeout } from "/lib/hooks/useTimeout";
import { TiWarning } from "react-icons/ti";
import { BsFillXCircleFill, BsFillCheckCircleFill } from "react-icons/bs";
import { AiFillExclamationCircle } from "react-icons/ai";

export interface ToastProps {
  message: ReactNode;
  description: ReactNode;
  type?: "warning" | "error" | "info" | "success";
  onClose?: () => void;
}

const Toast: React.FC<ToastProps> = ({
  message,
  description,
  type = "info",
  onClose = () => {},
}) => {
  useTimeout(onClose, 5000);

  return (
    <div
      className={classNames(
        "fixed bottom-5 right-5 p-4 bg-gray-800 text-[#FFF] rounded-md z-50 flex flex-col justify-center gap-2",
        {
          "bg-warning": type === "warning",
          "bg-error": type === "error",
          "bg-info": type === "info",
          "bg-success": type === "success",
        }
      )}
    >
      <div className="flex flex-row items-center gap-2">
        {type === "warning" && <TiWarning size={24} />}
        {type === "error" && <BsFillXCircleFill size={24} />}
        {type === "info" && <AiFillExclamationCircle size={24} />}
        {type === "success" && <BsFillCheckCircleFill size={24} />}
        <div className="font-bold">{message}</div>
      </div>
      <div className="ml-8 text-sm">{description}</div>
    </div>
  );
};

export default Toast;
