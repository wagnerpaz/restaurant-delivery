import debounce from "lodash.debounce";
import { useCallback, useEffect, useMemo, useRef } from "react";

const useDebounce = (callback: () => void) => {
  const ref = useRef<any>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = (e) => {
      ref.current?.(e);
    };

    return debounce(func, 500);
  }, []);

  return debouncedCallback;
};

export default useDebounce;
