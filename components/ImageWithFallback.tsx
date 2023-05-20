import classNames from "classnames";
import Image from "next/image";
import { ComponentProps, useEffect, useState, SyntheticEvent } from "react";
import { MdOutlineNoPhotography } from "react-icons/md";

interface ImageWithFallbackProps
  extends Omit<ComponentProps<typeof Image>, "src"> {
  fallback?: string;
  src?: string;
  cdn?: boolean;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  fallback = "/no-image-icon-4.png",
  className,
  alt,
  src,
  cdn,
  width,
  height,
  ...props
}) => {
  const [error, setError] = useState<SyntheticEvent<HTMLImageElement, Event>>();

  useEffect(() => {
    setError(undefined);
  }, [src]);

  return error || !src ? (
    <div
      className={classNames("flex items-center justify-center", className)}
      style={{ width, height }}
    >
      <MdOutlineNoPhotography className="text-main-a11y-low" size="50px" />
    </div>
  ) : (
    <Image
      className={className}
      width={width}
      height={height}
      alt={alt}
      onError={setError}
      src={
        cdn ? `${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN_NAME}/${src}` : src
      }
      {...props}
    />
  );
};

export default ImageWithFallback;
