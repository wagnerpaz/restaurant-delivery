import {
  FormControl as ChakraFormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Box,
} from "@chakra-ui/react";
import classNames from "classnames";
import { ReactNode } from "react";

interface FormControlProps {
  labelClassName?: string;
  className?: string;
  children: ReactNode;
  label: string;
}

const FormControl: React.FC<FormControlProps> = ({
  labelClassName,
  className,
  children,
  label,
}) => {
  return (
    <Box className={classNames("bg-main-100 rounded-md", className)}>
      <ChakraFormControl className="text-main-a11y-high" variant="floating">
        {children}
        {/* It is important that the Label comes after the Control due to css selectors */}
        <FormLabel
          className={classNames(
            "text-main-a11y-medium !bg-[transparent]",
            labelClassName
          )}
        >
          {label}
        </FormLabel>
        {/* <FormHelperText>Keep it very short and sweet!</FormHelperText>
        <FormErrorMessage>Your First name is invalid</FormErrorMessage> */}
      </ChakraFormControl>
    </Box>
  );
};

export default FormControl;
