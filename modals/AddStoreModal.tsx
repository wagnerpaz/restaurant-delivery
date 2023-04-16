import { Button, Input, Option } from "@material-tailwind/react";
import classNames from "classnames";
import { ComponentProps, useEffect, useState } from "react";
import DbImage from "/components/DbImage";
import EditableSection from "/components/EditableSection";
import Fieldset from "/components/Fieldset";

import Select from "/components/Select";
import Modal from "/components/Modal";
import useGetBrasilCep from "/hooks/useGetBrasilCep";
import useGetBrasilCities from "/hooks/useGetBrasilCities";
import useGetBrasilStates from "/hooks/useGetBrasilStates";
import applyCepMask from "/lib/cepMask";
import isValidBRPostalCode from "/lib/isValidBrPostalCode";
import { IStore } from "/models/Store";
import { useRouter } from "next/router";
import ImageEditorModal from "./ImageEditorModal";
import mongoose from "mongoose";

interface AddStoreModalProps extends ComponentProps<typeof Modal> {
  store?: IStore;
  onStoreChange: (newStore: IStore, shouldSave?: boolean) => void;
}

const AddStoreModal: React.FC<AddStoreModalProps> = ({
  contentClassName,
  store = {} as IStore,
  onStoreChange,
  ...props
}) => {
  const router = useRouter();

  const [clientStore, setClientStore] = useState({
    ...store,
    slug: router.query.storeSlug,
    locations: [{}],
  } as IStore);
  const [brasilStates, setBrasilStates] = useState([]);
  const [brasilCities, setBrasilCities] = useState([]);
  const [editImageModalOpen, setEditImageModalOpen] = useState(false);

  const getBrasilCep = useGetBrasilCep();
  const getBrasilStates = useGetBrasilStates();
  const getBrasilCities = useGetBrasilCities();

  useEffect(() => {
    async function exec() {
      setBrasilStates(await getBrasilStates());
    }
    exec();
  }, [getBrasilStates]);

  const state = clientStore.locations?.[0]?.state;

  useEffect(() => {
    async function exec() {
      console.log("will set cities");
      setBrasilCities(
        await getBrasilCities(brasilStates.find((f) => f.sigla === state)?.id)
      );
    }
    exec();
  }, [brasilStates, state, getBrasilCities]);

  useEffect(() => {
    if (!clientStore.locations || clientStore.locations.length === 0) {
      setClientStore({ ...clientStore, locations: [{}] });
    }
    onStoreChange(clientStore);
  }, [clientStore, onStoreChange]);

  const postalCode = clientStore.locations?.[0]?.postalCode;

  useEffect(() => {
    async function exec() {
      if (isValidBRPostalCode(postalCode)) {
        const serviceLocation = await getBrasilCep(postalCode);
        setClientStore(
          (clientStore) =>
            ({
              ...clientStore,
              locations: [
                {
                  ...clientStore.locations[0],
                  ...serviceLocation,
                  postalCode: postalCode,
                },
              ],
            } as IStore)
        );
      }
    }
    exec();
  }, [postalCode, getBrasilCep]);

  return (
    <Modal
      {...props}
      contentClassName={classNames(
        "!overflow-visible flex flex-col container",
        contentClassName
      )}
    >
      <form className="flex flex-col gap-2">
        <div className="flex flex-row gap-2 items-center">
          <EditableSection
            iconsContainerClassName="bottom-2 sm:bottom-8 !top-auto bg-contrast-high p-2 rounded-full"
            onEditClick={() => setEditImageModalOpen(true)}
            // onDeleteClick={onDeleteClick}
          >
            <DbImage id={clientStore.logo} width={200} height={200} />
          </EditableSection>
          <div className="flex-1 flex flex-col gap-2">
            <Input
              label="Nome"
              value={clientStore.name}
              onChange={(e) =>
                setClientStore({
                  ...clientStore,
                  name: e.target.value,
                } as IStore)
              }
            />
            <Input label="URL" value={`/store/${clientStore.slug}`} disabled />
          </div>
        </div>
        {clientStore?.locations?.[0] && (
          <Fieldset className="flex flex-col gap-2">
            <legend>Localização</legend>

            <Input
              label="CEP"
              value={clientStore.locations[0].postalCode}
              onChange={async (e) => {
                const newCep = applyCepMask(e);
                setClientStore({
                  ...clientStore,
                  locations: [
                    {
                      ...clientStore.locations[0],
                      postalCode: newCep,
                    },
                  ],
                } as IStore);
              }}
            />
            <div className="flex flex-row gap-2">
              <Select
                label="Estado"
                value={clientStore.locations[0].state}
                onChange={(e) => {
                  console.log(e);
                  setClientStore({
                    ...clientStore,
                    locations: [
                      { ...clientStore.locations[0], state: e.target.value },
                    ],
                  } as IStore);
                }}
              >
                <option></option>
                {brasilStates.map((state) => (
                  <option
                    className="text-main-a11y-high"
                    key={state.id}
                    value={state.sigla}
                  >
                    {state.sigla}
                  </option>
                ))}
              </Select>

              <Select
                label="Cidade"
                value={clientStore.locations[0].city}
                onChange={(e) => {
                  console.log("will change city");
                  setClientStore({
                    ...clientStore,
                    locations: [
                      { ...clientStore.locations[0], city: e.target.value },
                    ],
                  } as IStore);
                }}
              >
                {brasilCities.map((city) => (
                  <option
                    className="text-main-a11y-high"
                    key={city}
                    value={city}
                  >
                    {city}
                  </option>
                ))}
              </Select>

              <Input
                label="Bairro"
                value={clientStore.locations[0].neighborhood}
                onChange={(e) =>
                  setClientStore({
                    ...clientStore,
                    locations: [
                      {
                        ...clientStore.locations[0],
                        neighborhood: e.target.value,
                      },
                    ],
                  } as IStore)
                }
              />
            </div>

            <div className="flex flex-row gap-2">
              <Input
                label="Endereço"
                value={clientStore.locations[0].address}
                onChange={(e) =>
                  setClientStore({
                    ...clientStore,
                    locations: [
                      {
                        ...clientStore.locations[0],
                        address: e.target.value,
                      },
                    ],
                  } as IStore)
                }
              />

              <Input
                containerProps={{ className: "w-16" }}
                label="Número"
                value={clientStore.locations[0].number}
                onChange={(e) =>
                  setClientStore({
                    ...clientStore,
                    locations: [
                      { ...clientStore.locations[0], number: e.target.value },
                    ],
                  } as IStore)
                }
              />
            </div>
          </Fieldset>
        )}
        <Button onClick={() => onStoreChange(clientStore, true)}>Salvar</Button>
      </form>
      <ImageEditorModal
        open={editImageModalOpen}
        onOpenChange={(newValue) => setEditImageModalOpen(newValue)}
        upload={{
          path: "/",
          fileKey: "file",
          id: clientStore.logo?.toString(),
        }}
        // portalTargetEditModal={() =>
        //   document.querySelector("#edit-menu-item-form") as HTMLElement
        // }
        onUploadIdChange={(newMainImageId) => {
          setClientStore({
            ...clientStore,
            logo: new mongoose.Types.ObjectId(newMainImageId),
          } as IStore);
        }}
      />
    </Modal>
  );
};

export default AddStoreModal;
