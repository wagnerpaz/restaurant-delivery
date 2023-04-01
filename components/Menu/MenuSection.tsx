import { ComponentProps } from "react";
import classNames from "classnames";

interface MenuSectionProps extends ComponentProps<"section"> {
  name: string;
  length: number;
}

const MenuSection: React.FC<MenuSectionProps> = ({
  className,
  children,
  name,
  length,
  ...props
}) => {
  return (
    <>
      <form className="flex flex-row items-center px-4 h-12 sticky top-0 bg-dark-300 text-light-high mb-4">
        <div className="flex flex-row container justify-center m-auto font-bold text-xl">
          {name}
          <span className="text-light-medium font-normal ml-2">
            ({length} items)
          </span>
        </div>
      </form>
      <section
        className={classNames(
          "container m-auto grid  sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6",
          className
        )}
        {...props}
      >
        {children}
      </section>
    </>
  );
};

export default MenuSection;
