import React, { MouseEventHandler, useContext } from "react";
import classNames from "classnames";
import { MdEdit, MdDelete } from "react-icons/md";

const EditableSection: React.FC<Props> = ({
  className,
  children,
  hideDelete,
  onEditClick,
  onDeleteClick,
}) => {
  return (
    <div className={classNames(className, "relative group min-h-0 min-w-0")}>
      {children}
      <div
        className={classNames(
          "absolute left-2 top-2 hidden group-hover:flex cursor-pointer print:group-hover:hidden flex-row gap-2"
        )}
      >
        <MdDelete
          className={classNames({ hidden: hideDelete })}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onDeleteClick?.(e);
          }}
        />
        <MdEdit
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onEditClick?.(e);
          }}
        />
      </div>
    </div>
  );
};

type Props = {
  className?: string;
  children: React.ReactNode;
  hideDelete?: boolean;
  onEditClick?: MouseEventHandler<SVGElement>;
  onDeleteClick?: MouseEventHandler<SVGElement>;
};

export default EditableSection;
