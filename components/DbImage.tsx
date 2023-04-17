import { ComponentProps } from "react";
import classNames from "classnames";
import Image from "next/image";

interface DbImageProps extends ComponentProps<typeof Image> {
  id?: string;
}

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
      onError={({ currentTarget }) => {
        currentTarget.onerror = null; // prevents looping
        currentTarget.src = "/no-image-icon-4.png";
      }}
    >
      {children}
    </Image>
  ) : (
    <Image
      className={classNames("border-2 border-main-300", className)}
      alt={`${alt} (no photo)`}
      {...props}
      src="/no-image-icon-4.png"
    />
  );
};

export default DbImage;
