import { ComponentProps, useCallback, useRef } from "react";
import { IoIosAddCircle, IoMdCloseCircle } from "react-icons/io";
import { Button, Input, Select as SimpleSelect } from "@chakra-ui/react";

import Draggable from "/components/Draggable";
import DraggableGroup from "/components/DraggableGroup";
import { insertAt, replaceAt, swap } from "/lib/immutable";
import {
  IMenuItem,
  IMenuItemAdditionalsCategory,
  IMenuItemAdditionalsItem,
} from "/models/types/MenuItem";
import { Select } from "chakra-react-select";
import FormControl from "/components/FormControl";
import Fieldset from "/components/Fieldset";
import { IStore } from "/models/types/Store";
import MoneyDisplay from "/components/MoneyDisplay";
import MenuItemBySectionSelector from "/components/MenuItemBySectionSelector";

interface EditMenuItemAdditionalsFormProps
  extends ComponentProps<typeof DraggableGroup> {
  store: IStore;
  menuItem: IMenuItem;
  additionals?: IMenuItemAdditionalsCategory[];
  onMenuItemChange: (newMenuItem: IMenuItem) => void;
  onAdditionalsChange: (newAdditionals: IMenuItemAdditionalsCategory[]) => void;
}

export const emptyAdditionalsItem: IMenuItemAdditionalsItem = {
  ingredient: undefined,
  min: 0,
  max: 1,
};

export const emptyAdditionalsCategory: IMenuItemAdditionalsCategory = {
  categoryName: "",
  min: 0,
  max: 10,
  items: [{ ...emptyAdditionalsItem }],
};

const EditMenuItemAdditionalsForm: React.FC<
  EditMenuItemAdditionalsFormProps
