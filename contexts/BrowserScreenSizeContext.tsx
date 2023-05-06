import { createContext, useState, useEffect } from "react";

const ScreenSizeContext = createContext({
  screenSizeWidth: 0,
  setScreenSizeWidth: (value: number) => {},
  screenSizeHeight: 0,
  setScreenSizeHeight: (value: number) => {},
});

export const ScreenSizeProvider = ({
  children,
  screenSizeWidth = 1920,
  screenSizeHeight = 1080,
}) => {
  const [_screenSizeWidth, setScreenSizeWidth] = useState(screenSizeWidth);
  const [_screenSizeHeight, setScreenSizeHeight] = useState(screenSizeHeight);

  useEffect(() => {
    setScreenSizeWidth(window.innerWidth);
    setScreenSizeHeight(window.innerHeight);
  }, []);

  return (
    <ScreenSizeContext.Provider
      value={{
        screenSizeWidth: _screenSizeWidth,
        setScreenSizeWidth,
        screenSizeHeight: _screenSizeHeight,
        setScreenSizeHeight,
      }}
    >
      {children}
    </ScreenSizeContext.Provider>
  );
};

export default ScreenSizeContext;
