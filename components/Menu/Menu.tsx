import { Children, ComponentProps } from "react";
import classNames from "classnames";
import { Accordion } from "@chakra-ui/react";

interface MenuProps extends ComponentProps<"section"> {}

const Menu: React.FC<MenuProps> = ({ className, children, ...props }) => {
  return (
    <Accordion
      allowMultiple
      defaultIndex={new Array(50).fill("").map((_, index) => index)}
    >
      <section className={classNames("", className)} {...props}>
        {children}
      </section>
    </Accordion>
  );
};

export default Menu;
