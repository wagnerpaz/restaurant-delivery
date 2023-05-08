import {
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { PlusCircle, MinusCircle } from "@phosphor-icons/react";
import Draggable from "/components/Draggable";
import DraggableGroup from "/components/DraggableGroup";
import { insertAt, moveTo, replaceAt, swap } from "/lib/immutable";
import { IMenuItemCompositionItem } from "/models/MenuItem";
import FormControl from "/components/FormControl";
import { IStore } from "/models/types/Store";
import { retriveAllMenuItems } from "/lib/menuSectionUtils";
import MenuItemBySectionSelector from "/components/MenuItemBySectionSelector";
import Button from "/components/form/Button";

interface EditMenuItemCompositionFormProps
  extends ComponentProps<typeof DraggableGroup> {
  store: IStore;
  composition?: IMenuItemCompositionItem[];
  onCompositionChange: (newComposition: IMenuItemCompositionItem[]) => void;
}

export const emptyCompositionItem: IMenuItemCompositionItem = {
  ingredient: { name: "" },
  quantity: 1,
  essential: true,
};

const EditMenuItemCompositionForm: React.FC<
  EditMenuItemCompositionFormProps
> = ({ store, composition, onCompositionChange }) => {
  const containerRef = useRef(null);

  const storeIngredients = useMemo(
    () =>
      retriveAllMenuItems(store.menu.sections).filter(
        (f) => f.itemType === "ingredient"
      ),
    [store]
  );

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
      onCompositionChange(moveTo(composition, index, atIndex));
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
    <div ref={containerRef}>
      <DraggableGroup className="flex flex-col gap-5">
        {[...composition, { ...emptyCompositionItem }]?.map(
          (compositionItem, compositionItemIndex) => (
            <Draggable
              className="flex flex-col lg:flex-row gap-4 items-center"
              id={compositionItem.id}
              key={compositionItem.id}
              dragIndicator
              originalIndex={compositionItemIndex}
              onFind={onFindCompositionItem}
              onDrop={onDropCompositionItem}
            >
              <MenuItemBySectionSelector
                store={store}
                menuSectionIndex={compositionItem.section}
                menuItem={compositionItem.ingredient}
                onMenuSectionChange={(newSection) => {
                  onCompositionChange(
                    replaceAt(composition, compositionItemIndex, {
                      ...compositionItem,
                      section: newSection,
                      ingredient: null,
                    })
                  );
                }}
                onMenuItemChange={handleModifyCompositionProp(
                  compositionItem,
                  compositionItemIndex,
                  "ingredient",
                  (newItem) => newItem
                )}
                menuPortalTarget={containerRef.current}
              />
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
                      ...composition?.filter(
                        (f, i) => i !== compositionItemIndex
                      ),
                    ])
                  }
                >
                  <MinusCircle size={24} weight="fill" />
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
                  <PlusCircle size={24} weight="fill" className="color" />
                </Button>
              </div>
            </Draggable>
          )
        )}
      </DraggableGroup>
    </div>
  );
};

export default EditMenuItemCompositionForm;
