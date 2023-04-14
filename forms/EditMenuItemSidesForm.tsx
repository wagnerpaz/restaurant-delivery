import { Button, Input, Option, Select } from "@material-tailwind/react";
import classNames from "classnames";
import React, {
  cloneElement,
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
} from "react";
import { IoIosAddCircle, IoMdCloseCircle } from "react-icons/io";
import DbImage from "/components/DbImage";
import Draggable from "/components/Draggable";
import DraggableGroup from "/components/DraggableGroup";
import { insertAt, replaceAt, swap } from "/lib/immutable";
import { IIngredient } from "/models/Ingredients";
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
            <Select
              className="flex-1"
              label="Item do menu"
              value={sidesItem.menuItem?._id}
              selected={(element) =>
                element &&
                React.cloneElement(element, {
                  className: "flex items-center px-0 gap-2 pointer-events-none",
                })
              }
              onChange={(value) => {
                onSidesChange(
                  replaceAt(sides, sidesItemIndex, {
                    ...sides[sidesItemIndex],
                    menuItem: storeMenuItems.find((f) => f._id === value),
                  })
                );
              }}
            >
              {...storeMenuItems
                .filter((f) => f?.name)
                .sort((a, b) => (a.name > b.name ? 1 : -1))
                .map((menuItem) => (
                  <Option
                    key={menuItem._id}
                    value={menuItem._id}
                    className={classNames("flex flex-row items-center gap-2", {
                      hidden:
                        sides
                          .map((c) => c.menuItem?._id)
                          .includes(menuItem._id) ||
                        menuItem._id === sidesItem?.menuItem?._id,
                    })}
                  >
                    <DbImage
                      className="rounded-md"
                      id={menuItem.images?.main}
                      width={30}
                      height={30}
                    />
                    {menuItem.name}
                  </Option>
                ))}
            </Select>
          </div>
          <div className="w-full lg:w-auto flex-1 min-w-48">
            <Input
              type="number"
              label="Qtd."
              value={sidesItem.quantity}
              defaultValue={1}
              onChange={handleModifySidesProp(
                sidesItem,
                sidesItemIndex,
                "quantity",
                (e) => e.target.value
              )}
            />
          </div>
          <div className="w-full lg:w-auto flex-1 min-w-48">
            <Select
              label="Essencial"
              value={`${sidesItem.essential}`}
              onChange={handleModifySidesProp(
                sidesItem,
                sidesItemIndex,
                "essential",
                (value) => value == true
              )}
            >
              <Option key={`true`} value={`true`}>
                Sim
              </Option>
              <Option key={`false`} value={`false`}>
                Não
              </Option>
            </Select>
          </div>
          <div className="flex flex-row">
            <Button
              className="mr-2 text-light-high"
              variant="text"
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
              className="text-light-high"
              variant="text"
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
