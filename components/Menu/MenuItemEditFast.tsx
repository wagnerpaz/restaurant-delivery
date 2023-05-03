import { Button, Select } from "@chakra-ui/react";
import cloneDeep from "lodash.clonedeep";
import isEqual from "lodash.isequal";
import ImageWithFallback from "/components/ImageWithFallback";
import { ComponentProps, memo, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { RiSave3Fill } from "react-icons/ri";

import DebouncedInput from "/components/DebouncedInput";
import EditableSection from "/components/EditableSection";

import FormControl from "/components/FormControl";
import { IMenuItem } from "/models/MenuItem";

interface MenuItemEditFastProps extends ComponentProps<"form"> {
  menuItem: IMenuItem;
  onMenuItemChange: (newMenuItem: IMenuItem) => void;
  onSaveClick: () => Promise<boolean>;
  onEditClick: () => void;
  onDeleteClick: () => void;
}

const MenuItemEditFast: React.FC<MenuItemEditFastProps> = ({
  className,
  menuItem,
  onMenuItemChange,
  onSaveClick,
  onEditClick,
  onDeleteClick,
}) => {
  const [saved, setSaved] = useState(cloneDeep(menuItem));

  return (
    <form
      className="flex flex-col sm:flex-row gap-6 sm:gap-2 bg-main-100 w-full p-2 pt-5 shadow-md border border-main-a11y-low rounded-md"
      onSubmit={async (e) => {
        e.preventDefault();

        const wasReallySaved = await onSaveClick();
        if (wasReallySaved) {
          setSaved(cloneDeep(menuItem));
        }
      }}
    >
      <EditableSection
        className="hidden sm:block"
        iconsContainerClassName="!left-2 !top-2 bg-main-100 p-1 rounded-md opacity-70"
        hideDelete
        onEditClick={onEditClick}
      >
        <ImageWithFallback
          className="border border-solid border-main-a11y-low rounded-md"
          src={menuItem.images?.main}
          width={38}
          height={38}
          alt={`${menuItem.name} hero image`}
        />
      </EditableSection>
      <FormControl className="w-full sm:w-12 min-w-fit" label="Tipo">
        <Select
          value={menuItem.itemType}
          onChange={(e) =>
            onMenuItemChange({ ...menuItem, itemType: e.target.value })
          }
        >
          <option value="product">Produto</option>
          <option value="ingredient">Ingrediente</option>
        </Select>
      </FormControl>
      <FormControl className="flex-1 min-w-fit" label="Nome">
        <DebouncedInput
          value={menuItem.name}
          onChange={(e) =>
            onMenuItemChange({ ...menuItem, name: e.target.value })
          }
        />
      </FormControl>
      <FormControl className="w-full sm:w-32" label="Detalhe">
        <DebouncedInput
          value={menuItem.nameDetail}
          onChange={(e) =>
            onMenuItemChange({ ...menuItem, nameDetail: e.target.value })
          }
        />
      </FormControl>
      <FormControl className="flex-1 min-w-fit" label="Descrição (curta)">
        <DebouncedInput
          value={menuItem.details?.short}
          onChange={(e) => {
            onMenuItemChange({
              ...menuItem,
              details: { ...menuItem.details, short: e.target.value },
            });
          }}
        />
      </FormControl>
      <div className="flex flex-row gap-2">
        <FormControl className="w-full sm:!w-16" label="Preço">
          <DebouncedInput
            type="number"
            value={`${menuItem.price || 0}`}
            onChange={(e) =>
              onMenuItemChange({ ...menuItem, price: +e.target.value })
            }
          />
        </FormControl>
        <FormControl className="w-full sm:!w-16" label="Promo">
          <DebouncedInput
            type="number"
            value={`${menuItem.pricePromotional || 0}`}
            onChange={(e) =>
              onMenuItemChange({
                ...menuItem,
                pricePromotional: +e.target.value,
              })
            }
          />
        </FormControl>
      </div>
      <div className="flex flex-row gap-2">
        <Button
          className="w-full sm:w-auto"
          type="submit"
          size="md"
          isDisabled={isEqual(saved, menuItem)}
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

export default memo(MenuItemEditFast);
