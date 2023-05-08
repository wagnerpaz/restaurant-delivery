import Image from "next/image";
import { ComponentProps, useEffect, useState, SyntheticEvent } from "react";

interface ImageWithFallbackProps
  extends Omit<ComponentProps<typeof Image>, "src"> {
  fallback?: string;
  src?: string;
  cdn?: boolean;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  fallback = "/no-image-icon-4.png",
  alt,
  src,
  cdn,
  ...props
}) => {
  const [error, setError] = useState<SyntheticEvent<HTMLImageElement, Event>>();

  useEffect(() => {
    setError(undefined);
  }, [src]);

  return (
    <Image
      alt={alt}
      onError={setError}
      src={
        error || !src
          ? fallback
          : cdn
          ? `${process.env.NEXT_PUBLIC_CLOUDFRONT_DOMAIN_NAME}/${src}`
          : src
      }
      {...props}
    />
  );
};

export default ImageWithFallback;
