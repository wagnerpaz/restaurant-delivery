import classNames from "classnames";
import React, { ComponentProps } from "react";

interface MoneyDisplayProps extends ComponentProps<"div"> {
  oldValueClassName?: string;
  oldValue?: number;
  value?: number;
}

const MoneyDisplay: React.FC<MoneyDisplayProps> = ({
  className,
  oldValueClassName,
  oldValue,
  value = 0,
}) => {
  return (
    <div
      className={classNames(
        "flex flex-col sm:flex-row-reverse sm:justify-end sm:items-baseline gap-x-2",
        className
      )}
    >
      <span className="font-bold text-money">
        R$
        {(Math.round((value || 0) * 100) / 100).toFixed(2).replace(".", ",")}
      </span>
      {oldValue && (
        <span
          className={classNames(
            "font-bold line-through text-xs text-contrast-a11y-medium",
            oldValueClassName
          )}
        >
          R$
          {(Math.round((oldValue || 0) * 100) / 100)
            .toFixed(2)
            .replace(".", ",")}
        </span>
      )}
    </div>
  );
};

export default MoneyDisplay;
