import { ComponentProps, useCallback, useEffect, useState } from "react";
import classNames from "classnames";
import { IoMdCloseCircle } from "react-icons/io";
import { IoIosAddCircle } from "react-icons/io";
import { MdDragIndicator } from "react-icons/md";
import {
  Option,
  Select,
  Input,
  Button,
  Textarea,
} from "@material-tailwind/react";

import { IMenuItem, IMenuItemCompositionItem } from "/models/MenuItem";
import Fieldset from "/components/Fieldset";
import { IStore } from "/models/Store";
import { IIngredient } from "/models/Ingredients";
import MenuItem from "/components/Menu/MenuItem";
import mongoose from "mongoose";
import ImageEditorModal from "/modals/ImageEditorModal";
import AddIngredientModal from "/modals/AddIngredientModal";
import { insertAt, swap } from "/lib/immutable";
import Draggable from "/components/Draggable";
import DraggableGroup from "/components/DraggableGroup";
import usePutMenuItem from "/hooks/usePutMenuItem";

interface EditMenuItemProps extends ComponentProps<"form"> {
  store: IStore;
  ingredients: IIngredient[];
  menuItem: IMenuItem;
  onMenuItemChange: (newValue?: IMenuItem) => void;
  onStoreChange: (newValue: IStore) => void;
  onIngredientsChange: (newValue: IIngredient[]) => void;
}

const emptyCompositionItem: IMenuItemCompositionItem = {
  ingredient: { name: "" },
  quantity: 1,
  essential: false,
};

