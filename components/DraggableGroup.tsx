import classNames from "classnames";
import React from "react";
import { DndProvider, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import { ACCEPT } from "./Draggable";

const DraggableGroup = (props) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <ArrayFieldsControl {...props} />
    </DndProvider>
  );
};

const ArrayFieldsControl = ({ className, children }) => {
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
