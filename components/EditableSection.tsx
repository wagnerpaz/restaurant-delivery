import React, { MouseEventHandler, useContext } from "react";
import classNames from "classnames";
import { MdEdit, MdDelete } from "react-icons/md";

const EditableSection: React.FC<Props> = ({
  className,
  iconsContainerClassName,
  children,
  hideEdit,
  hideDelete,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <div className={classNames("relative group min-h-0 min-w-0", className)}>
      {children}
      {(!hideEdit || !hideDelete) && (
        <div
          className={classNames(
            "absolute left-1 sm:left-2 top-1 sm:top-2 flex sm:hidden group-hover:flex cursor-pointer print:group-hover:hidden flex-row gap-2",
            iconsContainerClassName
          )}
        >
          <MdEdit
            className={classNames("z-20", { hidden: hideEdit })}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onEditClick?.(e);
            }}
          />
          <MdDelete
            className={classNames("z-20", { hidden: hideDelete })}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDeleteClick?.(e);
            }}
          />
        </div>
      )}
    </div>
  );
};

type Props = {
  className?: string;
  iconsContainerClassName?: string;
  children: React.ReactNode;
  hideEdit?: boolean;
  hideDelete?: boolean;
  onEditClick?: MouseEventHandler<SVGElement>;
  onDeleteClick?: MouseEventHandler<SVGElement>;
};

export default EditableSection;