const EditMenuItem: React.FC<EditMenuItemProps> = ({
  className,
  children,
  store,
  ingredients,
  menuItem,
  onMenuItemChange = () => {},
  onStoreChange = () => {},
  onIngredientsChange = () => {},
  ...props
}) => {
  const [edit, setEdit] = useState(menuItem);
  const [editImageModalOpen, setEditImageModalOpen] = useState(false);
  const [addIngredientModalOpen, setAddIngredientModalOpen] = useState(false);

  const putMenuItem = usePutMenuItem();

  useEffect(() => {
    setEdit({
      ...menuItem,
      composition: menuItem.composition.map((c, index) => ({
        ...c,
        id: `${index}`,
      })),
    } as IMenuItem);
  }, [menuItem]);

  const onFindCompositionItem = useCallback(
    (id: string) => {
      const index = edit.composition.findIndex((f) => f.id === id);
      return {
        compositionItem: edit.composition[index],
        index,
      };
    },
    [edit.composition]
  );

  const onDropCompositionItem = useCallback(
    (id: string, atIndex: number) => {
      const { index } = onFindCompositionItem(id);
      setEdit({
        ...edit,
        composition: swap(edit.composition, index, atIndex),
      } as IMenuItem);
    },
    [edit, onFindCompositionItem]
  );

  const handleModifyCompositionProp =
    (
      compositionItem: IMenuItemCompositionItem,
      compositionItemIndex: number,
      key: string,
      getter: (value: any) => any
    ) =>
    (value: any) => {
      const slicedComposition = [...edit.composition];
      slicedComposition.splice(compositionItemIndex, 1, {
        ...compositionItem,
        [key]: getter(value),
      });
      setEdit({
        ...edit,
        composition: slicedComposition,
      } as IMenuItem);
    };

  return (
    <form
      id="edit-menu-item-form"
      className={classNames("flex flex-col gap-4", className)}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <MenuItem
          className="w-full sm:!w-80"
          id={edit._id}
          name={edit.name}
          mainImageId={edit.images?.main?.toString()}
          price={edit.price}
          composition={edit.composition}
          sides={edit.sides}
          index={-1}
          editable
          onClick={() => {}}
          onEditClick={() => setEditImageModalOpen(true)}
        />
        <div className="w-full lg:flex-1 flex flex-col gap-2">
          <Input
            label="Nome"
            value={edit.name}
            onChange={(e) =>
              setEdit({
                ...edit,
                name: e.target.value,
              } as IMenuItem)
            }
          />
          <Input
            type="number"
            label="Preço"
            value={`${edit.price}`}
            onChange={(e) =>
              setEdit({
                ...edit,
                price: +e.target.value,
              } as IMenuItem)
            }
          />
          <Fieldset className="flex flex-col gap-2 mt-2" title="Detalhes">
            <Input
              label="Descrição curta"
              value={edit.details?.short}
              onChange={(e) =>
                setEdit({
                  ...edit,
                  details: { ...edit.details, short: e.target.value },
                } as IMenuItem)
              }
            />
            <Textarea
              label="Descrição longa"
              value={edit.details?.long}
              rows={10}
              onChange={(e) =>
                setEdit({
                  ...edit,
                  details: { ...edit.details, long: e.target.value },
                } as IMenuItem)
              }
            />
          </Fieldset>
        </div>
      </div>
      <Fieldset className="flex flex-col gap-2" title="Composição">
        <DraggableGroup className="flex flex-col gap-2">
          {edit.composition.map((compositionItem, compositionItemIndex) => (
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
                  value={compositionItem.ingredient?.name}
                  onChange={handleModifyCompositionProp(
                    compositionItem,
                    compositionItemIndex,
                    "ingredient",
                    (value) =>
                      store.ingredients.find(
                        (ing) => ing.name === value
                      ) as IIngredient
                  )}
                >
                  {store.ingredients.map((ingredient) => (
                    <Option key={ingredient.name} value={ingredient.name}>
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
                  className="mr-2 text-light-high"
                  variant="text"
                  size="sm"
                  onClick={() =>
                    setEdit({
                      ...edit,
                      composition: [
                        ...edit.composition.filter(
                          (f, i) => i !== compositionItemIndex
                        ),
                      ],
                    } as IMenuItem)
                  }
                >
                  <IoMdCloseCircle size={24} />
                </Button>
                <Button
                  className="text-light-high"
                  variant="text"
                  size="sm"
                  onClick={() =>
                    setEdit({
                      ...edit,
                      composition: insertAt(
                        edit.composition,
                        compositionItemIndex + 1,
                        {
                          ...emptyCompositionItem,
                          id: `${
                            edit.composition.reduce(
                              (acc, cur) => Math.max(acc, +(cur.id || 0)),
                              0
                            ) + 1
                          }`,
                        }
                      ),
                    } as IMenuItem)
                  }
                >
                  <IoIosAddCircle className="color" size={24} />
                </Button>
              </div>
            </Draggable>
          ))}
        </DraggableGroup>
        <span className="text-sm">
          Procurou o ingrediente acima e não achou? Registre{" "}
          <span
            className="text-dark-500 font-bold cursor-pointer"
            onClick={() => setAddIngredientModalOpen(true)}
          >
            aqui
          </span>
        </span>
      </Fieldset>
      <div className="flex flex-row gap-2">
        <Button
          onClick={() => {
            onMenuItemChange();
          }}
        >
          Cancel
        </Button>
        <Button
          className="flex-1"
          onClick={() => {
            //remove empty ingredients
            edit.composition = edit.composition.filter(
              (f) => f.ingredient?.name
            );
            onMenuItemChange(edit);
          }}
        >
          Salvar
        </Button>
      </div>
      <ImageEditorModal
        open={editImageModalOpen}
        onOpenChange={(newValue) => setEditImageModalOpen(newValue)}
        upload={{
          path: "/",
          fileKey: "file",
          id: edit.images.main?.toString(),
        }}
        portalTargetEditModal={() =>
          document.querySelector("#edit-menu-item-form") as HTMLElement
        }
        onUploadIdChange={(newMainImageId) => {
          setEdit({
            ...edit,
            images: {
              ...edit.images,
              main: new mongoose.Types.ObjectId(newMainImageId),
            },
          } as IMenuItem);
        }}
      />
      <AddIngredientModal
        store={store}
        ingredients={ingredients}
        open={addIngredientModalOpen}
        onOpenChange={(newValue) => setAddIngredientModalOpen(newValue)}
        portalTarget={() =>
          document.querySelector("#edit-menu-item-form") as HTMLElement
        }
        onIngredientsChange={onIngredientsChange}
        onStoreIngredientsChange={(ingredients) => {
          onStoreChange({ ...store, ingredients } as IStore);
        }}
      />
    </form>
  );
};

EditMenuItem.displayName = "EditMenuItem";

export default EditMenuItem;
