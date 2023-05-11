import classNames from "classnames";
import { ComponentProps, useCallback, useState, useContext } from "react";
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
import { StoreContext } from "/components/Store";

interface AddStoreModalProps extends ComponentProps<typeof Modal> {
  store?: IStore;
}

const AddStoreModal: React.FC<AddStoreModalProps> = ({
  contentClassName,
  onOpenChange,
  ...props
}) => {
  const { store, setStore } = useContext(StoreContext);

  const router = useRouter();

  const [localStore, setLocalStore] = useState({
    ...store,
    slug: router.query.storeSlug,
    locations: store.locations?.length > 0 ? store.locations : [{}],
  } as IStore);

  const [editImageModalOpen, setEditImageModalOpen] = useState(false);

  const handleLocationChange = useCallback(
    (param: ILocation | ((newLocation: ILocation) => ILocation)) => {
      const newLocation =
        typeof param === "function" ? param(localStore.locations[0]) : param;

      setLocalStore(
        (clientStore) =>
          ({ ...clientStore, locations: [newLocation] } as IStore)
      );
    },
    [localStore.locations]
  );

  return (
    <Modal
      {...props}
      contentClassName={classNames("flex flex-col container", contentClassName)}
      onOpenChange={onOpenChange}
    >
      <form className="flex flex-col gap-6 text-main-a11y-high">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <EditableSection
            iconsContainerClassName="bottom-2 sm:bottom-8 !top-auto bg-contrast-high p-2 rounded-full"
            onEditClick={() => setEditImageModalOpen(true)}
          >
            <ImageWithFallback
              className="border border-solid border-main-a11y-low rounded-lg bg-main-100"
              src={localStore.logo}
              width={200}
              height={200}
              cdn
              alt="Logo da loja"
            />
          </EditableSection>
          <div className="w-full flex-1 flex flex-col gap-6">
            <FormControl className="flex-1 w-full sm:min-w-fit" label="Nome">
              <Input
                value={localStore.name}
                autoFocus
                onChange={(e) =>
                  setLocalStore({
                    ...localStore,
                    name: e.target.value,
                  } as IStore)
                }
              />
            </FormControl>
            <FormControl className="flex-1 min-w-fit" label="URL">
              <Input value={`/store/${localStore.slug}`} disabled />
            </FormControl>
            <FormControl className="flex-1 min-w-fit" label="Listada">
              <ReactSelect
                value={{
                  value: localStore.listed,
                  label: localStore.listed ? "Sim" : "Não",
                }}
                onChange={({ value }) =>
                  setLocalStore({
                    ...localStore,
                    listed: value === "true",
                  } as IStore)
                }
                options={[
                  { value: "true", label: "Sim" },
                  { value: "false", label: "Não" },
                ]}
              ></ReactSelect>
            </FormControl>
          </div>
        </div>
        {localStore?.locations?.[0] && (
          <Fieldset className="pt-0">
            <legend>Localização</legend>
            <EditAddressForm
              location={localStore.locations?.[0]}
              onLocationChange={handleLocationChange}
            />
          </Fieldset>
        )}
        <div className="sticky bottom-0 flex flex-row items-center justify-end gap-2 bg-main-100 p-4 -mx-4 translate-y-4 z-20 border-t border-hero">
          <Button
            className="w-full sm:w-32"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            className="w-full sm:w-32 self-end"
            onClick={() => setStore(localStore)}
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
          id: localStore.logo,
        }}
        onUploadIdChange={(newMainImageId) => {
          setLocalStore({
            ...localStore,
            logo: newMainImageId,
          } as IStore);
        }}
      />
    </Modal>
  );
};

export default AddStoreModal;
