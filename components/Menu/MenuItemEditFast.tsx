import { ComponentProps, memo, useMemo, useContext, useCallback } from "react";
import { Button } from "@chakra-ui/react";
import ImageWithFallback from "/components/ImageWithFallback";
import { IoMdClose } from "react-icons/io";
import { RiSave3Fill } from "react-icons/ri";
import isEqual from "lodash.isequal";

import LocalInput from "../MemoInput";
import EditableSection from "/components/EditableSection";

import { IMenuItem, ItemTypeType } from "/models/types/MenuItem";
import useLocalState from "/hooks/useLocalState";
import MemoSimpleSelect from "../MemoSimpleSelect";
import usePutMenuItem from "/hooks/usePutMenuItem";
import { StoreContext } from "../Store";
import { MenuSectionContext } from "./MenuSection";
import { IStore } from "/models/types/Store";

interface MenuItemEditFastProps extends ComponentProps<"form"> {
  menuItem: IMenuItem;
  onMenuItemChange: (newMenuItem: IMenuItem) => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const MenuItemEditFast: React.FC<MenuItemEditFastProps> = ({
  menuItem,
  onMenuItemChange,
  onEditClick,
  onDeleteClick,
}) => {
  const { store } = useContext(StoreContext);
  const { menuSection, setMenuSection } = useContext(MenuSectionContext);

  const [localMenuItem, setLocalMenuItem] = useLocalState(menuItem);

  const putMenuItem = usePutMenuItem();

  const isLocalEqualToReal = useMemo(
    () => isEqual(localMenuItem, menuItem),
    [localMenuItem, menuItem]
  );

  return (
    <form
      className="flex flex-col sm:flex-row gap-6 sm:gap-2 bg-main-100 w-full p-2 pt-5 shadow-md border border-main-a11y-low rounded-md"
      onSubmit={async (e) => {
        e.preventDefault();

        putMenuItem(store as IStore, localMenuItem, menuSection.index);
        onMenuItemChange(localMenuItem);
      }}
    >
      <EditableSection
        className="hidden sm:block w-[38px] h-[38px] min-w-[38px]"
        iconsContainerClassName="!left-2 !top-2 bg-main-100 p-1 rounded-md opacity-70"
        hideDelete
        onEditClick={onEditClick}
      >
        <ImageWithFallback
          className="w-[38px] h-[38px] min-w-[38px] object-cover border border-solid border-main-a11y-low rounded-md"
          src={menuItem.images?.main}
          width={38}
          height={38}
          alt={`${menuItem.name} hero image`}
        />
      </EditableSection>
      <MemoSimpleSelect
        className="w-full sm:w-12 min-w-fit"
        label="Tipo"
        value={localMenuItem.itemType}
        onChange={(e) =>
          setLocalMenuItem({
            ...localMenuItem,
            itemType: e.target.value as unknown as ItemTypeType,
          })
        }
      >
        <option value="product">Produto</option>
        <option value="ingredient">Ingrediente</option>
      </MemoSimpleSelect>
      <LocalInput
        className="flex-1 min-w-0"
        label="Nome"
        value={localMenuItem.name}
        onChange={(e) =>
          setLocalMenuItem({ ...localMenuItem, name: e.target.value })
        }
      />
      <LocalInput
        className="w-full sm:w-32"
        label="Detalhe"
        value={localMenuItem.nameDetail}
        onChange={(e) =>
          setLocalMenuItem({ ...localMenuItem, nameDetail: e.target.value })
        }
      />
      <LocalInput
        className="flex-1 min-w-fit"
        label="Descrição (curta)"
        value={localMenuItem.details?.short}
        onChange={(e) => {
          setLocalMenuItem({
            ...localMenuItem,
            details: { ...localMenuItem.details, short: e.target.value },
          });
        }}
      />
      <div className="flex flex-row gap-2">
        <LocalInput
          className="w-full sm:!w-16"
          label="Preço"
          type="number"
          value={localMenuItem.price || 0}
          onChange={(e) =>
            setLocalMenuItem({ ...localMenuItem, price: +e.target.value })
          }
        />
        <LocalInput
          className="w-full sm:!w-16"
          label="Promo"
          type="number"
          value={localMenuItem.pricePromotional || 0}
          onChange={(e) =>
            setLocalMenuItem({
              ...localMenuItem,
              pricePromotional: +e.target.value,
            })
          }
        />
      </div>
      <div className="flex flex-row gap-2">
        <Button
          className="w-full sm:w-auto"
          type="submit"
          size="md"
          isDisabled={isLocalEqualToReal}
        >
          <RiSave3Fill size={20} />
        </Button>
        <Button className="w-full sm:w-auto" size="md" onClick={onDeleteClick}>
          <IoMdClose size={20} />
        </Button>
      </div>
    </form>
  );
};

export default memo(MenuItemEditFast, (prevProps, nextProps) =>
  isEqual(prevProps, nextProps)
);
