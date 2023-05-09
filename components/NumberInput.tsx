import classNames from "classnames";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

import Button from "./form/Button";
import Input from "./form/Input";

const NumberInput = ({
  className = "",
  step = 1,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  value = 0,
  full = false,
  onChange = (newValue: number) => {},
}) => {
  return (
    <div
      className={classNames(
        "grid grid-cols-[max-content_1fr_max-content] gap-0",
        { "py-1": !full, "flex-1": full },
        className
      )}
    >
      <Button
        className={classNames("!rounded-r-none !px-2", {
          "!h-[30px]": !full,
          "h-full": full,
        })}
        size="sm"
        isDisabled={+value - 1 < min}
        onClick={() => onChange(+value - step)}
      >
        <AiOutlineMinus />
      </Button>
      <Input
        value={+value}
        disabled
        style={{ opacity: 1 }}
        className={classNames("!rounded-none !px-2 text-center min-w-0", {
          "!min-w-10 !w-10 !h-[30px]": !full,
          "h-full": full,
        })}
      />
      <Button
        className={classNames("!rounded-l-none !w-fit !px-2", {
          "!h-[30px]": !full,
          "h-full": full,
        })}
        size="sm"
        isDisabled={+value + 1 > max}
        onClick={() => onChange(+value + step)}
      >
        <AiOutlinePlus />
      </Button>
    </div>
  );
};

export default NumberInput;
