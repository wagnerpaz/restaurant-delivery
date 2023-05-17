import { ComponentProps, useEffect, useContext, useState } from "react";
import classNames from "classnames";
import isEqual from "lodash.isequal";
import { BsFillInfoCircleFill } from "react-icons/bs";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { useTranslation } from "next-i18next";

import { IMenuItem } from "/models/types/MenuItem";
import Fieldset from "/components/Fieldset";
import { IStore } from "/models/types/Store";
import MenuItemRealistic from "../components/Menu/MenuItemRealistic";
import ImageEditorModal from "/modals/ImageEditorModal";
import Modal from "/components/Modal";
import EditMenuItemCompositionForm from "/forms/EditMenuItemCompositionForm";
import EditMenuItemSidesForm, {
  emptySidesItem,
} from "../forms/EditMenuItemSidesForm";
import FormControl from "/components/FormControl";
import EditMenuItemAdditionalsForm, {
  emptyAdditionalsCategory,
} from "../forms/EditMenuItemAdditionalsForm";
import Input from "/components/form/Input";
import ReactSelect from "/components/ReactSelect";
import Textarea from "/components/form/Textarea";
import Button from "/components/form/Button";
import { StoreContext } from "/components/Store";
import usePutMenuItem from "/hooks/usePutMenuItem";
import { MenuSectionContext } from "/components/Menu/MenuSection";
import defaultToastError from "/config/defaultToastError";
import { replaceAt } from "/lib/immutable";
import { TYPE_OPTIONS, TYPE_VALUES } from "/components/Menu/MenuItem";

interface EditMenuItemModalProps extends ComponentProps<typeof Modal> {
  store: IStore;
  menuItem: IMenuItem;
}

const EditMenuItemModal: React.FC<EditMenuItemModalProps> = ({
  className,
  children,
  menuItem,
  open,
  onOpenChange,
  ...props
}) => {
  const { store } = useContext(StoreContext);
  const { menuSection, setMenuSection } = useContext(MenuSectionContext);
  const { t } = useTranslation();

  const [edit, setEdit] = useState(menuItem);
  const [editImageModalOpen, setEditImageModalOpen] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  const putMenuItem = usePutMenuItem();

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
      const confirmed = confirm(t("menu.item.edit.save.changes.confirm"));
      if (confirmed) {
        cancel();
      }
    } else {
      cancel();
    }
  };

  const handleFillSides = () => {
    if (!edit.sides?.length) {
      setEdit({ ...edit, sides: [{ ...emptySidesItem }] });
    }
  };

  const handleSave = async () => {
    //remove empty ingredients
    edit.composition = edit.composition?.filter((f) => f.ingredient?.name);
    //remove additionals
    edit.additionals = edit.additionals?.filter(
      (f) => (f.items?.filter((f2) => f2.ingredient?.name).length || 0) > 0
    );
    //remove empty sides
    edit.sides = edit.sides?.filter((f) => f.menuItem?._id);

    try {
      const serverMenuItem = await putMenuItem(store, edit, menuSection._id);
      const index = menuSection.items.findIndex(
        (f) => f._id === serverMenuItem._id
      );
      console.log(index);
      setMenuSection({
        ...menuSection,
        items:
          index >= 0
            ? replaceAt(menuSection.items, index, serverMenuItem)
            : [...menuSection.items, serverMenuItem],
      });
      onOpenChange(false);
    } catch (err) {
      defaultToastError(err);
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
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <MenuItemRealistic
            className="w-full sm:!w-80"
            menuItem={edit}
            index={-1}
            editable
            onClick={() => {}}
            onEditClick={() => setEditImageModalOpen(true)}
          />
          <div className="w-full lg:flex-1 flex flex-col gap-5">
            <div className="flex flex-row gap-2 mt-4">
              <FormControl
                className="flex-1 min-w-fit"
                label={t("menu.item.name")}
              >
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
              <FormControl
                className="flex-1 min-w-fit"
                label={t("menu.item.nameDetail")}
              >
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
              <FormControl
                className="flex-1 min-w-fit"
                label={t("menu.item.type")}
              >
                <ReactSelect
                  className="flex-1"
                  value={{
                    value: edit.itemType,
                    label: TYPE_VALUES(t)[edit.itemType],
                  }}
                  options={TYPE_OPTIONS(t)}
                  onChange={({ value }) => {
                    setEdit({
                      ...edit,
                      itemType: value,
                    });
                  }}
                />
              </FormControl>
            </div>
            <Fieldset
              className="flex flex-row gap-2"
              title={t("menu.item.price")}
            >
              <FormControl
                className="min-w-0 flex-1"
                label={t("menu.item.price.real")}
              >
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
              <FormControl
                className="min-w-0 flex-1"
                label={t("menu.item.price.sale")}
              >
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
              <FormControl
                className="min-w-0 flex-1"
                label={t("menu.item.price.suggested.ingredients")}
              >
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
              <FormControl
                className="min-w-0 flex-1"
                label={t("menu.item.price.suggested.combo")}
              >
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
            <Fieldset
              className="flex flex-col gap-5 mt-2"
              title={t("menu.item.details")}
            >
              <FormControl
                className="flex-1 min-w-fit"
                label={t("menu.item.detail.short")}
              >
                <Textarea
                  rows={3}
                  value={edit.details?.short}
                  onChange={(e) =>
                    setEdit({
                      ...edit,
                      details: { ...edit.details, short: e.target.value },
                    } as IMenuItem)
                  }
                />
              </FormControl>
              <FormControl
                className="flex-1 min-w-fit"
                label={t("menu.item.detail.long")}
              >
                <Textarea
                  value={edit.details?.long}
                  rows={6}
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

        {/* <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
            <TabList>
              <Tab>Ingredientes Principais</Tab>
              <Tab>Customizar</Tab>
              <Tab>Combo</Tab>
            </TabList>
            <TabPanel className="!px-0">
              {tabIndex === 0 && (
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
                      <ReactSelect>
                        <option>Sim</option>
                        <option>Não</option>
                      </ReactSelect>
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
              )}
            </TabPanel>
            <TabPanel className="!px-0">
              {tabIndex === 1 && (
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
              )}
            </TabPanel>
            <TabPanel className="!px-0">
              {tabIndex === 3 && (
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
              )}
            </TabPanel>
          </Tabs> */}
        <div className="sticky bottom-0 flex flex-row justify-end gap-2 bg-main-100 z-20 py-3 px-4 -mx-4 translate-y-4 border-t border-hero">
          <Button
            className="w-32"
            variant="outline"
            type="button"
            onClick={handleCancel}
          >
            {t("button.cancel")}
          </Button>
          <Button className="w-32" type="submit">
            {t("button.save")}
          </Button>
        </div>
      </form>
      {editImageModalOpen && (
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
                main: newMainImageId,
              },
            } as IMenuItem);
          }}
        />
      )}
    </Modal>
  );
};

export default EditMenuItemModal;
