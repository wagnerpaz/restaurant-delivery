import mongoose from "mongoose";
import { ComponentProps, useEffect, useMemo, useState } from "react";
import classNames from "classnames";
import isEqual from "lodash.isequal";
import {
  Button,
  Input,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Textarea,
} from "@chakra-ui/react";
import { Select } from "@chakra-ui/react";

import { IMenuItem, IMenuItemCompositionItem } from "/models/MenuItem";
import Fieldset from "/components/Fieldset";
import { IStore } from "/models/Store";
import { IIngredient } from "/models/Ingredients";
import MenuItem from "/components/Menu/MenuItem";
import ImageEditorModal from "/modals/ImageEditorModal";
import AddIngredientModal, {
  IIngredientSelection,
} from "/modals/AddIngredientModal";
import Modal from "/components/Modal";
import EditMenuItemCompositionForm, {
  emptyCompositionItem,
} from "/forms/EditMenuItemCompositionForm";
import EditMenuItemSidesForm, { emptySidesItem } from "./EditMenuItemSidesForm";
import FormControl from "/components/FormControl";

interface EditMenuItemModalProps extends ComponentProps<typeof Modal> {
  store: IStore;
  ingredients: IIngredient[];
  menuItem: IMenuItem;
  onMenuItemChange: (newValue?: IMenuItem, cancelled?: boolean) => void;
  onStoreChange: (newValue: IStore) => void;
  onIngredientsChange: (newValue: IIngredient[]) => void;
}

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

  const handleFillSides = () => {
    if (!edit.sides?.length) {
      setEdit({ ...edit, sides: [{ ...emptySidesItem }] });
    }
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
        <div className="flex flex-col lg:flex-row gap-4">
          <MenuItem
            className="w-full sm:!w-80"
            id={edit._id}
            name={edit.name}
            nameDetail={edit.nameDetail}
            mainImageId={edit.images?.main?.toString()}
            price={edit.price}
            hidden={edit.hidden}
            descriptionShort={edit.details?.short}
            composition={edit.composition}
            sides={edit.sides}
            index={-1}
            editable
            onClick={() => {}}
            onEditClick={() => setEditImageModalOpen(true)}
          />
          <div className="w-full lg:flex-1 flex flex-col gap-5">
            <div className="flex flex-row gap-2 mt-4">
              <FormControl className="flex-1 min-w-fit" label="Nome">
                <Input
                  value={edit.name}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      name: e.target.value,
                    } as IMenuItem)
                  }
                />
              </FormControl>
              <FormControl className="flex-1 min-w-fit" label="Detalhe">
                <Input
                  value={edit.nameDetail}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      nameDetail: e.target.value,
                    } as IMenuItem)
                  }
                />
              </FormControl>
              <FormControl className="flex-1 min-w-fit" label="Listado">
                <Select
                  className="flex-1"
                  value={`${!edit.hidden}`}
                  onChange={(value) => {
                    setEdit({
                      ...edit,
                      hidden: !!value,
                    });
                  }}
                >
                  <option value={"true"}>Sim</option>
                  <option value={"false"}>Não</option>
                </Select>
              </FormControl>
            </div>
            <FormControl className="min-w-fit" label="Preço">
              <Input
                type="number"
                value={`${edit.price}`}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    price: +e.target.value,
                  } as IMenuItem)
                }
              />
            </FormControl>
            <Fieldset className="flex flex-col gap-5 mt-2" title="Detalhes">
              <FormControl className="flex-1 min-w-fit" label="Descrição curta">
                <Input
                  value={edit.details?.short}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      details: { ...edit.details, short: e.target.value },
                    } as IMenuItem)
                  }
                />
              </FormControl>
              <FormControl className="flex-1 min-w-fit" label="Descrição longa">
                <Textarea
                  value={edit.details?.long}
                  rows={10}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      details: { ...edit.details, long: e.target.value },
                    } as IMenuItem)
                  }
                />
              </FormControl>
            </Fieldset>
          </div>
        </div>

        <Tabs>
          <TabList>
            <Tab>Ingredientes</Tab>
            <Tab>Acompanhamento</Tab>
          </TabList>
          <TabPanels>
            <TabPanel className="!px-0">
              <Fieldset className="flex flex-col gap-2">
                <div className="flex-1 flex flex-row items-center justify-between gap-4  mb-4">
                  <Button variant="outline" onClick={handleFillIngredients}>
                    Gerenciar Ingredientes
                  </Button>
                  <FormControl
                    className="min-w-[180px]"
                    label="Exibir Ingredientes"
                  >
                    <Select
                    //label="Exibir Ingredientes"
                    >
                      <option>Sim</option>
                      <option>Não</option>
                    </Select>
                  </FormControl>
                </div>
                <EditMenuItemCompositionForm
                  ingredients={ingredients}
                  composition={edit.composition}
                  onCompositionChange={(composition) =>
                    setEdit({ ...edit, composition })
                  }
                />
              </Fieldset>
            </TabPanel>
            <TabPanel className="!px-0">
              <Fieldset className="flex flex-col gap-2">
                <div>
                  <Button
                    className="mb-4"
                    variant="outline"
                    onClick={handleFillSides}
                  >
                    Gerenciar Acompanhamento
                  </Button>
                </div>
                <EditMenuItemSidesForm
                  store={store}
                  sides={edit.sides}
                  onSidesChange={(sides) => setEdit({ ...edit, sides })}
                />
              </Fieldset>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <div className="flex flex-row justify-end gap-2">
          <Button className="w-32" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            className="w-32"
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

            console.log("selected", selected);
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

export default EditMenuItemModal;
