import { Button, Input, Option, Select } from "@material-tailwind/react";
import classNames from "classnames";
import { ComponentProps, useCallback } from "react";
import { IoIosAddCircle, IoMdCloseCircle } from "react-icons/io";
import Draggable from "/components/Draggable";
import DraggableGroup from "/components/DraggableGroup";
import { insertAt, replaceAt, swap } from "/lib/immutable";
import { IIngredient } from "/models/Ingredients";
import { IMenuItemCompositionItem } from "/models/MenuItem";

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
    <DraggableGroup className="flex flex-col gap-2">
      {composition?.map((compositionItem, compositionItemIndex) => (
        <Draggable
          className="flex flex-col lg:flex-row gap-2 items-center"
          id={compositionItem.id}
          key={compositionItem.id}
          dragIndicator
          originalIndex={compositionItemIndex}
          onFind={onFindCompositionItem}
          onDrop={onDropCompositionItem}
        >
          <div className="w-full lg:w-auto flex-1">
            <Select
              className="flex-1"
              label="Ingrediente"
              value={compositionItem.ingredient?._id}
              onChange={(value) => {
                onCompositionChange(
                  replaceAt(composition, compositionItemIndex, {
                    ...composition[compositionItemIndex],
                    ingredient: ingredients.find((f) => f._id === value),
                  })
                );
              }}
            >
              {...ingredients
                .filter((f) => f?.name)
                .sort((a, b) => (a.name > b.name ? 1 : -1))
                .map((ingredient) => (
                  <Option
                    key={ingredient._id}
                    value={ingredient._id}
                    className={classNames({
                      hidden:
                        composition
                          .map((c) => c.ingredient?._id)
                          .includes(ingredient._id) ||
                        ingredient._id === compositionItem?.ingredient?._id,
                    })}
                  >
                    {ingredient.name}
                  </Option>
                ))}
            </Select>
          </div>
          <div className="w-full lg:w-auto flex-1 min-w-48">
            <Input
              type="number"
              label="Qtd."
              value={compositionItem.quantity}
              defaultValue={1}
              onChange={handleModifyCompositionProp(
                compositionItem,
                compositionItemIndex,
                "quantity",
                (e) => e.target.value
              )}
            />
          </div>
          <div className="w-full lg:w-auto flex-1 min-w-48">
            <Select
              label="Essencial"
              value={`${compositionItem.essential}`}
              onChange={handleModifyCompositionProp(
                compositionItem,
                compositionItemIndex,
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
              className="mr-2 text-contrast-high"
              variant="text"
              size="sm"
              onClick={() =>
                onCompositionChange([
                  ...composition?.filter((f, i) => i !== compositionItemIndex),
                ])
              }
            >
              <IoMdCloseCircle size={24} />
            </Button>
            <Button
              className="text-contrast-high"
              variant="text"
              size="sm"
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
