import classNames from "classnames";
import React, { ComponentProps, useRef } from "react";
import { useDrop } from "react-dnd";

import { ACCEPT } from "./Draggable";

interface DraggableGroupContentProps extends ComponentProps<"div"> {}

const DraggableGroupContent: React.FC<DraggableGroupContentProps> = ({
  className,
  children,
}) => {
  const [, drop] = useDrop(() => ({
    accept: ACCEPT,
  }));

  return (
    <div ref={drop} className={classNames(className)}>
      {children}
    </div>
  );
};

export default DraggableGroupContent;
