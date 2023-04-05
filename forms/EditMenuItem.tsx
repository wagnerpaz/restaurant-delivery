import { ComponentProps, useState } from "react";
import classNames from "classnames";
import { IoMdCloseCircle } from "react-icons/io";
import { IoIosAddCircle } from "react-icons/io";
import {
  Option,
  Select,
  Input,
  Button,
  Textarea,
} from "@material-tailwind/react";

import { IMenuItem, IMenuItemCompositionItem } from "/models/MenuItem";
import Fieldset from "/components/Fieldset";
import { IStore } from "/models/Store";
import { IIngredient } from "/models/Ingredients";
import DbImageEditor from "/components/DbImageEditor";
import MenuItem from "/components/Menu/MenuItem";

interface EditMenuItemProps extends ComponentProps<"form"> {
  store: IStore;
  menuItem: IMenuItem;
  onMenuItemChange: (newValue: IMenuItem) => void;
}

const emptyCompositionItem: IMenuItemCompositionItem = {
  ingredient: undefined,
  quantity: 1,
  essential: false,
};

const EditMenuItem: React.FC<EditMenuItemProps> = ({
  className,
  children,
  store,
  menuItem,
  onMenuItemChange,
  ...props
}) => {
  const [edit, setEdit] = useState(menuItem);

  const handleModifyCompositionProp =
    (
      compositionItem: IMenuItemCompositionItem,
      compositionItemIndex: number,
      key: string,
      getter: (value: any) => any
    ) =>
    (value: any) => {
      const slicedComposition = [...edit.composition];
      slicedComposition.splice(compositionItemIndex, 1, {
        ...compositionItem,
        [key]: getter(value),
      });
      console.log(slicedComposition, value);
      setEdit({
        ...edit,
        composition: slicedComposition,
      } as IMenuItem);
    };

  return (
    <form
      id="edit-menu-item-form"
      className={classNames("flex flex-col gap-4", className)}
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="flex flex-col lg:flex-row items-center gap-4">
        <MenuItem
          className="!w-80"
          id={edit._id}
          name={edit.name}
          mainImageId={edit.images?.main?.toString()}
          composition={edit.composition}
          sides={edit.sides}
          index={-1}
          editable
          onClick={() => {}}
          portalTargetEditModal={() =>
            document.querySelector("#edit-menu-item-form") as HTMLElement
          }
        />
        <div className="w-full lg:flex-1 flex flex-col gap-2">
          <Input
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
            label="Preço"
            value={edit.price}
            onChange={(e) =>
              setEdit({
                ...edit,
                price: e.target.value,
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
      <Fieldset className="flex flex-col gap-2" title="Composição">
        {edit.composition.map((compositionItem, compositionItemIndex) => (
          <div
            key={compositionItem.ingredient?.name}
            className="flex flex-col lg:flex-row gap-2 items-center"
          >
            <div className="w-full">
              <Select
                className="flex-1"
                label="Ingrediente"
                value={compositionItem.ingredient?.name}
                onChange={handleModifyCompositionProp(
                  compositionItem,
                  compositionItemIndex,
                  "ingredient",
                  (value) =>
                    store.ingredients.find(
                      (ing) => ing.name === value
                    ) as IIngredient
                )}
              >
                {store.ingredients.map((ingredient) => (
                  <Option key={ingredient.name} value={ingredient.name}>
                    {ingredient.name}
                  </Option>
                ))}
              </Select>
            </div>
            <div className="w-full min-w-48">
              <Input
                type="number"
                label="Qtd."
                value={compositionItem.quantity}
                defaultValue={1}
                onChange={handleModifyCompositionProp(
                  compositionItem,
                  compositionItemIndex,
                  "quantity",
                  (e) => e.target.value
                )}
              />
            </div>
            <div className="w-full min-w-48">
              <Select
                label="Essencial"
                value={`${compositionItem.essential}`}
                onChange={handleModifyCompositionProp(
                  compositionItem,
                  compositionItemIndex,
                  "essential",
                  (value) => value == true
                )}
              >
                <Option key={`true`} value={`true`}>
                  Sim
                </Option>
                <Option key={`false`} value={`false`}>
                  Não
                </Option>
              </Select>
            </div>
            <div className="flex flex-row">
              <Button className="mr-2 text-light-high" variant="text" size="sm">
                <IoMdCloseCircle size={24} />
              </Button>
              <Button
                className="text-light-high"
                variant="text"
                size="sm"
                onClick={() =>
                  setEdit({
                    ...edit,
                    composition: [
                      ...edit.composition,
                      { ...emptyCompositionItem },
                    ],
                  } as IMenuItem)
                }
              >
                <IoIosAddCircle className="color" size={24} />
              </Button>
            </div>
          </div>
        ))}
        <span className="text-sm">
          Procurou o ingrediente acima e não achou? Registre{" "}
          <span className="text-dark-500 font-bold cursor-pointer">aqui</span>
        </span>
      </Fieldset>
      <Button
        className="mb-4"
        onClick={() => {
          onMenuItemChange(edit);
        }}
      >
        Salvar
      </Button>
    </form>
  );
};

EditMenuItem.displayName = "EditMenuItem";

export default EditMenuItem;
