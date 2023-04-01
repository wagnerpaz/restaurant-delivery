import { ComponentProps } from "react";
import classNames from "classnames";
import Image from "next/image";

interface MenuProps extends ComponentProps<typeof Image> {
  id: string;
  src?: string;
}

const DbImage: React.FC<MenuProps> = ({
  className,
  children,
  alt,
  id,
  ...props
}) => {
  return (
    <Image
      className={classNames(className)}
      alt={alt}
      {...props}
      src={`/api/download?id=${id}`}
    >
      {children}
    </Image>
  );
};

export default DbImage;
