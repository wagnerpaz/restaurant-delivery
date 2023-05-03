import Image from "next/image";
import { ComponentProps, useEffect, useState } from "react";

interface ImageWithFallbackProps extends ComponentProps<typeof Image> {
  fallback?: string;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  fallback = "/no-image-icon-4.png",
  alt,
  src,
  ...props
}) => {
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
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
