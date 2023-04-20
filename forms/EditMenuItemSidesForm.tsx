import { Button, Input, Select as SelectSimple } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import React, { ComponentProps, useCallback, useMemo } from "react";
import { IoIosAddCircle, IoMdCloseCircle } from "react-icons/io";
import DbImage from "/components/DbImage";
import Draggable from "/components/Draggable";
import DraggableGroup from "/components/DraggableGroup";
import FormControl from "/components/FormControl";
import { insertAt, replaceAt, swap } from "/lib/immutable";
import { IMenuItem, ISidesItem } from "/models/MenuItem";
import { IMenuSection, IStore } from "/models/Store";

interface EditMenuItemSidesFormProps
  extends ComponentProps<typeof DraggableGroup> {
  store: IStore;
  sides?: ISidesItem[];
  onSidesChange: (newSides: ISidesItem[]) => void;
}

export const emptySidesItem: ISidesItem = {
  menuItem: { name: "" },
  quantity: 1,
  essential: false,
};

const EditMenuItemSidesForm: React.FC<EditMenuItemSidesFormProps> = ({
  store,
  sides = [],
  onSidesChange,
}) => {
  const storeMenuItems = useMemo(() => {
    const menuItems: IMenuItem[] = [];
    function traverseSections(sections: IMenuSection[]) {
      for (const section of sections) {
        if (section.items.length > 0) {
          menuItems.push(...section.items);
        }
        if (section.sections) {
          traverseSections(section.sections);
        }
      }
    }
    traverseSections(store.menu.sections);

    //@ts-ignore
    return [...menuItems.filter((el) => el)];
  }, [store]);

  console.log(storeMenuItems);

  const onFindSidesItem = useCallback(
    (id: string) => {
      const index = sides?.findIndex((f) => f.id === id);
      return {
        sidesItem: sides?.[index],
        index,
      };
    },
    [sides]
  );

  const onDropSidesItem = useCallback(
    (id: string, atIndex: number) => {
      const { index } = onFindSidesItem(id);
      onSidesChange(swap(sides, index, atIndex));
    },
    [sides, onFindSidesItem, onSidesChange]
  );

  const handleModifySidesProp =
    (
      sidesItem: ISidesItem,
      sidesItemIndex: number,
      key: string,
      getter: (value: any) => any
    ) =>
    (value: any) => {
      const slicedSides = [...sides];
      slicedSides.splice(sidesItemIndex, 1, {
        ...sidesItem,
        [key]: getter(value),
      });
      onSidesChange(slicedSides);
    };

  return (
    <DraggableGroup className="flex flex-col gap-2">
      {sides?.map((sidesItem, sidesItemIndex) => (
        <Draggable
          className="flex flex-col lg:flex-row gap-2 items-center"
          id={sidesItem.id}
          key={sidesItem.id}
          dragIndicator
          originalIndex={sidesItemIndex}
          onFind={onFindSidesItem}
          onDrop={onDropSidesItem}
        >
          <div className="w-full lg:w-auto flex-1">
            <FormControl className="flex-1" label="Item do menu">
              <Select
                useBasicStyles
                menuPortalTarget={document.body}
                menuPlacement="auto"
                value={{
                  value: sidesItem.menuItem?._id,
                  label: (
                    <div className="flex flex-row items-center gap-2">
                      <DbImage
                        className="rounded-md"
                        id={sidesItem.menuItem.images?.main?.toString()}
                        width={30}
                        height={30}
                        alt="acompanhamento foto"
                      />
                      {sidesItem.menuItem.name}
                    </div>
                  ),
                }}
                options={[...storeMenuItems]
                  .filter((f) => f?.name)
                  .sort((a, b) => (a.name > b.name ? 1 : -1))
                  .map((menuItem) => ({
                    value: menuItem._id,
                    label: (
                      <div className="flex flex-row items-center gap-2">
                        <DbImage
                          className="rounded-md"
                          id={menuItem.images?.main?.toString()}
                          width={30}
                          height={30}
                          alt="acompanhamento foto"
                        />
                        {menuItem.name}
                      </div>
                    ),
                  }))}
                onChange={({ value }) => {
                  onSidesChange(
                    replaceAt(sides, sidesItemIndex, {
                      ...sides[sidesItemIndex],
                      menuItem: storeMenuItems.find((f) => f._id === value),
                    })
                  );
                }}
              />
            </FormControl>
          </div>
          <FormControl className="w-24" label="Qtd.">
            <Input
              type="number"
              value={sidesItem.quantity}
              defaultValue={1}
              onChange={handleModifySidesProp(
                sidesItem,
                sidesItemIndex,
                "quantity",
                (e) => e.target.value
              )}
            />
          </FormControl>
          <FormControl className="w-24" label="Essencial">
            <SelectSimple
              value={`${sidesItem.essential}`}
              onChange={handleModifySidesProp(
                sidesItem,
                sidesItemIndex,
                "essential",
                (value) => value == true
              )}
            >
              <option key={`true`} value={`true`}>
                Sim
              </option>
              <option key={`false`} value={`false`}>
                Não
              </option>
            </SelectSimple>
          </FormControl>
          <div className="flex flex-row">
            <Button
              className="mr-2 text-contrast-high"
              size="sm"
              onClick={() =>
                onSidesChange([
                  ...sides?.filter((f, i) => i !== sidesItemIndex),
                ])
              }
            >
              <IoMdCloseCircle size={24} />
            </Button>
            <Button
              className="text-contrast-high"
              size="sm"
              onClick={() =>
                onSidesChange(
                  insertAt(sides, sidesItemIndex + 1, {
                    ...emptySidesItem,
                    id: `${
                      sides?.reduce(
                        (acc, cur) => Math.max(acc, +(cur.id || 0)),
                        0
                      ) + 1
                    }`,
                  })
                )
              }
            >
              <IoIosAddCircle className="color" size={24} />
            </Button>
          </div>
        </Draggable>
      ))}
    </DraggableGroup>
  );
};

export default EditMenuItemSidesForm;
