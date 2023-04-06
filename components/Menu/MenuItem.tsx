import { ComponentProps } from "react";
import classNames from "classnames";
import { FaShoppingCart } from "react-icons/fa";

import { IMenuItemCompositionItem, ISidesItem } from "/models/MenuItem";
import Button from "/components/Button";
import Image from "next/image";
import ImageEditorModal from "../../modals/ImageEditorModal";
import EditableSection from "../EditableSection";
import DbImage from "../DbImage";

interface MenuItemProps extends ComponentProps<"div"> {
  id: string;
  name: string;
  index: number;
  mainImageId?: string;
  price: number;
  composition?: IMenuItemCompositionItem[];
  sides?: ISidesItem[];
  editable?: boolean;
  portalTargetEditModal?: () => HTMLElement;
  onEditClick?: () => void;
  onDeleteClick?: () => void;
  onClick?: () => void;
  onUploadIdChange?: (id: string) => void;
  onMainImageChange?: (newMainImageId: string) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({
  className,
  children,
  id,
  name,
  index,
  mainImageId,
  price,
  composition,
  sides,
  editable = false,
  portalTargetEditModal,
  onEditClick,
  onDeleteClick,
  onClick,
  onUploadIdChange = () => {},
  onMainImageChange = () => {},
  ...props
}) => {
  return (
    <EditableSection
      iconsContainerClassName="bg-light-high p-2 rounded-full"
      hideEdit={!editable}
      hideDelete={!editable}
      onEditClick={onEditClick}
      onDeleteClick={onDeleteClick}
    >
      <div
        className={classNames(
          "flex flex-col h-full relative rounded-bl-2xl rounded-br-2xl rounded-tl-2xl overflow-hidden shadow-md text-dark-500 bg-light-high border-light-high border-4 group cursor-pointer z-0",
          className
        )}
        {...props}
        onClick={onClick}
      >
        <div className="absolute top-0 right-0 bg-light-high p-2 rounded-bl-2xl z-10">
          <span className="font-bold text-[#036704]">R${price}</span>
        </div>
        <DbImage
          className="bg-dark-200"
          id={mainImageId}
          width={99999}
          height={99999}
          alt={`${name} hero image`}
        />
        <div className="flex-1 relative bottom-0 w-full p-4 mb-14 flex flex-col bg-light-high -translate-y-6 group-hover:-translate-y-12 rounded-tl-2xl rounded-tr-2xl">
          <div className="flex flex-row justify-between">
            <h3 className="text-md font-bold">{name}</h3>
          </div>

          <div className="relative flex-1 pb-2">
            <ul className="text-xs pt-2 opacity-60">
              {composition
                ?.map((compositionItem) =>
                  compositionItem.ingredient ? (
                    <li
                      className="inline"
                      key={compositionItem.ingredient.name}
                    >
                      {compositionItem.quantity &&
                      compositionItem.quantity !== 1
                        ? `${compositionItem.quantity}x `
                        : ""}
                      {compositionItem.ingredient.name}
                    </li>
                  ) : null
                )
                .flatMap((item) => [item, ", "])
                .slice(0, -1)}
            </ul>
            {sides?.length ? (
              <ul className="text-sm mt-1">
                <span>Acompanha: </span>
                {sides
                  ?.map((side) => (
                    <li className="inline" key={side.menuItem.name}>
                      {side.menuItem.name}
                    </li>
                  ))
                  .flatMap((item) => [item, ", "])
                  .slice(0, -1)}
              </ul>
            ) : null}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="text-[darkblue]">Mais detalhes</span>
          <Button
            className="w-full mt-2 flex flex-row gap-2 items-center justify-center"
            variant="contained"
          >
            <FaShoppingCart className="text-xl" />
            Adicionar
          </Button>
        </div>
      </div>
    </EditableSection>
  );
};

export default MenuItem;
