import classNames from "classnames";
import { useSession } from "next-auth/react";
import { CSSProperties, ReactNode } from "react";
import { useDrag, useDrop } from "react-dnd";
import { MdDragIndicator } from "react-icons/md";
import { IUser } from "/models/types/User";

export interface DraggableProps {
  id: string;
  originalIndex: number;
  dragIndicator?: boolean;
  disabled?: boolean;
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
  disabled,
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
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const admin = (session?.user as IUser)?.role === "admin";

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      canDrag: admin,
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
    [admin, id, originalIndex, onDrop]
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
          <div className="relative">
            <div ref={(node) => drag(node)}>
              <MdDragIndicator
                className={classNames("cursor-move -mx-1", {
                  "opacity-30": disabled,
                })}
                size={24}
              />
            </div>
            <div
              className={classNames({
                "absolute inset-0 cursor-not-allowed": disabled,
              })}
            />
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
