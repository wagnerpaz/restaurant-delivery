import { Button } from "@chakra-ui/react";
import classNames from "classnames";
import cloneDeep from "lodash.clonedeep";
import { useRouter } from "next/router";
import { ComponentProps, useEffect, useMemo, useState } from "react";
import MenuItem from "/components/Menu/MenuItem";

import Modal from "/components/Modal";
import useDeleteMenuItemFromTrash from "/hooks/useDeleteMenuItemFromTrash";
import useGetMenuItemsTrash from "/hooks/useGetMenuItemTrash";
import usePutMenuItem from "/hooks/usePutMenuItem";
import { navigateBySectionIndex } from "/lib/menuSectionUtils";
import { IMenuItem } from "/models/MenuItem";
import { IStore } from "/models/Store";

interface EditMenuItemTrashModalProps extends ComponentProps<typeof Modal> {
  store: IStore;
}

const EditMenuItemTrashModal: React.FC<EditMenuItemTrashModalProps> = ({
  store,
  contentClassName,
  ...props
}) => {
  const router = useRouter();
  const putMenuItem = usePutMenuItem();

  const [menuItemTrash, setMenuItemTrash] = useState<IMenuItem[]>([]);

  const getMenuItemTrash = useGetMenuItemsTrash(store);
  const deleteMenuItemFromTrash = useDeleteMenuItemFromTrash(store);

  const updateList = async function () {
    setMenuItemTrash(await getMenuItemTrash());
  };

  useEffect(() => {
    updateList();
  }, []);

  return (
    <Modal
      {...props}
      contentClassName={classNames("flex flex-col container", contentClassName)}
    >
      <h2 className="sticky top-0 text-xl text-bol bg-main-200 z-20 -translate-y-4 p-4 border-b border-hero -mx-4 shadow-sm flex flex-row items-center justify-between">
        Conteúdo na Núvem
        <Button
          variant="outline"
          onClick={async () => {
            const confirmed = confirm("Excluir todos os items da lixeira?");
            if (confirmed) {
              const promises = [];
              for (const item of menuItemTrash) {
                promises.push(deleteMenuItemFromTrash(item));
              }
              await Promise.all(promises);
              updateList();
            }
          }}
          isDisabled={menuItemTrash.length === 0}
        >
          Excluir Tudo
        </Button>
      </h2>
      {menuItemTrash.length === 0 && <div>Nenhum item na lixeira</div>}
      <div className="sm:container sm:m-auto px-4 sm:px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
        {menuItemTrash.map((menuItem, menuItemIndex) => (
          <MenuItem
            key={menuItem._id}
            name={menuItem.name}
            nameDetail={menuItem.nameDetail}
            id={menuItem._id}
            mainImageId={menuItem.images?.main?.toString()}
            price={menuItem.price}
            pricePromotional={menuItem.pricePromotional}
            descriptionShort={menuItem.details?.short}
            composition={menuItem.composition}
            sides={menuItem.sides}
            index={menuItemIndex}
            editable
            onEditClick={async () => {
              await putMenuItem(
                store,
                menuItem,
                (router.query.restoreTrashForSectionIndex as string)
                  .split(",")
                  .map((m) => +m)
              );
              updateList();
            }}
            onDeleteClick={async () => {
              const confirmed = confirm(
                `Deseja excluir definitivamente o item "${menuItem.name}"?`
              );
              if (confirmed) {
                await deleteMenuItemFromTrash(menuItem);
                updateList();
              }
            }}
          />
        ))}
      </div>
    </Modal>
  );
};

export default EditMenuItemTrashModal;
