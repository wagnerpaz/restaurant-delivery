import classNames from "classnames";
import React, { ComponentProps } from "react";

interface MoneyDisplayProps extends ComponentProps<"div"> {
  className?: string;
  oldValueClassName?: string;
  value?: number;
  promotional?: number;
  plus?: boolean;
  debit?: boolean;
  zeroInvisible?: boolean;
}

const MoneyDisplay: React.FC<MoneyDisplayProps> = ({
  className,
  oldValueClassName,
  value = 0,
  promotional,
  plus,
  debit,
  zeroInvisible,
}) => {
  const oldValue = promotional ? value : undefined;
  const newValue = promotional ? promotional : value;

  return newValue === 0 && zeroInvisible ? null : (
    <div
      className={classNames(
        "flex flex-col sm:flex-row-reverse sm:justify-end sm:items-baseline gap-x-2",
        className
      )}
    >
      <span
        className={classNames("font-bold text-money", {
          "text-money-debit": debit,
        })}
      >
        {plus ? "+" : null}
        R$
        {(Math.round((newValue || 0) * 100) / 100).toFixed(2).replace(".", ",")}
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
