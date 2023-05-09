import classNames from "classnames";
import React, { ComponentProps, useEffect, useState } from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { ACCEPT } from "./Draggable";

export interface DraggableGroupProps extends ComponentProps<"div"> {}

const DraggableGroup: React.FC<DraggableGroupProps> = ({
  id = "",
  ...props
}) => {
  const [context, setContext] = useState<HTMLElement>();

  useEffect(() => {
    setContext(document.getElementById(id) as HTMLElement);
  }, [id]);

  //options={{ rootElement: context }}
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
    <div ref={drop} className={classNames(className)}>
      {children}
    </div>
  );
};

export default DraggableGroup;
