import classNames from "classnames";
import React, { ComponentProps } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { ACCEPT } from "./Draggable";

interface DraggableGroupProps extends ComponentProps<"div"> {}

const DraggableGroup: React.FC<DraggableGroupProps> = (props) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <DraggableGroupContent {...props} />
    </DndProvider>
  );
};

interface DraggableGroupContentProps extends ComponentProps<"div"> {}

const DraggableGroupContent: React.FC<DraggableGroupContentProps> = ({
  className,
  children,
}) => {
  const [, drop] = useDrop(() => ({
    accept: ACCEPT,
  }));

  return (
    <div ref={drop} className={classNames("contents", className)}>
      {children}
    </div>
  );
};

export default DraggableGroup;
