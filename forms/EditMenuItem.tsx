import {
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import classNames from "classnames";
import { IoMdCloseCircle } from "react-icons/io";
import { IoIosAddCircle } from "react-icons/io";
import {
  Option,
  Select,
  Input,
  Button,
  Textarea,
} from "@material-tailwind/react";
import isEqual from "lodash.isequal";

import { IMenuItem, IMenuItemCompositionItem } from "/models/MenuItem";
import Fieldset from "/components/Fieldset";
import { IStore } from "/models/Store";
import { IIngredient } from "/models/Ingredients";
import MenuItem from "/components/Menu/MenuItem";
import mongoose from "mongoose";
import ImageEditorModal from "/modals/ImageEditorModal";
import AddIngredientModal, {
  IIngredientSelection,
} from "/modals/AddIngredientModal";
import { insertAt, replaceAt, swap } from "/lib/immutable";
import Draggable from "/components/Draggable";
import DraggableGroup from "/components/DraggableGroup";
import Modal from "/components/Modal";

interface EditMenuItemModalProps extends ComponentProps<typeof Modal> {
  store: IStore;
  ingredients: IIngredient[];
  menuItem: IMenuItem;
  onMenuItemChange: (newValue?: IMenuItem, cancelled?: boolean) => void;
  onStoreChange: (newValue: IStore) => void;
  onIngredientsChange: (newValue: IIngredient[]) => void;
}

const emptyCompositionItem: IMenuItemCompositionItem = {
  ingredient: { name: "" },
  quantity: 1,
  essential: false,
};

const EditMenuItemModal: React.FC<EditMenuItemModalProps> = ({
  className,
  children,
  store,
  ingredients,
  menuItem,
  open,
  onOpenChange,
  onMenuItemChange = () => {},
  onStoreChange = () => {},
  onIngredientsChange = () => {},
  ...props
}) => {
  const [edit, setEdit] = useState(menuItem);
  const [editImageModalOpen, setEditImageModalOpen] = useState(false);
  const [addIngredientModalOpen, setAddIngredientModalOpen] = useState(false);

  const addIngredientsInitialSelection = useMemo(
    () => edit.composition.map((ci) => ci.ingredient),
    [edit]
  );

  useEffect(() => {
    const compositionIndexed = menuItem.composition?.map((c, index) => ({
      ...c,
      id: `${index}`,
    }));

    setEdit({
      ...menuItem,
      composition: compositionIndexed,
    } as IMenuItem);
  }, [menuItem]);

  const onFindCompositionItem = useCallback(
    (id: string) => {
      const index = edit.composition?.findIndex((f) => f.id === id);
      return {
        compositionItem: edit.composition?.[index],
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

  const handleCancel = () => {
    function cancel() {
      setEdit(menuItem);
      onOpenChange(false);
    }

    function clearTransient(menuItem: IMenuItem) {
      menuItem.composition = menuItem.composition.map((ci) => {
        delete ci.id;
        return ci;
      });
      return menuItem;
    }

    const toCheck = clearTransient({ ...edit });

    if (!isEqual(menuItem, toCheck)) {
      const confirmed = confirm("Você tem alterações não salvas. Deseja sair?");
      if (confirmed) {
        cancel();
      }
    } else {
      cancel();
    }
  };

  const handleFillIngredients = () => {
    setAddIngredientModalOpen(true);
  };

  return (
    <Modal
      className="!z-40"
      contentClassName="container"
      open={open}
      onOpenChange={(newValue) => {
        if (!newValue) {
          handleCancel();
        } else {
          onOpenChange(newValue);
        }
      }}
    >
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
            nameDetail={edit.nameDetail}
            mainImageId={edit.images?.main?.toString()}
            price={edit.price}
            descriptionShort={edit.details?.short}
            composition={edit.composition}
            sides={edit.sides}
            index={-1}
            editable
            onClick={() => {}}
            onEditClick={() => setEditImageModalOpen(true)}
          />
          <div className="w-full lg:flex-1 flex flex-col gap-2">
            <div className="flex flex-row gap-2">
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
                label="Detalhe"
                value={edit.nameDetail}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    nameDetail: e.target.value,
                  } as IMenuItem)
                }
              />
            </div>
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
          <Button className="mb-2" onClick={handleFillIngredients}>
            Gerenciar Ingredientes
          </Button>
          <DraggableGroup className="flex flex-col gap-2">
            {edit.composition?.map((compositionItem, compositionItemIndex) => (
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
                      setEdit({
                        ...edit,
                        composition: replaceAt(
                          edit.composition,
                          compositionItemIndex,
                          {
                            ...edit.composition[compositionItemIndex],
                            ingredient: ingredients.find(
                              (f) => f._id === value
                            ),
                          }
                        ),
                      });
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
                              edit.composition
                                .map((c) => c.ingredient?._id)
                                .includes(ingredient._id) ||
                              ingredient._id ===
                                compositionItem?.ingredient?._id,
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
                    className="mr-2 text-light-high"
                    variant="text"
                    size="sm"
                    onClick={() =>
                      setEdit({
                        ...edit,
                        composition: [
                          ...edit.composition?.filter(
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
                              edit.composition?.reduce(
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
        </Fieldset>
        <div className="flex flex-row gap-2">
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            className="flex-1"
            onClick={() => {
              //remove empty ingredients
              edit.composition = edit.composition?.filter(
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
            id: edit.images?.main?.toString(),
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
          contentClassName="h-full"
          store={store}
          ingredients={ingredients}
          initialSelection={addIngredientsInitialSelection}
          open={addIngredientModalOpen}
          onOpenChange={(newValue) => setAddIngredientModalOpen(newValue)}
          portalTarget={() =>
            document.querySelector("#edit-menu-item-form") as HTMLElement
          }
          onIngredientsChange={onIngredientsChange}
          onSelectionChange={(ingredientsSelection: IIngredientSelection[]) => {
            const newComposition: IMenuItemCompositionItem[] = [];
            const selected = ingredientsSelection.filter((f) => f.selected);

            edit.composition.forEach((ci) => {
              const found = selected.find(
                (f) => f.ingredient._id === ci.ingredient?._id
              )?.ingredient;
              if (found) {
                newComposition.push(ci);
              }
            });
            selected
              .filter(
                (f) =>
                  !newComposition
                    .map((m) => m.ingredient._id)
                    .includes(f.ingredient._id)
              )
              .forEach((is) => {
                newComposition.push({
                  ...emptyCompositionItem,
                  ingredient: is.ingredient,
                });
              });

            setEdit({
              ...edit,
              composition: newComposition.map((m, index) => ({
                ...m,
                id: index,
              })),
            });
          }}
        />
      </form>
    </Modal>
  );
};

EditMenuItemModal.displayName = "EditMenuItem";

export default EditMenuItemModal;
