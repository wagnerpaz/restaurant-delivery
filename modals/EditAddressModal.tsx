import { Button } from "@chakra-ui/react";
import classNames from "classnames";
import { ComponentProps, useEffect, useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaHouseUser } from "react-icons/fa";
import Fieldset from "/components/Fieldset";

import Modal from "/components/Modal";
import EditAddressForm from "/forms/EditAddressForm";
import { replaceAt } from "/lib/immutable";
import { ILocation } from "/models/Store";

interface EditAddressModalProps extends ComponentProps<typeof Modal> {}

const emptyLocation: ILocation = {
  postalCode: "",
  state: "",
  city: "",
  address: "",
  neighborhood: "",
  number: "",
  address2: "",
};

const EditAddressModal: React.FC<EditAddressModalProps> = ({
  locations,
  onLocationsChange = () => {},
  contentClassName,
  onOpenChange,
  ...props
}) => {
  const [index, setIndex] = useState(0);
  const [clientLocations, setClientLocations] = useState<ILocation[]>(
    locations || [{}]
  );
  const currentLocation = useMemo(
    () => clientLocations[index] || { ...emptyLocation },
    [clientLocations, index]
  );

  useEffect(() => {
    const newLocations = locations || [{}];
    const mainIndex = newLocations.findIndex((f) => f.main);
    setIndex(mainIndex > 0 ? mainIndex : 0);
    setClientLocations(newLocations);
  }, [locations]);

  const isFilled = (location: ILocation) =>
    location.postalCode ||
    location.state ||
    location.city ||
    location.address ||
    location.neighborhood ||
    location.number ||
    location.address2;

  return (
    <Modal
      {...props}
      contentClassName={classNames(
        "flex flex-col container max-w-2xl",
        contentClassName
      )}
      onOpenChange={onOpenChange}
    >
      <Fieldset className="border border-hero !p-0 flex flex-col !pt-4">
        <div className={classNames("flex flex-row gap-2 items-center")}>
          <FaChevronLeft
            className={classNames("ml-2 cursor-pointer", {
              "opacity-30 !cursor-not-allowed": index === 0,
            })}
            size={24}
            onClick={() => {
              if (index > 0) {
                setIndex(index - 1);
              }
            }}
          />
          <div className="border-l border-r border-hero flex-1 flex flex-row gap-2 items-center px-2">
            <FaHouseUser size={60} />
            <address className="text-sm text-main-a11y-high py-2 flex flex-col w-full flex-1">
              <span className="font-bold mr-2 block">
                {currentLocation?.city || "[Cidade]"} -{" "}
                {currentLocation?.state || "[ES]"}
              </span>
              <span className="mr-2 block pt-1">
                {currentLocation?.address || "[Endereço]"}{" "}
                {currentLocation?.number || "[Número]"},{" "}
                {currentLocation?.neighborhood || "[Bairro]"},{" "}
                {currentLocation?.postalCode || "[CEP]"}
              </span>
              <span className="mr-2 block pt-1">
                {currentLocation?.address2}
              </span>
            </address>
          </div>
          <FaChevronRight
            className={classNames("mr-2 cursor-pointer", {
              "opacity-30 !cursor-not-allowed": !isFilled(currentLocation),
            })}
            size={24}
            onClick={() => {
              if (clientLocations[index + 1]) {
                setIndex(index + 1);
              } else if (isFilled(clientLocations[index])) {
                setClientLocations([
                  ...clientLocations,
                  { ...emptyLocation } as ILocation,
                ]);
                setIndex(index + 1);
              }
            }}
          />
        </div>
        <div className="flex flex-row justify-between my-2 mx-4">
          <span
            className="text-add cursor-pointer"
            onClick={() =>
              setClientLocations(
                replaceAt(
                  clientLocations.map((m) => ({ ...m, main: false })),
                  index,
                  {
                    ...clientLocations[index],
                    main: true,
                  }
                )
              )
            }
          >
            {currentLocation.main ? (
              <strong>Endereço padrão</strong>
            ) : (
              "Definir como padrão"
            )}
          </span>
          <span
            className="text-remove cursor-pointer"
            onClick={() => {
              setClientLocations(clientLocations.filter((f, i) => i !== index));
              setIndex(index > 0 ? index - 1 : 0);
            }}
          >
            Excluir
          </span>
        </div>
      </Fieldset>

      <EditAddressForm
        location={currentLocation}
        onLocationChange={(
          param: ILocation | ((oldLocation: ILocation) => ILocation)
        ) => {
          let newLocation;
          if (typeof param === "function") {
            newLocation = param(currentLocation);
          } else {
            newLocation = param;
          }
          setClientLocations(replaceAt(clientLocations, index, newLocation));
        }}
      />
      <div className="sticky bottom-0 flex flex-row gap-2 pt-2 border-t border-hero -mx-4 translate-y-4 bg-main-100 p-4">
        <Button
          className="flex-1"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Cancelar
        </Button>
        <Button
          className="flex-1"
          onClick={() => {
            onLocationsChange(clientLocations.filter((f) => isFilled(f)));
          }}
        >
          Salvar
        </Button>
      </div>
    </Modal>
  );
};

export default EditAddressModal;
