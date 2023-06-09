import React, { ComponentProps, useCallback, useMemo, useRef } from "react";
import { IoIosAddCircle, IoMdCloseCircle } from "react-icons/io";
import { RiExchangeFill } from "react-icons/ri";

import { retriveAllMenuItems } from "/lib/menuSectionUtils";
import Draggable from "/components/Draggable";
import DraggableGroup from "/components/DraggableGroup";
import Fieldset from "/components/Fieldset";
import FormControl from "/components/FormControl";
import { insertAt, replaceAt, swap } from "/lib/immutable";
import { IExchangesItem, IMenuItem, ISidesItem } from "/models/types/MenuItem";
import { IMenuSection, IStore } from "/models/types/Store";
import ImageWithFallback from "/components/ImageWithFallback";

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

export const emptyExchangesItem: IExchangesItem = {
  scope: "menu-section",
};

const EditMenuItemSidesForm: React.FC<EditMenuItemSidesFormProps> = ({
  store,
  sides = [],
  onSidesChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const storeMenuItems = useMemo(
    () => retriveAllMenuItems(store.menu.sections),
    [store]
  );

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

  const renderMenuSectionsOptions = (
    sections: IMenuSection[] = [],
    path: IMenuSection[] = [],
    indexPath: number[] = []
  ): React.ReactNode => {
    return sections.map((section, sectionIndex) => {
      const sectionName = [path.map((p) => p.name).join(" • "), section.name]
        .filter((f) => f)
        .join(" • ");

      return (
        <>
          <option
            key={`${[...indexPath, sectionIndex]}`}
            value={`${[...indexPath, sectionIndex]}`}
          >
            {sectionName}
          </option>
          {renderMenuSectionsOptions(
            section.sections || [],
            [...path, section],
            [...indexPath, sectionIndex]
          )}
        </>
      );
    });
  };

  return (
    <div ref={containerRef}>
      <DraggableGroup className="flex flex-col gap-6">
        {sides?.map((sidesItem, sidesItemIndex) => (
          <Draggable
            className="flex flex-col gap-2"
            id={sidesItem.id}
            key={sidesItem.id}
            dragIndicator
            originalIndex={sidesItemIndex}
            onFind={onFindSidesItem}
            onDrop={onDropSidesItem}
          >
            <Fieldset className="py-6">
              <div className="flex flex-col lg:flex-row gap-2 items-center">
                <div className="w-full lg:w-auto flex-1">
                  <FormControl className="flex-1" label="Item do menu">
                    <Select
                      useBasicStyles
                      menuPortalTarget={containerRef.current}
                      classNames={{ menuPortal: () => "!z-50" }}
                      menuPosition="fixed"
                      menuPlacement="auto"
                      value={{
                        value: sidesItem.menuItem?._id,
                        label: (
                          <div className="flex flex-row items-center gap-2">
                            <ImageWithFallback
                              className="rounded-md"
                              src={sidesItem.menuItem.images?.main}
                              width={30}
                              height={30}
                              alt="menu item foto"
                              cdn
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
                              <ImageWithFallback
                                className="rounded-md"
                                src={menuItem.images?.main}
                                width={30}
                                height={30}
                                alt="menu item foto"
                                cdn
                              />
                              {menuItem.name} ({menuItem.nameDetail})
                            </div>
                          ),
                        }))}
                      onChange={({ value }) => {
                        onSidesChange(
                          replaceAt(sides, sidesItemIndex, {
                            ...sides[sidesItemIndex],
                            menuItem: storeMenuItems.find(
                              (f) => f._id === value
                            ),
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
                      onSidesChange(
                        replaceAt(sides, sidesItemIndex, {
                          ...sidesItem,
                          exchanges:
                            (sidesItem.exchanges?.length || 0) > 0
                              ? undefined
                              : [{ ...emptyExchangesItem }],
                        })
                      )
                    }
                  >
                    <RiExchangeFill size={24} />
                  </Button>
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
              </div>
              {(sidesItem.exchanges?.length || 0) > 0 && (
                <Fieldset
                  className="flex flex-col lg:flex-row gap-2 items-center"
                  title="Trocas"
                >
                  {sidesItem.exchanges?.map((ex, exchangeIndex) => (
                    <>
                      <FormControl className="w-full lg:w-48" label="">
                        <SelectSimple
                          value={ex.scope}
                          onChange={handleModifySidesProp(
                            sidesItem,
                            sidesItemIndex,
                            "exchanges",
                            (e) =>
                              replaceAt(
                                sidesItem.exchanges as IExchangesItem[],
                                exchangeIndex,
                                { ...ex, scope: e.target.value }
                              )
                          )}
                        >
                          <option value="menu-section">Seção de Menu</option>
                          <option value="menu-item">Item de Menu</option>
                        </SelectSimple>
                      </FormControl>
                      {ex.scope === "menu-section" && (
                        <FormControl
                          className="w-full lg:w-auto flex-1"
                          key={`${ex.menuSectionIndex}`}
                          label=""
                        >
                          <SelectSimple
                            value={ex.menuSectionIndex}
                            onChange={handleModifySidesProp(
                              sidesItem,
                              sidesItemIndex,
                              "exchanges",
                              (e) =>
                                replaceAt(
                                  sidesItem.exchanges as IExchangesItem[],
                                  exchangeIndex,
                                  { ...ex, menuSectionIndex: e.target.value }
                                )
                            )}
                          >
                            {renderMenuSectionsOptions(store.menu.sections)}
                          </SelectSimple>
                        </FormControl>
                      )}
                    </>
                  ))}
                </Fieldset>
              )}
            </Fieldset>
          </Draggable>
        ))}
      </DraggableGroup>
    </div>
  );
};

export default EditMenuItemSidesForm;
