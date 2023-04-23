import { ComponentProps, useCallback } from "react";
import { IoIosAddCircle, IoMdCloseCircle } from "react-icons/io";
import Draggable from "/components/Draggable";
import DraggableGroup from "/components/DraggableGroup";
import { insertAt, replaceAt, swap } from "/lib/immutable";
import { IIngredient } from "/models/Ingredients";
import { IMenuItemCompositionItem } from "/models/MenuItem";
import { Select } from "chakra-react-select";
import { Select as SimpleSelect } from "@chakra-ui/react";
import FormControl from "/components/FormControl";
import { Button, Input } from "@chakra-ui/react";

interface EditMenuItemCompositionFormProps
  extends ComponentProps<typeof DraggableGroup> {
  ingredients: IIngredient[];
  composition?: IMenuItemCompositionItem[];
  onCompositionChange: (newComposition: IMenuItemCompositionItem[]) => void;
}

export const emptyCompositionItem: IMenuItemCompositionItem = {
  ingredient: { name: "" },
  quantity: 1,
  essential: false,
};

const EditMenuItemCompositionForm: React.FC<
  EditMenuItemCompositionFormProps
> = ({ ingredients, composition, onCompositionChange }) => {
  const onFindCompositionItem = useCallback(
    (id: string) => {
      const index = composition?.findIndex((f) => f.id === id);
      return {
        compositionItem: composition?.[index],
        index,
      };
    },
    [composition]
  );

  const onDropCompositionItem = useCallback(
    (id: string, atIndex: number) => {
      const { index } = onFindCompositionItem(id);
      onCompositionChange(swap(composition, index, atIndex));
    },
    [composition, onFindCompositionItem, onCompositionChange]
  );

  const handleModifyCompositionProp =
    (
      compositionItem: IMenuItemCompositionItem,
      compositionItemIndex: number,
      key: string,
      getter: (value: any) => any
    ) =>
    (value: any) => {
      const slicedComposition = [...composition];
      slicedComposition.splice(compositionItemIndex, 1, {
        ...compositionItem,
        [key]: getter(value),
      });
      onCompositionChange(slicedComposition);
    };

  return (
    <DraggableGroup className="flex flex-col gap-5">
      {composition?.map((compositionItem, compositionItemIndex) => (
        <Draggable
          className="flex flex-col lg:flex-row gap-4 items-center"
          id={compositionItem.id}
          key={compositionItem.id}
          dragIndicator
          originalIndex={compositionItemIndex}
          onFind={onFindCompositionItem}
          onDrop={onDropCompositionItem}
        >
          <FormControl className="flex-1 min-w-fit" label="Ingrediente">
            <Select
              useBasicStyles
              menuPortalTarget={document.body}
              menuPlacement="auto"
              value={{
                value: compositionItem.ingredient?._id,
                label: compositionItem.ingredient?.name,
              }}
              options={ingredients
                .filter((f) => f?.name)
                .sort((a, b) => (a.name > b.name ? 1 : -1))
                .filter(
                  (i) =>
                    !composition.map((c) => c.ingredient?._id).includes(i._id)
                )
                .map((m) => ({ value: m._id, label: m.name }))}
              onChange={({ value }) => {
                onCompositionChange(
                  replaceAt(composition, compositionItemIndex, {
                    ...composition[compositionItemIndex],
                    ingredient: ingredients.find((f) => f._id === value),
                  })
                );
              }}
            ></Select>
          </FormControl>
          <FormControl className="w-20" label="Qtd.">
            <Input
              type="number"
              value={compositionItem.quantity}
              defaultValue={1}
              onChange={handleModifyCompositionProp(
                compositionItem,
                compositionItemIndex,
                "quantity",
                (e) => e.target.value
              )}
            />
          </FormControl>
          <FormControl className="w-24" label="Essencial">
            <SimpleSelect
              value={`${compositionItem.essential}`}
              onChange={handleModifyCompositionProp(
                compositionItem,
                compositionItemIndex,
                "essential",
                (e) => {
                  return e.target.value === "true";
                }
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
              onClick={() =>
                onCompositionChange([
                  ...composition?.filter((f, i) => i !== compositionItemIndex),
                ])
              }
            >
              <IoMdCloseCircle size={24} />
            </Button>
            <Button
              className="text-main-a11y-high"
              onClick={() =>
                onCompositionChange(
                  insertAt(composition, compositionItemIndex + 1, {
                    ...emptyCompositionItem,
                    id: `${
                      composition?.reduce(
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

export default EditMenuItemCompositionForm;
