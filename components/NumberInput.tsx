import { Button, Input } from "@chakra-ui/react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const NumberInput = ({
  step = 1,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  value = 0,
  onChange = (newValue: number) => {},
}) => {
  return (
    <div className="flex flex-row gap-0 w-fit py-1">
      <Button
        className="!rounded-r-none !w-fit !h-[30px]"
        isDisabled={+value - 1 < min}
        onClick={() => onChange(+value - step)}
      >
        <AiOutlineMinus />
      </Button>
      <Input
        value={+value}
        disabled
        style={{ opacity: 1 }}
        className="!rounded-none !h-[30px] !w-[50px]"
      />
      <Button
        isDisabled={+value + 1 > max}
        className="!rounded-l-none !w-fit !h-[30px]"
        onClick={() => onChange(+value + step)}
      >
        <AiOutlinePlus />
      </Button>
    </div>
  );
};

export default NumberInput;
