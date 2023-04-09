import classNames from "classnames";
import { ComponentProps, ReactNode } from "react";
import { useDrag, useDrop } from "react-dnd";
import { MdDragIndicator } from "react-icons/md";

interface DraggableProps extends ComponentProps<"div"> {
  id: string;
  originalIndex: number;
  onFind: (id: string) => { index: number };
  onDrop: (droppedId: string, originalIndex: number) => void;
  children: ReactNode;
  className?: string;
}

interface Item {
  id: string;
  originalIndex: number;
}

export const ACCEPT = "Anything";

const Draggable: React.FC<DraggableProps> = ({
  id,
  originalIndex,
  onFind = () => {
    return { index: -1 };
  },
  onDrop = () => {},
  children,
  className,
  ...props
}) => {
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ACCEPT,
      item: { id, originalIndex },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        const { id: droppedId, originalIndex } = item;
        const didDrop = monitor.didDrop();
        if (!didDrop) {
          onDrop(droppedId, originalIndex);
        }
      },
    }),
    [id, originalIndex, onDrop]
  );

  const [, drop] = useDrop(
    () => ({
      accept: ACCEPT,
      hover({ id: draggedId, originalIndex: indexFrom }: Item) {
        if (draggedId !== id) {
          const { index: overIndex } = onFind(id);
          onDrop(draggedId, overIndex);
        }
      },
    }),
    [onFind, onDrop]
  );

  return (
    <div
      ref={(node) => preview(drop(node))}
      className={classNames("flex flex-row items-center gap-2", {
        "opacity-0": isDragging,
      })}
      {...props}
    >
      <div ref={(node) => drag(node)}>
        <MdDragIndicator className="cursor-move -mx-1" size={24} />
      </div>
      <div className={classNames("flex-1", className)}>{children}</div>
    </div>
  );
};

export default Draggable;
