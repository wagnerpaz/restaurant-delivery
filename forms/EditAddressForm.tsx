import { Input, Select } from "@chakra-ui/react";
import { ComponentProps, useEffect, useState } from "react";
import FormControl from "/components/FormControl";
import useGetBrasilCep from "/hooks/useGetBrasilCep";
import useGetBrasilCities from "/hooks/useGetBrasilCities";
import useGetBrasilStates from "/hooks/useGetBrasilStates";

import applyCepMask from "/lib/cepMask";
import isValidBRPostalCode from "/lib/isValidBrPostalCode";
import { ILocation } from "/models/Store";

interface EditAddressFormProps extends ComponentProps<"div"> {}

const EditAddressForm: React.FC<EditAddressFormProps> = ({
  location,
  onLocationChange = () => {},
}) => {
  const [clientLocation, setClientLocation] = useState(location);

  const [brasilStates, setBrasilStates] = useState([]);
  const [brasilCities, setBrasilCities] = useState([]);

  const getBrasilCep = useGetBrasilCep();
  const getBrasilStates = useGetBrasilStates();
  const getBrasilCities = useGetBrasilCities();

  useEffect(() => {
    onLocationChange(clientLocation);
  }, [clientLocation, onLocationChange]);

  useEffect(() => {
    async function exec() {
      setBrasilStates(await getBrasilStates());
    }
    exec();
  }, [getBrasilStates]);

  const state = location.state;

  useEffect(() => {
    async function exec() {
      setBrasilCities(
        await getBrasilCities(brasilStates.find((f) => f.sigla === state)?.id)
      );
    }
    exec();
  }, [brasilStates, state, getBrasilCities]);

  const postalCode = location.postalCode;

  useEffect(() => {
    async function exec() {
      if (isValidBRPostalCode(postalCode)) {
        const serviceLocation = await getBrasilCep(postalCode);
        setClientLocation((location: ILocation) => ({
          ...location,
          ...serviceLocation,
          postalCode: postalCode,
        }));
      }
    }
    exec();
  }, [postalCode, getBrasilCep]);

  return (
    <div className="flex flex-col gap-6 pt-6">
      <FormControl className="flex-1 min-w-fit" label="CEP">
        <Input
          value={location.postalCode}
          onChange={async (e) => {
            const newCep = applyCepMask(e);
            setClientLocation({
              ...location,
              postalCode: newCep,
            });
          }}
        />
      </FormControl>
      <div className="flex flex-row gap-4">
        <FormControl className="min-w-fit" label="Estado">
          <Select
            value={location.state}
            onChange={(e) => {
              setClientLocation({
                ...location,
                state: e.target.value,
              });
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
        </FormControl>

        <FormControl className="flex-1 w-full" label="Cidade">
          <Select
            value={location.city}
            onChange={(e) => {
              setClientLocation({
                ...location,
                city: e.target.value,
              });
            }}
          >
            {brasilCities.map((city) => (
              <option
                className="text-main-a11y-high overflow-hidden text-ellipsis"
                key={city}
                value={city}
              >
                {city}
              </option>
            ))}
          </Select>
        </FormControl>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <FormControl className="flex-1 min-w-fit" label="Endereço">
          <Input
            value={location.address}
            onChange={(e) =>
              setClientLocation({
                ...location,
                address: e.target.value,
              })
            }
          />
        </FormControl>

        <FormControl className="flex-1 min-w-fit" label="Bairro">
          <Input
            value={location.neighborhood}
            onChange={(e) =>
              setClientLocation({
                ...location,
                neighborhood: e.target.value,
              })
            }
          />
        </FormControl>

        <FormControl className="w-full sm:w-20" label="Número">
          <Input
            value={location.number}
            onChange={(e) =>
              setClientLocation({
                ...location,
                number: e.target.value,
              })
            }
          />
        </FormControl>
      </div>
      <FormControl className="flex-1 w-full sm:w-auto" label="Complemento">
        <Input
          value={location.address2}
          onChange={(e) =>
            setClientLocation({
              ...location,
              address2: e.target.value,
            })
          }
        />
      </FormControl>
    </div>
  );
};

export default EditAddressForm;
