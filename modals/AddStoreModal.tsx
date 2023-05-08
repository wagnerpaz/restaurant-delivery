import classNames from "classnames";
import { ComponentProps, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/router";

import Button from "/components/form/Button";
import Input from "/components/form/Input";
import ReactSelect from "/components/ReactSelect";

import EditableSection from "/components/EditableSection";
import Fieldset from "/components/Fieldset";
import Modal from "/components/Modal";
import { ILocation, IStore } from "/models/types/Store";
import ImageEditorModal from "./ImageEditorModal";
import FormControl from "/components/FormControl";
import EditAddressForm from "/forms/EditAddressForm";
import ImageWithFallback from "/components/ImageWithFallback";

interface AddStoreModalProps extends ComponentProps<typeof Modal> {
  store?: IStore;
  onStoreChange: (newStore: IStore, shouldSave?: boolean) => void;
}

const AddStoreModal: React.FC<AddStoreModalProps> = ({
  contentClassName,
  store = {} as IStore,
  onOpenChange,
  onStoreChange,
  ...props
}) => {
  const router = useRouter();

  const [clientStore, setClientStore] = useState({
    ...store,
    slug: router.query.storeSlug,
    locations: store.locations?.length > 0 ? store.locations : [{}],
  } as IStore);

  const [editImageModalOpen, setEditImageModalOpen] = useState(false);

  useEffect(() => {
    if (!clientStore.locations || clientStore.locations.length === 0) {
      setClientStore({ ...clientStore, locations: [{}] });
    }
    onStoreChange(clientStore);
  }, [clientStore, onStoreChange]);

  const handleLocationChange = useCallback(
    (param: ILocation | ((newLocation: ILocation) => ILocation)) => {
      const newLocation =
        typeof param === "function" ? param(clientStore.locations[0]) : param;

      setClientStore(
        (clientStore) =>
          ({ ...clientStore, locations: [newLocation] } as IStore)
      );
    },
    []
  );

  return (
    <Modal
      {...props}
      contentClassName={classNames("flex flex-col container", contentClassName)}
      onOpenChange={onOpenChange}
    >
      <form className="flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <EditableSection
            iconsContainerClassName="bottom-2 sm:bottom-8 !top-auto bg-contrast-high p-2 rounded-full"
            onEditClick={() => setEditImageModalOpen(true)}
            // onDeleteClick={onDeleteClick}
          >
            <ImageWithFallback
              className="border border-solid border-main-a11y-low rounded-lg bg-main-100"
              src={clientStore.logo}
              width={200}
              height={200}
              cdn
            />
          </EditableSection>
          <div className="w-full flex-1 flex flex-col gap-6">
            <FormControl className="flex-1 w-full sm:min-w-fit" label="Nome">
              <Input
                value={clientStore.name}
                autoFocus
                onChange={(e) =>
                  setClientStore({
                    ...clientStore,
                    name: e.target.value,
                  } as IStore)
                }
              />
            </FormControl>
            <FormControl className="flex-1 min-w-fit" label="URL">
              <Input value={`/store/${clientStore.slug}`} disabled />
            </FormControl>
            <FormControl className="flex-1 min-w-fit" label="Listada">
              <ReactSelect
                value={`${clientStore.listed}`}
                onChange={(e) =>
                  setClientStore({
                    ...clientStore,
                    listed: e.target.value === "true",
                  } as IStore)
                }
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </ReactSelect>
            </FormControl>
          </div>
        </div>
        {clientStore?.locations?.[0] && (
          <Fieldset className="pt-0">
            <legend>Localização</legend>
            <EditAddressForm
              location={clientStore.locations?.[0]}
              onLocationChange={handleLocationChange}
            />
          </Fieldset>
        )}
        <div className="sticky bottom-0 flex flex-row justify-end gap-2 bg-main-100 p-4 -mx-4 translate-y-4 z-20 border-t border-hero">
          <Button
            className="w-full sm:w-32"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            className="w-full sm:w-32 self-end"
            onClick={() => onStoreChange(clientStore, true)}
          >
            Salvar
          </Button>
        </div>
      </form>
      <ImageEditorModal
        open={editImageModalOpen}
        onOpenChange={(newValue) => setEditImageModalOpen(newValue)}
        upload={{
          path: "/",
          fileKey: "file",
          id: clientStore.logo,
        }}
        // portalTargetEditModal={() =>
        //   document.querySelector("#edit-menu-item-form") as HTMLElement
        // }
        onUploadIdChange={(newMainImageId) => {
          setClientStore({
            ...clientStore,
            logo: newMainImageId,
          } as IStore);
        }}
      />
    </Modal>
  );
};

export default AddStoreModal;
