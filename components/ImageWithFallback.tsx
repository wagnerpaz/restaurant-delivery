import Image from "next/image";
import { ComponentProps, useEffect, useState, SyntheticEvent } from "react";

interface ImageWithFallbackProps
  extends Omit<ComponentProps<typeof Image>, "src"> {
  fallback?: string;
  src?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  fallback = "/no-image-icon-4.png",
  alt,
  src,
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
      src={error || !src ? fallback : src}
      {...props}
    />
  );
};

export default ImageWithFallback;
