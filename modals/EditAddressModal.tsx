import { Button } from "@chakra-ui/react";
import classNames from "classnames";
import { ComponentProps, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaHouseUser } from "react-icons/fa";
import Fieldset from "/components/Fieldset";

import Modal from "/components/Modal";
import EditAddressForm from "/forms/EditAddressForm";

interface EditAddressModalProps extends ComponentProps<typeof Modal> {}

const EditAddressModal: React.FC<EditAddressModalProps> = ({
  locations,
  onLocationsChange,
  contentClassName,
  ...props
}) => {
  const [location, setLocation] = useState(locations?.[0] || {});

  return (
    <Modal
      {...props}
      contentClassName={classNames(
        "flex flex-col container max-w-2xl",
        contentClassName
      )}
    >
      <Fieldset className="border border-hero !p-0 flex flex-row gap-2 items-center !py-4">
        <FaChevronLeft className="ml-2 cursor-pointer" size={24} />
        <div className="border-l border-r border-hero flex-1 flex flex-row gap-2 items-center px-2">
          <FaHouseUser size={60} />
          <address className="text-sm text-main-a11y-high py-2 flex flex-col w-full">
            <span className="font-bold mr-2 block">
              {location?.city || "[Cidade]"} - {location?.state || "[ES]"}
            </span>
            <span className="mr-2 block pt-1">
              {location?.address || "[Endereço]"}{" "}
              {location?.number || "[Número]"},{" "}
              {location?.neighborhood || "[Bairro]"},{" "}
              {location?.postalCode || "[CEP]"}
            </span>
            <span className="mr-2 block pt-1">{location?.address2}</span>
          </address>
        </div>
        <FaChevronRight className="mr-2 cursor-pointer" size={24} />
      </Fieldset>

      <EditAddressForm
        location={location}
        onLocationChange={(newLocation) => setLocation(newLocation)}
      />
      <div className="sticky bottom-0 flex flex-row gap-2 pt-2 border-t border-hero -mx-4 translate-y-4 bg-main-100 p-4">
        <Button className="flex-1" variant="outline">
          Cancelar
        </Button>
        <Button className="flex-1">Salvar</Button>
      </div>
    </Modal>
  );
};

export default EditAddressModal;
