import classNames from "classnames";
import { CSSProperties, ReactNode } from "react";
import { useDrag, useDrop } from "react-dnd";
import { MdDragIndicator } from "react-icons/md";

export interface DraggableProps {
  id: string;
  originalIndex: number;
  dragIndicator?: boolean;
  onFind: (id: string) => { index: number };
  onDrop: (droppedId: string, originalIndex: number) => void;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  style?: CSSProperties;
}

interface Item {
  id: string;
  originalIndex: number;
}

export const ACCEPT = "Anything";

const Draggable: React.FC<DraggableProps> = ({
  id,
  originalIndex,
  dragIndicator,
  onFind = () => {
    return { index: -1 };
  },
  onDrop = () => {},
  children,
  className,
  containerClassName,
  style,
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
      style={style}
      className={classNames(
        {
          "flex flex-row items-center gap-2": dragIndicator,
        },
        containerClassName,
        {
          "opacity-0": isDragging,
        }
      )}
      {...props}
    >
      {dragIndicator && (
        <>
          <div ref={(node) => drag(node)}>
            <MdDragIndicator className="cursor-move -mx-1" size={24} />
          </div>
          <div className={classNames("flex-1", className)}>{children}</div>
        </>
      )}
      {!dragIndicator && (
        <div ref={(node) => drag(node)} className={containerClassName}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Draggable;
