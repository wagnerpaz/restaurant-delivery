import mongoose from "mongoose";
import {
  ComponentProps,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import classNames from "classnames";
import {
  Option,
  Select,
  Input,
  Button,
  Textarea,
  Tabs,
  TabsHeader,
  TabsBody,
  Tab,
  TabPanel,
} from "@material-tailwind/react";
import isEqual from "lodash.isequal";

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

interface EditMenuItemModalProps extends ComponentProps<typeof Modal> {
  store: IStore;
  ingredients: IIngredient[];
  menuItem: IMenuItem;
  onMenuItemChange: (newValue?: IMenuItem, cancelled?: boolean) => void;
  onStoreChange: (newValue: IStore) => void;
  onIngredientsChange: (newValue: IIngredient[]) => void;
}

const TABS = {
  COMPOSITION: "composition",
  SIDES: "sides",
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

  const [selectedTab, setSelectedTab] = useState(TABS.COMPOSITION);

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
        <div className="flex flex-col lg:flex-row items-center gap-4">
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
          <div className="w-full lg:flex-1 flex flex-col gap-2">
            <div className="flex flex-row gap-2">
              <Input
                containerProps={{ className: "!min-w-0" }}
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
                containerProps={{ className: "!min-w-0" }}
                label="Detalhe"
                value={edit.nameDetail}
                onChange={(e) =>
                  setEdit({
                    ...edit,
                    nameDetail: e.target.value,
                  } as IMenuItem)
                }
              />
              <Select
                className="flex-1"
                label="Listado"
                value={`${!edit.hidden}`}
                onChange={(value) => {
                  setEdit({
                    ...edit,
                    hidden: !!value,
                  });
                }}
              >
                <Option value={"true"}>Sim</Option>
                <Option value={"false"}>Não</Option>
              </Select>
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

        <Tabs value={selectedTab}>
          <TabsHeader>
            <Tab value={TABS.COMPOSITION}>Ingredientes</Tab>
            <Tab value={TABS.SIDES}>Acompanhamento</Tab>
          </TabsHeader>
          <TabsBody>
            <TabPanel value={TABS.COMPOSITION} className="!px-0">
              <Fieldset className="flex flex-col gap-2">
                <div className="flex-1 flex flex-row items-center gap-2">
                  <Button className="flex-1" onClick={handleFillIngredients}>
                    Gerenciar Ingredientes
                  </Button>
                  <div className="max-w-sm">
                    <Select label="Exibir Ingredientes">
                      <Option>Sim</Option>
                      <Option>Não</Option>
                    </Select>
                  </div>
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
            <TabPanel className="!px-0" value={TABS.SIDES}>
              <Fieldset className="flex flex-col gap-2">
                <Button className="flex-1" onClick={handleFillSides}>
                  Gerenciar Acompanhamento
                </Button>
                <EditMenuItemSidesForm
                  store={store}
                  sides={edit.sides}
                  onSidesChange={(sides) => setEdit({ ...edit, sides })}
                />
              </Fieldset>
            </TabPanel>
          </TabsBody>
        </Tabs>
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

export default EditMenuItemModal;
