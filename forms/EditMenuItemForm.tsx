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
import { BsFillInfoCircleFill } from "react-icons/bs";

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
import EditMenuItemAdditionalsForm, {
  emptyAdditionalsCategory,
} from "./EditMenuItemAdditionalsForm";

interface EditMenuItemModalProps extends ComponentProps<typeof Modal> {
  store: IStore;
  ingredients: IIngredient[];
  menuItem: IMenuItem;
  onMenuItemChange: (newValue?: IMenuItem, cancelled?: boolean) => void;
  onStoreChange: (newValue: IStore, shouldSave?: boolean) => void;
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
    () =>
      edit.composition?.map((ci) => ({
        ingredient: ci.ingredient,
        price: ci.unitPrice,
      })) || [],
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

  useEffect(() => {
    const additionalsIndexed = menuItem.additionals?.map((c, index) => ({
      ...c,
      id: `${index}`,
    }));

    setEdit({
      ...menuItem,
      additionals: additionalsIndexed,
    } as IMenuItem);
  }, [menuItem]);

  useEffect(() => {
    if (menuItem.additionals?.length === 0) {
      setEdit({ ...menuItem, additionals: [{ ...emptyAdditionalsCategory }] });
    }
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
            pricePromotional={edit.pricePromotional}
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
              <FormControl className="flex-1 min-w-fit" label="Tipo">
                <Select
                  className="flex-1"
                  value={edit.itemType}
                  onChange={(e) => {
                    setEdit({
                      ...edit,
                      itemType: e.target.value,
                    });
                  }}
                >
                  <option value="product">Produto</option>
                  <option value="ingredient">Ingrediente</option>
                </Select>
              </FormControl>
            </div>
            <Fieldset className="flex flex-row gap-2" title="Preço">
              <FormControl className="min-w-0 flex-1" label="Real">
                <Input
                  type="number"
                  value={`${edit.price}`}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      price: Math.floor(+e.target.value * 100) / 100,
                    } as IMenuItem)
                  }
                />
              </FormControl>
              <FormControl className="min-w-0 flex-1" label="Promocional">
                <Input
                  type="number"
                  value={`${edit.pricePromotional}`}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      pricePromotional: +e.target.value,
                    } as IMenuItem)
                  }
                />
              </FormControl>
              <FormControl className="min-w-0 flex-1" label="Sugerido (Ingr.)">
                <Input
                  type="number"
                  value={edit.sides?.reduce(
                    (acc, curr) =>
                      acc +
                      Math.round(
                        (curr.menuItem?.price || 0) * curr.quantity * 100
                      ) /
                        100,
                    0
                  )}
                  disabled
                />
              </FormControl>
              <FormControl className="min-w-0 flex-1" label="Sugerido (Cmb.)">
                <Input
                  type="number"
                  value={edit.sides?.reduce(
                    (acc, curr) =>
                      acc +
                      Math.round(
                        (curr.menuItem?.price || 0) * curr.quantity * 100
                      ) /
                        100,
                    0
                  )}
                  disabled
                />
              </FormControl>
            </Fieldset>
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

        <Tabs isLazy>
          <TabList>
            <Tab>Ingredientes Principais</Tab>
            <Tab>Customizar</Tab>
            <Tab>Combo</Tab>
          </TabList>
          <TabPanels>
            <TabPanel className="!px-0">
              <Fieldset className="flex flex-col gap-2">
                <div className="flex-1 flex flex-row items-center justify-between gap-4  mb-4">
                  <div className="flex-1 flex flex-row items-center gap-2">
                    <BsFillInfoCircleFill
                      className="text-main-a11y-medium"
                      size={24}
                    />
                    <span className="text-xs">
                      Ingredientes servem para informar ao cliente o que contém
                      no prato. São também usados na busca e na opção de retirar
                      ingredientes do prato (ex. Não quero ervilha)
                    </span>
                  </div>
                  <FormControl
                    className="min-w-[180px]"
                    label="Exibir Ingredientes"
                  >
                    <Select>
                      <option>Sim</option>
                      <option>Não</option>
                    </Select>
                  </FormControl>
                </div>
                <EditMenuItemCompositionForm
                  store={store}
                  composition={edit.composition}
                  onCompositionChange={(composition) =>
                    setEdit({ ...edit, composition })
                  }
                />
              </Fieldset>
            </TabPanel>
            <TabPanel className="!px-0">
              <Fieldset className="flex flex-col gap-2 pt-6">
                <EditMenuItemAdditionalsForm
                  store={store}
                  menuItem={edit}
                  additionals={edit.additionals}
                  onMenuItemChange={(newMenuItem) =>
                    setEdit({ ...newMenuItem })
                  }
                  onAdditionalsChange={(additionals) =>
                    setEdit({ ...edit, additionals })
                  }
                />
              </Fieldset>
            </TabPanel>
            <TabPanel className="!px-0">
              <Fieldset className="flex flex-col gap-2">
                <div className="flex flex-row items-center mb-4">
                  <div className="flex-1 flex flex-row items-center gap-2">
                    <BsFillInfoCircleFill
                      className="text-main-a11y-medium"
                      size={24}
                    />
                    <span className="text-xs">
                      Combos servem para vender um conjunto de itens em um único
                      pacote.
                    </span>
                  </div>
                  <Button variant="outline" onClick={handleFillSides}>
                    Gerenciar Combo
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
        <div className="sticky bottom-0 flex flex-row justify-end gap-2 bg-main-100 z-20 py-3 px-4 -mx-4 translate-y-4 border-t border-hero">
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
              //remove additionals
              edit.additionals = edit.additionals?.filter(
                (f) =>
                  (f.items?.filter((f2) => f2.ingredient?.name).length || 0) > 0
              );
              //remove empty sides
              edit.sides = edit.sides?.filter((f) => f.menuItem?._id);

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
          onStoreChange={onStoreChange}
          onIngredientsChange={onIngredientsChange}
          onSelectionChange={(ingredientsSelection: IIngredientSelection[]) => {
            const newComposition: IMenuItemCompositionItem[] = [];
            const selected = ingredientsSelection.filter((f) => f.selected);

            edit.composition.forEach((ci) => {
              const found = selected.find(
                (f) => f.ingredient._id === ci.ingredient?._id
              );
              if (found) {
                newComposition.push({ ...ci, unitPrice: found.price });
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
                  unitPrice: is.price,
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
