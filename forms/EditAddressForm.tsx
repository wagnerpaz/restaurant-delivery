import { ComponentProps, useEffect, useState } from "react";
import FormControl from "/components/FormControl";
import useGetBrasilCep from "/hooks/useGetBrasilCep";
import useGetBrasilCities from "/hooks/useGetBrasilCities";
import useGetBrasilStates from "/hooks/useGetBrasilStates";

import Input from "/components/form/Input";
import ReactSelect from "/components/ReactSelect";

import applyCepMask from "/lib/cepMask";
import isValidBRPostalCode from "/lib/isValidBrPostalCode";
import useToast from "/hooks/useToast";

interface EditAddressFormProps extends ComponentProps<"div"> {}

const EditAddressForm: React.FC<EditAddressFormProps> = ({
  location,
  onLocationChange = () => {},
}) => {
  const [brasilStates, setBrasilStates] = useState([]);
  const [brasilCities, setBrasilCities] = useState([]);

  const toast = useToast();

  const getBrasilCep = useGetBrasilCep();
  const getBrasilStates = useGetBrasilStates();
  const getBrasilCities = useGetBrasilCities();

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
        try {
          const serviceLocation = await getBrasilCep(postalCode);
          onLocationChange({
            ...location,
            ...serviceLocation,
            postalCode: postalCode,
          });
        } catch (err) {
          toast({ type: "warning", message: "CEP não encontrado." });
        }
      }
    }
    exec();
  }, [postalCode, getBrasilCep, onLocationChange]);

  return (
    <div className="flex flex-col gap-6 pt-6 flex-1 text-main-a11y-high">
      <FormControl className="min-w-fit" label="CEP">
        <Input
          value={location.postalCode}
          onChange={async (e) => {
            const newCep = applyCepMask(e);
            onLocationChange({
              ...location,
              postalCode: newCep,
            });
          }}
        />
      </FormControl>
      <div className="flex flex-row gap-4">
        <FormControl className="w-24" label="Estado">
          <ReactSelect
            value={{ value: location.state, label: location.state }}
            onChange={({ value }) => {
              onLocationChange({
                ...location,
                state: value,
              });
            }}
            options={brasilStates.map((state) => ({
              value: state,
              label: state.sigla,
            }))}
          />
        </FormControl>

        <FormControl className="w-full" label="Cidade">
          <ReactSelect
            value={{ value: location.city, label: location.city }}
            onChange={({ value }) => {
              onLocationChange({
                ...location,
                city: value,
              });
            }}
            options={brasilCities.map((city) => ({
              value: city,
              label: city,
            }))}
          />
        </FormControl>
      </div>

      <div className="flex flex-col sm:flex-row gap-6">
        <FormControl className="flex-1" label="Endereço">
          <Input
            value={location.address}
            onChange={(e) =>
              onLocationChange({
                ...location,
                address: e.target.value,
              })
            }
          />
        </FormControl>

        <FormControl className="w-full sm:w-56" label="Bairro">
          <Input
            value={location.neighborhood}
            onChange={(e) =>
              onLocationChange({
                ...location,
                neighborhood: e.target.value,
              })
            }
          />
        </FormControl>

        <FormControl className="w-38 sm:w-20" label="Número">
          <Input
            value={location.number}
            onChange={(e) =>
              onLocationChange({
                ...location,
                number: e.target.value,
              })
            }
          />
        </FormControl>
      </div>
      <FormControl className="w-full sm:w-auto" label="Complemento">
        <Input
          value={location.address2}
          onChange={(e) =>
            onLocationChange({
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
