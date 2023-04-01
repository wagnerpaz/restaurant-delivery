import { ComponentProps } from "react";
import classNames from "classnames";

interface MenuProps extends ComponentProps<"section"> {}

const Menu: React.FC<MenuProps> = ({ className, children, ...props }) => {
  return (
    <section className={classNames("", className)} {...props}>
      {children}
    </section>
  );
};

export default Menu;
