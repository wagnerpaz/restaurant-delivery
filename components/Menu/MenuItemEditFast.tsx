import { ComponentProps, memo, useMemo, useState, useContext } from "react";
import ImageWithFallback from "/components/ImageWithFallback";
import { IoMdClose } from "react-icons/io";
import { RiSave3Fill } from "react-icons/ri";
import isEqual from "lodash.isequal";

import MemoInput from "../MemoInput";
import EditableSection from "/components/EditableSection";

import { IMenuItem, ItemTypeType } from "/models/types/MenuItem";
import useLocalState from "/hooks/useLocalState";
import MemoReactSelect from "../MemoReactSelect";
import usePutMenuItem from "/hooks/usePutMenuItem";
import { StoreContext } from "../Store";
import { MenuSectionContext } from "./MenuSection";
import { IStore } from "/models/types/Store";
import { replaceAt } from "/lib/immutable";
import MemoButton from "/components/MemoButton";

const TYPE_OPTIONS = {
  product: "Produto",
  ingredient: "Ingrediente",
};

interface MenuItemEditFastProps extends ComponentProps<"form"> {
  menuItem: IMenuItem;
  onMenuItemChange: (newMenuItem: IMenuItem) => void;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const MenuItemEditFast: React.FC<MenuItemEditFastProps> = ({
  menuItem,
  onEditClick,
  onDeleteClick,
}) => {
  const { store } = useContext(StoreContext);
  const { menuSection, setMenuSection } = useContext(MenuSectionContext);

  const [localMenuItem, setLocalMenuItem] = useLocalState(menuItem);
  const [saving, setSaving] = useState(false);

  const putMenuItem = usePutMenuItem();

  const isLocalEqualToReal = useMemo(
    () => isEqual(localMenuItem, menuItem),
    [localMenuItem, menuItem]
  );

  const handleSubmit = async (e) => {
    console.log("will submit");
    e.preventDefault();
    setSaving(true);
    const saved = await putMenuItem(
      store as IStore,
      localMenuItem._id.startsWith("_tmp_")
        ? { ...localMenuItem, _id: undefined }
        : localMenuItem._id,
      menuSection._id
    );

    setMenuSection((menuSection) => {
      const index = menuSection.items.findIndex((f) => f._id === saved._id);
      const items =
        index >= 0
          ? replaceAt(menuSection.items, index, saved)
          : [...menuSection.items, saved];
      return { ...menuSection, items };
    });
    setSaving(false);
  };

  return (
    <form
      className="flex flex-col sm:flex-row gap-6 sm:gap-2 bg-main-100 w-full p-2 pt-5 shadow-md border border-main-a11y-low rounded-md"
      onSubmit={handleSubmit}
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
          cdn
        />
      </EditableSection>
      <MemoReactSelect
        className="w-full sm:w-36"
        disabled={saving}
        label="Tipo"
        value={{
          value: localMenuItem.itemType,
          label: TYPE_OPTIONS[localMenuItem.itemType],
        }}
        options={[
          {
            value: Object.keys(TYPE_OPTIONS)[0],
            label: Object.values(TYPE_OPTIONS)[0],
          },
          {
            value: Object.keys(TYPE_OPTIONS)[1],
            label: Object.values(TYPE_OPTIONS)[1],
          },
        ]}
        onChange={({ value }) =>
          setLocalMenuItem((localMenuItem) => ({
            ...localMenuItem,
            itemType: value as unknown as ItemTypeType,
          }))
        }
      />
      <MemoInput
        className="flex-1 min-w-0"
        isDisabled={saving}
        label="Nome"
        value={localMenuItem.name}
        onChange={(e) =>
          setLocalMenuItem((localMenuItem) => ({
            ...localMenuItem,
            name: e.target.value,
          }))
        }
      />
      <MemoInput
        className="w-full sm:w-32"
        isDisabled={saving}
        label="Detalhe"
        value={localMenuItem.nameDetail}
        onChange={(e) =>
          setLocalMenuItem((localMenuItem) => ({
            ...localMenuItem,
            nameDetail: e.target.value,
          }))
        }
      />
      <MemoInput
        className="flex-1 min-w-fit"
        isDisabled={saving}
        label="Descrição (curta)"
        value={localMenuItem.details?.short}
        onChange={(e) => {
          setLocalMenuItem((localMenuItem) => ({
            ...localMenuItem,
            details: { ...localMenuItem.details, short: e.target.value },
          }));
        }}
      />
      <div className="flex flex-row gap-2">
        <MemoInput
          className="w-full sm:!w-16"
          isDisabled={saving}
          label="Preço"
          type="number"
          value={localMenuItem.price || 0}
          onChange={(e) =>
            setLocalMenuItem((localMenuItem) => ({
              ...localMenuItem,
              price: +e.target.value,
            }))
          }
        />
        <MemoInput
          className="w-full sm:!w-16"
          isDisabled={saving}
          label="Promo"
          type="number"
          value={localMenuItem.pricePromotional || 0}
          onChange={(e) =>
            setLocalMenuItem((localMenuItem) => ({
              ...localMenuItem,
              pricePromotional: +e.target.value,
            }))
          }
        />
      </div>
      <div className="flex flex-row gap-2">
        <MemoButton
          className="!px-3"
          type="submit"
          size="sm"
          isDisabled={isLocalEqualToReal || saving}
        >
          <RiSave3Fill size={20} />
        </MemoButton>
        <MemoButton
          type="button"
          className="!px-3 h-auto"
          size="sm"
          isDisabled={saving}
          onClick={onDeleteClick}
        >
          <IoMdClose size={20} />
        </MemoButton>
      </div>
    </form>
  );
};

export default memo(MenuItemEditFast, (prevProps, nextProps) =>
  isEqual(prevProps, nextProps)
);
