import { ComponentProps, useCallback } from "react";
import { IoIosAddCircle, IoMdCloseCircle } from "react-icons/io";
import Draggable from "/components/Draggable";
import DraggableGroup from "/components/DraggableGroup";
import { insertAt, replaceAt, swap } from "/lib/immutable";
import { IIngredient } from "/models/Ingredients";
import {
  IMenuItemAdditionalsCategory,
  IMenuItemAdditionalsItem,
} from "/models/MenuItem";
import { Select } from "chakra-react-select";
import { Select as SimpleSelect } from "@chakra-ui/react";
import FormControl from "/components/FormControl";
import { Button, Input } from "@chakra-ui/react";
import Fieldset from "/components/Fieldset";
import Store, { IStore } from "/models/Store";
import MoneyDisplay from "/components/MoneyDisplay";

interface EditMenuItemAdditionalsFormProps
  extends ComponentProps<typeof DraggableGroup> {
  store: IStore;
  ingredients: IIngredient[];
  additionals?: IMenuItemAdditionalsCategory[];
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
  ingredients,
  additionals = [{ ...emptyAdditionalsCategory }],
  onAdditionalsChange,
}) => {
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
                <FormControl className="flex-1 min-w-fit" label="Ingrediente">
                  <Select
                    useBasicStyles
                    menuPortalTarget={document.body}
                    menuPlacement="auto"
                    value={{
                      value: item.ingredient?._id,
                      label: (
                        <span className="flex flex-row items-center justify-between flex-1">
                          {item.ingredient?.name}{" "}
                          {
                            <MoneyDisplay
                              zeroInvisible
                              plus
                              value={
                                store.ingredients.find(
                                  (f) =>
                                    f.ingredient._id === item.ingredient?._id
                                )?.price
                              }
                            />
                          }
                        </span>
                      ),
                    }}
                    options={store.ingredients
                      .filter((f) => f?.ingredient.name)
                      .sort((a, b) =>
                        a.ingredient.name > b.ingredient.name ? 1 : -1
                      )
                      .filter(
                        (i) =>
                          !additionalsCategory.items
                            ?.map((c) => c.ingredient?._id)
                            .includes(i._id)
                      )
                      .map((m) => ({
                        value: m.ingredient._id,
                        label: (
                          <span className="flex flex-row items-center justify-between flex-1">
                            {m.ingredient.name}{" "}
                            <MoneyDisplay zeroInvisible plus value={m.price} />
                          </span>
                        ),
                      }))}
                    onChange={({ value }) => {
                      onAdditionalsChange(
                        replaceAt(additionals, additionalsCategoryIndex, {
                          ...additionals[additionalsCategoryIndex],
                          items: replaceAt(
                            additionals[additionalsCategoryIndex].items,
                            itemIndex,
                            {
                              ...item,
                              ingredient: ingredients.find(
                                (f) => f._id === value
                              ),
                            }
                          ),
                        })
                      );
                    }}
                  ></Select>
                </FormControl>
                <FormControl className="w-20" label="Min.">
                  <Input
                    type="number"
                    value={`${item.min}`}
                    onChange={handleModifyAdditionalsProp(
                      additionalsCategory,
                      additionalsCategoryIndex,
                      "items",
                      (e) =>
                        replaceAt(additionalsCategory.items || [], itemIndex, {
                          ...item,
                          min: e.target.value,
                        })
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
                        replaceAt(additionalsCategory.items || [], itemIndex, {
                          ...item,
                          max: e.target.value,
                        })
                    )}
                  />
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
        </Draggable>
      ))}
    </DraggableGroup>
  );
};

export default EditMenuItemAdditionalsForm;
