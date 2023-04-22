import { Button, HStack, Input, useNumberInput } from "@chakra-ui/react";
import { AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";

const NumberInput = ({
  step = 1,
  defaultValue = 0,
  min = Number.MIN_SAFE_INTEGER,
  max = Number.MAX_SAFE_INTEGER,
  precision = 0,
}) => {
  const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
    useNumberInput({
      step,
      defaultValue,
      min,
      max,
      precision,
    });

  const inc = getIncrementButtonProps();
  const dec = getDecrementButtonProps();
  const input = getInputProps();

  return (
    <div className="flex flex-row gap-0 w-fit pb-2">
      <Button className="!rounded-r-none !w-fit !h-[30px]" {...dec}>
        <AiOutlineMinus />
      </Button>
      <Input
        {...input}
        disabled
        style={{ opacity: 1 }}
        className="!rounded-none !h-[30px] !w-[50px]"
      />
      <Button className="!rounded-l-none !w-fit !h-[30px]" {...inc}>
        <AiOutlinePlus />
      </Button>
    </div>
  );
};

export default NumberInput;