> = ({
  store,
  menuItem,
  additionals = [{ ...emptyAdditionalsCategory }],
  onMenuItemChange,
  onAdditionalsChange,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const onFindAdditionalsItem = useCallback(
    (id: string) => {
      const index = additionals?.findIndex((f) => f.id === id);
      return {
        additionalsItem: additionals?.[index],
        index,
      };
    },
    [additionals]
  );

  const onDropAdditionalsItem = useCallback(
    (id: string, atIndex: number) => {
      const { index } = onFindAdditionalsItem(id);
      onAdditionalsChange(swap(additionals, index, atIndex));
    },
    [additionals, onFindAdditionalsItem, onAdditionalsChange]
  );

  const handleModifyAdditionalsProp =
    (
      additionalsItem: IMenuItemAdditionalsCategory,
      additionalsItemIndex: number,
      key: string,
      getter: (value: any) => any
    ) =>
    (value: any) => {
      const slicedAdditionals = [...additionals];
      slicedAdditionals.splice(additionalsItemIndex, 1, {
        ...additionalsItem,
        [key]: getter(value),
      });
      onAdditionalsChange(slicedAdditionals);
    };

  return (
    <div ref={containerRef}>
      <Fieldset className="flex flex-row items-center gap-2 mb-6">
        <FormControl className="flex-1 min-w-fit" label="Definição">
          <SimpleSelect
            value={menuItem.customizeType}
            onChange={(e) =>
              onMenuItemChange({ ...menuItem, customizeType: e.target.value })
            }
          >
            <option value="template">Usar Modelo</option>
            <option value="individual">Usar Individual</option>
          </SimpleSelect>
        </FormControl>
        {menuItem.customizeType === "template" && (
          <MenuItemBySectionSelector
            store={store}
            menuSectionIndex={menuItem.customizeTemplateSectionIndex}
            menuItem={menuItem.customizeTemplateMenuItem}
            onMenuSectionChange={(value) =>
              onMenuItemChange({
                ...menuItem,
                customizeTemplateSectionIndex: value,
                customizeTemplateMenuItem: undefined,
              })
            }
            onMenuItemChange={(value) =>
              onMenuItemChange({
                ...menuItem,
                customizeTemplateMenuItem: value,
              })
            }
          />
        )}
      </Fieldset>
      {menuItem.customizeType === "individual" && (
        <DraggableGroup className="flex flex-col gap-5">
          {additionals?.map((additionalsCategory, additionalsCategoryIndex) => (
            <Draggable
              id={additionalsCategory.id}
              key={additionalsCategory.id}
              dragIndicator
              originalIndex={additionalsCategoryIndex}
              onFind={onFindAdditionalsItem}
              onDrop={onDropAdditionalsItem}
            >
              <Fieldset>
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                  <FormControl className="flex-1 min-w-fit" label="Categoria">
                    <Input
                      value={additionalsCategory.categoryName}
                      onChange={handleModifyAdditionalsProp(
                        additionalsCategory,
                        additionalsCategoryIndex,
                        "categoryName",
                        (e) => e.target.value
                      )}
                    />
                  </FormControl>
                  <FormControl className="w-20" label="Min.">
                    <Input
                      type="number"
                      value={`${additionalsCategory.min}`}
                      onChange={handleModifyAdditionalsProp(
                        additionalsCategory,
                        additionalsCategoryIndex,
                        "min",
                        (e) => +e.target.value
                      )}
                    />
                  </FormControl>
                  <FormControl className="w-20" label="Máx.">
                    <Input
                      type="number"
                      value={`${additionalsCategory.max}`}
                      onChange={handleModifyAdditionalsProp(
                        additionalsCategory,
                        additionalsCategoryIndex,
                        "max",
                        (e) => +e.target.value
                      )}
                    />
                  </FormControl>
                  <div className="flex flex-row">
                    <Button
                      className="mr-2 text-main-a11y-high h-full"
                      onClick={() =>
                        onAdditionalsChange([
                          ...additionals?.filter(
                            (f, i) => i !== additionalsCategoryIndex
                          ),
                        ])
                      }
                    >
                      <IoMdCloseCircle size={24} />
                    </Button>
                    <Button
                      className="text-main-a11y-high"
                      onClick={() =>
                        onAdditionalsChange(
                          insertAt(additionals, additionalsCategoryIndex + 1, {
                            ...emptyAdditionalsCategory,
                            id: `${
                              additionals?.reduce(
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
                <Fieldset className="mt-2 px-6 pt-6 flex flex-col gap-6">
                  {additionalsCategory.items?.map((item, itemIndex) => (
                    <div
                      key={item.id}
                      className="flex flex-col lg:flex-row gap-4 items-center"
                    >
                      <MenuItemBySectionSelector
                        store={store}
                        menuItem={item.ingredient}
                        menuSectionIndex={item.sectionIndex}
                        onMenuSectionChange={handleModifyAdditionalsProp(
                          additionalsCategory,
                          additionalsCategoryIndex,
                          "items",
                          (newSectionIndex) =>
                            replaceAt(
                              additionalsCategory.items || [],
                              itemIndex,
                              {
                                ...item,
                                sectionIndex: newSectionIndex,
                                ingredient: null,
                              }
                            )
                        )}
                        onMenuItemChange={handleModifyAdditionalsProp(
                          additionalsCategory,
                          additionalsCategoryIndex,
                          "items",
                          (newItem) =>
                            replaceAt(
                              additionalsCategory.items || [],
                              itemIndex,
                              {
                                ...item,
                                ingredient: newItem,
                              }
                            )
                        )}
                      />
                      <FormControl className="w-20" label="Min.">
                        <Input
                          type="number"
                          value={`${item.min}`}
                          onChange={handleModifyAdditionalsProp(
                            additionalsCategory,
                            additionalsCategoryIndex,
                            "items",
                            (e) =>
                              replaceAt(
                                additionalsCategory.items || [],
                                itemIndex,
                                {
                                  ...item,
                                  min: e.target.value,
                                }
                              )
                          )}
                        />
                      </FormControl>
                      <FormControl className="w-20" label="Máx.">
                        <Input
                          type="number"
                          value={`${item.max}`}
                          onChange={handleModifyAdditionalsProp(
                            additionalsCategory,
                            additionalsCategoryIndex,
                            "items",
                            (e) =>
                              replaceAt(
                                additionalsCategory.items || [],
                                itemIndex,
                                {
                                  ...item,
                                  max: e.target.value,
                                }
                              )
                          )}
                        />
                      </FormControl>
                      <FormControl className="w-20" label="Cobrar">
                        <SimpleSelect
                          value={`${item.charge}`}
                          onChange={handleModifyAdditionalsProp(
                            additionalsCategory,
                            additionalsCategoryIndex,
                            "items",
                            (e) =>
                              replaceAt(
                                additionalsCategory.items || [],
                                itemIndex,
                                {
                                  ...item,
                                  charge: e.target.value === "true",
                                }
                              )
                          )}
                        >
                          <option key="true" value="true">
                            Sim
                          </option>
                          <option key="false" value="false">
                            Não
                          </option>
                        </SimpleSelect>
                      </FormControl>
                      <div className="flex flex-row">
                        <Button
                          className="mr-2 text-main-a11y-high h-full"
                          onClick={handleModifyAdditionalsProp(
                            additionalsCategory,
                            additionalsCategoryIndex,
                            "items",
                            () =>
                              additionalsCategory.items?.filter(
                                (f, index) => index !== itemIndex
                              )
                          )}
                        >
                          <IoMdCloseCircle size={24} />
                        </Button>
                        <Button
                          className="text-main-a11y-high"
                          onClick={handleModifyAdditionalsProp(
                            additionalsCategory,
                            additionalsCategoryIndex,
                            "items",
                            (e) => [
                              ...additionalsCategory.items,
                              { ...emptyAdditionalsItem },
                            ]
                          )}
                        >
                          <IoIosAddCircle className="color" size={24} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </Fieldset>
              </Fieldset>
            </Draggable>
          ))}
        </DraggableGroup>
      )}
    </div>
  );
};

export default EditMenuItemAdditionalsForm;
