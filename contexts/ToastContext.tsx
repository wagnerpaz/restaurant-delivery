import React, { useState, useMemo, ReactNode, createContext } from "react";
import { createPortal } from "react-dom";
import { v4 as uuidv4 } from "uuid";
import Toast, { ToastProps } from "/components/Toast";

interface ToastProviderProps {
  children: ReactNode;
}

const ToastContext = createContext({});

export const ToastProvider: React.FC<ToastProviderProps> = ({
  portalTarget,
  children,
}) => {
  const [toasts, setToasts] = useState<
    { id: string; message: ReactNode; description: ReactNode }[]
  >([]);
  const open = (content: ToastProps) =>
    setToasts((currentToasts) => [
      ...currentToasts,
      { id: uuidv4(), ...content },
    ]);

  const close = (id: string) =>
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    );

  const contextValue = useMemo(() => ({ open }), []);

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {portalTarget &&
        createPortal(
          <div className="toasts-wrapper">
            {toasts.map((toast) => (
              <Toast
                key={toast.id}
                {...toast}
                onClose={() => close(toast.id)}
              />
            ))}
          </div>,
          portalTarget
        )}
    </ToastContext.Provider>
  );
};

export default ToastContext;
