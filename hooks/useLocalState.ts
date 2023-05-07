import { useState, useEffect } from "react";

export default function useLocalState<T>(realValue: T) {
  const [localValue, setLocalValue] = useState<T>(realValue);

  useEffect(() => {
    setLocalValue(realValue);
  }, [realValue]);

  return [localValue, setLocalValue] as const;
}
