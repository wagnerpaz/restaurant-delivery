import { ComponentProps } from "react";
import classNames from "classnames";
import Image from "next/image";

interface DbImageProps extends ComponentProps<typeof Image> {}

const DbImage: React.FC<DbImageProps> = ({
  className,
  children,
  alt,
  id,
  ...props
}) => {
  return id ? (
    <Image
      className={classNames(className)}
      alt={alt}
      {...props}
      src={`/api/download?id=${id}`}
    >
      {children}
    </Image>
  ) : (
    <Image
      className={classNames(className)}
      alt={`${alt} (no photo)`}
      {...props}
      src="/no-image-icon-4.png"
    />
  );
};

export default DbImage;